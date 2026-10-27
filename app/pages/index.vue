<script setup lang="ts">
import type { TopFivePost } from '~/types/content'

const { data } = await useAsyncData('home-top5', () => queryCollection('top5').order('date', 'DESC').all())

const posts = computed(() => (data.value ?? []) as unknown as TopFivePost[])
const featured = computed(() => posts.value[0])
const recent = computed(() => posts.value.slice(1, 7))
const spotlight = computed(() => featured.value?.products[0])

const categories = computed(() => {
  const map = new Map<string, { slug: string; label: string; count: number }>()
  for (const post of posts.value) {
    const existing = map.get(post.categorySlug)
    if (existing) {
      existing.count += 1
    } else {
      map.set(post.categorySlug, { slug: post.categorySlug, label: post.category, count: 1 })
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8)
})

const homeDescription =
  'Top 5 de produtos escolhidos por nota, vendas e preço real no Mercado Livre. Rankings curtos, transparentes e atualizados para você comprar melhor.'

useSeoMeta({
  title: 'Top 5 do Mercado Livre, sem enrolação',
  description: homeDescription,
  ogTitle: 'Rankou — Top 5 do Mercado Livre, sem enrolação',
  ogDescription: homeDescription,
  ogImage: useAbsoluteAsset('og-default.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Rankou — Top 5 do Mercado Livre',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <section class="hero-glow relative overflow-hidden border-b border-[var(--line)]">
      <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-24">
        <div class="animate-rise">
          <p class="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-600/[0.07] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Rankings com dados reais
          </p>

          <h1 class="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
            O <span class="relative inline-block">
              <span class="relative z-10">Top 5</span>
              <span class="absolute inset-x-0 bottom-1 -z-0 h-3 -rotate-1 rounded-sm bg-emerald-400/35 dark:bg-emerald-500/25" />
            </span>
            certo, sem passar horas pesquisando.
          </h1>

          <p class="muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            A gente compara nota, volume de vendas e preço real dos anúncios do Mercado Livre e
            entrega um ranking curto, honesto e direto ao ponto.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <UButton to="/top5" size="lg" color="primary" trailing-icon="i-lucide-arrow-right">
              Ver todos os rankings
            </UButton>
            <UButton to="/sobre" size="lg" color="neutral" variant="outline" icon="i-lucide-list-checks">
              Como escolhemos
            </UButton>
          </div>

          <dl class="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--line)] pt-6">
            <div>
              <dt class="muted text-[11px] font-semibold uppercase tracking-[0.14em]">Critério 1</dt>
              <dd class="mt-1 text-sm font-semibold">Nota real</dd>
            </div>
            <div>
              <dt class="muted text-[11px] font-semibold uppercase tracking-[0.14em]">Critério 2</dt>
              <dd class="mt-1 text-sm font-semibold">Vendas reais</dd>
            </div>
            <div>
              <dt class="muted text-[11px] font-semibold uppercase tracking-[0.14em]">Critério 3</dt>
              <dd class="mt-1 text-sm font-semibold">Preço real</dd>
            </div>
          </dl>
        </div>

        <div class="relative animate-rise [animation-delay:120ms]">
          <div
            aria-hidden="true"
            class="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/15 via-lime-400/10 to-transparent blur-2xl"
          />
          <NuxtLink
            v-if="featured && spotlight"
            :to="featured.path"
            class="panel group relative block overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-[var(--paper-deep)]">
              <picture>
                <source :srcset="useAsset(spotlight.image)" type="image/webp" />
                <img
                  :src="useAsset(spotlight.imageFallback)"
                  :alt="`Foto do produto ${spotlight.name}`"
                  class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.02]"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
              <div class="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                <UBadge color="primary" variant="solid">Ranking novo</UBadge>
                <span class="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  Top {{ featured.products.length }}
                </span>
              </div>
            </div>
            <div class="p-5">
              <p class="text-[11px] font-bold uppercase tracking-[0.16em] accent">{{ sentenceCase(featured.category) }}</p>
              <h2 class="mt-2 font-display text-xl font-bold leading-snug tracking-[-0.02em]">
                {{ featured.title }}
              </h2>
              <div class="mt-3 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
                <div>
                  <p class="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">#1 do ranking</p>
                  <p class="mt-0.5 line-clamp-1 text-sm font-semibold">{{ spotlight.name }}</p>
                </div>
                <p class="font-display text-xl font-extrabold tracking-[-0.03em]">
                  {{ formatPrice(spotlight.price) }}
                </p>
              </div>
            </div>
          </NuxtLink>

          <div v-else class="panel flex min-h-[380px] flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <UIcon name="i-lucide-trophy" class="h-12 w-12 accent" />
            <p class="mt-4 font-display text-xl font-bold">O primeiro ranking está chegando</p>
            <p class="muted mt-2 max-w-xs text-sm">
              Enquanto isso, conheça como o Rankou escolhe os produtos.
            </p>
            <UButton to="/sobre" class="mt-5" variant="outline" color="neutral">Como funciona</UButton>
          </div>
        </div>
      </div>
    </section>

    <section v-if="categories.length" class="border-b border-[var(--line)]">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-5 sm:px-6">
        <span class="muted mr-1 text-xs font-semibold uppercase tracking-[0.14em]">Categorias</span>
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/categoria/${category.slug}`"
          class="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-emerald-500/40 hover:text-[var(--accent)]"
        >
          {{ sentenceCase(category.label) }}
          <span class="rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold accent">
            {{ category.count }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Últimos rankings"
          title="Escolhas boas, explicadas rápido"
          description="Cada ranking mostra os produtos, os números que importam e o link direto para a oferta."
        />
        <UButton to="/top5" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
          Ver arquivo completo
        </UButton>
      </div>

      <div v-if="featured" class="mt-8 grid gap-5">
        <TopFiveCard :post="featured" featured />
        <div v-if="recent.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TopFiveCard v-for="post in recent" :key="post.path" :post="post" />
        </div>
      </div>

      <div v-else class="panel mt-8 rounded-3xl p-10 text-center">
        <UIcon name="i-lucide-inbox" class="mx-auto h-10 w-10 accent" />
        <p class="mt-4 font-display text-xl font-bold">Nenhum ranking publicado ainda</p>
        <p class="muted mt-2 text-sm">Publique o primeiro Top 5 pela dashboard para ele aparecer aqui.</p>
      </div>
    </section>

    <section class="border-y border-[var(--line)] bg-[var(--paper-deep)]">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionTitle
          eyebrow="Como funciona"
          title="Menos achismo, mais critério"
          description="O ranking não é opinião solta: ele nasce dos dados que o Mercado Livre já mostra em cada anúncio."
          align="center"
        />

        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <div class="panel rounded-3xl p-6">
            <div class="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
              <UIcon name="i-lucide-database" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-lg font-bold">Dados do anúncio</h3>
            <p class="muted mt-2 text-sm leading-relaxed">
              Nota, quantidade de vendas, preço, desconto e vendedor são lidos direto da página do
              produto.
            </p>
          </div>
          <div class="panel rounded-3xl p-6">
            <div class="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
              <UIcon name="i-lucide-scale" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-lg font-bold">Ranking transparente</h3>
            <p class="muted mt-2 text-sm leading-relaxed">
              A nota pesa mais, depois entram o volume de vendas e o desconto. Nenhum produto paga
              para aparecer.
            </p>
          </div>
          <div class="panel rounded-3xl p-6">
            <div class="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
              <UIcon name="i-lucide-link" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-lg font-bold">Link direto</h3>
            <p class="muted mt-2 text-sm leading-relaxed">
              Você confere o preço atualizado e compra no Mercado Livre. O Rankou pode receber
              comissão de afiliado, sem custo extra.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div class="hero-glow panel relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
        <p class="text-[11px] font-bold uppercase tracking-[0.2em] accent">Sempre atualizado</p>
        <h2 class="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-[-0.04em] text-balance sm:text-4xl">
          Acompanhe os próximos rankings
        </h2>
        <p class="muted mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
          Salve o Rankou nos favoritos e volte sempre que precisar comprar algo. Cada novo Top 5
          entra no arquivo com data e critério.
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <UButton to="/top5" size="lg" color="primary" trailing-icon="i-lucide-arrow-right">
            Explorar rankings
          </UButton>
          <UButton to="/sobre" size="lg" color="neutral" variant="outline">
            Entender a metodologia
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
