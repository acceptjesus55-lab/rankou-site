<script setup lang="ts">
const route = useRoute()

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
      <NuxtLink to="/" aria-label="Rankou — página inicial" class="shrink-0">
        <BrandMark />
      </NuxtLink>

      <nav class="ml-auto flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
        <NuxtLink
          to="/top5"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          :class="isActive('/top5') ? 'accent' : 'muted'"
        >
          Top 5
        </NuxtLink>
        <NuxtLink
          to="/sobre"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          :class="isActive('/sobre') ? 'accent' : 'muted'"
        >
          Como funciona
        </NuxtLink>
        <UColorModeButton color="neutral" variant="ghost" aria-label="Alternar tema" />
      </nav>
    </div>
  </header>
</template>
