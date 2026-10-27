import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const productSchema = z.object({
  rank: z.number().int().min(1).max(5),
  name: z.string(),
  price: z.number(),
  originalPrice: z.number().nullable().optional(),
  discountPercent: z.number().nullable().optional(),
  rating: z.number().nullable().optional(),
  reviews: z.number().nullable().optional(),
  sold: z.number().nullable().optional(),
  seller: z.string().nullable().optional(),
  sku: z.string().optional(),
  image: z.string(),
  imageFallback: z.string(),
  thumb: z.string(),
  productUrl: z.string().url(),
  affiliateUrl: z.string().url(),
  highlight: z.string().optional(),
  description: z.string(),
})

export default defineContentConfig({
  collections: {
    top5: defineCollection({
      type: 'page',
      source: 'top5/*.md',
      schema: z.object({
        title: z.string(),
        seoTitle: z.string().optional(),
        description: z.string(),
        date: z.date(),
        updated: z.date().optional(),
        category: z.string(),
        categorySlug: z.string(),
        query: z.string(),
        monthLabel: z.string(),
        cover: z.string(),
        socialImage: z.string(),
        products: z.array(productSchema).min(3).max(5),
        faq: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
            }),
          )
          .default([]),
        tags: z.array(z.string()).default([]),
        readingMinutes: z.number().optional(),
        projectId: z.string().optional(),
        affiliateDisclosure: z.string().optional(),
      }),
    }),
  },
})
