<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PlaygroundLayout from '@/layouts/PlaygroundLayout.vue'
import Button from '@/components/buttons/Button.vue'
import Alert from '@/components/information/Alert.vue'
import Badge from '@/components/information/Badge.vue'
import Card from '@/components/information/Card.vue'
import Input from '@/components/form/Input.vue'
import Switch from '@/components/form/Switch.vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Select from '@/components/form/Select.vue'
import Textarea from '@/components/form/Textarea.vue'
import FileInput from '@/components/form/FileInput.vue'
import FileInputZone from '@/components/form/FileInputZone.vue'
import ColorPicker from '@/components/form/ColorPicker.vue'
import FloatingButton from '@/components/buttons/FloatingButton.vue'
import LucideSave from '@/components/icons/LucideSave.vue'
import ThemeManagerModal from '@/components/theme/ThemeManagerModal.vue'
import Table from '@/components/data/Table.vue'
import Pagination from '@/components/controls/Pagination.vue'
import Tabs from '@/components/Tabs.vue'
import Collapse from '@/components/overlay/Collapse.vue'
import MonthSlider from '@/components/controls/MonthSlider.vue'
import YearSlider from '@/components/controls/YearSlider.vue'
import Calendar from '@/components/controls/Calendar.vue'
import DatePicker from '@/components/form/DatePicker.vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'
import Label from '@/components/form/Label.vue'
import Autocomplete from '@/components/form/Autocomplete.vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Markdown from '@/components/markdown/Markdown.vue'
import CodeBlock from '@/components/markdown/CodeBlock.vue'
import Blockquote from '@/components/markdown/Blockquote.vue'
import CopyButton from '@/components/buttons/CopyButton.vue'
import AdvancedTable from '@/components/data/AdvancedTable.vue'
import Navbar from '@/components/lab/collapse/navigation/Navbar.vue'
import Outline from '@/components/lab/collapse/navigation/Outline.vue'
import type { NavItem } from '@/components/lab/collapse/navigation/Navbar.vue'
import type { OutlineItem } from '@/components/lab/collapse/navigation/Outline.vue'
import Modal from '@/components/overlay/Modal.vue'
import { colorsBlock } from '@/plugins/cu-tokens/css'
import { theme as activeTheme, setTheme, registerTheme } from '@/plugins/cu-tokens'

const STORAGE_KEY = 'cu-theme-builder'

interface ThemeConfig {
  themes: Record<string, Record<string, string>>
  typography: typeof typography.value
  spacing: typeof spacing.value
  borderRadius: typeof borderRadius.value
  shadows: typeof shadows.value
  borders: typeof borders.value
}

const tableData = [
  { name: 'Alice Johnson', status: 'Active', role: 'Admin' },
  { name: 'Bob Smith', status: 'Pending', role: 'User' },
  { name: 'Carol White', status: 'Inactive', role: 'Moderator' },
]

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Role' },
]

const themeName = ref('light')
const modalRef = ref<InstanceType<typeof ThemeManagerModal> | null>(null)
const modalPreviewRef = ref<InstanceType<typeof Modal> | null>(null)

const dropdownItems = [
  { label: 'Ver detalle', value: 'detail' },
  { label: 'Editar', value: 'edit' },
  { label: 'Eliminar', value: 'delete' },
]

const demoNavItems: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Button', path: '/playground/components/button' },
  { label: 'Table', path: '/playground/components/table' },
  { label: 'Markdown', path: '/playground/components/markdown' },
  {
    label: 'Ayuda',
    children: [{ label: 'Guía', path: '/playground/theme-builder' }],
  },
]

const demoOutlineItems: OutlineItem[] = [
  { label: 'Introducción', id: 'tb-outline-intro' },
  {
    label: 'Uso',
    id: 'tb-outline-uso',
    children: [
      { label: 'Props', id: 'tb-outline-props' },
      { label: 'Eventos', id: 'tb-outline-eventos' },
    ],
  },
]

const editorialSnippet = `const tokens = getThemeNames();
// cambiás un color y todo el ecosistema lo sigue
setTheme('nord');`

const colors = ref({
  primary: '#E73F1E',
  secondary: '#6366f1',
  neutral: '#1a1a1a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#eeeeee',
})

const typography = ref({
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
})

const spacing = ref({
  '2xs': '2px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
})

const borderRadius = ref({
  default: '8px',
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
})

const shadows = ref({
  color: '#000000',
})

const borders = ref({
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },
  color: {
    default: '#d1d5db',
    strong: '#6b7280',
    focus: '#1774A4',
  },
})

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* neutral es la tinta (títulos, labels, texto del layout): en temas oscuros
   debe ser claro. Si al editar el surface el neutral queda con la misma
   polaridad (texto oscuro sobre fondo oscuro o viceversa), se invierte solo.
   Editar el neutral a mano nunca lo pisa. */
function luma(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

watch(() => colors.value.surface, (surface) => {
  if (!surface || !colors.value.neutral) return
  const surfaceDark = luma(surface) < 0.5
  const neutralDark = luma(colors.value.neutral) < 0.5
  if (surfaceDark && neutralDark) {
    colors.value.neutral = '#e5e5e5'
  } else if (!surfaceDark && !neutralDark) {
    colors.value.neutral = '#1a1a1a'
  }
})

function buildSharedVariables(): string {
  const t = typography.value
  const s = spacing.value
  const r = borderRadius.value
  const sh = shadows.value
  const b = borders.value

  const shadowColor = hexToRgba(sh.color, 1)
  const shadowAlpha05 = hexToRgba(sh.color, 0.05)
  const shadowAlpha1 = hexToRgba(sh.color, 0.1)

  return `/* Typography */
    --cu-font-sans: ${t.fontFamily.sans};
    --cu-font-mono: ${t.fontFamily.mono};
    --cu-font-size-xs: ${t.fontSize.xs};
    --cu-font-size-sm: ${t.fontSize.sm};
    --cu-font-size-md: ${t.fontSize.md};
    --cu-font-size-lg: ${t.fontSize.lg};
    --cu-font-size-xl: ${t.fontSize.xl};
    --cu-font-size-2xl: ${t.fontSize['2xl']};
    --cu-font-weight-normal: ${t.fontWeight.normal};
    --cu-font-weight-medium: ${t.fontWeight.medium};
    --cu-font-weight-semibold: ${t.fontWeight.semibold};
    --cu-font-weight-bold: ${t.fontWeight.bold};
    --cu-line-height-tight: ${t.lineHeight.tight};
    --cu-line-height-normal: ${t.lineHeight.normal};
    --cu-line-height-relaxed: ${t.lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${s['2xs']};
    --cu-space-xs: ${s.xs};
    --cu-space-sm: ${s.sm};
    --cu-space-md: ${s.md};
    --cu-space-lg: ${s.lg};
    --cu-space-xl: ${s.xl};
    --cu-space-2xl: ${s['2xl']};
    --cu-space-3xl: ${s['3xl']};

    /* Border Radius */
    --cu-radius: ${r.default};
    --cu-radius-none: ${r.none};
    --cu-radius-sm: ${r.sm};
    --cu-radius-md: ${r.md};
    --cu-radius-lg: ${r.lg};
    --cu-radius-full: ${r.full};

    /* Shadows */
    --cu-shadow-color: ${shadowColor};
    --cu-shadow-sm: 0 1px 2px ${shadowAlpha05};
    --cu-shadow-md: 0 4px 6px ${shadowAlpha1};
    --cu-shadow-lg: 0 10px 15px ${shadowAlpha1};
    --cu-shadow-xl: 0 20px 25px ${shadowAlpha1};

    /* Borders */
    --cu-border-none: ${b.width.none};
    --cu-border-thin: ${b.width.thin};
    --cu-border-medium: ${b.width.medium};
    --cu-border-thick: ${b.width.thick};
    --cu-border-color: ${b.color.default};
    --cu-border-color-strong: ${b.color.strong};
    --cu-border-color-focus: ${b.color.focus};`
}

/* mismo generador que la lib (cu-tokens): incluye --cu-color-*-code y
   el esquema --cu-code-* — nunca diverge. resolveInk deriva la tinta
   (neutral) del surface cuando no contrasta — única fuente de verdad */
const cssColors = computed(() => colorsBlock(colors.value))
const cssShared = computed(() => buildSharedVariables())

// La page entera toma el tema editado: los colores van bajo el selector del
// tema activo (pisa al :root del plugin por especificidad) y los tokens
// compartidos en :root (el style tag inyectado va después del del plugin).
const cssPreview = computed(
  () => `html[data-theme="${themeName.value}"] {\n${cssColors.value}\n}\n\n:root {\n${cssShared.value}\n}`
)

const cssExport = computed(() => `:root {\n${cssColors.value}\n\n${cssShared.value}\n}`)

let styleEl: HTMLStyleElement | null = null

watch(cssPreview, (css) => {
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'theme-builder-preview'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
}, { immediate: true })

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getCurrentConfig()))
}

watch([colors, typography, spacing, borderRadius, shadows, borders], () => {
  saveToStorage()
}, { deep: true })

function getCurrentConfig(): ThemeConfig {
  return {
    themes: { [themeName.value]: { ...colors.value } },
    typography: JSON.parse(JSON.stringify(typography.value)),
    spacing: JSON.parse(JSON.stringify(spacing.value)),
    borderRadius: JSON.parse(JSON.stringify(borderRadius.value)),
    shadows: JSON.parse(JSON.stringify(shadows.value)),
    borders: JSON.parse(JSON.stringify(borders.value)),
  }
}

function applyConfig(config: ThemeConfig) {
  if (config.themes) {
    const themeNames = Object.keys(config.themes)
    if (themeNames.length > 0) {
      const firstTheme = themeNames[0] as string
      themeName.value = firstTheme
      const themeColors = config.themes[firstTheme]
      if (themeColors) {
        colors.value = { ...colors.value, ...themeColors }
      }
    }
  }
  if (config.typography) typography.value = config.typography
  if (config.spacing) spacing.value = config.spacing
  if (config.borderRadius) borderRadius.value = config.borderRadius
  if (config.shadows) shadows.value = config.shadows
  if (config.borders) borders.value = config.borders
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const config = JSON.parse(raw) as ThemeConfig
      applyConfig(config)
    } catch {}
  }
}

function handleImport(config: any) {
  applyConfig(config as ThemeConfig)
  saveToStorage()
  // El tema importado se registra como "custom": aparece en el theme chooser,
  // sus estilos quedan aplicados y no se restauran al salir del builder.
  const importedColors = Object.values((config as ThemeConfig)?.themes ?? {})[0]
  if (importedColors) {
    registerTheme('custom', importedColors)
    themeName.value = 'custom'
    previousTheme.value = ''
  }
}

function handleExport() {
  const config = getCurrentConfig()
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comegen-${themeName.value}-theme.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleCopyCSS() {
  navigator.clipboard.writeText(cssExport.value)
}

function handleDownloadCSS() {
  const blob = new Blob([cssExport.value], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comegen-${themeName.value}-theme.css`
  a.click()
  URL.revokeObjectURL(url)
}

function resetToDefaults() {
  colors.value = {
    primary: '#E73F1E',
    secondary: '#6366f1',
    neutral: '#1a1a1a',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    surface: '#eeeeee',
  }
  typography.value = {
    fontFamily: { sans: 'Inter, system-ui, sans-serif', mono: 'Fira Code, monospace' },
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem' },
    fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
  }
  spacing.value = { '2xs': '2px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px' }
  borderRadius.value = { default: '8px', none: '0', sm: '4px', md: '8px', lg: '12px', full: '9999px' }
  shadows.value = { color: '#000000' }
  borders.value = { width: { none: '0', thin: '1px', medium: '2px', thick: '4px' }, color: { default: '#d1d5db', strong: '#6b7280', focus: '#1774A4' } }
}

// El tema activo pasa a ser el que se está editando (preview global en vivo);
// al salir se restaura el que estaba ("el de ahorita" queda como default).
const previousTheme = ref('')

onMounted(() => {
  loadFromStorage()
  previousTheme.value = activeTheme.value
  setTheme(themeName.value)
  modalPreviewRef.value?.open()
})

watch(themeName, (name) => setTheme(name))

onBeforeUnmount(() => {
  if (styleEl) {
    styleEl.remove()
    styleEl = null
  }
  if (previousTheme.value) setTheme(previousTheme.value)
})
</script>

<template>
  <PlaygroundLayout title="Theme Builder">
    <div class="tb-layout">
      <aside class="tb-controls">
        <section class="tb-section">
          <h2>Colors</h2>
          <div class="tb-colors-list">
            <div v-for="(value, key) in colors" :key="key" class="tb-color-row">
              <Label :label="key === 'neutral' ? 'neutral (texto/títulos)' : key" color="var(--cu-color-neutral)" />
              <ColorPicker :model-value="value" @update:model-value="colors[key] = $event" />
            </div>
          </div>
          <p class="tb-hint">
            <strong>neutral</strong> es la tinta: títulos, labels y texto del layout. En temas oscuros debe ser un color claro (se invierte solo al oscurecer el surface).
          </p>
        </section>

        <hr class="tb-separator" />

        <section class="tb-section">
          <h2>Typography</h2>
          <div class="tb-group">
            <h3>Font Family</h3>
            <div class="tb-field">
              <Label label="Sans" color="var(--cu-color-neutral)" />
              <Input v-model="typography.fontFamily.sans" />
            </div>
            <div class="tb-field">
              <Label label="Mono" color="var(--cu-color-neutral)" />
              <Input v-model="typography.fontFamily.mono" />
            </div>
          </div>
          <div class="tb-group">
            <h3>Font Size</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.fontSize" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.fontSize[key]" />
              </div>
            </div>
          </div>
          <div class="tb-group">
            <h3>Font Weight</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.fontWeight" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.fontWeight[key]" />
              </div>
            </div>
          </div>
          <div class="tb-group">
            <h3>Line Height</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.lineHeight" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.lineHeight[key]" />
              </div>
            </div>
          </div>
        </section>

        <hr class="tb-separator" />

        <section class="tb-section">
          <h2>Spacing</h2>
          <div class="tb-grid">
            <div v-for="(value, key) in spacing" :key="key" class="tb-field">
              <Label :label="key" color="var(--cu-color-neutral)" />
              <Input v-model="spacing[key]" />
            </div>
          </div>
        </section>

        <hr class="tb-separator" />

        <section class="tb-section">
          <h2>Border Radius</h2>
          <div class="tb-grid">
            <div v-for="(value, key) in borderRadius" :key="key" class="tb-field">
              <Label :label="key" color="var(--cu-color-neutral)" />
              <Input v-model="borderRadius[key]" />
            </div>
          </div>
        </section>

        <hr class="tb-separator" />

        <section class="tb-section">
          <h2>Shadow Color</h2>
          <div class="tb-colors-list">
            <div class="tb-color-row">
              <Label label="color" color="var(--cu-color-neutral)" />
              <ColorPicker v-model="shadows.color" />
            </div>
          </div>
        </section>

        <hr class="tb-separator" />

        <section class="tb-section">
          <h2>Borders</h2>
          <div class="tb-group">
            <h3>Width</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in borders.width" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="borders.width[key]" />
              </div>
            </div>
          </div>
          <div class="tb-group">
            <h3>Color</h3>
            <div class="tb-colors-list">
              <div v-for="(value, key) in borders.color" :key="key" class="tb-color-row">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <ColorPicker :model-value="value" @update:model-value="borders.color[key] = $event" />
              </div>
            </div>
          </div>
        </section>
      </aside>

      <main class="tb-preview">
        <div class="tb-gallery">
          <Card variant="ghost" title="Acciones" class="tb-card">
            <div class="tb-cluster">
              <p class="tb-cluster-label">Colores — solid</p>
              <div class="tb-row">
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button color="neutral">Neutral</Button>
                <Button color="success">Success</Button>
                <Button color="warning">Warning</Button>
                <Button color="danger">Danger</Button>
              </div>
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">Variantes</p>
              <div class="tb-row">
                <Button color="primary" variant="soft">Soft</Button>
                <Button color="primary" variant="ghost">Ghost</Button>
                <Button color="primary" variant="outlined">Outlined</Button>
                <Button color="primary" variant="subtle">Subtle</Button>
                <Button color="primary" variant="link">Link</Button>
              </div>
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">Estados y con función</p>
              <div class="tb-row">
                <Button :loading="true">Loading</Button>
                <Button color="danger" :loading="true">Loading</Button>
                <Button :disabled="true">Disabled</Button>
                <CopyButton text="comegen-ui" label="Copiar" />
                <ToggleColorSheme />
                <FloatingButton style="position: static" color="primary">
                  <LucideSave :width="18" :height="18" />
                </FloatingButton>
              </div>
            </div>
          </Card>

          <div class="tb-pair">
            <Card variant="ghost" title="Campos" class="tb-card">
            <div class="tb-sim">
              <Label label="Nombre" />
              <Input placeholder="Tu nombre" />
              <div class="tb-two">
                <div class="tb-cluster">
                  <Label label="Email" color="primary" />
                  <Input placeholder="tu@email.com" color="primary" />
                </div>
                <div class="tb-cluster">
                  <Label label="Rol" />
                  <Select placeholder="Elegí…">
                    <option value="dev">Dev</option>
                    <option value="designer">Designer</option>
                  </Select>
                </div>
              </div>
              <Label label="Bio" />
              <Textarea placeholder="Contanos qué estás construyendo…" />
              <Label label="Avatar" />
              <FileInput placeholder="Adjuntá una imagen" accept="image/*" />
              <Label label="Color" />
              <ColorPicker model-value="#E73F1E" />
              <Autocomplete placeholder="¿Dónde estás?" />
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">Zona de carga</p>
              <FileInputZone placeholder="Arrastrá archivos acá, o hacé clic para elegir" />
            </div>
          </Card>

          <Card variant="ghost" title="Opciones" class="tb-card">
            <div class="tb-cluster">
              <p class="tb-cluster-label">Switches</p>
              <div class="tb-row">
                <Switch />
                <Switch color="primary" :model-value="true" />
                <Switch color="success" :model-value="true" />
                <Switch color="danger" :model-value="true" />
                <Switch :disabled="true" />
              </div>
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">Checkboxes</p>
              <div class="tb-col">
                <Checkbox label="Notificaciones" color="primary" :model-value="true" />
                <Checkbox label="Newsletter" color="success" :model-value="true" />
                <Checkbox label="Modo oscuro" />
                <Checkbox label="Borrado definitivo" color="danger" :disabled="true" />
              </div>
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">En contexto — preferencias</p>
              <div class="tb-sim">
                <div class="tb-option-row">
                  <span class="tb-option-label">Notificaciones push</span>
                  <Switch color="primary" :model-value="true" />
                </div>
                <div class="tb-option-row">
                  <span class="tb-option-label">Resumen semanal</span>
                  <Switch />
                </div>
                <div class="tb-option-row">
                  <span class="tb-option-label">Mantener la sesión abierta</span>
                  <Checkbox color="primary" :model-value="true" />
                </div>
                <div class="tb-option-row">
                  <span class="tb-option-label">Compartir métricas</span>
                  <Checkbox color="success" :model-value="true" />
                </div>
                <div class="tb-option-row">
                  <span class="tb-option-label">Cuenta de prueba</span>
                  <Checkbox :disabled="true" />
                </div>
              </div>
            </div>
          </Card>
          </div>

          <Card variant="ghost" title="Fechas" class="tb-card">
            <div class="tb-agenda">
              <Calendar model-value="2026-09-11" style="width: 300px" />
              <div class="tb-agenda-side">
                <DatePicker model-value="2026-09-11" />
                <DatePickerRange start-date="2026-09-01" end-date="2026-09-10" />
              </div>
            </div>
            <div class="tb-row">
              <MonthSlider />
              <MonthSlider month-format="MMM yyyy" color="success" />
              <YearSlider />
              <YearSlider variant="outlined" color="success" />
            </div>
          </Card>

          <Card variant="ghost" title="Feedback" class="tb-card">
            <div class="tb-two">
              <div class="tb-col">
                <Alert title="Primary" color="primary">Mensaje informativo con el color del tema.</Alert>
                <Alert title="Success" color="success">Todo salió como esperabas.</Alert>
                <Alert title="Warning" color="warning">Algo necesita tu atención.</Alert>
                <Alert title="Danger" color="danger">Esta acción no se puede deshacer.</Alert>
              </div>
              <div class="tb-col">
                <div class="tb-cluster">
                  <p class="tb-cluster-label">Colores</p>
                  <div class="tb-row">
                    <Badge color="primary">Primary</Badge>
                    <Badge color="secondary">Secondary</Badge>
                    <Badge color="neutral">Neutral</Badge>
                    <Badge color="success">Success</Badge>
                    <Badge color="warning">Warning</Badge>
                    <Badge color="danger">Danger</Badge>
                  </div>
                </div>
                <div class="tb-cluster">
                  <p class="tb-cluster-label">Variantes</p>
                  <div class="tb-row">
                    <Badge color="primary" variant="solid">Solid</Badge>
                    <Badge color="primary" variant="soft">Soft</Badge>
                    <Badge color="primary" variant="ghost">Ghost</Badge>
                    <Badge color="primary" variant="outlined">Outlined</Badge>
                    <Badge color="primary" variant="subtle">Subtle</Badge>
                  </div>
                </div>
                <div class="tb-cluster">
                  <p class="tb-cluster-label">En contexto</p>
                  <div class="tb-notis">
                    <div class="tb-noti">
                      <Badge color="success" variant="soft">OK</Badge>
                      <span>Tema publicado</span>
                    </div>
                    <div class="tb-noti">
                      <Badge color="danger" variant="soft">Error</Badge>
                      <span>No se pudo guardar el tema</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="ghost" title="Datos" class="tb-card">
            <div class="tb-sim">
              <div class="tb-toolbar">
                <Input placeholder="Buscar…" style="max-width: 240px" />
                <Button color="primary">Nuevo</Button>
              </div>
              <Table :columns="tableColumns" :data="tableData" color="primary">
                <template #cell-status="{ value }">
                  <Badge
                    :color="value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'"
                  >
                    {{ value }}
                  </Badge>
                </template>
              </Table>
              <Pagination :total-pages="10" :current-page="3" :total-items="100" color="primary" />
            </div>
            <div class="tb-cluster">
              <p class="tb-cluster-label">Tabla avanzada — búsqueda, orden y paginación incluidos</p>
              <AdvancedTable :columns="tableColumns" :data="tableData" :items-per-page="5" color="primary" />
            </div>
          </Card>

          <Card variant="ghost" title="Superficies" class="tb-card">
            <div class="tb-two">
              <div class="tb-cards-grid">
                <Card title="Ghost" variant="ghost">Contenido apoyado sobre el fondo.</Card>
                <Card title="Soft" variant="soft" color="primary">Tinte suave del color activo.</Card>
                <Card title="Subtle" variant="subtle" color="secondary">Fondo tenue con borde propio.</Card>
                <Card title="Solid" variant="solid" color="primary">Bloque de color pleno.</Card>
              </div>
              <div class="tb-cluster">
                <p class="tb-cluster-label">Horizontal y con footer</p>
                <Card title="Horizontal" variant="ghost" layout="horizontal">
                  <template #media>
                    <div style="background: linear-gradient(135deg, var(--cu-color-primary), var(--cu-color-secondary)); height: 100%; min-height: 90px;"></div>
                  </template>
                  Media al costado, contenido a la derecha.
                </Card>
                <Card title="Con footer" variant="subtle" color="success">
                  El footer queda anclado abajo con su separador.
                  <template #footer>
                    <Button color="success" variant="soft">Aceptar</Button>
                    <Button color="neutral" variant="ghost">Cancelar</Button>
                  </template>
                </Card>
              </div>
            </div>
          </Card>

          <Card variant="ghost" title="Navegación" class="tb-card">
            <div class="tb-site">
              <div class="tb-site-cols">
                <nav class="tb-site-nav">
                  <Navbar :items="demoNavItems" />
                </nav>
                <div class="tb-site-body">
                  <div class="tb-sim-lines">
                    <span class="tb-sim-line tb-sim-line--w80"></span>
                    <span class="tb-sim-line"></span>
                    <span class="tb-sim-line tb-sim-line--w60"></span>
                  </div>
                  <Tabs variant="tabs" :tabs="[
                    { key: 'general', label: 'General' },
                    { key: 'advanced', label: 'Advanced' },
                    { key: 'locked', label: 'Locked', disabled: true },
                  ]">
                    <template #general>Contenido General</template>
                    <template #advanced>Contenido Advanced</template>
                    <template #locked>Contenido Locked</template>
                  </Tabs>
                </div>
              </div>
            </div>
            <div class="tb-nav-grid">
              <div class="tb-cluster">
                <p class="tb-cluster-label">Outline — cápsula propia</p>
                <div class="tb-sim">
                  <Outline :items="demoOutlineItems" />
                </div>
              </div>
              <div class="tb-cluster">
                <p class="tb-cluster-label">Menú desplegable</p>
                <div class="tb-sim">
                  <div class="tb-sim-lines">
                    <span class="tb-sim-line tb-sim-line--w60"></span>
                  </div>
                  <div class="tb-row">
                    <DropdownMenu color="primary" label="Opciones" :items="dropdownItems" />
                    <DropdownMenu color="neutral" variant="soft" label="Acciones" :items="dropdownItems" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="ghost" title="Editorial" class="tb-card">
            <div class="tb-two">
              <Blockquote color="primary">
                Los tokens son la fuente única de verdad: cambiás un color y todo el ecosistema lo sigue.
              </Blockquote>
              <Markdown>
                # Título del tema

                Párrafo con **negrita**, *itálica* y `código inline`.

                - Item uno
                - Item dos
              </Markdown>
            </div>
            <CodeBlock :code="editorialSnippet" language="javascript" />
          </Card>

          <Card variant="ghost" title="Overlays" class="tb-card">
            <div class="tb-overlays">
              <div class="tb-cluster">
                <p class="tb-cluster-label">Modal — renderizado en contexto</p>
                <div class="tb-sim">
                  <div class="tb-sim-lines">
                    <span class="tb-sim-line tb-sim-line--w80"></span>
                    <span class="tb-sim-line"></span>
                  </div>
                  <div class="cu-modal" data-size="sm" data-height="auto">
                    <header class="cu-modal-header">
                      <div class="cu-modal-header-text">
                        <div class="cu-modal-title-row">
                          <h2 class="cu-modal-title">Confirm Action</h2>
                        </div>
                        <p class="cu-modal-description">This action cannot be undone.</p>
                      </div>
                      <Button color="neutral" variant="ghost" class="cu-modal-close" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </Button>
                    </header>
                    <main class="cu-modal-body">
                      <p>Are you sure you want to delete this item?</p>
                    </main>
                    <footer class="cu-modal-footer">
                      <div class="cu-modal-footer-default">
                        <Button color="neutral" variant="ghost">Cancel</Button>
                        <Button color="danger">Delete</Button>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
              <div class="tb-cluster">
                <p class="tb-cluster-label">Modal real + expandibles</p>
                <div class="tb-sim">
                  <div class="tb-sim-lines">
                    <span class="tb-sim-line tb-sim-line--w80"></span>
                    <span class="tb-sim-line tb-sim-line--w60"></span>
                  </div>
                  <Collapse label="Más información" color="primary" :default-open="true">
                    <p>El contenido aparece sobre la página, con el tema editado.</p>
                  </Collapse>
                  <Collapse label="Detalles" color="success">
                    <p>Cada color sigue los tokens del tema activo.</p>
                  </Collapse>
                  <Modal
                    ref="modalPreviewRef"
                    size="sm"
                    title="Confirmar acción"
                    description="El modal usa los tokens del tema activo."
                  >
                    <p>Contenido del modal con el tema del ThemeBuilder.</p>
                  </Modal>
                </div>
              </div>
            </div>
            <div class="tb-row">
              <Button color="primary" @click="modalPreviewRef?.open()">Abrir modal real</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>

    <ThemeManagerModal
      ref="modalRef"
      v-model:theme-name="themeName"
      :css-output="cssExport"
      @import="handleImport"
      @export="handleExport"
      @reset="resetToDefaults"
      @copy-css="handleCopyCSS"
      @download-css="handleDownloadCSS"
    />

    <FloatingButton color="primary" @click="modalRef?.open()">
      <LucideSave :width="20" :height="20" />
    </FloatingButton>
  </PlaygroundLayout>
</template>

<style scoped>
/* Colores del form: heredan el tema activo (resolveInk en colorsBlock es la
   única fuente de verdad). Acá solo lo estructural — la tipografía y los
   espacios quedan fijos para que el form no se mueva. */
.tb-controls {
  --cu-font-sans: Inter, system-ui, sans-serif;
  --cu-font-mono: Fira Code, monospace;
  --cu-font-size-xs: 0.75rem;
  --cu-font-size-sm: 0.875rem;
  --cu-font-weight-medium: 500;
  --cu-font-weight-semibold: 600;
  --cu-space-xs: 4px;
  --cu-space-sm: 8px;
  --cu-radius: 8px;
  --cu-border-thin: 1px;
}
.tb-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.tb-controls {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tb-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

.tb-gallery {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tb-pair {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.tb-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tb-cluster-label {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  opacity: 0.6;
  margin: 0;
}

.tb-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.tb-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tb-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Simulaciones: mini-páginas con contenido de contexto (como la vitrina de la home).
   El transform crea containing block → los position:fixed (Modal, FAB) quedan adentro. */
.tb-sim {
  position: relative;
  transform: translateZ(0);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  background-color: var(--cu-color-surface);
  overflow: hidden;
}

.tb-sim-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tb-sim-line {
  height: 6px;
  border-radius: 3px;
  background-color: var(--cu-color-neutral);
  opacity: 0.12;
}

.tb-sim-line--w60 {
  width: 60%;
}

.tb-sim-line--w80 {
  width: 80%;
}

.tb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tb-agenda {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.tb-agenda-side {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.tb-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.tb-notis {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tb-noti {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  font-size: var(--cu-font-size-sm);
}

.tb-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.tb-option-label {
  font-size: var(--cu-font-size-sm);
}

.tb-site {
  transform: translateZ(0);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  overflow: hidden;
  background-color: var(--cu-color-surface);
}

.tb-site-cols {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 250px;
}

.tb-site-nav {
  padding: 0.5rem;
  border-right: var(--cu-border-thin) solid var(--cu-border-color);
  overflow-y: auto;
}

.tb-site-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.tb-nav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tb-overlays {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tb-section h2 {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0 0 0.75rem 0;
  color: var(--cu-color-neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tb-section h3 {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  margin: 0 0 0.5rem 0;
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.tb-group {
  margin-bottom: 0.75rem;
}

.tb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.tb-colors-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.tb-color-row {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tb-hint {
  margin: 0.5rem 0 0;
  font-size: var(--cu-font-size-xs);
  line-height: var(--cu-line-height-normal);
  color: var(--cu-color-neutral);
  opacity: 0.75;
}

.tb-field {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.tb-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0.5rem 0;
}
</style>
