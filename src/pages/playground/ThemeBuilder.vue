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
import ToggleColorSheme from '@/components/buttons/ToggleColorSheme.vue'
import LucideSave from '@/components/icons/LucideSave.vue'
import LucidePencil from '@/components/icons/LucidePencil.vue'
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
import {
  theme as activeTheme, setTheme, registerTheme, allThemes, builtInNames, opacities,
  setShared, getShared, getThemeCSS, applyFullConfig,
} from '@/plugins/cu-tokens'
import { DEFAULTS, DEFAULT_COLORS, DEFAULT_OPACITIES } from '@/plugins/cu-tokens/defaults'
import { hexToRgba } from '@/lib/colors'

function resolveOpacity(name: string): number {
  return opacities.value[name]?.shadow ?? opacities.value.default?.shadow ?? 10
}

const STORAGE_KEY = 'cu-theme-builder'

interface ThemeConfig {
  themes: Record<string, Record<string, string>>
  opacities: Record<string, { shadow: number }>
  typography: typeof typography.value
  spacing: typeof spacing.value
  borderRadius: typeof borderRadius.value
  borders: { width: typeof borders.value.width }
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
const isEditing = ref(false)
const modalRef = ref<InstanceType<typeof ThemeManagerModal> | null>(null)
const modalPreviewRef = ref<InstanceType<typeof Modal> | null>(null)
const isSaving = ref(false)
const showSaveSuccess = ref(false)

function handleSaveProfile() {
  if (showSaveSuccess.value) return
  isSaving.value = true
  showSaveSuccess.value = false
  setTimeout(() => {
    isSaving.value = false
    showSaveSuccess.value = true
    setTimeout(() => {
      showSaveSuccess.value = false
    }, 3000)
  }, 2000)
}

const isBuiltIn = computed(() => builtInNames.value.includes(themeName.value))

function enableEditing() {
  isEditing.value = true
  registerTheme('custom', { ...colors.value }, {
    opacity: parseInt(shadowOpacityRaw.value) || 10,
    shared: sharedSnapshot(),
  })
  themeName.value = 'custom'
  setTheme('custom')
}

function sharedSnapshot() {
  return {
    typography: JSON.parse(JSON.stringify(typography.value)),
    spacing: JSON.parse(JSON.stringify(spacing.value)),
    borderRadius: JSON.parse(JSON.stringify(borderRadius.value)),
    borders: { width: JSON.parse(JSON.stringify(borders.value.width)) },
  }
}

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

// Inicializa los colores desde el tema activo del plugin (o defaults si no cargó).
function initColorsFromTheme(name: string) {
  const themeColors = allThemes.value[name]?.colors
  if (themeColors) {
    const { shadowOpacity, ...rest } = themeColors
    colors.value = { ...colors.value, ...rest }
  }
}

const colors = ref({ ...DEFAULT_COLORS })

initColorsFromTheme('light')

const shadowOpacityRaw = ref(String(opacities.value.default?.shadow ?? 10))

const typography = ref({ ...getShared()?.typography })

const spacing = ref({ ...getShared()?.spacing })

const borderRadius = ref({ ...getShared()?.borderRadius })

const borders = ref({
  width: { ...getShared()?.borders?.width },
  color: { ...getShared()?.borders?.color },
})

const shadowPreview = computed(() => hexToRgba(colors.value.shadow || '#000000', parseInt(shadowOpacityRaw.value) || 10))

// CSS de export: lo genera el plugin (colores + shared) — ya no hay duplicación.
const cssExport = computed(() => getThemeCSS(themeName.value))

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getCurrentConfig()))
}

watch([colors, shadowOpacityRaw, typography, spacing, borderRadius, borders], () => {
  saveToStorage()
}, { deep: true })

function getCurrentConfig(): ThemeConfig {
  return {
    themes: { [themeName.value]: { ...colors.value } },
    opacities: { [themeName.value]: { shadow: parseInt(shadowOpacityRaw.value) || 10 } },
    typography: JSON.parse(JSON.stringify(typography.value)),
    spacing: JSON.parse(JSON.stringify(spacing.value)),
    borderRadius: JSON.parse(JSON.stringify(borderRadius.value)),
    borders: { width: JSON.parse(JSON.stringify(borders.value.width)) },
  }
}

function applyConfig(config: ThemeConfig) {
  if (!config.themes) return

  const themeNames = Object.keys(config.themes)
  if (themeNames.length > 0) {
    themeName.value = themeNames[0]
    const themeColors = config.themes[themeName.value]
    if (themeColors) {
      const { shadowOpacity, ...rest } = themeColors
      colors.value = { ...colors.value, ...rest }
    }
  }

  if (config.opacities) {
    const themeOp = config.opacities[themeName.value]?.shadow ?? config.opacities.default?.shadow
    if (themeOp !== undefined) shadowOpacityRaw.value = String(themeOp)
  }

  if (config.borders?.color) {
    if (!colors.value.default) colors.value.default = config.borders.color.default
    if (!colors.value.strong) colors.value.strong = config.borders.color.strong
    if (!colors.value.focus) colors.value.focus = config.borders.color.focus
  }

  // Aplica todo de una vez: temas, opacidades y shared tokens.
  // El plugin regenera CSS una sola vez.
  applyFullConfig({
    themes: config.themes,
    opacities: config.opacities,
    shared: sharedSnapshot(),
  })

  if (config.shadows?.color && !colors.value.shadow) {
    colors.value.shadow = config.shadows.color
  }
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const config = JSON.parse(raw) as ThemeConfig
      applyConfig(config)
      // Si el tema guardado es custom, entrar en modo edición
      if (Object.keys(config.themes)[0] === 'custom') {
        isEditing.value = true
      }
    } catch {}
  }
}

function handleImport(config: any) {
  const cfg = config as ThemeConfig
  applyConfig(cfg)
  saveToStorage()

  // El import se aplica como "custom" para que sea editable y persistente.
  const importedColors = Object.values(cfg?.themes ?? {})[0]
  if (importedColors) {
    applyFullConfig({
      themes: { custom: importedColors },
      opacities: cfg?.opacities?.custom ? { custom: cfg.opacities.custom } : undefined,
      shared: sharedSnapshot(),
    })
    themeName.value = 'custom'
    isEditing.value = true
    previousTheme.value = ''
    setTheme('custom')
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
    focus: '#1774A4',
    strong: '#6b7280',
    default: '#d1d5db',
    shadow: '#000000',
  }
  shadowOpacityRaw.value = '10'
  typography.value = {
    fontFamily: { sans: 'Inter, system-ui, sans-serif', mono: 'Fira Code, monospace' },
    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.75rem', '4xl': '2rem' },
    fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' },
  }
  spacing.value = { '2xs': '2px', xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px', '4xl': '64px', '5xl': '80px' }
  borderRadius.value = { default: '8px', none: '0', sm: '4px', md: '8px', lg: '12px', full: '9999px' }
  borders.value = { width: { none: '0', thin: '1px', medium: '2px', thick: '4px' } }
}

// Sincroniza los shared tokens (typography, spacing, etc.) desde el plugin.
function syncSharedFromPlugin() {
  const s = getShared()
  if (!s) return
  if (s.typography) typography.value = { ...typography.value, ...s.typography }
  if (s.spacing) spacing.value = { ...spacing.value, ...s.spacing }
  if (s.borderRadius) borderRadius.value = { ...borderRadius.value, ...s.borderRadius }
  if (s.borders) borders.value = { ...borders.value, ...s.borders }
}

// El tema activo pasa a ser el que se está editando (preview global en vivo);
// al salir se restaura el que estaba ("el de ahorita" queda como default).
const previousTheme = ref('')

onMounted(() => {
  loadFromStorage()
  syncSharedFromPlugin()
  initColorsFromTheme(themeName.value)
  previousTheme.value = activeTheme.value
  setTheme(themeName.value)
  shadowOpacityRaw.value = String(resolveOpacity(themeName.value))
})

// Cargar los tokens de un tema en el editor
function loadThemeIntoTokens(name: string) {
  const themeTokens = allThemes.value[name]
  if (themeTokens?.colors) {
    const { shadowOpacity, ...rest } = themeTokens.colors
    colors.value = { ...colors.value, ...rest }
    shadowOpacityRaw.value = String(resolveOpacity(name))
  }
}

watch(themeName, (name) => {
  if (name !== activeTheme.value) {
    setTheme(name)
  }
  if (builtInNames.value.includes(name)) {
    loadThemeIntoTokens(name)
  }
})

// Sync editor when theme changes externally (e.g. ThemeChooser/Dropdown)
watch(activeTheme, (name) => {
  if (name !== themeName.value) {
    themeName.value = name
    isEditing.value = false
    loadThemeIntoTokens(name)
  }
})

// Detectar cambios → solo cuando está editando (isEditing)
watch([colors, shadowOpacityRaw, typography, spacing, borderRadius, borders], () => {
  if (!isEditing.value) return
  registerTheme('custom', { ...colors.value }, {
    opacity: parseInt(shadowOpacityRaw.value) || 10,
    shared: sharedSnapshot(),
  })
  if (themeName.value !== 'custom') {
    themeName.value = 'custom'
    setTheme('custom')
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (previousTheme.value) setTheme(previousTheme.value)
})
</script>

<template>
  <PlaygroundLayout title="Theme Builder">
    <div class="tb-layout">
      <aside class="tb-controls">
        <div class="tb-controls-header">
          <span class="tb-controls-theme-name">{{ themeName }}</span>
          <button
            v-if="!isEditing"
            class="tb-edit-btn"
            title="Editar tema"
            @click="enableEditing"
          >
            <LucidePencil :width="16" :height="16" />
          </button>
        </div>

        <Collapse label="Colors" :default-open="true">
          <div class="tb-colors-list">
            <div v-for="(value, key) in colors" :key="key" class="tb-color-row">
              <Label :label="key === 'neutral' ? 'neutral (texto/títulos)' : key" color="var(--cu-color-neutral)" />
              <ColorPicker :model-value="value" :disabled="!isEditing" @update:model-value="colors[key] = $event" />
            </div>
          </div>
          <p class="tb-hint">
            <strong>neutral</strong> es la tinta: títulos, labels y texto del layout. En temas oscuros debe ser un color claro (se invierte solo al oscurecer el surface).
          </p>
        </Collapse>

        <Collapse label="Typography" :default-open="false">
          <div class="tb-group">
            <h3>Font Family</h3>
            <div class="tb-field">
              <Label label="Sans" color="var(--cu-color-neutral)" />
              <Input v-model="typography.fontFamily.sans" :disabled="!isEditing" />
            </div>
            <div class="tb-field">
              <Label label="Mono" color="var(--cu-color-neutral)" />
              <Input v-model="typography.fontFamily.mono" :disabled="!isEditing" />
            </div>
          </div>
          <div class="tb-group">
            <h3>Font Size</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.fontSize" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.fontSize[key]" :disabled="!isEditing" />
              </div>
            </div>
          </div>
          <div class="tb-group">
            <h3>Font Weight</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.fontWeight" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.fontWeight[key]" :disabled="!isEditing" />
              </div>
            </div>
          </div>
          <div class="tb-group">
            <h3>Line Height</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in typography.lineHeight" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="typography.lineHeight[key]" :disabled="!isEditing" />
              </div>
            </div>
          </div>
        </Collapse>

        <Collapse label="Spacing" :default-open="false">
          <div class="tb-grid">
            <div v-for="(value, key) in spacing" :key="key" class="tb-field">
              <Label :label="key" color="var(--cu-color-neutral)" />
              <Input v-model="spacing[key]" :disabled="!isEditing" />
            </div>
          </div>
        </Collapse>

        <Collapse label="Border Radius" :default-open="false">
          <div class="tb-grid">
            <div v-for="(value, key) in borderRadius" :key="key" class="tb-field">
              <Label :label="key" color="var(--cu-color-neutral)" />
              <Input v-model="borderRadius[key]" :disabled="!isEditing" />
            </div>
          </div>
        </Collapse>

        <Collapse label="Borders" :default-open="false">
          <div class="tb-group">
            <h3>Width</h3>
            <div class="tb-grid">
              <div v-for="(value, key) in borders.width" :key="key" class="tb-field">
                <Label :label="key" color="var(--cu-color-neutral)" />
                <Input v-model="borders.width[key]" :disabled="!isEditing" />
              </div>
            </div>
          </div>
        </Collapse>

        <Collapse label="Opacities" :default-open="false">
          <div class="tb-colors-list">
            <div class="tb-field">
              <Label label="shadow" color="var(--cu-color-neutral)" />
              <Input v-model="shadowOpacityRaw" :disabled="!isEditing" />
            </div>
          </div>
          <p class="tb-hint">
            <code>shadow</code>: {{ colors.shadow }} con opacidad {{ shadowOpacityRaw }}% → <code>{{ shadowPreview }}</code>
          </p>
        </Collapse>
      </aside>

      <main class="tb-preview">
        <div class="tb-gallery">

          <!-- DASHBOARD -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Dashboard</h3>
              <p class="tb-scene-desc">Vista general con métricas, datos y acciones rápidas</p>
            </div>
            <div class="tb-dashboard">
              <div class="tb-dash-sidebar">
                <Navbar :items="demoNavItems" :search="true" search-placeholder="Buscar sección..." />
                <div class="tb-dash-sidebar-footer">
                  <Outline :items="demoOutlineItems" />
                </div>
              </div>
              <div class="tb-dash-main">
                <div class="tb-dash-toolbar">
                  <Input placeholder="Buscar…" style="max-width: 240px" />
                  <div class="tb-dash-toolbar-actions">
                    <Button color="primary">Nuevo</Button>
                    <DropdownMenu color="neutral" variant="soft" label="Exportar" :items="dropdownItems" />
                  </div>
                </div>
                <div class="tb-dash-stats">
                  <Card variant="soft" color="primary" class="tb-stat">
                    <div class="tb-stat-value">1,284</div>
                    <div class="tb-stat-label">Usuarios activos</div>
                  </Card>
                  <Card variant="soft" color="success" class="tb-stat">
                    <div class="tb-stat-value">98.2%</div>
                    <div class="tb-stat-label">Uptime</div>
                  </Card>
                  <Card variant="soft" color="warning" class="tb-stat">
                    <div class="tb-stat-value">42</div>
                    <div class="tb-stat-label">Alertas</div>
                  </Card>
                  <Card variant="subtle" color="secondary" class="tb-stat">
                    <div class="tb-stat-value">$12.4k</div>
                    <div class="tb-stat-label">Ingresos</div>
                  </Card>
                </div>
                <Card variant="ghost" class="tb-dash-table">
                  <Table :columns="tableColumns" :data="tableData" color="primary">
                    <template #cell-status="{ value }">
                      <Badge
                        :color="value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'"
                      >
                        {{ value }}
                      </Badge>
                    </template>
                  </Table>
                  <template #footer>
                    <Pagination :total-pages="10" :current-page="3" :total-items="100" color="primary" />
                  </template>
                </Card>
              </div>
            </div>
          </div>

          <!-- SETTINGS -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Settings</h3>
              <p class="tb-scene-desc">Formulario de configuración con preferencias y campos</p>
            </div>
          <div class="tb-settings">
            <Card variant="ghost" title="Perfil" class="tb-settings-card tb-settings-profile">
              <div class="tb-settings-form">
                <div class="tb-settings-row">
                  <div class="tb-field">
                    <Label label="Nombre" />
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div class="tb-field">
                    <Label label="Apellido" />
                    <Input placeholder="Tu apellido" />
                  </div>
                </div>
                <div class="tb-settings-row">
                  <div class="tb-field">
                    <Label label="Email" color="primary" />
                    <Input placeholder="tu@email.com" color="primary" />
                  </div>
                  <div class="tb-field">
                    <Label label="Teléfono" />
                    <Input placeholder="+54 11 1234-5678" />
                  </div>
                </div>
                <div class="tb-field">
                  <Label label="Bio" />
                  <Textarea placeholder="Contanos qué estás construyendo…" />
                </div>
                <div class="tb-settings-row">
                  <div class="tb-field">
                    <Label label="Rol" />
                    <Select placeholder="Elegí…">
                      <option value="dev">Dev</option>
                      <option value="designer">Designer</option>
                    </Select>
                  </div>
                  <div class="tb-field">
                    <Label label="Ubicación" />
                    <Autocomplete placeholder="¿Dónde estás?" />
                  </div>
                </div>
                <div class="tb-field">
                  <Label label="Avatar" />
                  <FileInput placeholder="Adjuntá una imagen" accept="image/*" />
                </div>
                <div class="tb-settings-form-footer">
                  <Checkbox label="Acepto los términos y condiciones" color="primary" />
                  <div class="tb-settings-form-actions">
                    <Button color="neutral" variant="ghost">Cancelar</Button>
                    <Button color="primary" :loading="isSaving" @click="handleSaveProfile">
                      {{ showSaveSuccess ? 'Guardado ✓' : 'Guardar cambios' }}
                    </Button>
                  </div>
                  <Transition name="tb-fade">
                    <Alert v-if="showSaveSuccess" title="Cambios guardados" color="success">
                      Tu perfil se actualizó correctamente.
                    </Alert>
                  </Transition>
                </div>
              </div>
            </Card>
            <Card variant="ghost" title="Preferencias" class="tb-settings-card tb-settings-prefs-card">
              <div class="tb-settings-prefs">
                <div class="tb-pref-section">
                  <h4 class="tb-pref-title">Notificaciones</h4>
                  <div class="tb-pref-row">
                    <span class="tb-pref-label">Notificaciones push</span>
                    <Switch color="primary" :model-value="true" />
                  </div>
                  <div class="tb-pref-row">
                    <span class="tb-pref-label">Resumen semanal</span>
                    <Switch />
                  </div>
                  <div class="tb-pref-row">
                    <span class="tb-pref-label">Newsletter</span>
                    <Switch color="success" :model-value="true" />
                  </div>
                </div>
                <div class="tb-pref-section">
                  <h4 class="tb-pref-title">Privacidad</h4>
                  <div class="tb-pref-row">
                    <span class="tb-pref-label">Perfil público</span>
                    <Checkbox color="primary" :model-value="true" />
                  </div>
                  <div class="tb-pref-row">
                    <span class="tb-pref-label">Compartir métricas</span>
                    <Checkbox color="success" :model-value="true" />
                  </div>
                </div>
                <div class="tb-pref-section">
                  <h4 class="tb-pref-title">Zona de carga</h4>
                  <FileInputZone placeholder="Arrastrá archivos acá, o hacé clic para elegir" />
                </div>
              </div>
            </Card>
          </div>
          </div>

          <!-- COMPONENTS GALLERY -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Componentes</h3>
              <p class="tb-scene-desc">Botones, badges, alertas y feedback en contexto</p>
            </div>
            <div class="tb-components">
              <Card variant="ghost" title="Acciones" class="tb-comp-card">
                <div class="tb-comp-group">
                  <p class="tb-comp-label">Colores — solid</p>
                  <div class="tb-row">
                    <Button color="primary">Primary</Button>
                    <Button color="secondary">Secondary</Button>
                    <Button color="neutral">Neutral</Button>
                    <Button color="success">Success</Button>
                    <Button color="warning">Warning</Button>
                    <Button color="danger">Danger</Button>
                  </div>
                </div>
                <div class="tb-comp-group">
                  <p class="tb-comp-label">Variantes</p>
                  <div class="tb-row">
                    <Button color="primary" variant="soft">Soft</Button>
                    <Button color="primary" variant="ghost">Ghost</Button>
                    <Button color="primary" variant="outlined">Outlined</Button>
                    <Button color="primary" variant="subtle">Subtle</Button>
                    <Button color="primary" variant="link">Link</Button>
                  </div>
                </div>
                <div class="tb-comp-group">
                  <p class="tb-comp-label">Estados</p>
                  <div class="tb-row">
                    <Button :loading="true">Loading</Button>
                    <Button color="danger" :loading="true">Loading</Button>
                    <Button :disabled="true">Disabled</Button>
                    <CopyButton text="comegen-ui" label="Copiar" />
                    <ToggleColorSheme />
                  </div>
                </div>
              </Card>
              <Card variant="ghost" title="Feedback" class="tb-comp-card">
                <div class="tb-col">
                  <Alert title="Primary" color="primary">Mensaje informativo con el color del tema.</Alert>
                  <Alert title="Success" color="success">Todo salió como esperabas.</Alert>
                  <Alert title="Warning" color="warning">Algo necesita tu atención.</Alert>
                  <Alert title="Danger" color="danger">Esta acción no se puede deshacer.</Alert>
                </div>
              </Card>
              <Card variant="ghost" title="Badges" class="tb-comp-card">
                <div class="tb-comp-group">
                  <p class="tb-comp-label">Colores</p>
                  <div class="tb-row">
                    <Badge color="primary">Primary</Badge>
                    <Badge color="secondary">Secondary</Badge>
                    <Badge color="neutral">Neutral</Badge>
                    <Badge color="success">Success</Badge>
                    <Badge color="warning">Warning</Badge>
                    <Badge color="danger">Danger</Badge>
                  </div>
                </div>
                <div class="tb-comp-group">
                  <p class="tb-comp-label">Variantes</p>
                  <div class="tb-row">
                    <Badge color="primary" variant="solid">Solid</Badge>
                    <Badge color="primary" variant="soft">Soft</Badge>
                    <Badge color="primary" variant="ghost">Ghost</Badge>
                    <Badge color="primary" variant="outlined">Outlined</Badge>
                    <Badge color="primary" variant="subtle">Subtle</Badge>
                  </div>
                </div>
                <div class="tb-comp-group">
                  <p class="tb-comp-label">En contexto</p>
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
              </Card>
            </div>
          </div>

          <!-- CALENDAR -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Fechas</h3>
              <p class="tb-scene-desc">Calendario, selectores de fecha y sliders temporales</p>
            </div>
            <div class="tb-calendar">
              <Card variant="ghost" class="tb-cal-card">
                <Calendar model-value="2026-09-11" style="width: 100%" />
              </Card>
              <Card variant="ghost" class="tb-cal-card">
                <div class="tb-cal-side">
                  <DatePicker model-value="2026-09-11" />
                  <DatePickerRange start-date="2026-09-01" end-date="2026-09-10" />
                </div>
                <div class="tb-cal-sliders">
                  <MonthSlider />
                  <MonthSlider month-format="MMM yyyy" color="success" />
                  <YearSlider />
                  <YearSlider variant="outlined" color="success" />
                </div>
              </Card>
            </div>
          </div>

          <!-- EDITORIAL -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Editorial</h3>
              <p class="tb-scene-desc">Contenido markdown, citas y bloques de código</p>
            </div>
            <div class="tb-editorial">
              <Card variant="ghost" class="tb-ed-card">
                <Markdown>
                  # Título del tema

                  Párrafo con **negrita**, *itálica* y `código inline`. Un párrafo más largo para ver cómo se comporta el texto extenso con el tema aplicado y los tokens de tipografía.

                  - Item uno
                  - Item dos
                  - Item tres
                </Markdown>
              </Card>
              <div class="tb-ed-sidebar">
                <Blockquote color="primary">
                  Los tokens son la fuente única de verdad: cambiás un color y todo el ecosistema lo sigue.
                </Blockquote>
                <CodeBlock :code="editorialSnippet" language="javascript" />
              </div>
            </div>
          </div>

          <!-- OVERLAYS -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Overlays</h3>
              <p class="tb-scene-desc">Modales, collapse y elementos flotantes</p>
            </div>
            <div class="tb-overlays-mock">
              <div class="tb-overlay-page">
                <div class="tb-overlay-content">
                  <div class="tb-sim-lines">
                    <span class="tb-sim-line tb-sim-line--w80"></span>
                    <span class="tb-sim-line"></span>
                    <span class="tb-sim-line tb-sim-line--w60"></span>
                  </div>
                  <Collapse label="Más información" color="primary" :default-open="true">
                    <p>El contenido aparece sobre la página, con el tema editado.</p>
                  </Collapse>
                  <Collapse label="Detalles" color="success">
                    <p>Cada color sigue los tokens del tema activo.</p>
                  </Collapse>
                </div>
                <div class="tb-overlay-modal">
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
              <div class="tb-overlay-actions">
                <Modal
                  ref="modalPreviewRef"
                  size="sm"
                  title="Confirmar acción"
                  description="El modal usa los tokens del tema activo."
                >
                  <p>Contenido del modal con el tema del ThemeBuilder.</p>
                </Modal>
                <Button color="primary" @click="modalPreviewRef?.open()">Abrir modal real</Button>
                <FloatingButton style="position: static" color="primary">
                  <LucideSave :width="18" :height="18" />
                </FloatingButton>
              </div>
            </div>
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
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
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
  gap: 1rem;
}

.tb-controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
}

.tb-controls-theme-name {
  font-weight: var(--cu-font-weight-semibold);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tb-edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-sm);
  background: transparent;
  color: var(--cu-color-neutral);
  cursor: pointer;
  transition: background 150ms ease;
}

.tb-edit-btn:hover {
  background: var(--cu-color-neutral-ghost-hover);
}

.tb-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.tb-gallery {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* === SCENES === */
.tb-scene {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-scene-header {
  padding: 0 0.25rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  padding-bottom: 0.75rem;
}

.tb-scene-title {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
}

.tb-scene-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0.25rem 0 0;
}

/* === DASHBOARD === */
.tb-dashboard {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.25rem;
  background-color: var(--cu-color-surface);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  overflow: hidden;
}

.tb-dash-sidebar {
  padding: 1rem;
  border-right: var(--cu-border-thin) solid var(--cu-border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: var(--cu-color-surface);
}

.tb-dash-sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-dash-main {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.tb-dash-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.tb-dash-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tb-dash-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.tb-stat {
  padding: 1rem;
}

.tb-stat-value {
  font-size: var(--cu-font-size-2xl);
  font-weight: var(--cu-weight-bold);
  color: var(--cu-color-neutral);
  line-height: 1.2;
}

.tb-stat-label {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin-top: 0.25rem;
}

.tb-dash-table {
  padding: 1rem;
}

/* === SETTINGS === */
.tb-settings {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
}

.tb-settings-card {
  padding: 1.25rem;
}

.tb-settings-profile {
  /* Más ancho — formulario completo */
}

.tb-settings-prefs-card {
  /* Más estrecho — preferencias compactas */
}

.tb-settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-settings-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tb-settings-form-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-settings-form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.tb-settings-prefs {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tb-pref-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tb-pref-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.tb-pref-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

/* === COMPONENTS === */
.tb-components {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.tb-comp-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-comp-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tb-comp-label {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0;
}

/* === CALENDAR === */
.tb-calendar {
  display: grid;
  grid-template-columns: minmax(280px, 320px) 1fr;
  gap: 1.25rem;
}

.tb-cal-card {
  padding: 1.25rem;
}

.tb-cal-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.tb-cal-sliders {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

/* === EDITORIAL === */
.tb-editorial {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.25rem;
}

.tb-ed-card {
  padding: 1.5rem;
}

.tb-ed-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* === OVERLAYS === */
.tb-overlays-mock {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-overlay-page {
  position: relative;
  transform: translateZ(0);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  background-color: var(--cu-color-surface);
  overflow: hidden;
  min-height: 320px;
}

.tb-overlay-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-overlay-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.tb-overlay-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.25rem;
}

/* === SHARED === */
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

</style>
