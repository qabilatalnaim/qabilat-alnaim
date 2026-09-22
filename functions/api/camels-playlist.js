import handler from '../../api/camels-playlist.js'
import { runVercelHandler } from '../_lib/vercel-compat.js'

export function onRequest(context) {
  return runVercelHandler(context, handler)
}
