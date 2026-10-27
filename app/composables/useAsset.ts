/** Resolve a public asset path against the Nuxt base URL (GitHub Pages subpath). */
export function useAsset(path: string): string {
  const baseURL = useRuntimeConfig().app.baseURL || '/'
  const clean = path.replace(/^\/+/, '')
  const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${base}${clean}`
}

/** Absolute site URL for canonicals and social metadata. The site origin + GitHub Pages subpath. */
export function useAbsoluteUrl(path = '/'): string {
  const siteUrl = String(useRuntimeConfig().public.siteUrl || 'http://localhost:3000').replace(/\/+$/, '')
  const baseURL = String(useRuntimeConfig().app.baseURL || '/')
  const basePath = baseURL === '/' ? '' : `/${baseURL.replace(/^\/+|\/+$/g, '')}`
  return `${siteUrl}${basePath}${path.startsWith('/') ? path : `/${path}`}`
}

/** Absolute URL for a public asset referenced by content. */
export function useAbsoluteAsset(path: string): string {
  return useAbsoluteUrl(`/${path.replace(/^\/+/, '')}`)
}

export function useCanonical(path?: string): string {
  const route = useRoute()
  return useAbsoluteUrl(path ?? route.path)
}
