export interface TopFiveProduct {
  rank: number
  name: string
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  rating?: number | null
  reviews?: number | null
  sold?: number | null
  seller?: string | null
  sku?: string
  image: string
  imageFallback: string
  thumb: string
  productUrl: string
  affiliateUrl: string
  highlight?: string
  description: string
}

export interface TopFiveFaq {
  question: string
  answer: string
}

export interface TopFivePost {
  path: string
  title: string
  seoTitle?: string
  description: string
  date: Date
  updated?: Date
  category: string
  categorySlug: string
  query: string
  monthLabel: string
  cover: string
  socialImage: string
  products: TopFiveProduct[]
  faq?: TopFiveFaq[]
  tags?: string[]
  readingMinutes?: number
  projectId?: string
  affiliateDisclosure?: string
  body?: unknown
}

export interface MonthGroup {
  key: string
  label: string
  posts: TopFivePost[]
}
