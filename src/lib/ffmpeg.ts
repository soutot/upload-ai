import {FFmpeg} from '@ffmpeg/ffmpeg'
import {toBlobURL} from '@ffmpeg/util'

const ffmpeg = new FFmpeg()
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.3/dist/umd'
export async function getFFmpeg() {
  if (!ffmpeg.loaded) {
    /** 1st attempt
      await ffmpeg.load({
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm',
        workerURL: '/ffmpeg/ffmpeg-worker.js',
      })
     */

    /** 2nd attempt
      const coreURL = await toBlobURL(`/ffmpeg/ffmpeg-core.js`, 'text/javascript')
      const wasmURL = await toBlobURL(`/ffmpeg/ffmpeg-core.wasm`, 'application/wasm')
      const workerURL = await toBlobURL(`/ffmpeg/ffmpeg-worker.js`, 'text/javascript')
    */

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
  }
  return ffmpeg
}
