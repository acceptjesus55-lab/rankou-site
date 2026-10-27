<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
    <p v-if="eyebrow" class="text-[11px] font-bold uppercase tracking-[0.2em] accent">
      {{ eyebrow }}
    </p>
    <h2 class="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-balance sm:text-3xl">
      {{ title }}
    </h2>
    <p v-if="description" class="muted mt-3 text-sm leading-relaxed sm:text-base">
      {{ description }}
    </p>
  </div>
</template>
