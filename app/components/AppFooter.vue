<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-20 border-t border-[var(--line)] bg-[var(--paper-deep)]">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <NuxtLink to="/" aria-label="Rankou — página inicial">
          <BrandMark />
        </NuxtLink>
        <p class="muted mt-4 max-w-sm text-sm leading-relaxed">
          Rankings objetivos de produtos no Mercado Livre. A gente cruza nota, vendas e preço para
          você decidir em minutos, não em horas.
        </p>
        <p class="mt-4 text-xs leading-relaxed text-[var(--muted)]">
          O Rankou participa do Programa de Afiliados do Mercado Livre. Podemos receber comissão por
          compras feitas pelos links do site, sem custo extra para você.
        </p>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Explorar</p>
        <ul class="mt-4 space-y-2 text-sm">
          <li><NuxtLink to="/top5" class="muted transition-colors hover:text-[var(--accent)]">Todos os Top 5</NuxtLink></li>
          <li><NuxtLink to="/sobre" class="muted transition-colors hover:text-[var(--accent)]">Como escolhemos</NuxtLink></li>
          <li><NuxtLink to="/top5" class="muted transition-colors hover:text-[var(--accent)]">Novidades</NuxtLink></li>
        </ul>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Transparência</p>
        <ul class="mt-4 space-y-2 text-sm">
          <li class="muted">Dados reais do Mercado Livre</li>
          <li class="muted">Sem produto patrocinado</li>
          <li class="muted">Preços sujeitos a alteração</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-[var(--line)]">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {{ year }} Rankou. Todos os direitos reservados.</p>
        <p>Mercado Livre é uma marca do Mercado Livre S.A. O Rankou não é uma loja e não representa oficialmente o Mercado Livre.</p>
      </div>
    </div>
  </footer>
</template>
