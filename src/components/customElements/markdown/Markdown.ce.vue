<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Markdown from '../../markdown/Markdown.vue'
import { DEFAULTS, extractColors, extractShared } from '@/plugins/cu-tokens/defaults'
import { darken, toHex, lighten, transparentize } from 'color2k'

const props = defineProps({
  /** Tema de colores (`light`, `dark`, `sigacadv2`) */
  theme: { type: String, default: 'light' },
})

function colorVar(name: string, value: string) {
  return `--cu-color-${name}: ${value};
    --cu-color-${name}-text: ${toHex(darken(value, 0.25))};
    --cu-color-${name}-hover: ${toHex(darken(value, 0.1))};
    --cu-color-${name}-active: ${toHex(lighten(value, 0.1))};
    --cu-color-${name}-ghost-hover: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-ghost-active: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-soft: ${toHex(transparentize(value, 0.85))};
    --cu-color-${name}-soft-hover: ${toHex(transparentize(value, 0.75))};
    --cu-color-${name}-soft-active: ${toHex(transparentize(value, 0.65))};
    --cu-color-${name}-subtle: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-subtle-hover: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-subtle-active: ${toHex(transparentize(value, 0.7))};
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};`
}

function colorsBlock(colors: any) {
  return `${colorVar('primary', colors.primary)}
    ${colorVar('secondary', colors.secondary)}
    ${colorVar('neutral', colors.neutral)}
    ${colorVar('success', colors.success)}
    ${colorVar('warning', colors.warning)}
    ${colorVar('danger', colors.danger)}
    --cu-color-surface: ${colors.surface};`
}

function sharedBlock(shared: any) {
  return `/* Typography */
    --cu-font-sans: ${shared.typography.fontFamily.sans};
    --cu-font-mono: ${shared.typography.fontFamily.mono};
    --cu-font-size-xs: ${shared.typography.fontSize.xs};
    --cu-font-size-sm: ${shared.typography.fontSize.sm};
    --cu-font-size-md: ${shared.typography.fontSize.md};
    --cu-font-size-lg: ${shared.typography.fontSize.lg};
    --cu-font-size-xl: ${shared.typography.fontSize.xl};
    --cu-font-size-2xl: ${shared.typography.fontSize['2xl']};
    --cu-font-weight-normal: ${shared.typography.fontWeight.normal};
    --cu-font-weight-medium: ${shared.typography.fontWeight.medium};
    --cu-font-weight-semibold: ${shared.typography.fontWeight.semibold};
    --cu-font-weight-bold: ${shared.typography.fontWeight.bold};
    --cu-line-height-tight: ${shared.typography.lineHeight.tight};
    --cu-line-height-normal: ${shared.typography.lineHeight.normal};
    --cu-line-height-relaxed: ${shared.typography.lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${shared.spacing['2xs']};
    --cu-space-xs: ${shared.spacing.xs};
    --cu-space-sm: ${shared.spacing.sm};
    --cu-space-md: ${shared.spacing.md};
    --cu-space-lg: ${shared.spacing.lg};
    --cu-space-xl: ${shared.spacing.xl};
    --cu-space-2xl: ${shared.spacing['2xl']};
    --cu-space-3xl: ${shared.spacing['3xl']};

    /* Border Radius */
    --cu-radius: ${shared.borderRadius.default};
    --cu-radius-none: ${shared.borderRadius.none};
    --cu-radius-sm: ${shared.borderRadius.sm};
    --cu-radius-md: ${shared.borderRadius.md};
    --cu-radius-lg: ${shared.borderRadius.lg};
    --cu-radius-full: ${shared.borderRadius.full};

    /* Borders */
    --cu-border-none: ${shared.borders.width.none};
    --cu-border-thin: ${shared.borders.width.thin};
    --cu-border-medium: ${shared.borders.width.medium};
    --cu-border-thick: ${shared.borders.width.thick};
    --cu-border-color: ${shared.borders.color.default};`
}

function generateTokensCSS(): string {
  const colors = extractColors(DEFAULTS)
  const shared = extractShared(DEFAULTS)
  return `:host {\n${colorsBlock(colors)}\n${sharedBlock(shared)}\n}`
}

const markdownRef = ref<InstanceType<typeof Markdown> | null>(null)

onMounted(() => {
  nextTick(() => {
    const el = markdownRef.value?.$el as HTMLElement
    if (!el) return

    const root = el.getRootNode() as ShadowRoot
    if (root && root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      const tokensStyle = document.createElement('style')
      tokensStyle.textContent = generateTokensCSS()
      root.appendChild(tokensStyle)
    }
  })
})
</script>

<template>
  <Markdown ref="markdownRef">
    <slot />
  </Markdown>
</template>

<style>
@unocss-placeholder;
</style>
