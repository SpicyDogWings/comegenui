<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PlaygroundLayout from '@/layouts/PlaygroundLayout.vue'
import Button from '@/components/buttons/Button.vue'
import Alert from '@/components/information/Alert.vue'
import Badge from '@/components/information/Badge.vue'
import Input from '@/components/form/Input.vue'
import Switch from '@/components/form/Switch.vue'
import Checkbox from '@/components/form/Checkbox.vue'

const themeName = ref('light')

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
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.25)',
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

function colorVar(name: string, value: string) {
  const darken = (c: string, amount: number) => {
    const hex = c.replace('#', '')
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - Math.round(255 * amount))
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - Math.round(255 * amount))
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - Math.round(255 * amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  const lighten = (c: string, amount: number) => {
    const hex = c.replace('#', '')
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + Math.round(255 * amount))
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + Math.round(255 * amount))
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + Math.round(255 * amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  const transparentize = (c: string, amount: number) => {
    const hex = c.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${1 - amount})`
  }

  return `--cu-color-${name}: ${value};
    --cu-color-${name}-text: ${darken(value, 0.25)};
    --cu-color-${name}-hover: ${darken(value, 0.1)};
    --cu-color-${name}-active: ${lighten(value, 0.1)};
    --cu-color-${name}-ghost-hover: ${transparentize(value, 0.9)};
    --cu-color-${name}-ghost-active: ${transparentize(value, 0.8)};
    --cu-color-${name}-soft: ${transparentize(value, 0.85)};
    --cu-color-${name}-soft-hover: ${transparentize(value, 0.75)};
    --cu-color-${name}-soft-active: ${transparentize(value, 0.65)};
    --cu-color-${name}-subtle: ${transparentize(value, 0.9)};
    --cu-color-${name}-subtle-hover: ${transparentize(value, 0.8)};
    --cu-color-${name}-subtle-active: ${transparentize(value, 0.7)};
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};`
}

const cssOutput = computed(() => {
  const t = typography.value
  const s = spacing.value
  const r = borderRadius.value
  const sh = shadows.value
  const b = borders.value

  const colorsCSS = Object.entries(colors.value)
    .map(([name, value]) => colorVar(name, value))
    .join('\n    ')

  return `:root {
    /* Colors */
    ${colorsCSS}

    /* Typography */
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
    --cu-shadow-sm: ${sh.sm};
    --cu-shadow-md: ${sh.md};
    --cu-shadow-lg: ${sh.lg};
    --cu-shadow-xl: ${sh.xl};

    /* Borders */
    --cu-border-none: ${b.width.none};
    --cu-border-thin: ${b.width.thin};
    --cu-border-medium: ${b.width.medium};
    --cu-border-thick: ${b.width.thick};
    --cu-border-color: ${b.color.default};
    --cu-border-color-strong: ${b.color.strong};
    --cu-border-color-focus: ${b.color.focus};
}`
})

const previewStyle = computed(() => {
  const el = document.getElementById('theme-preview')
  if (el) {
    el.style.cssText = cssOutput.value.replace(/:root\s*\{/, '').replace(/\}$/, '').split('\n').map(l => l.trim()).filter(Boolean).join('; ') + ';'
  }
  return ''
})

let styleEl: HTMLStyleElement | null = null

watch(cssOutput, (css) => {
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'theme-builder-preview'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
}, { immediate: true })

function copyCSS() {
  navigator.clipboard.writeText(cssOutput.value)
}

function downloadCSS() {
  const blob = new Blob([cssOutput.value], { type: 'text/css' })
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
  shadows.value = { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)', lg: '0 10px 15px rgba(0,0,0,0.1)', xl: '0 20px 25px rgba(0,0,0,0.25)' }
  borders.value = { width: { none: '0', thin: '1px', medium: '2px', thick: '4px' }, color: { default: '#d1d5db', strong: '#6b7280', focus: '#1774A4' } }
}

const outlineItems = [
  { label: 'Colors', id: 'colors' },
  { label: 'Typography', id: 'typography' },
  { label: 'Spacing', id: 'spacing' },
  { label: 'Border Radius', id: 'radius' },
  { label: 'Shadows', id: 'shadows' },
  { label: 'Borders', id: 'borders' },
  { label: 'Preview', id: 'preview' },
  { label: 'Output', id: 'output' },
]
</script>

<template>
  <PlaygroundLayout title="Theme Builder" :outlineItems="outlineItems">
    <div class="theme-builder">
      <section id="colors" class="tb-section">
        <h2>Colors</h2>
        <div class="tb-grid">
          <div v-for="(value, key) in colors" :key="key" class="tb-color-field">
            <label>{{ key }}</label>
            <div class="tb-color-input">
              <input type="color" :value="value" @input="colors[key] = ($event.target as HTMLInputElement).value" />
              <input type="text" :value="value" @input="colors[key] = ($event.target as HTMLInputElement).value" />
            </div>
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="typography" class="tb-section">
        <h2>Typography</h2>
        <div class="tb-group">
          <h3>Font Family</h3>
          <div class="tb-field">
            <label>Sans</label>
            <input type="text" v-model="typography.fontFamily.sans" />
          </div>
          <div class="tb-field">
            <label>Mono</label>
            <input type="text" v-model="typography.fontFamily.mono" />
          </div>
        </div>
        <div class="tb-group">
          <h3>Font Size</h3>
          <div class="tb-grid">
            <div v-for="(value, key) in typography.fontSize" :key="key" class="tb-field">
              <label>{{ key }}</label>
              <input type="text" v-model="typography.fontSize[key]" />
            </div>
          </div>
        </div>
        <div class="tb-group">
          <h3>Font Weight</h3>
          <div class="tb-grid">
            <div v-for="(value, key) in typography.fontWeight" :key="key" class="tb-field">
              <label>{{ key }}</label>
              <input type="text" v-model="typography.fontWeight[key]" />
            </div>
          </div>
        </div>
        <div class="tb-group">
          <h3>Line Height</h3>
          <div class="tb-grid">
            <div v-for="(value, key) in typography.lineHeight" :key="key" class="tb-field">
              <label>{{ key }}</label>
              <input type="text" v-model="typography.lineHeight[key]" />
            </div>
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="spacing" class="tb-section">
        <h2>Spacing</h2>
        <div class="tb-grid">
          <div v-for="(value, key) in spacing" :key="key" class="tb-field">
            <label>{{ key }}</label>
            <input type="text" v-model="spacing[key]" />
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="radius" class="tb-section">
        <h2>Border Radius</h2>
        <div class="tb-grid">
          <div v-for="(value, key) in borderRadius" :key="key" class="tb-field">
            <label>{{ key }}</label>
            <input type="text" v-model="borderRadius[key]" />
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="shadows" class="tb-section">
        <h2>Shadows</h2>
        <div class="tb-grid">
          <div v-for="(value, key) in shadows" :key="key" class="tb-field">
            <label>{{ key }}</label>
            <input type="text" v-model="shadows[key]" />
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="borders" class="tb-section">
        <h2>Borders</h2>
        <div class="tb-group">
          <h3>Width</h3>
          <div class="tb-grid">
            <div v-for="(value, key) in borders.width" :key="key" class="tb-field">
              <label>{{ key }}</label>
              <input type="text" v-model="borders.width[key]" />
            </div>
          </div>
        </div>
        <div class="tb-group">
          <h3>Color</h3>
          <div class="tb-grid">
            <div v-for="(value, key) in borders.color" :key="key" class="tb-field">
              <label>{{ key }}</label>
              <div class="tb-color-input">
                <input type="color" :value="value" @input="borders.color[key] = ($event.target as HTMLInputElement).value" />
                <input type="text" v-model="borders.color[key]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="preview" class="tb-section">
        <h2>Preview</h2>
        <div class="tb-preview">
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
            <Alert title="Info" color="primary">This is an alert message.</Alert>
          </div>
          <div class="tb-preview-row">
            <Badge color="primary">Primary</Badge>
            <Badge color="success">Success</Badge>
            <Badge color="danger">Danger</Badge>
          </div>
          <div class="tb-preview-row">
            <Input placeholder="Input field..." />
            <Switch />
            <Checkbox label="Checkbox" />
          </div>
        </div>
      </section>

      <hr class="tb-separator" />

      <section id="output" class="tb-section">
        <h2>CSS Output</h2>
        <div class="tb-actions">
          <Button color="primary" @click="copyCSS">Copy CSS</Button>
          <Button color="secondary" @click="downloadCSS">Download</Button>
          <Button color="neutral" variant="ghost" @click="resetToDefaults">Reset</Button>
        </div>
        <pre class="tb-code"><code>{{ cssOutput }}</code></pre>
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.theme-builder {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.tb-section h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0 0 1rem 0;
  color: var(--cu-color-neutral);
}

.tb-section h3 {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  margin: 0 0 0.5rem 0;
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.tb-group {
  margin-bottom: 1rem;
}

.tb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.tb-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tb-field label {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.tb-field input[type="text"] {
  padding: var(--cu-space-sm) var(--cu-space-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  background: var(--cu-color-surface);
  color: var(--cu-color-neutral);
}

.tb-field input[type="text"]:focus {
  outline: none;
  border-color: var(--cu-color-primary);
  box-shadow: 0 0 0 2px var(--cu-color-primary-soft);
}

.tb-color-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tb-color-field label {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  opacity: 0.7;
}

.tb-color-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tb-color-input input[type="color"] {
  width: 32px;
  height: 32px;
  padding: 0;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  cursor: pointer;
  background: none;
}

.tb-color-input input[type="text"] {
  flex: 1;
  padding: var(--cu-space-sm) var(--cu-space-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  background: var(--cu-color-surface);
  color: var(--cu-color-neutral);
}

.tb-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}

.tb-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  background: var(--cu-color-surface);
}

.tb-preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.tb-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tb-code {
  background: #1a1a2e;
  color: #e0e0e0;
  padding: 1rem;
  border-radius: var(--cu-radius);
  overflow-x: auto;
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-xs);
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
}
</style>
