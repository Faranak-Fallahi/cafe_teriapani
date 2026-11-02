import PocketBase from 'pocketbase'

const baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(baseUrl)
pb.autoCancellation(false)

export function getFileUrl(record, filename, options = {}) {
  if (!filename) return ''
  return pb.files.getUrl(record, filename, options)
}
