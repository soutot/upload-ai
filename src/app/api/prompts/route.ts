import {NextRequest, NextResponse} from 'next/server'

import {prisma} from '@/lib/prisma'

const Route = async (_request: NextRequest, _response: NextResponse) => {
  const prompts = await prisma.prompt.findMany()
  return NextResponse.json({prompts})
}

export {Route as GET}
