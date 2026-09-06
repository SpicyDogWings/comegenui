<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PlaygroundLayout from '@/layouts/PlaygroundLayout.vue'
import Button from '@/components/buttons/Button.vue'
import Alert from '@/components/information/Alert.vue'
import Badge from '@/components/information/Badge.vue'
import Avatar from '@/components/information/Avatar.vue'
import AuthorCard from '@/components/information/AuthorCard.vue'
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
import { useThemeStore } from '@/stores/theme'
import { DEFAULTS, DEFAULT_COLORS, DEFAULT_OPACITIES } from '@/plugins/cu-tokens/defaults'
import { hexToRgba } from '@/lib/colors'

const themeStore = useThemeStore()

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

const showDeleteModal = ref(false)
const deleteModalRef = ref<InstanceType<typeof Modal> | null>(null)
watch(showDeleteModal, (val) => {
  if (val) deleteModalRef.value?.open()
})

const showDrawer = ref(false)
const toastVisible = ref(false)
const toastType = ref<'success' | 'warning' | 'danger' | 'primary'>('success')
const toastMessage = ref('')
const toastIcon = ref('✓')

const toastMessages = {
  success: { msg: 'Cambios guardados correctamente', icon: '✓' },
  warning: { msg: 'Tené cuidado con esta acción', icon: '⚠' },
  danger: { msg: 'Ocurrió un error inesperado', icon: '✕' },
  primary: { msg: 'Procesando solicitud...', icon: 'ℹ' },
}

function triggerToast(type: 'success' | 'warning' | 'danger' | 'primary') {
  toastType.value = type
  toastMessage.value = toastMessages[type].msg
  toastIcon.value = toastMessages[type].icon
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
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

const docOutlineItems: OutlineItem[] = [
  { label: 'Introducción', id: 'doc-intro' },
  { label: '¿Cómo funciona?', id: 'doc-how' },
  {
    label: 'Buenas prácticas',
    id: 'doc-best',
    children: [
      { label: 'Consistencia', id: 'doc-consistency' },
      { label: 'Contexto', id: 'doc-context' },
    ],
  },
]

const editorialSnippet = `const tokens = getThemeNames();
// cambiás un color y todo el ecosistema lo sigue
setTheme('nord');`

interface AgendaEvent {
  date: string
  time: string
  title: string
  desc: string
  color: string
  badge: string
}

const allAgendaEvents: AgendaEvent[] = [
  { date: '2026-09-03', time: '10:00', title: 'Workshop UX', desc: 'Mapear flujos del nuevo dashboard', color: 'primary', badge: 'Work' },
  { date: '2026-09-08', time: '14:00', title: 'Demo interna', desc: 'Mostrar avances al equipo', color: 'success', badge: 'Done' },
  { date: '2026-09-11', time: '09:00', title: 'Review de diseño', desc: 'Revisar mockups del dashboard nuevo', color: 'primary', badge: 'Work' },
  { date: '2026-09-11', time: '14:00', title: 'Call con cliente', desc: 'Presentar avances del tema system', color: 'warning', badge: 'Pending' },
  { date: '2026-09-15', time: '11:00', title: 'Sprint review', desc: 'Retrospectiva del sprint 14', color: 'primary', badge: 'Work' },
  { date: '2026-09-18', time: '16:00', title: 'Deploy producción', desc: 'Subir versión 2.0 a producción', color: 'success', badge: 'Done' },
  { date: '2026-09-22', time: '09:30', title: 'Post-mortem', desc: 'Análisis del incidente en staging', color: 'danger', badge: 'Urgent' },
  { date: '2026-09-25', time: '13:00', title: 'Planning Q4', desc: 'Definir objetivos del próximo trimestre', color: 'warning', badge: 'Pending' },
];

const agendaSelectedDate = ref('2026-09-11');

const agendaEvents = computed(() =>
  allAgendaEvents.filter(e => e.date === agendaSelectedDate.value)
);

const agendaDots = computed(() =>
  allAgendaEvents.map(e => ({ date: e.date, color: e.color }))
);

function onSelectDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  agendaSelectedDate.value = `${yyyy}-${mm}-${dd}`;
}

const newEvent = ref({
  title: '',
  date: '2026-09-11',
  time: '',
  category: 'work',
  desc: '',
});

const eventSaved = ref(false);

function saveEventDraft() {
  eventSaved.value = true;
  setTimeout(() => { eventSaved.value = false; }, 2500);
}

function createEvent() {
  if (!newEvent.value.title) return;
  const colorMap: Record<string, AgendaEvent['color']> = {
    work: 'primary',
    personal: 'success',
    urgent: 'danger',
  };
  const badgeMap: Record<string, string> = {
    work: 'Work',
    personal: 'Personal',
    urgent: 'Urgent',
  };
  allAgendaEvents.push({
    date: newEvent.value.date,
    time: newEvent.value.time || '12:00',
    title: newEvent.value.title,
    desc: newEvent.value.desc,
    color: colorMap[newEvent.value.category] || 'primary',
    badge: badgeMap[newEvent.value.category] || 'Work',
  });
  newEvent.value = { title: '', date: '2026-09-11', time: '', category: 'work', desc: '' };
  eventSaved.value = true;
  setTimeout(() => { eventSaved.value = false; }, 2500);
}

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
                <Collapse label="Zona de peligro" color="danger" :default-open="true" class="tb-settings-collapse">
                  <div class="tb-over-options">
                    <div class="tb-over-option-row">
                      <div>
                        <span class="tb-over-option-title">Eliminar cuenta</span>
                        <span class="tb-over-option-desc">Esta acción no se puede deshacer</span>
                      </div>
                      <Button color="danger" variant="outlined" size="sm" @click="showDeleteModal = true">Eliminar</Button>
                    </div>
                    <div class="tb-over-option-row">
                      <div>
                        <span class="tb-over-option-title">Cerrar sesión</span>
                        <span class="tb-over-option-desc">Se cerrará en todos los dispositivos</span>
                      </div>
                      <Switch color="danger" />
                    </div>
                  </div>
                </Collapse>
              </div>
            </Card>
          </div>
          </div>

          <!-- AGENDA -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Agenda</h3>
              <p class="tb-scene-desc">Calendario con eventos, badges de estado y acciones rápidas</p>
            </div>
            <div class="tb-agenda">
              <div class="tb-agenda-toolbar">
                <Input placeholder="Buscar evento…" style="max-width: 220px" />
                <div class="tb-agenda-toolbar-actions">
                  <DropdownMenu color="neutral" variant="soft" label="Filtrar" :items="dropdownItems" />
                </div>
              </div>
              <div class="tb-agenda-split">
                <div class="tb-agenda-cal">
                  <Calendar
                    :model-value="agendaSelectedDate"
                    :events="agendaDots"
                    style="width: 100%"
                    @select="onSelectDate"
                  />
                  <div class="tb-agenda-events">
                    <h4 class="tb-agenda-section-title">Eventos del día ({{ agendaEvents.length }})</h4>
                    <template v-if="agendaEvents.length > 0">
                      <div v-for="event in agendaEvents" :key="event.time + event.title" class="tb-agenda-event">
                        <div class="tb-agenda-event-time">{{ event.time }}</div>
                        <div class="tb-agenda-event-content">
                          <div class="tb-agenda-event-header">
                            <span class="tb-agenda-event-title">{{ event.title }}</span>
                            <Badge :color="event.color" variant="soft">{{ event.badge }}</Badge>
                          </div>
                          <p class="tb-agenda-event-desc">{{ event.desc }}</p>
                        </div>
                      </div>
                    </template>
                    <p v-else class="tb-agenda-empty">No hay eventos para este día</p>
                  </div>
                </div>
                <div class="tb-agenda-side">
                  <h4 class="tb-agenda-section-title">Nuevo evento</h4>
                  <div class="tb-agenda-form">
                    <div class="tb-field">
                      <Label label="Título" />
                      <Input v-model="newEvent.title" placeholder="Nombre del evento" />
                    </div>
                    <div class="tb-agenda-form-row">
                      <div class="tb-field">
                        <Label label="Fecha" />
                        <DatePicker v-model="newEvent.date" />
                      </div>
                      <div class="tb-field">
                        <Label label="Hora" />
                        <Input v-model="newEvent.time" placeholder="14:00" />
                      </div>
                    </div>
                    <div class="tb-field">
                      <Label label="Categoría" />
                      <Select v-model="newEvent.category">
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="urgent">Urgent</option>
                      </Select>
                    </div>
                    <div class="tb-field">
                      <Label label="Descripción" />
                      <Textarea v-model="newEvent.desc" placeholder="Detalles del evento…" />
                    </div>
                    <div class="tb-agenda-form-actions">
                      <Button color="primary" style="width: 100%" @click="createEvent">Crear evento</Button>
                    </div>
                    <Transition name="tb-fade">
                      <Alert v-if="eventSaved" title="Evento creado" color="success">
                        Se agregó a tu agenda.
                      </Alert>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- EDITORIAL -->
          <div class="tb-scene">
            <div class="tb-scene-header">
              <h3 class="tb-scene-title">Editorial</h3>
              <p class="tb-scene-desc">Nota de documentación con formato de artículo</p>
            </div>
            <div class="tb-editorial">
              <div class="tb-doc">
                <div class="tb-doc-header">
                  <div class="tb-doc-meta">
                    <Badge color="primary" variant="soft">Documentación</Badge>
                    <span class="tb-doc-date">6 sep 2026</span>
                    <span class="tb-doc-read">4 min de lectura</span>
                  </div>
                  <h1 class="tb-doc-title">Sistema de tokens y temas</h1>
                  <p class="tb-doc-subtitle">Cómo funciona la personalización de colores, tipografía y espaciado en ComegenUI</p>
                  <div class="tb-doc-author">
                    <AuthorCard name="María Cano" role="Design Systems" />
                  </div>
                </div>
                <div class="tb-doc-toolbar">
                  <div class="tb-doc-toolbar-group">
                    <button class="tb-doc-tb-btn" title="Negrita"><strong>B</strong></button>
                    <button class="tb-doc-tb-btn" title="Itálica"><em>I</em></button>
                    <button class="tb-doc-tb-btn" title="Código">&lt;/&gt;</button>
                    <button class="tb-doc-tb-btn" title="Link">🔗</button>
                  </div>
                  <div class="tb-doc-toolbar-group">
                    <button class="tb-doc-tb-btn" title="Lista">☰</button>
                    <button class="tb-doc-tb-btn" title="Título">H</button>
                    <button class="tb-doc-tb-btn" title="Cita">❝</button>
                  </div>
                  <div class="tb-doc-toolbar-spacer" />
                  <Badge color="success" variant="soft">Publicado</Badge>
                </div>
                <div class="tb-doc-body">
                  <Markdown>
                    ## Introducción

                    Los **tokens de diseño** son la fuente única de verdad para todo el sistema visual. En lugar de hardcodear colores o tamaños en cada componente, usamos variables CSS que se resuelven según el tema activo.

                    > Cambiás un token y todo el ecosistema lo sigue — desde los botones hasta las alertas.

                    ## ¿Cómo funciona?

                    Cada tema define un conjunto de tokens que cubren:

                    - **Colores**: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`
                    - **Tipografía**: familias, pesos y tamaños
                    - **Espaciado**: escala consistente para márgenes y paddings
                    - **Bordes**: radios y anchos

                    ### Ejemplo rápido

                    Definís un tema nuevo en pocos pasos:

                    1. Abrís el Theme Builder
                    2. Ajustás los colores con los pickers
                    3. Exportás el CSS generado
                    4. Lo importás en tu proyecto

                    ## Buenas prácticas

                    - **No mezcles temas** en la misma vista
                    - **Usá los tokens semánticos** (`primary`, `success`) en vez de nombres de color
                    - **Probá en contexto** con las previews del builder
                    - **Exportá y versioná** los temas junto al código
                  </Markdown>
                </div>
                <div class="tb-doc-footer">
                  <div class="tb-doc-tags">
                    <Badge color="neutral" variant="soft">Design Tokens</Badge>
                    <Badge color="neutral" variant="soft">Temas</Badge>
                    <Badge color="neutral" variant="soft">CSS</Badge>
                  </div>
                  <div class="tb-doc-actions">
                    <Button color="neutral" variant="ghost">Compartir</Button>
                    <Button color="primary">Guardar borrador</Button>
                  </div>
                </div>
              </div>
              <div class="tb-doc-sidebar">
                <Card variant="subtle" color="primary" class="tb-doc-toc-card">
                  <h4 class="tb-doc-sidebar-title">En esta página</h4>
                  <Outline :items="docOutlineItems" />
                </Card>
                <Card variant="ghost" class="tb-doc-meta-card">
                  <h4 class="tb-doc-sidebar-title">Estadísticas</h4>
                  <div class="tb-doc-stats">
                    <div class="tb-doc-stat">
                      <span class="tb-doc-stat-value">1.2k</span>
                      <span class="tb-doc-stat-label">Palabras</span>
                    </div>
                    <div class="tb-doc-stat">
                      <span class="tb-doc-stat-value">4</span>
                      <span class="tb-doc-stat-label">Secciones</span>
                    </div>
                    <div class="tb-doc-stat">
                      <span class="tb-doc-stat-value">3</span>
                      <span class="tb-doc-stat-label">Bloques código</span>
                    </div>
                    <div class="tb-doc-stat">
                      <span class="tb-doc-stat-value">2</span>
                      <span class="tb-doc-stat-label">Citas</span>
                    </div>
                  </div>
                </Card>
                <Card variant="ghost" class="tb-doc-versions-card">
                  <h4 class="tb-doc-sidebar-title">Versiones</h4>
                  <div class="tb-doc-versions">
                    <div class="tb-doc-version tb-doc-version--current">
                      <div class="tb-doc-version-dot" />
                      <div class="tb-doc-version-info">
                        <span class="tb-doc-version-label">v1.3</span>
                        <span class="tb-doc-version-date">Hoy, 14:20</span>
                      </div>
                      <Badge color="success" variant="soft">Actual</Badge>
                    </div>
                    <div class="tb-doc-version">
                      <div class="tb-doc-version-dot" />
                      <div class="tb-doc-version-info">
                        <span class="tb-doc-version-label">v1.2</span>
                        <span class="tb-doc-version-date">Ayer, 09:45</span>
                      </div>
                    </div>
                    <div class="tb-doc-version">
                      <div class="tb-doc-version-dot" />
                      <div class="tb-doc-version-info">
                        <span class="tb-doc-version-label">v1.1</span>
                        <span class="tb-doc-version-date">5 sep, 18:00</span>
                      </div>
                    </div>
                    <div class="tb-doc-version">
                      <div class="tb-doc-version-dot" />
                      <div class="tb-doc-version-info">
                        <span class="tb-doc-version-label">v1.0</span>
                        <span class="tb-doc-version-date">3 sep, 11:30</span>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card variant="soft" color="warning" class="tb-doc-note-card">
                  <h4 class="tb-doc-sidebar-title">Nota del editor</h4>
                  <p class="tb-doc-note-text">Esta documentación está en revisión. Faltan ejemplos de migración desde v1.x.</p>
                </Card>
              </div>
            </div>
          </div>

          <!-- Toast container -->
          <Transition name="tb-toast">
            <div v-if="toastVisible" class="tb-toast" :class="`tb-toast--${toastType}`">
              <span class="tb-toast-icon">{{ toastIcon }}</span>
              <span class="tb-toast-msg">{{ toastMessage }}</span>
            </div>
          </Transition>

          <!-- Delete Modal -->
          <Modal
            ref="deleteModalRef"
            size="sm"
            title="¿Eliminar cuenta?"
            description="Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente."
            @close="showDeleteModal = false"
          >
            <div class="tb-modal-actions">
              <Button color="neutral" variant="ghost" @click="deleteModalRef?.close()">Cancelar</Button>
              <Button color="danger" @click="deleteModalRef?.close(); showDeleteModal = false">Sí, eliminar cuenta</Button>
            </div>
          </Modal>

          <!-- Drawer -->
          <Transition name="tb-drawer">
            <div v-if="showDrawer" class="tb-drawer-overlay" @click="showDrawer = false">
              <div class="tb-drawer" @click.stop>
                <div class="tb-drawer-header">
                  <h3 class="tb-drawer-title">Configuración</h3>
                  <Button color="neutral" variant="ghost" @click="showDrawer = false">✕</Button>
                </div>
                <div class="tb-drawer-body">
                  <div class="tb-drawer-section">
                    <h4 class="tb-drawer-section-title">General</h4>
                    <div class="tb-drawer-row">
                      <span>Notificaciones</span>
                      <Switch color="primary" :model-value="true" />
                    </div>
                    <div class="tb-drawer-row">
                      <span>Modo oscuro</span>
                      <Switch />
                    </div>
                  </div>
                  <div class="tb-drawer-section">
                    <h4 class="tb-drawer-section-title">Privacidad</h4>
                    <div class="tb-drawer-row">
                      <span>Perfil público</span>
                      <Checkbox color="primary" :model-value="true" />
                    </div>
                    <div class="tb-drawer-row">
                      <span>Compartir métricas</span>
                      <Checkbox color="success" :model-value="true" />
                    </div>
                  </div>
                </div>
                <div class="tb-drawer-footer">
                  <Button color="neutral" variant="ghost" style="width: 100%" @click="showDrawer = false">Cerrar</Button>
                  <Button color="primary" style="width: 100%">Guardar cambios</Button>
                </div>
              </div>
            </div>
          </Transition>

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

.tb-settings-collapse {
  margin-top: 0.5rem;
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

/* === AGENDA === */
.tb-agenda {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--cu-color-surface);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
}

.tb-agenda-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-agenda-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tb-agenda-split {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 1.5rem;
}

.tb-agenda-cal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-agenda-events {
  display: flex;
  flex-direction: column;
}

.tb-agenda-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tb-agenda-form {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
}

.tb-agenda-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--cu-space-md);
}

.tb-agenda-form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.tb-agenda-section-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0 0 0.75rem;
}

.tb-agenda-event {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-agenda-event:last-child {
  border-bottom: none;
}

.tb-agenda-event-time {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  opacity: 0.5;
  min-width: 42px;
  padding-top: 2px;
}

.tb-agenda-event-content {
  flex: 1;
}

.tb-agenda-event-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 2px;
}

.tb-agenda-event-title {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
}

.tb-agenda-event-desc {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0;
}

.tb-agenda-empty {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.5;
  margin: 0;
  padding: 0.5rem 0;
}

/* === EDITORIAL === */
.tb-editorial {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.25rem;
}

.tb-doc {
  display: flex;
  flex-direction: column;
  background-color: var(--cu-color-surface);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  overflow: hidden;
}

.tb-doc-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-doc-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}

.tb-doc-date::before,
.tb-doc-read::before {
  content: '·';
  margin-right: 0.75rem;
}

.tb-doc-title {
  font-size: var(--cu-font-size-2xl);
  font-weight: var(--cu-weight-bold);
  color: var(--cu-color-neutral);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.tb-doc-subtitle {
  font-size: var(--cu-font-size-md);
  color: var(--cu-color-neutral);
  opacity: 0.7;
  margin: 0 0 1rem;
}

.tb-doc-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  background-color: var(--cu-color-surface);
}

.tb-doc-toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding-right: 0.5rem;
  border-right: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-doc-toolbar-group:last-of-type {
  border-right: none;
}

.tb-doc-tb-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--cu-radius-sm);
  background: transparent;
  color: var(--cu-color-neutral);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--cu-font-size-sm);
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 150ms ease;
}

.tb-doc-tb-btn:hover {
  background: var(--cu-color-neutral-ghost-hover);
}

.tb-doc-toolbar-spacer {
  flex: 1;
}

.tb-doc-body {
  padding: 1.5rem;
}

.tb-doc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
  margin-top: auto;
}

.tb-doc-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tb-doc-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tb-doc-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tb-doc-toc-card {
  padding: 1rem;
}

.tb-doc-snippet-card {
  padding: 1rem;
}

.tb-doc-meta-card {
  padding: 1rem;
}

.tb-doc-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.tb-doc-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tb-doc-stat-value {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
}

.tb-doc-stat-label {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.5;
}

.tb-doc-versions-card {
  padding: 1rem;
}

.tb-doc-versions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tb-doc-version {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem;
  border-radius: var(--cu-radius-sm);
  transition: background 150ms ease;
}

.tb-doc-version--current {
  background-color: var(--cu-color-primary-soft);
}

.tb-doc-version-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--cu-color-neutral);
  opacity: 0.3;
  flex-shrink: 0;
}

.tb-doc-version--current .tb-doc-version-dot {
  background-color: var(--cu-color-primary);
  opacity: 1;
}

.tb-doc-version-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.tb-doc-version-label {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
}

.tb-doc-version-date {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.5;
}

.tb-doc-note-card {
  padding: 1rem;
}

.tb-doc-note-text {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.8;
  margin: 0;
  line-height: var(--cu-line-height-normal);
}

.tb-doc-sidebar-title {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* === OVERLAYS (integrados) === */
.tb-over-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tb-over-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-over-option-row:last-child {
  border-bottom: none;
}

.tb-over-option-title {
  display: block;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
}

.tb-over-option-desc {
  display: block;
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  opacity: 0.6;
}

.tb-over-fab-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.tb-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* === TOAST === */
.tb-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: var(--cu-radius);
  background-color: var(--cu-color-surface);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.tb-toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: white;
  flex-shrink: 0;
}

.tb-toast--success .tb-toast-icon { background-color: var(--cu-color-success); }
.tb-toast--warning .tb-toast-icon { background-color: var(--cu-color-warning); }
.tb-toast--danger .tb-toast-icon { background-color: var(--cu-color-danger); }
.tb-toast--primary .tb-toast-icon { background-color: var(--cu-color-primary); }

.tb-toast-enter-active,
.tb-toast-leave-active {
  transition: all 0.3s ease;
}

.tb-toast-enter-from,
.tb-toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.tb-fade-enter-active,
.tb-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tb-fade-enter-from,
.tb-fade-leave-to {
  opacity: 0;
}

/* === DRAWER === */
.tb-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
}

.tb-drawer {
  width: 360px;
  height: 100%;
  background-color: var(--cu-color-surface);
  border-left: var(--cu-border-thin) solid var(--cu-border-color);
  display: flex;
  flex-direction: column;
  animation: tb-drawer-in 0.25s ease;
}

@keyframes tb-drawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.tb-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.tb-drawer-title {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  margin: 0;
}

.tb-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tb-drawer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tb-drawer-section-title {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  color: var(--cu-color-neutral);
  opacity: 0.6;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tb-drawer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.tb-drawer-footer {
  padding: 1.25rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tb-drawer-enter-active,
.tb-drawer-leave-active {
  transition: opacity 0.25s ease;
}

.tb-drawer-enter-from,
.tb-drawer-leave-to {
  opacity: 0;
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
