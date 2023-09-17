import {createReadStream} from 'fs'
import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'

import {openai} from '@/lib/openai'
import {prisma} from '@/lib/prisma'

type Data = {
  params: {
    videoId: string
  }
}

export async function POST(request: NextRequest, {params}: Data) {
  const body = await request.json()
  const paramsSchema = z.object({
    videoId: z.string().uuid(),
  })
  const bodySchema = z.object({
    prompt: z.string(),
  })

  const {videoId} = paramsSchema.parse(params)

  const {prompt} = bodySchema.parse(body)

  const video = await prisma.video.findUniqueOrThrow({
    where: {id: videoId},
  })

  const videoPath = video.path

  const audioReadStream = createReadStream(videoPath)

  const response = await openai.audio.transcriptions.create({
    file: audioReadStream,
    model: 'whisper-1',
    language: 'pt',
    response_format: 'json',
    temperature: 0,
    prompt,
  })
  const transcription = response.text

  await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      transcription,
    },
  })

  return NextResponse.json({transcription})
}
