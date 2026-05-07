import { useEffect } from 'react'

type Meta = {
  title: string
  description?: string
  image?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'skuro'
const DEFAULT_IMAGE = '/og-default.jpg'

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function useDocumentMeta({ title, description, image, type = 'website' }: Meta) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`
    document.title = fullTitle

    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description)
      setMeta('meta[property="og:description"]', 'property', 'og:description', description)
      setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    }

    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')

    const ogImage = image ?? DEFAULT_IMAGE
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)
  }, [title, description, image, type])
}
