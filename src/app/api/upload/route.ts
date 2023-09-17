// @TODO: DELETE ME - test file
import {writeFile} from 'fs/promises'
import {NextResponse} from 'next/server'
import {join} from 'path'

export async function GET(_request: Request) {
  return NextResponse.json({message: 'This Worked', success: true})
}

export async function POST(request: Request) {
  try {
    const data = request.formData()
    const file: File | null = (await data).get('file') as unknown as File
    if (!file) {
      return NextResponse.json({success: false})
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = join('public/tmp', file.name)
    await writeFile(path, buffer)
    return NextResponse.json({message: 'This Worked', success: true})
  } catch (err) {
    console.log(err)
    return NextResponse.json({message: err, success: false})
  }
}
