'use client'

import {fetchFile} from '@ffmpeg/util'
import {FileVideo, Upload} from 'lucide-react'
import {ChangeEvent, FormEvent, useMemo, useRef, useState} from 'react'

import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {Textarea} from '@/components/ui/textarea'
import {getFFmpeg} from '@/lib/ffmpeg'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  waiting: 'Carregar vídeo',
  converting: 'Convertendo...',
  uploading: 'Carregando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!',
}

interface Props {
  onVideoUploaded: (videoId: string) => void
}

const VideoInputForm = ({onVideoUploaded}: Props) => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const {files} = event.currentTarget

    if (!files?.length) {
      return
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started')

    const ffmpeg = await getFFmpeg()
    if (!ffmpeg) {
      console.log('ffmpeg not found')
      return
    }

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', (log) => {
    //   console.log('-------- ffmpeg log --------', log)
    // })

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')
    const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finish')

    return audioFile
  }
  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      console.log('No video file found')
      setStatus('waiting')
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    if (!audioFile) {
      console.log('Audio file is missing')
      setStatus('waiting')
      return
    }

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await fetch('/api/videos', {
      method: 'post',
      body: data,
    })
    const responseData = await response.json()

    const videoId = responseData?.video?.id

    if (!videoId) {
      console.log('Video id is missing')
      setStatus('waiting')
      return
    }

    setStatus('generating')

    await fetch(`/api/videos/${videoId}/transcription`, {
      method: 'post',
      body: JSON.stringify({prompt}),
    })

    setStatus('success')

    setTimeout(() => {
      setStatus('waiting')
    }, 1000)

    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return
    }
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5">
        {videoFile ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0 aspect-video"
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavra-chaves mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>
      <Button type="submit" className="w-full" disabled={status !== 'waiting'}>
        {statusMessages[status]}
        <Upload className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}

export default VideoInputForm
