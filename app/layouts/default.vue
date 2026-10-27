<template>
  <div class="site-shell min-h-screen">
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      Pular para o conteúdo
    </a>
    <AppHeader />
    <main id="conteudo" class="min-h-[60vh]">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
