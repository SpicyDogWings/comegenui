<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import Switch from "@/components/form/Switch.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";

const demoValue = ref("");
const notifications = ref(true);
const keepSession = ref(true);

const indexGroups = [
  {
    group: "Buttons",
    items: [
      { label: "Button", path: "/playground/components/button" },
      { label: "CopyButton", path: "/playground/components/copy-button" },
      { label: "FloatingButton", path: "/playground/components/floating-button" },
      { label: "ToggleColorScheme", path: "/playground/components/toggle-color-scheme" },
    ],
  },
  {
    group: "Form",
    items: [
      { label: "Autocomplete", path: "/playground/components/autocomplete" },
      { label: "Checkbox", path: "/playground/components/checkbox" },
      { label: "ColorPicker", path: "/playground/components/color-picker" },
      { label: "DatePicker", path: "/playground/components/date-picker" },
      { label: "DatePickerRange", path: "/playground/components/date-picker-range" },
      { label: "FileInput", path: "/playground/components/file-input" },
      { label: "FileInputZone", path: "/playground/components/file-input-zone" },
      { label: "Input", path: "/playground/components/input" },
      { label: "Label", path: "/playground/components/label" },
      { label: "Select", path: "/playground/components/select" },
      { label: "Switch", path: "/playground/components/switch" },
      { label: "Textarea", path: "/playground/components/textarea" },
    ],
  },
  {
    group: "Controls",
    items: [
      { label: "MonthSlider", path: "/playground/components/month-slider" },
      { label: "YearSlider", path: "/playground/components/year-slider" },
      { label: "Calendar", path: "/playground/components/calendar" },
      { label: "DropdownMenu", path: "/playground/components/dropdown-menu" },
      { label: "Pagination", path: "/playground/components/pagination" },
    ],
  },
  {
    group: "Information",
    items: [
      { label: "Alert", path: "/playground/components/alert" },
      { label: "Badge", path: "/playground/components/badge" },
      { label: "Card", path: "/playground/components/card" },
    ],
  },
  {
    group: "Markdown",
    items: [
      { label: "Markdown", path: "/playground/components/markdown" },
      { label: "CodeBlock", path: "/playground/components/codeblock" },
      { label: "Blockquote", path: "/playground/components/blockquote" },
    ],
  },
  {
    group: "Overlay",
    items: [
      { label: "Modal", path: "/playground/components/modal" },
      { label: "Collapse", path: "/playground/components/collapse" },
      { label: "Dropdown", path: "/playground/components/dropdown" },
    ],
  },
  {
    group: "Data",
    items: [
      { label: "Table", path: "/playground/components/table" },
      { label: "AdvancedTable", path: "/playground/components/advanced-table" },
      { label: "EditableRow", path: "/playground/components/editable-row" },
    ],
  },
  {
    group: "Root",
    items: [{ label: "Tabs", path: "/playground/components/tabs" }],
  },
  {
    group: "Lab",
    items: [{ label: "Navbar", path: "/playground/components/navbar" }],
  },
];
</script>

<template>
  <section class="home">
    <header class="home-topbar">
      <span class="home-brand">ComegenUI</span>
      <ToggleColorSheme />
    </header>

    <main class="home-main">
      <section class="home-hero">
        <div class="home-hero-copy">
          <h1 class="home-hero-title">Componentes para llevar.</h1>
          <p class="home-hero-tagline">
            Lib de Web Components hecha en Vue 3: importalos como componentes
            Vue o soltalos como custom elements en HTML plano. Temas incluidos.
          </p>
          <div class="home-hero-actions">
            <Button color="primary" variant="solid" to="/playground/components/button">
              Ver la documentación
            </Button>
            <Button color="neutral" variant="outlined" to="/playground/theme-builder">
              Theme Builder
            </Button>
          </div>
        </div>

        <div class="home-vitrina" aria-label="Componentes en vivo">
          <div class="home-vitrina-row">
            <Input v-model="demoValue" start-value="" placeholder="Escribí algo…" />
          </div>
          <div class="home-vitrina-row">
            <Switch v-model="notifications" color="primary" />
            <span class="home-vitrina-label">Notificaciones</span>
          </div>
          <div class="home-vitrina-row">
            <Checkbox v-model="keepSession" color="primary" />
            <span class="home-vitrina-label">Mantener la sesión abierta</span>
          </div>
          <div class="home-vitrina-row">
            <span class="home-vitrina-eco">{{ demoValue || "El input va llegando acá…" }}</span>
          </div>
        </div>
      </section>

      <section class="home-usage">
        <h2 class="home-heading">Dos formas de traerla</h2>
        <div class="home-usage-grid">
          <div class="home-usage-col">
            <h3 class="home-usage-label">Script directo</h3>
            <pre class="home-code"><code>&lt;body&gt;
  &lt;script src="comegenui/CuButton.umd.js"&gt;&lt;/script&gt;
  &lt;cu-button color="primary"&gt;Click me&lt;/cu-button&gt;
&lt;/body&gt;</code></pre>
          </div>
          <div class="home-usage-col">
            <h3 class="home-usage-label">Bundler</h3>
            <pre class="home-code"><code>import "comegenui/CuButton.umd.js";
// y en cualquier template:
// &lt;cu-button color="primary"&gt;Click me&lt;/cu-button&gt;</code></pre>
          </div>
        </div>
      </section>

      <section class="home-index">
        <div class="home-index-head">
          <h2 class="home-heading">Índice</h2>
          <p class="home-index-note">
            Cada componente tiene su página en el playground: props, eventos y
            demos en vivo.
          </p>
        </div>
        <div class="home-index-grid">
          <div v-for="group in indexGroups" :key="group.group" class="home-index-group">
            <h3 class="home-index-group-label">{{ group.group }}</h3>
            <RouterLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="home-index-link"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="home-footer">
      <p>Esta página está hecha con la lib.</p>
    </footer>
  </section>
</template>

<style scoped>
.home {
  width: 100dvw;
  height: 100dvh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--cu-color-surface);
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
  box-sizing: border-box;
}

.home :is(h1, h2, h3, p, span) {
  margin: 0;
  color: inherit;
}

.home-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.home-brand {
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: -0.01em;
}

.home-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
  padding: 4rem 2.5rem 5rem;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  box-sizing: border-box;
}

.home-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 3rem;
  align-items: center;
}

.home-hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}

.home-hero-title {
  font-size: clamp(2.5rem, 5.5vw, 4rem);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.home-hero-tagline {
  font-size: var(--cu-font-size-md);
  line-height: var(--cu-line-height-relaxed);
  opacity: 0.75;
  max-width: 32rem;
}

.home-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.home-vitrina {
  display: flex;
  flex-direction: column;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  padding: 0.25rem 1.5rem;
}

.home-vitrina-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 0;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.home-vitrina-row:last-child {
  border-bottom: none;
}

.home-vitrina-label {
  font-size: var(--cu-font-size-sm);
}

.home-vitrina-eco {
  font-size: var(--cu-font-size-sm);
  opacity: 0.55;
}

.home-heading {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: -0.01em;
}

.home-usage {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-usage-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.home-usage-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-usage-label {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  opacity: 0.7;
}

.home-code {
  margin: 0;
  padding: 1rem 1.25rem;
  background-color: var(--cu-code-bg);
  color: var(--cu-code-text);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  line-height: var(--cu-line-height-relaxed);
  border-radius: var(--cu-radius);
  overflow-x: auto;
  box-sizing: border-box;
}

.home-index {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-index-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.home-index-note {
  font-size: var(--cu-font-size-sm);
  opacity: 0.6;
}

.home-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 2rem 1.5rem;
}

.home-index-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.home-index-group-label {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  padding-bottom: 0.4rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.home-index-link {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  width: fit-content;
  transition: color 150ms ease;
}

.home-index-link:hover {
  color: var(--cu-color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.home-index-link:focus-visible,
.home-hero-actions :focus-visible {
  outline: 2px solid var(--cu-color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.home-footer {
  padding: 1.25rem 2.5rem;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}

.home-footer p {
  font-size: var(--cu-font-size-sm);
  opacity: 0.55;
}

@media (max-width: 56rem) {
  .home-hero {
    grid-template-columns: 1fr;
  }
  .home-usage-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home * {
    transition: none !important;
  }
}
</style>
