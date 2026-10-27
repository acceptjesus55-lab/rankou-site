<script setup lang="ts">
const description =
  'Entenda como o Rankou monta cada Top 5: filtros, pontuação, checagem de dados e transparência dos links de afiliado.'

useSeoMeta({
  title: 'Como escolhemos os produtos',
  description,
  ogTitle: 'Como o Rankou escolhe os produtos',
  ogDescription: description,
  ogImage: useAbsoluteAsset('og-default.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Rankou — como escolhemos os produtos',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const steps = [
  {
    icon: 'i-lucide-scan-search',
    title: 'Coleta no Mercado Livre',
    text: 'Lemos os anúncios reais: título, preço, desconto, nota, quantidade de vendas, vendedor e foto do produto.',
  },
  {
    icon: 'i-lucide-filter',
    title: 'Filtros mínimos',
    text: 'Entram apenas produtos com boa nota, histórico de vendas consistente e imagem real disponível.',
  },
  {
    icon: 'i-lucide-calculator',
    title: 'Pontuação objetiva',
    text: 'A nota domina o ranking; o volume de vendas entra em escala logarítmica e o desconto funciona como desempate.',
  },
  {
    icon: 'i-lucide-badge-check',
    title: 'Conferência final',
    text: 'Abrimos a página do produto para confirmar os dados e a imagem antes de publicar o Top 5.',
  },
]

const faq = [
  {
    question: 'O Rankou recebe dinheiro para colocar um produto no ranking?',
    answer:
      'Não. A ordem é calculada pelos dados do anúncio. Os links são de afiliado, então podemos receber comissão se você comprar por eles, mas isso não altera a posição dos produtos.',
  },
  {
    question: 'Por que o preço do site pode estar diferente do Mercado Livre?',
    answer:
      'O preço exibido é o do momento em que o ranking foi montado. O Mercado Livre muda ofertas com frequência, então sempre confira o valor atual no link antes de comprar.',
  },
  {
    question: 'Quantos produtos entram em cada Top 5?',
    answer:
      'Trabalhamos com Top 3, Top 4 ou Top 5. O tamanho depende da quantidade de produtos realmente competitivos encontrados na categoria.',
  },
]
</script>

<template>
  <div>
    <section class="hero-glow border-b border-[var(--line)]">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <nav aria-label="Trilha de navegação" class="muted flex items-center gap-2 text-xs">
          <NuxtLink to="/" class="transition-colors hover:text-[var(--accent)]">Início</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span class="text-[var(--ink)]">Como funciona</span>
        </nav>

        <p class="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] accent">Metodologia</p>
        <h1 class="mt-2 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.045em] text-balance sm:text-5xl">
          Como o Rankou escolhe cada Top 5
        </h1>
        <p class="muted mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
          Sem opinião solta e sem produto patrocinado. O ranking nasce dos números que o Mercado Livre
          já mostra em cada anúncio — e você pode conferir tudo nos links.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div class="grid gap-5 md:grid-cols-2">
        <div v-for="step in steps" :key="step.title" class="panel rounded-3xl p-6">
          <div class="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
            <UIcon :name="step.icon" class="h-5 w-5" />
          </div>
          <h2 class="mt-5 font-display text-lg font-bold">{{ step.title }}</h2>
          <p class="muted mt-2 text-sm leading-relaxed">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <section class="border-y border-[var(--line)] bg-[var(--paper-deep)]">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow="A conta"
          title="A pontuação, sem caixa-preta"
          description="Cada candidato recebe uma nota objetiva. Depois, os melhores são ordenados e os empates usam vendas, nota e identificador do anúncio."
        />
        <div class="panel rounded-3xl p-6 sm:p-8">
          <p class="text-[11px] font-bold uppercase tracking-[0.16em] accent">Fórmula do ranking</p>
          <pre class="mt-4 overflow-x-auto rounded-2xl bg-[var(--paper-deep)] p-5 text-sm leading-relaxed"><code>nota × 20
+ log10(vendidos + 1) × 10
+ desconto × 0,5</code></pre>
          <ul class="muted mt-5 space-y-3 text-sm leading-relaxed">
            <li class="flex gap-2">
              <UIcon name="i-lucide-check" class="mt-0.5 h-4 w-4 shrink-0 accent" />
              A nota tem o maior peso: um produto mal avaliado não sobe só por vender muito.
            </li>
            <li class="flex gap-2">
              <UIcon name="i-lucide-check" class="mt-0.5 h-4 w-4 shrink-0 accent" />
              Vendas entram em escala logarítmica para não transformar popularidade em monopólio.
            </li>
            <li class="flex gap-2">
              <UIcon name="i-lucide-check" class="mt-0.5 h-4 w-4 shrink-0 accent" />
              O desconto é apenas um desempate, nunca o critério principal.
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div class="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionTitle
            eyebrow="Transparência"
            title="O que o Rankou faz — e o que não faz"
            description="A confiança é parte do produto. Por isso, algumas regras são públicas."
          />
          <div class="mt-6 grid gap-4">
            <div class="panel rounded-2xl p-5">
              <p class="flex items-center gap-2 text-sm font-semibold">
                <UIcon name="i-lucide-check-circle-2" class="h-4 w-4 accent" /> O que fazemos
              </p>
              <ul class="muted mt-3 space-y-2 text-sm">
                <li>Usamos dados e fotos reais dos anúncios.</li>
                <li>Mostramos preço, nota e vendas do momento da publicação.</li>
                <li>Informamos que os links são de afiliado.</li>
                <li>Atualizamos o arquivo a cada novo Top 5.</li>
              </ul>
            </div>
            <div class="panel rounded-2xl p-5">
              <p class="flex items-center gap-2 text-sm font-semibold">
                <UIcon name="i-lucide-x-circle" class="h-4 w-4 text-rose-500" /> O que não fazemos
              </p>
              <ul class="muted mt-3 space-y-2 text-sm">
                <li>Não vendemos posição no ranking.</li>
                <li>Não inventamos testes que não fizemos.</li>
                <li>Não prometemos urgência falsa ou preço garantido.</li>
                <li>Não escondemos que podemos receber comissão.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <AffiliateDisclosure />
          <div class="panel rounded-3xl p-6">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] accent">Perguntas frequentes</p>
            <div class="mt-4 space-y-3">
              <details
                v-for="item in faq"
                :key="item.question"
                class="group rounded-2xl border border-[var(--line)] p-4 open:border-emerald-500/30"
              >
                <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  {{ item.question }}
                  <UIcon name="i-lucide-plus" class="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p class="muted mt-3 text-sm leading-relaxed">{{ item.answer }}</p>
              </details>
            </div>
          </div>
          <div class="panel-soft rounded-3xl p-6">
            <p class="text-sm font-semibold">Quer sugerir uma categoria?</p>
            <p class="muted mt-2 text-sm leading-relaxed">
              O Rankou prioriza o que está vendendo no Mercado Livre. Novos rankings entram no arquivo
              assim que são publicados.
            </p>
            <UButton to="/top5" class="mt-4" color="primary" trailing-icon="i-lucide-arrow-right">
              Ver rankings publicados
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
