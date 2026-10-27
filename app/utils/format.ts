// Nuxt Content's SQLite column stores only the calendar date (YYYY-MM-DD).
// Format it as UTC so 2026-10-26 is not shifted to the previous day in São Paulo.
const dateZone = 'UTC'

export function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

export function formatDate(value: Date | string | number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: dateZone,
  }).format(toDate(value))
}

export function formatDateShort(value: Date | string | number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: dateZone,
  })
    .format(toDate(value))
    .replace('.', '')
}

export function formatMonth(value: Date | string | number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: dateZone,
  }).format(toDate(value))
}

export function sentenceCase(value: string): string {
  const text = value.trim()
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : text
}

export function rankingCount(count: number): string {
  return `${count} ${count === 1 ? 'ranking' : 'rankings'}`
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatRating(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  return value.toFixed(1).replace('.', ',')
}

export function priceRange(values: number[]): { min: number; max: number } | null {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0)
  if (valid.length === 0) return null
  return { min: Math.min(...valid), max: Math.max(...valid) }
}

export function discountPercent(
  price: number,
  originalPrice?: number | null,
  stored?: number | null,
): number | null {
  if (stored && stored > 0 && stored < 100) return Math.round(stored)
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function readingTimeLabel(minutes?: number): string {
  const value = minutes && minutes > 0 ? minutes : 4
  return `${value} min de leitura`
}

export function monthKey(value: Date | string | number): string {
  const date = toDate(value)
  const year = new Intl.DateTimeFormat('en-CA', { year: 'numeric', timeZone: dateZone }).format(date)
  const month = new Intl.DateTimeFormat('en-CA', { month: '2-digit', timeZone: dateZone }).format(date)
  return `${year}-${month}`
}

export function groupByMonth<T extends { date: Date }>(posts: T[]): Array<{ key: string; label: string; posts: T[] }> {
  const groups = new Map<string, { key: string; label: string; posts: T[] }>()
  const sorted = [...posts].sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime())
  for (const post of sorted) {
    const key = monthKey(post.date)
    const existing = groups.get(key)
    if (existing) {
      existing.posts.push(post)
    } else {
      groups.set(key, { key, label: formatMonth(post.date), posts: [post] })
    }
  }
  return [...groups.values()]
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1).trimEnd()}…`
}
