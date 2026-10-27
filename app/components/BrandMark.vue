<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <span
      class="flex items-center justify-center rounded-xl bg-emerald-600 text-white shadow-[0_6px_20px_-8px_rgba(5,150,105,0.8)]"
      :class="size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'"
    >
      <UIcon
        name="i-lucide-chart-no-axes-column-increasing"
        :class="size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'"
      />
    </span>
    <span
      class="font-display font-extrabold tracking-[-0.045em]"
      :class="size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl'"
    >
      rankou<span class="text-emerald-600 dark:text-emerald-400">.</span>
    </span>
  </span>
</template>
