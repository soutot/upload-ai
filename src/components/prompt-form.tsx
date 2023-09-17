import {FormEvent, useRef, useState} from 'react'

import {Button} from './ui/button'
import {Input} from './ui/input'
import {Label} from './ui/label'
import {Textarea} from './ui/textarea'

type Status = 'waiting' | 'creating' | 'success'

const statusMessages = {
  waiting: 'Adicionar prompt',
  creating: 'Criando...',
  success: 'Sucesso!',
}

interface Props {
  onPromptCreated: (promptId: string) => void
}

const PromptSelect = ({onPromptCreated}: Props) => {
  const [status, setStatus] = useState<Status>('waiting')

  const titleInputRef = useRef<HTMLInputElement>(null)
  const templateInputRef = useRef<HTMLTextAreaElement>(null)

  async function handleCreatePrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = titleInputRef.current?.value
    const template = templateInputRef.current?.value

    if (!title || !template) {
      console.log(`Missing data title: ${title} | template: ${template}`)
      setStatus('waiting')
      return
    }

    setStatus('creating')

    const data = {
      title,
      template,
    }

    const response = await fetch('/api/prompts/create', {
      method: 'post',
      body: JSON.stringify(data),
    })

    const responseData = await response.json()

    const promptId = responseData?.prompt?.id

    if (!promptId) {
      console.log('Prompt id is missing')
      setStatus('waiting')
      return
    }

    setStatus('success')

    onPromptCreated(promptId)

    setTimeout(() => {
      setStatus('waiting')
    }, 1000)
  }

  return (
    <form className="space-y-6" onSubmit={handleCreatePrompt}>
      <div className="space-y-2">
        <Label htmlFor="prompt_title">Título</Label>
        <Input
          ref={titleInputRef}
          id="prompt_title"
          className="h-10 resize-none leading-relaxed"
          placeholder="Dê um título ao prompt"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt_template">Template</Label>
        <Textarea
          ref={templateInputRef}
          id="prompt_template"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua o template do prompt"
        />
      </div>
      <Button type="submit" className="w-full">
        {statusMessages[status]}
      </Button>
    </form>
  )
}

export default PromptSelect
