<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
}>()

const toast = useToast()
const copied = ref(false)

const telegramUrl = computed(
  () => `https://t.me/share/url?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`,
)

const whatsappUrl = computed(
  () => `https://wa.me/?text=${encodeURIComponent(`${props.title} ${props.url}`)}`,
)

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    toast.add({ title: 'Link copiado!', color: 'success' })
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toast.add({ title: 'Não foi possível copiar o link.', color: 'error' })
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Compartilhar</span>
    <UButton
      :to="telegramUrl"
      target="_blank"
      rel="noopener noreferrer"
      color="neutral"
      variant="outline"
      size="sm"
      icon="i-lucide-send"
      aria-label="Compartilhar no Telegram"
    >
      Telegram
    </UButton>
    <UButton
      :to="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      color="neutral"
      variant="outline"
      size="sm"
      icon="i-lucide-message-circle"
      aria-label="Compartilhar no WhatsApp"
    >
      WhatsApp
    </UButton>
    <UButton
      color="neutral"
      variant="outline"
      size="sm"
      :icon="copied ? 'i-lucide-check' : 'i-lucide-link'"
      aria-label="Copiar link do ranking"
      @click="copyLink"
    >
      {{ copied ? 'Copiado' : 'Copiar link' }}
    </UButton>
  </div>
</template>
