function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * GitHub Pages project sites run under /<repo>/. Nitro's prerender crawler
 * discovers the base-prefixed home twice, so the sitemap gets one URL with the
 * base duplicated (e.g. /rankou-site/rankou-site). Remove only that entry.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:output', (ctx) => {
    const config = useRuntimeConfig()
    const baseURL = String(config.app.baseURL || '/')
    if (baseURL === '/') return

    const basePath = baseURL.replace(/^\/+|\/+$/g, '')
    if (!basePath) return

    const duplicated = `/${basePath}/${basePath}`
    const pattern = new RegExp(
      `<url>(?:(?!</url>)[\\s\\S])*?<loc>[^<]*${escapeRegExp(duplicated)}(?:/)?</loc>(?:(?!</url>)[\\s\\S])*?</url>`,
      'g',
    )
    ctx.sitemap = ctx.sitemap.replace(pattern, '')
  })
})
