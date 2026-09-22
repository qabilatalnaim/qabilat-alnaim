import handler from '../../api/coffee-playlist.js'
import { runVercelHandler } from '../_lib/vercel-compat.js'

export function onRequest(context) {
  return runVercelHandler(context, handler)
}
