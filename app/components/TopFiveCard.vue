<script setup lang="ts">
import type { TopFivePost } from '~/types/content'

const props = withDefaults(
  defineProps<{
    post: TopFivePost
    featured?: boolean
  }>(),
  { featured: false },
)

const first = computed(() => props.post.products[0])
const range = computed(() => priceRange(props.post.products.map((product) => product.price)))
</script>

<template>
  <NuxtLink :to="post.path" class="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]">
    <article
      class="panel card-lift h-full overflow-hidden rounded-3xl"
      :class="featured ? 'md:grid md:grid-cols-[1.05fr_1fr]' : 'flex flex-col'"
    >
      <div
        class="relative aspect-[4/3] overflow-hidden bg-[var(--paper-deep)]"
      >
        <picture v-if="first">
          <source :srcset="useAsset(first.image)" type="image/webp" />
          <img
            :src="useAsset(first.imageFallback)"
            :alt="`Foto do produto ${first.name}`"
            class="h-full w-full object-contain p-4 transition duration-500 ease-out group-hover:scale-[1.025]"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
        <UBadge color="primary" variant="solid" size="md" class="absolute left-4 top-4 shadow-lg">
          Top {{ post.products.length }}
        </UBadge>
        <div class="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
            {{ post.monthLabel }}
          </p>
          <span class="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
            {{ sentenceCase(post.category) }}
          </span>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3
          class="font-display font-bold leading-[1.15] tracking-[-0.02em]"
          :class="featured ? 'text-2xl sm:text-3xl' : 'text-xl'"
        >
          {{ post.title }}
        </h3>
        <p class="muted line-clamp-3 text-sm leading-relaxed">{{ post.description }}</p>

        <div class="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-xs text-[var(--muted)]">
          <span>{{ formatDate(post.date) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ readingTimeLabel(post.readingMinutes) }}</span>
          <template v-if="range">
            <span aria-hidden="true">·</span>
            <span>{{ formatPrice(range.min) }} – {{ formatPrice(range.max) }}</span>
          </template>
        </div>

        <span class="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold accent">
          Ver ranking
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  </NuxtLink>
</template>
