<script setup lang="ts">
import Button from '@/components/buttons/Button.vue'

const props = defineProps({
  /** Tokens inline de marked a renderizar. */
  tokens: { type: Array as () => any[], required: true },
})

function isLink(token: any) {
  return token.type === 'link'
}

// Texto plano de un árbol de tokens: para atributos (`alt`) no queremos HTML
// ni marcado (`**negrita**`), sólo lo que lee el usuario.
function plainText(tokens: any[]): string {
  return tokens
    .map((token) => {
      if (token.type === 'br') return ' '
      if (token.tokens && token.tokens.length > 0) return plainText(token.tokens)
      return token.text || ''
    })
    .join('')
}

function tokenToHtml(token: any): string {
  switch (token.type) {
    case 'text':
      if (token.tokens && token.tokens.length > 0) {
        return token.tokens.map(tokenToHtml).join('')
      }
      // marked entrega el texto crudo (sin escapar): dentro de `v-html` hay que
      // escaparlo. `escapeText` respeta las entidades que ya vienen (`&amp;`).
      return escapeText(token.text)
    case 'strong':
      return `<strong>${(token.tokens || []).map(tokenToHtml).join('')}</strong>`
    case 'em':
      return `<em>${(token.tokens || []).map(tokenToHtml).join('')}</em>`
    case 'codespan':
      return `<code class="cu-md-code-inline">${escapeHtml(token.text)}</code>`
    case 'del':
      return `<del>${(token.tokens || []).map(tokenToHtml).join('')}</del>`
    case 'image':
      return `<img src="${escapeHtml(token.href)}" alt="${escapeText(plainText(token.tokens || []) || token.text || '')}" class="cu-md-image" />`
    case 'link':
      return `<a href="${escapeHtml(token.href)}" class="cu-md-link" target="_blank" rel="noopener">${(token.tokens || []).map(tokenToHtml).join('')}</a>`
    case 'br':
      return '<br>'
    case 'escape':
      // `\<` produce un token `escape` con el carácter crudo: sin escapar, el
      // `<` reabre una etiqueta dentro del `v-html`.
      return escapeHtml(token.text)
    default:
      return ''
  }
}

// Escapa para contenido/atributos y respeta las entidades ya codificadas
// (`&amp;` no se vuelve `&amp;amp;`). Escapa comillas: el resultado se interpola
// en atributos (`src`, `href`, `alt`) y un `"` sin escapar inyecta atributos.
function escapeText(text: string): string {
  return text
    .replace(/&(?!#?\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Escapa todo `&` (texto literal de código, `codespan` y URLs).
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<template>
  <span class="cu-md-inline">
    <template v-for="(token, i) in props.tokens" :key="i">
      <Button
        v-if="isLink(token)"
        variant="link"
        :to="token.href"
        target="_blank"
        rel="noopener"
      >
        <InlineRenderer :tokens="token.tokens || []" />
      </Button>
      <span v-else v-html="tokenToHtml(token)"></span>
    </template>
  </span>
</template>

<style scoped>
.cu-md-inline {
  display: inline;
}

.cu-md-inline :deep(.cu-md-code-inline) {
  display: inline-flex;
  align-items: center;
  padding: var(--cu-space-2xs) var(--cu-space-sm);
  border-radius: var(--cu-radius);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  line-height: var(--cu-line-height-tight);
  white-space: nowrap;
  background-color: var(--cu-color-neutral-soft);
  color: var(--cu-color-neutral-text);
  border: var(--cu-border-thin) solid transparent;
}
</style>
