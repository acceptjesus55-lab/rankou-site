<script setup lang="ts">
import type { TopFivePost } from '~/types/content'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data } = await useAsyncData(`top5-category-${slug.value}`, () =>
  queryCollection('top5').where('categorySlug', '=', slug.value).order('date', 'DESC').all(),
)

const posts = computed(() => (data.value ?? []) as unknown as TopFivePost[])

if (posts.value.length === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Categoria não encontrada' })
}

const category = computed(() => posts.value[0]?.category ?? slug.value)
const displayCategory = computed(() => sentenceCase(category.value))
const description = computed(
  () =>
    `Todos os rankings de ${displayCategory.value} do Rankou: Top 5 escolhidos por nota, vendas e preço real no Mercado Livre, organizados por data.`,
)

useSeoMeta({
  title: `Top 5 de ${displayCategory.value}`,
  description: description.value,
  ogTitle: `Top 5 de ${displayCategory.value} · Rankou`,
  ogDescription: description.value,
  ogImage: useAbsoluteAsset(posts.value[0]?.socialImage ?? 'og-default.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `Rankou — Top 5 de ${displayCategory.value}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <section class="hero-glow border-b border-[var(--line)]">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <nav aria-label="Trilha de navegação" class="muted flex flex-wrap items-center gap-2 text-xs">
          <NuxtLink to="/" class="transition-colors hover:text-[var(--accent)]">Início</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <NuxtLink to="/top5" class="transition-colors hover:text-[var(--accent)]">Top 5</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span class="text-[var(--ink)]">{{ displayCategory }}</span>
        </nav>

        <p class="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] accent">Categoria</p>
        <h1 class="mt-2 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
          Top 5 de {{ displayCategory }}
        </h1>
        <p class="muted mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
          {{ posts.length === 1 ? '1 ranking publicado' : `${posts.length} rankings publicados` }}.
          Todos com nota, vendas e preço reais no momento da seleção.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <UBadge color="neutral" variant="subtle">{{ rankingCount(posts.length) }}</UBadge>
          <UBadge color="neutral" variant="subtle">Atualizado com o Mercado Livre</UBadge>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <TopFiveCard v-for="post in posts" :key="post.path" :post="post" />
      </div>

      <div class="mt-12">
        <UButton to="/top5" color="neutral" variant="outline" icon="i-lucide-arrow-left">
          Ver todos os rankings
        </UButton>
      </div>
    </section>
  </div>
</template>
