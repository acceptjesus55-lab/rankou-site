# Rankou — portal de Top 5

Site estático em **Nuxt 4.6** para publicar os rankings gerados pelo
[money-printer](../money-printer). Cada Top 5 vira um Markdown com dados reais do Mercado Livre,
imagens otimizadas e uma página com SEO completo, hospedada no **GitHub Pages**.

O site é o destino dos links compartilhados no Telegram/TikTok: o cliente abre o ranking, vê os
produtos em ordem, confere preço/nota/vendas e compra pelo link de afiliado.

## Stack

| Peça | Versão | Papel |
| --- | --- | --- |
| Nuxt | 4.6.3 | SSG, rotas, prerender, Vue 3.5 |
| `@nuxt/content` | 3.16.2 | Markdown tipado, collection `top5`, build estático |
| `@nuxt/ui` | 4.12.0 | Componentes, Tailwind CSS v4, color mode e fontes |
| `@nuxtjs/seo` | 6.0.1 | Sitemap, robots, Schema.org e SEO utils |
| `@nuxt/fonts` | via Nuxt UI | Fontes self-hosted no build |
| `@nuxt/icon` | via Nuxt UI | Ícones Lucide no bundle local |
| `better-sqlite3` | build only | Banco que o Content usa para compilar as collections |

## Módulos avaliados

| Módulo | Decisão | Por quê |
| --- | --- | --- |
| `@nuxt/content` | **Usar** | É o CMS certo para conteúdo versionado em Markdown, com schema Zod e renderização MDC. O site é 100% estático e o deploy é um `git push`. |
| `@nuxt/ui` | **Usar** | Em v4 a biblioteca inteira (125+ componentes) é gratuita/MIT e já traz Tailwind CSS v4, `@nuxt/icon`, `@nuxt/fonts` e color mode. Não precisa instalar Tailwind separadamente. |
| `@nuxtjs/seo` | **Usar** | Bundle principal de SEO: `nuxt-site-config`, `sitemap`, `robots`, `schema-org` e `seo-utils`. O `og-image` automático foi desligado porque a dashboard gera a imagem social real do produto. O `ai-ready`/`llms.txt` também está desligado: não é necessário para o portal e duplicava a instalação do sitemap. |
| `nuxt-studio` | **Não agora** | Editor online exige autenticação/GitHub App (e o ecossistema do Studio). A dashboard já é o CMS: gera Markdown e faz commit. Dá para plugar depois sem mudar o conteúdo. |
| `@nuxtjs/supabase` | **Não agora** | O site é estático e o conteúdo é resolvido em build. Não há necessidade de banco em runtime para rankings. Faria sentido para comentários, auth ou analytics, não para o Top 5. |
| Nuxt Hub | **Não usar** | É uma plataforma de hospedagem/deploy. O alvo é GitHub Pages; adicionar Hub só criaria outro caminho de deploy. |
| `@nuxt/scripts` | **Opcional** | Útil para carregar analytics/embeds sem bloquear a hidratação. Não é necessário para o MVP; pode entrar quando houver um script real. |
| `@nuxtjs/delay-hydration` | **Opcional** | O site tem pouca interatividade (busca, accordion, tema). O ganho seria pequeno e adicionaria complexidade de build. |
| `nuxt-site-config` | **Já incluído** | Vem com `@nuxtjs/seo`; configura nome, URL, locale e é a base do canonical/sitemap. |
| `comark` | **Não usar** | O Content já renderiza Markdown/MDC no build. Comark duplicaria a camada de Markdown sem ganho para conteúdo estático. |
| `@nuxt/fonts` | **Incluído** | Registrado automaticamente pelo Nuxt UI; usamos Plus Jakarta Sans + Bricolage Grotesque. |

## Estrutura

```text
rankou-site/
  app/
    assets/css/main.css      # Tailwind v4 + Nuxt UI + design tokens + prose
    components/              # header, footer, cards, CTA, share, disclosure
    composables/useAsset.ts  # baseURL do GitHub Pages + URLs absolutas
    layouts/default.vue
    pages/
      index.vue              # home/portal
      top5/index.vue         # arquivo com busca e agrupamento por mês
      top5/[slug].vue        # página do ranking (produtos + artigo + FAQ + SEO)
      categoria/[slug].vue   # página de categoria
      sobre.vue              # metodologia e transparência
    error.vue
  content/top5/*.md          # publicados pela dashboard
  public/top5/<slug>/        # imagens otimizadas de cada ranking
  server/routes/feed.xml.ts  # RSS
  content.config.ts          # schema Zod da collection
  nuxt.config.ts
  .github/workflows/deploy.yml
```

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # SSG em .output/public
npm run typecheck
```

O Content exige `better-sqlite3` no build; ele já está em `devDependencies`.

## Publicar um Top 5

O fluxo completo é:

```text
money-printer: projeto aprovado (completed)
  -> botão "Publicar no site" no dashboard
  -> content/top5/<data>-<slug>.md
  -> public/top5/<slug>/{1..5}.{webp,jpg}, thumbs, cover, og.jpg
  -> git commit + git push no repo do site
  -> GitHub Actions roda npm run generate
  -> GitHub Pages atualiza
```

No `.env` do **money-printer**:

```env
SITE_DIR=../rankou-site
SITE_URL=https://SEU-USUARIO.github.io/rankou-site
SITE_PUSH=true
SITE_GIT_REMOTE=origin
```

- `SITE_URL` é opcional; sem ele o conteúdo é gerado, mas a dashboard não mostra o link público.
- `SITE_PUSH=false` gera os arquivos sem commitar.
- A publicação só é liberada para projetos `completed` (a aprovação humana continua obrigatória).
- O slug é `<data-em-São-Paulo>-<categoria>`; republicar o mesmo projeto sobrescreve a mesma página.

Alternativa por CLI (dentro de `money-printer`):

```bash
npm start -- site:publish --id=<uuid>
npm start -- site:publish --id=<uuid> --preview   # projeto não aprovado, sem push/DB
```

## Deploy no GitHub Pages

1. Crie o repositório `rankou-site` (público, para Pages gratuito) e envie este projeto:

   ```bash
   git init
   git add .
   git commit -m "site: initial"
   git branch -M main
   git remote add origin https://github.com/<usuario>/rankou-site.git
   git push -u origin main
   ```

2. Em **Settings → Pages**, escolha **GitHub Actions** como source.
3. O workflow `.github/workflows/deploy.yml` roda em cada push na `main` e publica `.output/public`.
4. O workflow calcula sozinho:
   - `NUXT_PUBLIC_SITE_URL=https://<owner>.github.io` (origem, sem path)
   - `NUXT_APP_BASE_URL=/<repo>/` (subpath do GitHub Pages)
5. Para domínio próprio, crie `public/CNAME` e defina a variável de repositório `SITE_URL`
   (ex.: `https://rankou.com.br`). Nesse caso a base é `/`.

> `site.url` no Nuxt SEO é sempre a **origem**. O subpath do GitHub Pages fica em
> `NUXT_APP_BASE_URL`; canonical, sitemap, imagens e links são montados com os dois.

> O repo precisa de `package-lock.json` (está versionado) para o `npm ci` do Actions. Depois do
> primeiro deploy, envie `sitemap.xml` no Google Search Console. Em project pages o `robots.txt` do
> domínio pertence ao GitHub; com domínio próprio (base `/`) ele é gerado normalmente.

## Formato do conteúdo

Cada `content/top5/<slug>.md` tem frontmatter tipado e um corpo Markdown:

```yaml
---
title: "Top 5 fones bluetooth em outubro de 2026 para uso diário"
seoTitle: "Top 5 fones bluetooth em outubro de 2026 para uso diário"
description: "Ranking Top 5 de ... no Mercado Livre em Outubro de 2026: preços, nota, vendas e links."
date: "2026-10-26"
updated: "2026-10-27"
category: "fone de ouvido bluetooth"
categorySlug: "fone-de-ouvido-bluetooth"
query: "fone de ouvido bluetooth"
monthLabel: "Outubro de 2026"
cover: "top5/<slug>/cover.webp"
socialImage: "top5/<slug>/og.jpg"
products:
  - rank: 1
    name: "..."
    price: 78.9
    originalPrice: 149
    discountPercent: 47
    rating: 4.9
    reviews: null
    sold: 100000
    seller: "..."
    sku: "MLB24117280"
    image: "top5/<slug>/1.webp"
    imageFallback: "top5/<slug>/1.jpg"
    thumb: "top5/<slug>/1-thumb.webp"
    productUrl: "https://www.mercadolivre.com.br/..."
    affiliateUrl: "https://meli.la/..."
    highlight: "..."
    description: "..."
faq:
  - question: "..."
    answer: "..."
tags: ["fone de ouvido bluetooth", "top 5", "outubro de 2026", "mercado livre"]
readingMinutes: 4
projectId: "<uuid>"
affiliateDisclosure: "..."
---
```

O corpo traz “Por que este ranking existe”, “Como escolhemos”, “O que observar antes de comprar”,
“Vale a pena?” e a transparência de afiliado. A página renderiza os cards a partir de `products` e o
texto com `ContentRenderer`. O Content guarda `date` como data de calendário (YYYY-MM-DD); o site
formata em UTC para não deslocar o dia em São Paulo.

## SEO

- `<title>` com template `· Rankou`, description, canonical e Open Graph/Twitter.
- JSON-LD com `BreadcrumbList`, `ItemList`, `Product`/`Offer` e `FAQPage`.
- Sitemap gerado no build (`sitemap.zeroRuntime`). Em project pages, um plugin remove a URL
  duplicada que o crawler cria para a home com o subpath do GitHub Pages. `robots.txt` é gerado
  em deployments na raiz (domínio próprio ou user page); em `/<repo>/` ele pertence ao domínio.
- RSS em `/feed.xml`.
- Prerender com crawler: home, arquivo, categorias, cada post, 404 e sitemap.
- Imagens em WebP com fallback JPEG, `loading=lazy`, dimensões e `alt` real.
- `lang="pt-BR"` e links de afiliado com `rel="sponsored nofollow noopener"`.
- O visual funciona em light/dark e respeita `prefers-reduced-motion`.

## Comandos

```bash
npm run dev
npm run generate
npm run preview
npm run typecheck
```
