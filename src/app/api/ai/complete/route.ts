import {OpenAIStream, StreamingTextResponse} from 'ai'
import {NextResponse} from 'next/server'
import {z} from 'zod'

import {openai} from '@/lib/openai'
import {prisma} from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const bodySchema = z.object({
    prompt: z.string(),
    videoId: z.string().uuid(),
    temperature: z.number().min(0).max(1).default(0.5),
  })

  const {prompt, videoId, temperature} = bodySchema.parse(body)

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId,
    },
  })

  if (!video.transcription) {
    return NextResponse.json({
      status: 400,
      error: 'Video transcription was not generated yet',
    })
  }

  const promptMessage = prompt.replace('{transcription}', video.transcription)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature,
    messages: [{role: 'user', content: promptMessage}],
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
