const DDG_IMAGE_PROXY = 'https://proxy.duckduckgo.com/iu/?u='

export function imageUrl(src: string) {
  if (/^https?:\/\//i.test(src)) {
    return `${DDG_IMAGE_PROXY}${encodeURIComponent(src)}`
  }
  return src
}