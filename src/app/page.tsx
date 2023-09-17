'use client'

import {useCompletion} from 'ai/react'
import {Github, Wand} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'

import PromptForm from '@/components/prompt-form'
import PromptSelect from '@/components/prompt-select'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {Slider} from '@/components/ui/slider'
import {Textarea} from '@/components/ui/textarea'
import VideoInputForm from '@/components/video-input-form'

const MODEL_OPTIONS = {
  GPT3: {
    value: 'gpt3.5',
    label: 'GPT 3.5-turbo 16k',
  },
  LLAMA2: {
    value: 'llama2',
    label: 'Llama2',
  },
}

export default function Home() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>()
  const [newPromptId, setNewPromptId] = useState<string | null>()
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const {input, setInput, handleInputChange, handleSubmit, completion, isLoading} = useCompletion({
    api: 'http://localhost:3333/api/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-type': 'application/json',
    },
  })

  function handleVideoUploaded(id: string) {
    setVideoId(id)
  }

  function toggleAddPrompt() {
    setShowAddPrompt((prev) => !prev)
  }

  function handlePromptCreated(promptId: string) {
    setNewPromptId(promptId)
    toggleAddPrompt()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido por @soutot </span>

          <Separator orientation="vertical" className="h-6" />

          <Link href="https://github.com/soutot" passHref={true}>
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </Link>
        </div>
      </div>
      <main className="flex flex-1 gap-6 p-6">
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{' '}
            <code className="text-sky-800">{'{transcription}'}</code> no seu prompt para adicionar o
            conteúdo de transcrição de videos selecionados
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={handleVideoUploaded} />

          <Separator />

          <Button onClick={toggleAddPrompt}>Novo Prompt</Button>
          {showAddPrompt ? <PromptForm onPromptCreated={handlePromptCreated} /> : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect newPromptId={newPromptId} onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue={MODEL_OPTIONS.GPT3.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MODEL_OPTIONS).map(({value, label}, index) => (
                    <SelectItem key={index} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="block text-xs italic text-muted-foreground">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <span className="block text-xs italic text-muted-foreground">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros
              </span>
            </div>

            <Separator />

            <Button type="submit" disabled={isLoading} className="w-full">
              Executar <Wand className="ml-2 h-4 w-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
