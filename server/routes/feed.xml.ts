import { queryCollection } from '@nuxt/content/server'
import type { TopFivePost } from '../../app/types/content'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const posts = (await queryCollection(event, 'top5').order('date', 'DESC').all()) as unknown as TopFivePost[]
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'http://localhost:3000').replace(/\/+$/, '')
  const baseURL = String(config.app.baseURL || '/')
  const basePath = baseURL === '/' ? '' : `/${baseURL.replace(/^\/+|\/+$/g, '')}`
  const siteBase = `${siteUrl}${basePath}`

  const items = posts
    .map((post) => {
      const url = `${siteBase}${post.path}`
      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<category>${escapeXml(post.category)}</category>`,
        `<description>${escapeXml(post.description)}</description>`,
        '</item>',
      ].join('')
    })
    .join('')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    '<title>Rankou — Top 5 do Mercado Livre</title>',
    `<link>${escapeXml(siteBase)}</link>`,
    '<description>Rankings objetivos de produtos no Mercado Livre.</description>',
    '<language>pt-BR</language>',
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(`${siteBase}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    '</channel>',
    '</rss>',
  ].join('')
})
