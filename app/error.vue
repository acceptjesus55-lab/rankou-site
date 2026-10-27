<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: isNotFound.value ? 'Página não encontrada' : 'Algo deu errado',
  robots: 'noindex',
})

function goHome(): void {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="site-shell flex min-h-screen flex-col">
    <header class="mx-auto flex w-full max-w-6xl items-center px-4 py-6 sm:px-6">
      <NuxtLink to="/" aria-label="Rankou — página inicial">
        <BrandMark />
      </NuxtLink>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-16">
      <div class="panel w-full max-w-lg rounded-[2rem] p-8 text-center sm:p-12">
        <p class="font-display text-6xl font-extrabold tracking-[-0.06em] accent">
          {{ error.statusCode || 500 }}
        </p>
        <h1 class="mt-3 font-display text-2xl font-extrabold tracking-[-0.03em]">
          {{ isNotFound ? 'Esse ranking não existe (ou mudou de lugar)' : 'Algo deu errado por aqui' }}
        </h1>
        <p class="muted mt-3 text-sm leading-relaxed">
          {{
            isNotFound
              ? 'Confira o arquivo completo de Top 5 ou volte para a página inicial.'
              : 'Tente recarregar a página. Se continuar, volte para o início.'
          }}
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <UButton color="primary" size="lg" @click="goHome">Voltar ao início</UButton>
          <UButton to="/top5" color="neutral" variant="outline" size="lg">Ver Top 5</UButton>
        </div>
      </div>
    </main>
  </div>
</template>
