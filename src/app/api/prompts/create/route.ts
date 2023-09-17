import {NextRequest, NextResponse} from 'next/server'
import {z} from 'zod'

import {prisma} from '@/lib/prisma'

const Route = async (request: NextRequest) => {
  const body = await request.json()
  const bodySchema = z.object({
    title: z.string(),
    template: z.string(),
  })

  const {title, template} = bodySchema.parse(body)

  const prompts = await prisma.prompt.findFirst({
    where: {
      title,
    },
  })

  if (prompts) {
    return NextResponse.json({error: 'Prompt already exists', status: 400})
  }

  const prompt = await prisma.prompt.create({
    data: {
      title,
      template,
    },
  })

  if (!prompt) {
    return NextResponse.json({error: 'Error on create prompt', status: 400})
  }
  return NextResponse.json({prompt})
}

export {Route as POST}
