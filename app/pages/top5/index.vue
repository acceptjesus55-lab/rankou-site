<script setup lang="ts">
import type { TopFivePost } from '~/types/content'

const { data } = await useAsyncData('top5-archive', () => queryCollection('top5').order('date', 'DESC').all())

const posts = computed(() => (data.value ?? []) as unknown as TopFivePost[])
const search = ref('')

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return posts.value
  return posts.value.filter((post) => {
    const haystack = [post.title, post.description, post.category, ...(post.tags ?? [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
})

const groups = computed(() => groupByMonth(filtered.value))

const categoryCount = computed(() => new Set(posts.value.map((post) => post.categorySlug)).size)

const archiveDescription =
  'Todos os rankings Top 5 do Rankou, organizados por data. Produtos escolhidos por nota, vendas e preço real no Mercado Livre.'

useSeoMeta({
  title: 'Todos os Top 5',
  description: archiveDescription,
  ogTitle: 'Todos os Top 5 · Rankou',
  ogDescription: archiveDescription,
  ogImage: useAbsoluteAsset('og-default.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Rankou — arquivo de Top 5',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <section class="hero-glow border-b border-[var(--line)]">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <nav aria-label="Trilha de navegação" class="muted flex items-center gap-2 text-xs">
          <NuxtLink to="/" class="transition-colors hover:text-[var(--accent)]">Início</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span class="text-[var(--ink)]">Top 5</span>
        </nav>

        <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-2xl">
            <p class="text-[11px] font-bold uppercase tracking-[0.2em] accent">Arquivo completo</p>
            <h1 class="mt-2 font-display text-4xl font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
              Todos os Top 5 do Rankou
            </h1>
            <p class="muted mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
              Cada ranking fica salvo com a data de publicação e os números do momento. Use a busca
              para encontrar a categoria que você precisa.
            </p>
          </div>

          <dl class="panel flex divide-x divide-[var(--line)] rounded-2xl">
            <div class="px-4 py-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Rankings</dt>
              <dd class="font-display text-xl font-extrabold">{{ posts.length }}</dd>
            </div>
            <div class="px-4 py-3 text-center">
              <dt class="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Categorias</dt>
              <dd class="font-display text-xl font-extrabold">{{ categoryCount }}</dd>
            </div>
          </dl>
        </div>

        <div class="mt-8 max-w-md">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            size="lg"
            placeholder="Buscar por produto, categoria ou tag..."
            aria-label="Buscar rankings"
            class="w-full"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div v-if="groups.length" class="space-y-14">
        <section v-for="group in groups" :key="group.key" :aria-labelledby="`mes-${group.key}`">
          <div class="flex items-center gap-3">
            <h2 :id="`mes-${group.key}`" class="font-display text-xl font-bold tracking-[-0.02em]">
              {{ sentenceCase(group.label) }}
            </h2>
            <span class="h-px flex-1 bg-[var(--line)]" />
            <span class="muted text-xs font-medium">{{ rankingCount(group.posts.length) }}</span>
          </div>

          <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <TopFiveCard v-for="post in group.posts" :key="post.path" :post="post" />
          </div>
        </section>
      </div>

      <div v-else class="panel rounded-3xl p-10 text-center">
        <UIcon name="i-lucide-search-x" class="mx-auto h-10 w-10 accent" />
        <p class="mt-4 font-display text-xl font-bold">Nenhum ranking encontrado</p>
        <p class="muted mt-2 text-sm">
          {{ search ? `Nada para “${search}”. Tente outro termo.` : 'Assim que o primeiro Top 5 for publicado, ele aparece aqui.' }}
        </p>
        <UButton v-if="search" class="mt-5" variant="outline" color="neutral" @click="search = ''">
          Limpar busca
        </UButton>
      </div>
    </section>
  </div>
</template>
