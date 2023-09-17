import {NextResponse} from 'next/server'
import {createWriteStream} from 'node:fs'
import path from 'node:path'
import internal, {pipeline} from 'node:stream'
import {promisify} from 'node:util'

import {prisma} from '@/lib/prisma'

const pump = promisify(pipeline)

function formatFileName(fileName: string): string {
  fileName = fileName.trim()

  // Replace invalid characters with dashes
  fileName = fileName.replace(/[\\/:"*?<>|]+/g, '-')

  // Remove invalid characters from start and end
  fileName = fileName.replace(/^-+|-+$/g, '')

  // Replace blank spaces with underscore
  fileName = fileName.replace(/\s+/g, '_')

  // Make sure name is not empty
  if (!fileName) {
    fileName = 'unnamed'
  }

  return fileName
}

export async function POST(request: Request, _response: NextResponse) {
  try {
    const data = request.formData()
    const file: File | null = (await data).get('file') as unknown as File
    if (!file) {
      return NextResponse.json({message: 'Missing file input', success: false})
    }

    const filename = file.name

    const extension = path.extname(filename)

    if (extension !== '.mp3') {
      return NextResponse.json({message: 'Invalid input type, please upload a MP3', success: false})
    }

    const fileBaseName = path.basename(filename, extension)
    const fileUploadName = formatFileName(`${fileBaseName}_${new Date().toISOString()}${extension}`)

    const uploadDestination = path.resolve('public/tmp', fileUploadName)

    const destination = createWriteStream(uploadDestination)
    const source = file.stream() as unknown as internal.PipelineSource<any>
    await pump(source, destination)

    const video = await prisma.video.create({
      data: {
        name: filename,
        path: uploadDestination,
      },
    })

    return NextResponse.json({video})
  } catch (err) {
    console.log(err)
    return NextResponse.json({message: err, success: false})
  }
}
