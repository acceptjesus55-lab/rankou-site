<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  { text: '' },
)
</script>

<template>
  <aside class="flex items-start gap-3 rounded-2xl border border-emerald-600/20 bg-emerald-600/[0.06] p-4 text-xs leading-relaxed text-[var(--muted)]">
    <UIcon name="i-lucide-badge-info" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
    <p>
      <strong class="font-semibold text-[var(--ink)]">Transparência:</strong>
      {{
        text ||
        'o Rankou participa do Programa de Afiliados do Mercado Livre. Podemos receber comissão pelas compras feitas pelos links deste site, sem custo extra para você. Preços e disponibilidade podem mudar a qualquer momento.'
      }}
    </p>
  </aside>
</template>
