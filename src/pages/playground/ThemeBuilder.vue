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
import Modal from '@/components/overlay/Modal.vue'
import { colorsBlock } from '@/plugins/cu-tokens/css'
import { theme as activeTheme, setTheme } from '@/plugins/cu-tokens'

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
   el esquema --cu-code-* — nunca diverge */
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
              <Label :label="key" color="var(--cu-color-neutral)" />
              <ColorPicker :model-value="value" @update:model-value="colors[key] = $event" />
            </div>
          </div>
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
        <div class="tb-preview-row-group asymmetric">
          <div class="tb-preview-section">
            <h3>Buttons</h3>
            <div class="tb-preview-row">
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="neutral">Neutral</Button>
              <Button color="success">Success</Button>
              <Button color="warning">Warning</Button>
              <Button color="danger">Danger</Button>
            </div>
            <div class="tb-preview-row">
              <Button color="primary" variant="soft">Soft</Button>
              <Button color="primary" variant="ghost">Ghost</Button>
              <Button color="primary" variant="outlined">Outlined</Button>
              <Button color="primary" variant="subtle">Subtle</Button>
            </div>
            <div class="tb-preview-row">
              <Button color="primary" :loading="true">Loading</Button>
              <Button color="danger" variant="solid" :loading="true">Loading</Button>
            </div>
          </div>

          <div class="tb-preview-section">
            <h3>Badges</h3>
            <div class="tb-preview-row">
              <Badge color="primary">Primary</Badge>
              <Badge color="secondary">Secondary</Badge>
              <Badge color="neutral">Neutral</Badge>
              <Badge color="success">Success</Badge>
              <Badge color="warning">Warning</Badge>
              <Badge color="danger">Danger</Badge>
            </div>
            <div class="tb-preview-row">
              <Badge color="primary" variant="solid">Solid</Badge>
              <Badge color="primary" variant="soft">Soft</Badge>
              <Badge color="primary" variant="ghost">Ghost</Badge>
              <Badge color="primary" variant="outlined">Outlined</Badge>
              <Badge color="primary" variant="subtle">Subtle</Badge>
            </div>
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Dropdown Menu</h3>
          <div class="tb-preview-row">
            <DropdownMenu color="primary" label="Opciones" :items="dropdownItems" />
            <DropdownMenu color="neutral" variant="soft" label="Acciones" :items="dropdownItems" />
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Alerts</h3>
          <div class="tb-preview-row-group">
            <div class="tb-preview-col">
              <Alert title="Primary" color="primary">This is a primary alert.</Alert>
              <Alert title="Success" color="success">This is a success alert.</Alert>
              <Alert title="Warning" color="warning">This is a warning alert.</Alert>
              <Alert title="Danger" color="danger">This is a danger alert.</Alert>
            </div>
            <div class="tb-preview-col">
              <Alert title="Solid" color="primary" variant="solid">Solid variant.</Alert>
              <Alert title="Soft" color="primary" variant="soft">Soft variant.</Alert>
              <Alert title="Ghost" color="primary" variant="ghost">Ghost variant.</Alert>
              <Alert title="Outlined" color="primary" variant="outlined">Outlined variant.</Alert>
              <Alert title="Subtle" color="primary" variant="subtle">Subtle variant.</Alert>
            </div>
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Cards</h3>
          <div class="tb-preview-row">
            <Card title="Tarjeta" subtitle="Subtítulo descriptivo" variant="ghost">
              Contenido de la tarjeta para mostrar información agrupada.
            </Card>
            <Card title="Solid" variant="solid" color="primary">
              Variante solid con el color activo del tema.
            </Card>
            <Card title="Soft" variant="soft" color="primary">
              Variante soft con el color activo del tema.
            </Card>
            <Card title="Outlined" variant="outlined" color="primary">
              Variante outlined con el color activo del tema.
            </Card>
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Tabs</h3>
          <div class="tb-preview-col">
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

        <div class="tb-preview-section">
          <h3>Collapse</h3>
          <div class="tb-preview-row-group">
            <div class="tb-preview-col">
              <Collapse label="Más información" color="primary">
                <p>Contenido colapsable con el color primario del tema activo.</p>
              </Collapse>
              <Collapse label="Opciones avanzadas" :default-open="true">
                <p>Este collapse arranca abierto usando <code>default-open</code>.</p>
              </Collapse>
            </div>
            <div class="tb-preview-col">
              <Collapse label="Detalles" color="success">
                <p>Los colores del trigger siguen los tokens del tema editado.</p>
              </Collapse>
              <Collapse label="Ayuda" color="warning">
                <p>Probá cambiar colores en el panel y ver cómo se actualiza.</p>
              </Collapse>
            </div>
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Sliders</h3>
          <div class="tb-preview-row-group">
            <div class="tb-preview-col">
              <MonthSlider />
              <MonthSlider month-format="MMM yyyy" color="success" />
              <MonthSlider :year-navigation="false" color="warning" />
            </div>
            <div class="tb-preview-col">
              <YearSlider />
              <YearSlider variant="outlined" color="success" />
              <YearSlider :min="2020" :max="2030" color="warning" />
            </div>
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Calendar & Date Picker & Range</h3>
          <div class="tb-preview-row">
            <Calendar model-value="2026-08-11" style="width: 300px;" />
            <Calendar model-value="2026-08-11" variant="solid" year-navigation style="width: 330px;" />
            <Calendar model-value="2026-08-11" color="success" style="width: 300px;" />
            <DatePicker model-value="2026-08-11" style="max-width: 280px;" />
            <DatePicker model-value="2026-08-11" year-navigation style="max-width: 280px;" />
            <DatePickerRange start-date="2026-09-01" end-date="2026-09-10" style="max-width: 420px;" />
          </div>
        </div>

        <div class="tb-preview-row-group">
          <div class="tb-preview-section">
            <h3>Inputs</h3>
            <div class="tb-preview-col">
              <Label label="Nombre" for="tb-input-demo" />
              <Input id="tb-input-demo" placeholder="Con Label..." />
              <Label label="Email" for="tb-input-email" color="primary" />
              <Input id="tb-input-email" placeholder="Label primary..." color="primary" />
              <Input placeholder="Default..." />
              <Input placeholder="Primary..." color="primary" />
              <Input placeholder="Disabled..." :disabled="true" />
              <Input placeholder="Soft..." variant="soft" />
              <Input placeholder="Outlined..." variant="outlined" />
            </div>
          </div>

          <div class="tb-preview-col">
            <div class="tb-preview-section">
              <h3>Selects & Autocomplete</h3>
              <div class="tb-preview-row">
                <Select placeholder="Select...">
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                </Select>
                <Select placeholder="Choose..." color="primary">
                  <option value="a">Choice A</option>
                  <option value="b">Choice B</option>
                </Select>
              </div>
              <Autocomplete placeholder="Buscar..." />
              <Autocomplete placeholder="Buscar..." color="primary" />
            </div>

            <div class="tb-preview-section">
              <h3>File Inputs</h3>
              <div class="tb-preview-row">
                <FileInput placeholder="Select file..." />
                <FileInput placeholder="Images only..." accept="image/*" color="primary" />
              </div>
            </div>
          </div>
        </div>

        <div class="tb-preview-row-group three-cols">
          <div class="tb-preview-section">
            <h3>Switches</h3>
            <div class="tb-preview-row">
              <Switch />
              <Switch color="primary" :model-value="true" />
              <Switch color="success" :model-value="true" />
              <Switch color="danger" :model-value="true" />
              <Switch :disabled="true" />
            </div>
          </div>

          <div class="tb-preview-section">
            <h3>Checkboxes</h3>
            <div class="tb-preview-row">
              <Checkbox label="Default" />
              <Checkbox label="Primary" color="primary" :model-value="true" />
              <Checkbox label="Success" color="success" :model-value="true" />
              <Checkbox label="Danger" color="danger" />
            </div>
          </div>

          <div class="tb-preview-section">
            <h3>Textarea</h3>
            <Textarea placeholder="Write something..." />
          </div>
        </div>

        <div class="tb-preview-section">
          <h3>Table</h3>
          <Table :columns="tableColumns" :data="tableData" color="primary">
            <template #cell-status="{ value }">
              <Badge
                :color="value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'"
              >
                {{ value }}
              </Badge>
            </template>
          </Table>
        </div>

        <div class="tb-preview-section">
          <h3>Pagination</h3>
          <Pagination :total-pages="10" :current-page="3" :total-items="100" color="primary" />
        </div>

        <div class="tb-preview-section">
          <h3>Markdown</h3>
          <Markdown>
# Título del tema

Párrafo con **negrita**, *itálica* y `código inline`.

- Item uno
- Item dos

```js
const tema = 'builder';
```
          </Markdown>
        </div>

        <div class="tb-preview-row-group">
          <div class="tb-preview-section">
            <h3>File Dropzone</h3>
            <FileInputZone placeholder="Drag & drop files here, or click to browse" />
          </div>

          <div class="tb-preview-section">
            <h3>Modal</h3>
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
            <div class="tb-preview-row">
              <Button color="primary" @click="modalPreviewRef?.open()">Abrir Modal</Button>
            </div>
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
.tb-controls {
  --cu-color-primary: #1774A4;
  --cu-color-primary-soft: rgba(23, 116, 164, 0.15);
  --cu-color-neutral: #2c2c2c;
  --cu-color-neutral-text: #000000;
  --cu-color-neutral-hover: #000000;
  --cu-color-neutral-active: #343434;
  --cu-color-neutral-ghost-hover: rgba(44, 44, 44, 0.1);
  --cu-color-neutral-ghost-active: rgba(44, 44, 44, 0.2);
  --cu-color-neutral-soft: rgba(44, 44, 44, 0.15);
  --cu-color-neutral-soft-hover: rgba(44, 44, 44, 0.25);
  --cu-color-neutral-soft-active: rgba(44, 44, 44, 0.35);
  --cu-color-neutral-subtle: rgba(44, 44, 44, 0.1);
  --cu-color-neutral-subtle-hover: rgba(44, 44, 44, 0.2);
  --cu-color-neutral-subtle-active: rgba(44, 44, 44, 0.3);
  --cu-color-neutral-subtle-border: rgba(44, 44, 44, 0.5);
  --cu-color-surface: #ffffff;
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
  --cu-border-color: #d1d5db;
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

.tb-preview-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  background: var(--cu-color-surface);
}

.tb-preview-section h3 {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.tb-preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tb-preview-row :deep(.cu-card) {
  flex: 1 1 200px;
}

.tb-preview-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tb-preview-row-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.tb-preview-row-group.asymmetric {
  grid-template-columns: 2fr 1fr;
}

.tb-preview-row-group.three-cols {
  grid-template-columns: repeat(3, 1fr);
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
