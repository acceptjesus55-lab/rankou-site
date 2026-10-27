<script setup lang="ts">
import type { TopFivePost } from '~/types/content'

const route = useRoute()

const { data: page } = await useAsyncData(`top5-${route.path}`, () =>
  queryCollection('top5').path(route.path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ranking não encontrado' })
}

const post = computed(() => page.value as unknown as TopFivePost)
const content = computed(() => page.value!)
const products = computed(() => [...post.value.products].sort((a, b) => a.rank - b.rank))
const first = computed(() => products.value[0])
const range = computed(() => priceRange(products.value.map((product) => product.price)))
const faq = computed(() => post.value.faq ?? [])
const canonical = useCanonical(route.path)

const { data: all } = await useAsyncData('top5-related', () =>
  queryCollection('top5').order('date', 'DESC').all(),
)

const related = computed(() => {
  const others = ((all.value ?? []) as unknown as TopFivePost[]).filter((item) => item.path !== post.value.path)
  return [...others]
    .sort((a, b) => {
      const sameA = a.categorySlug === post.value.categorySlug ? 1 : 0
      const sameB = b.categorySlug === post.value.categorySlug ? 1 : 0
      return sameB - sameA || new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)
})

const published = toDate(post.value.date)
const updated = post.value.updated ? toDate(post.value.updated) : published

useSeoMeta({
  title: post.value.seoTitle || post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: useAbsoluteAsset(post.value.socialImage),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: post.value.title,
  ogType: 'article',
  articlePublishedTime: published.toISOString(),
  articleModifiedTime: updated.toISOString(),
  articleSection: post.value.category,
  articleTag: post.value.tags,
  twitterCard: 'summary_large_image',
})

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: useAbsoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Top 5', item: useAbsoluteUrl('/top5') },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.value.category,
          item: useAbsoluteUrl(`/categoria/${post.value.categorySlug}`),
        },
        { '@type': 'ListItem', position: 4, name: post.value.title, item: canonical },
      ],
    },
    {
      '@type': 'ItemList',
      name: post.value.title,
      description: post.value.description,
      numberOfItems: products.value.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: products.value.map((product) => ({
        '@type': 'ListItem',
        position: product.rank,
        item: {
          '@type': 'Product',
          name: product.name,
          image: [useAbsoluteAsset(product.imageFallback)],
          description: product.description,
          sku: product.sku,
          url: product.productUrl,
          ...(product.rating && product.reviews
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: product.rating,
                  reviewCount: product.reviews,
                  bestRating: 5,
                  worstRating: 1,
                },
              }
            : {}),
          offers: {
            '@type': 'Offer',
            url: product.affiliateUrl,
            priceCurrency: 'BRL',
            price: product.price.toFixed(2),
            availability: 'https://schema.org/InStock',
            ...(product.seller
              ? { seller: { '@type': 'Organization', name: product.seller } }
              : {}),
          },
        },
      })),
    },
    ...(faq.value.length
      ? [
          {
            '@type': 'FAQPage',
            mainEntity: faq.value.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          },
        ]
      : []),
  ],
}

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema).replace(/</g, '\\u003c'),
    },
  ],
}))
</script>

<template>
  <article>
    <section class="hero-glow border-b border-[var(--line)]">
      <div class="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16">
        <nav aria-label="Trilha de navegação" class="muted flex flex-wrap items-center gap-2 text-xs">
          <NuxtLink to="/" class="transition-colors hover:text-[var(--accent)]">Início</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <NuxtLink to="/top5" class="transition-colors hover:text-[var(--accent)]">Top 5</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <NuxtLink
            :to="`/categoria/${post.categorySlug}`"
            class="transition-colors hover:text-[var(--accent)]"
          >
            {{ sentenceCase(post.category) }}
          </NuxtLink>
        </nav>

        <div class="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-14">
          <div class="animate-rise">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge color="primary" variant="solid">Top {{ products.length }}</UBadge>
              <UBadge color="neutral" variant="subtle">{{ sentenceCase(post.category) }}</UBadge>
              <span class="muted text-xs">{{ post.monthLabel }}</span>
            </div>

            <h1 class="mt-5 font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-balance sm:text-5xl">
              {{ post.title }}
            </h1>

            <p class="muted mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
              {{ post.description }}
            </p>

            <div class="muted mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span class="inline-flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5" />
                {{ formatDate(post.date) }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <UIcon name="i-lucide-clock" class="h-3.5 w-3.5" />
                {{ readingTimeLabel(post.readingMinutes) }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <UIcon name="i-lucide-shield-check" class="h-3.5 w-3.5" />
                Dados reais do anúncio
              </span>
            </div>

            <div class="mt-7">
              <ShareButtons :url="canonical" :title="post.title" />
            </div>
          </div>

          <div v-if="first" class="relative animate-rise [animation-delay:100ms]">
            <div aria-hidden="true" class="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/15 via-lime-400/10 to-transparent blur-2xl" />
            <div class="panel relative overflow-hidden rounded-[2rem]">
              <div class="relative aspect-[4/3] bg-[var(--paper-deep)]">
                <picture>
                  <source :srcset="useAsset(first.image)" type="image/webp" />
                  <img
                    :src="useAsset(first.imageFallback)"
                    :alt="`Foto do produto ${first.name}`"
                    class="h-full w-full object-contain p-3"
                    loading="eager"
                    fetchpriority="high"
                  />
                </picture>
                <span class="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
                  #1 do ranking
                </span>
              </div>
              <div class="p-5">
                <p class="line-clamp-2 text-sm font-semibold leading-snug">{{ first.name }}</p>
                <div class="mt-3 flex items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">A partir de</p>
                    <p class="font-display text-2xl font-extrabold tracking-[-0.03em]">
                      {{ formatPrice(first.price) }}
                    </p>
                  </div>
                  <span v-if="first.rating" class="muted inline-flex items-center gap-1 text-xs">
                    <UIcon name="i-lucide-star" class="h-3.5 w-3.5 text-amber-500" />
                    {{ formatRating(first.rating) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <AffiliateDisclosure :text="post.affiliateDisclosure" />

      <div class="mt-10 flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          eyebrow="O ranking"
          title="Os melhores na ordem"
          :description="`Critério: nota, vendas e preço real dos anúncios. Faixa de preço: ${
            range ? `${formatPrice(range.min)} a ${formatPrice(range.max)}` : 'confira nos links'
          }.`"
        />
        <span class="muted text-xs">{{ products.length }} produtos selecionados</span>
      </div>

      <div class="mt-6 grid gap-5">
        <ProductRankCard
          v-for="(product, index) in products"
          :key="product.rank"
          :product="product"
          class="animate-rise"
          :style="{ animationDelay: `${index * 55}ms` }"
        />
      </div>
    </section>

    <section class="border-y border-[var(--line)] bg-[var(--paper-deep)]">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionTitle eyebrow="Análise" title="O que você precisa saber antes de comprar" />
          <div class="prose-rankou mt-6 max-w-3xl">
            <ContentRenderer :value="content" />
          </div>

          <div v-if="faq.length" class="mt-12">
            <h2 class="font-display text-2xl font-extrabold tracking-[-0.03em]">Perguntas frequentes</h2>
            <div class="mt-5 space-y-3">
              <details
                v-for="item in faq"
                :key="item.question"
                class="panel group rounded-2xl open:border-emerald-500/30"
              >
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {{ item.question }}
                  <UIcon
                    name="i-lucide-plus"
                    class="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"
                  />
                </summary>
                <p class="muted px-5 pb-5 text-sm leading-relaxed">{{ item.answer }}</p>
              </details>
            </div>
          </div>
        </div>

        <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div class="panel rounded-3xl p-5">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] accent">Resumo do ranking</p>
            <dl class="mt-4 space-y-3 text-sm">
              <div class="flex items-start justify-between gap-3">
                <dt class="muted">#1</dt>
                <dd class="text-right font-medium">{{ first?.name }}</dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="muted">Faixa de preço</dt>
                <dd class="text-right font-medium">
                  <template v-if="range">{{ formatPrice(range.min) }} – {{ formatPrice(range.max) }}</template>
                  <template v-else>—</template>
                </dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="muted">Publicado</dt>
                <dd class="text-right font-medium">{{ formatDate(post.date) }}</dd>
              </div>
              <div class="flex items-start justify-between gap-3">
                <dt class="muted">Produtos</dt>
                <dd class="text-right font-medium">{{ products.length }}</dd>
              </div>
            </dl>
            <UButton
              v-if="first"
              :to="first.affiliateUrl"
              target="_blank"
              rel="sponsored nofollow noopener"
              color="primary"
              size="lg"
              block
              class="mt-5"
              trailing-icon="i-lucide-arrow-up-right"
            >
              Ver oferta #1
            </UButton>
            <p class="mt-3 text-[10px] leading-relaxed text-[var(--muted)]">
              Link de afiliado. Preço e disponibilidade podem mudar.
            </p>
          </div>

          <div class="panel-soft rounded-3xl p-5 text-xs leading-relaxed text-[var(--muted)]">
            <p class="font-semibold text-[var(--ink)]">Como ler este ranking</p>
            <p class="mt-2">
              A posição combina nota, volume de vendas e desconto no momento da publicação. O preço
              exibido é o do momento da coleta; confira o valor atual no link.
            </p>
            <NuxtLink to="/sobre" class="mt-3 inline-flex items-center gap-1 font-semibold accent">
              Metodologia completa
              <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>

          <div class="panel rounded-3xl p-5">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] accent">Compartilhe</p>
            <p class="muted mt-2 text-xs leading-relaxed">
              Ajude alguém a economizar tempo na próxima compra.
            </p>
            <div class="mt-3">
              <ShareButtons :url="canonical" :title="post.title" />
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section v-if="related.length" class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Continue explorando"
          title="Outros rankings que podem ajudar"
          description="Mais listas organizadas pelo mesmo critério: dado real, decisão rápida."
        />
        <UButton to="/top5" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
          Ver todos
        </UButton>
      </div>
      <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <TopFiveCard v-for="item in related" :key="item.path" :post="item" />
      </div>
    </section>
  </article>
</template>
