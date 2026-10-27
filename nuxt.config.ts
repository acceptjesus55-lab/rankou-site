const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const siteURL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const hasBasePath = baseURL !== '/'

function withBase(path: string): string {
  return `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-27',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      titleTemplate: '%s · Rankou',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: withBase('favicon.svg') },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Rankou', href: withBase('feed.xml') },
      ],
      meta: [
        { name: 'theme-color', content: '#f6f5f0', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0b0f0d', media: '(prefers-color-scheme: dark)' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },

  site: {
    url: siteURL,
    name: 'Rankou',
    description:
      'Top 5 de produtos escolhidos por nota, vendas e preço real no Mercado Livre. Menos pesquisa, mais compra certa.',
    defaultLocale: 'pt-BR',
  },

  runtimeConfig: {
    public: {
      siteUrl: siteURL,
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'Bricolage Grotesque', provider: 'google' },
    ],
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 2, searchDepth: 2 },
      },
    },
  },

  sitemap: {
    zeroRuntime: true,
    include: ['/', '/top5', '/top5/**', '/categoria/**', '/sobre'],
    // The base-prefixed home discovered by the crawler is removed in server/plugins/sitemap-filter.ts.
    exclude: hasBasePath ? [baseURL.replace(/\/$/, ''), `${baseURL.replace(/\/$/, '')}/**`] : [],
  },

  // llms.txt is not part of the portal and the extra sitemap runtime duplicated the module.
  aiReady: false,

  robots: {
    allow: '/',
    // A project page lives under /<repo>/, so robots.txt cannot be generated at the origin root.
    robotsTxt: !hasBasePath,
  },

  // The dashboard already generates the social image from the real product photo.
  ogImage: {
    enabled: false,
  },

  // Affiliate links often block bots; external link checks would make the build flaky.
  linkChecker: {
    enabled: false,
  },

  routeRules: {
    '/': { prerender: true },
    '/top5': { prerender: true },
    '/top5/**': { prerender: true },
    '/categoria/**': { prerender: true },
    '/sobre': { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/top5',
        '/sobre',
        '/sitemap.xml',
        ...(hasBasePath ? [] : ['/robots.txt']),
        '/feed.xml',
      ],
    },
  },
})
