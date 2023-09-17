import {useEffect, useState} from 'react'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

type Prompt = {
  id: string
  title: string
  template: string
}

interface Props {
  newPromptId?: string | null
  onPromptSelected: (template: string) => void
}

const PromptSelect = ({newPromptId, onPromptSelected}: Props) => {
  const [prompts, setPrompts] = useState<Prompt[]>()

  useEffect(() => {
    fetch('api/prompts').then(async (response) => {
      const promptsData = await response.json()
      setPrompts(promptsData?.prompts || [])
    })
  }, [newPromptId])

  function handlePromptSelected(promptId: string) {
    const template = prompts?.find((prompt) => prompt.id === promptId)?.template
    if (!template) {
      console.log('Prompt not found')
      return
    }
    onPromptSelected(template)
  }

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PromptSelect
