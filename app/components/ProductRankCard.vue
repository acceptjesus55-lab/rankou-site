<script setup lang="ts">
import type { TopFiveProduct } from '~/types/content'

const props = defineProps<{
  product: TopFiveProduct
}>()

const off = computed(() =>
  discountPercent(props.product.price, props.product.originalPrice, props.product.discountPercent),
)

const href = computed(() => {
  const value = props.product.affiliateUrl || props.product.productUrl
  return /^https?:\/\//i.test(value) ? value : '#'
})

const seller = computed(() => {
  const value = props.product.seller?.trim()
  return value && !/^meios de pagamento$/i.test(value) ? value : null
})

const metrics = computed(() =>
  [
    props.product.rating !== null && props.product.rating !== undefined
      ? { icon: 'i-lucide-star', label: formatRating(props.product.rating), hint: 'nota' }
      : null,
    props.product.sold !== null && props.product.sold !== undefined
      ? { icon: 'i-lucide-shopping-bag', label: formatCompact(props.product.sold), hint: 'vendidos' }
      : null,
  ].filter((item): item is { icon: string; label: string; hint: string } => item !== null),
)
</script>

<template>
  <article
    :id="`produto-${product.rank}`"
    class="panel card-lift relative overflow-hidden rounded-3xl"
  >
    <div class="grid md:grid-cols-[240px_1fr]">
      <div class="relative overflow-hidden bg-[var(--paper-deep)]">
        <picture>
          <source :srcset="useAsset(product.image)" type="image/webp" />
          <img
            :src="useAsset(product.imageFallback)"
            :alt="`Foto do produto ${product.name}`"
            class="h-full max-h-[380px] w-full object-contain p-3 md:max-h-none md:min-h-[340px]"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span
          class="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-emerald-600 px-2 text-xs font-bold text-white shadow-lg"
        >
          #{{ product.rank }}
        </span>
        <span
          v-if="off"
          class="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg"
        >
          -{{ off }}%
        </span>
      </div>

      <div class="flex flex-col gap-4 p-5 sm:p-6">
        <div class="space-y-2">
          <p v-if="product.highlight" class="text-[11px] font-semibold uppercase tracking-[0.16em] accent">
            {{ product.highlight }}
          </p>
          <h3 class="font-display text-xl font-bold leading-snug tracking-[-0.02em] sm:text-2xl">
            {{ product.name }}
          </h3>
          <p class="muted text-sm leading-relaxed">{{ product.description }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span
            v-for="metric in metrics"
            :key="metric.hint"
            class="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-2.5 py-1 text-xs font-medium"
          >
            <UIcon :name="metric.icon" class="h-3.5 w-3.5 accent" />
            <strong class="font-semibold">{{ metric.label }}</strong>
            <span class="text-[var(--muted)]">{{ metric.hint }}</span>
          </span>
          <span
            v-if="seller"
            class="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper-deep)] px-2.5 py-1 text-xs font-medium"
          >
            <UIcon name="i-lucide-store" class="h-3.5 w-3.5 accent" />
            <span class="max-w-[140px] truncate">{{ seller }}</span>
          </span>
        </div>

        <div class="mt-auto flex flex-col gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">Preço na publicação</p>
            <div class="flex flex-wrap items-baseline gap-2">
              <p class="font-display text-2xl font-extrabold tracking-[-0.03em]">
                {{ formatPrice(product.price) }}
              </p>
              <p
                v-if="product.originalPrice && product.originalPrice > product.price"
                class="text-sm text-[var(--muted)] line-through"
              >
                {{ formatPrice(product.originalPrice) }}
              </p>
            </div>
            <p class="mt-1 text-[11px] text-[var(--muted)]">Confira o valor atual no Mercado Livre.</p>
          </div>

          <UButton
            :to="href"
            target="_blank"
            rel="sponsored nofollow noopener"
            color="primary"
            size="lg"
            class="w-full justify-center sm:w-auto"
            trailing-icon="i-lucide-arrow-up-right"
          >
            Ver oferta
          </UButton>
        </div>

        <p class="text-[10px] leading-relaxed text-[var(--muted)]">
          Link de afiliado. O preço pode mudar a qualquer momento; a compra é feita direto no Mercado Livre.
        </p>
      </div>
    </div>
  </article>
</template>
