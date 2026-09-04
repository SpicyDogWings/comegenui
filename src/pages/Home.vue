<script setup lang="ts">
import { computed, ref } from "vue";
import { theme, loaded, setTheme, getThemeNames } from "@/plugins/cu-tokens";
import AppLayout from "@/layouts/AppLayout.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import Alert from "@/components/information/Alert.vue";
import Input from "@/components/form/Input.vue";
import Switch from "@/components/form/Switch.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Markdown from "@/components/markdown/Markdown.vue";

const demoValue = ref("");
const notifications = ref(true);
const keepSession = ref(true);

const themeNames = computed(() => (loaded.value ? getThemeNames() : []));
const currentTheme = computed(() => theme.value);

function prettyTheme(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
</script>

<template>
  <AppLayout>
    <div class="home-scroll">
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
        <Alert color="primary" variant="subtle">
          Hecha para agentes: el zip de la lib viaja con la skill de uso y
          ./update.sh la instala en .agents/skills/ de tu proyecto.
        </Alert>
      </section>

      <section class="home-doc">
        <Markdown>
          # Markdown, tal cual

          Este bloque lo renderiza el componente **Markdown** de la lib: el
          texto va crudo en el slot y sale parseado — headings, **negritas**,
          `código inline`, [links](/playground/components/markdown) y listas
          como esta.

          - Sanitizado con DOMPurify.
          - Renderiza al montar, sin configuración.
        </Markdown>
      </section>

      <section v-if="themeNames.length > 1" class="home-themes">
        <div class="home-themes-head">
          <h2 class="home-heading">Un atributo, todos los temas</h2>
          <p class="home-themes-note">
            Un data-theme cambia todo el ecosistema. Tocá uno para activarlo.
          </p>
        </div>
        <div class="home-themes-grid">
          <div
            v-for="name in themeNames"
            :key="name"
            class="home-theme"
            :class="{ 'home-theme--active': currentTheme === name }"
            :data-theme="name"
            role="button"
            tabindex="0"
            :aria-pressed="currentTheme === name"
            @click="setTheme(name)"
            @keydown.enter.prevent="setTheme(name)"
            @keydown.space.prevent="setTheme(name)"
          >
            <div class="home-theme-samples" inert>
              <div class="home-theme-row">
                <Button color="primary" variant="solid">Botón</Button>
                <Badge color="success" variant="soft">Estable</Badge>
              </div>
              <div class="home-theme-row">
                <Switch :model-value="true" color="primary" />
              </div>
            </div>
            <span class="home-theme-name">{{ prettyTheme(name) }}</span>
          </div>
        </div>
      </section>
    </main>

      <footer class="home-footer">
        <p>Esta página está hecha con la lib.</p>
      </footer>
    </div>
  </AppLayout>
</template>

<style scoped>
.home-scroll {
  flex: 1;
  overflow-y: auto;
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

.home-doc {
  max-width: 42rem;
}

.home-themes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.home-themes-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.home-themes-note {
  font-size: var(--cu-font-size-sm);
  opacity: 0.6;
}

.home-themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

.home-theme {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  background-color: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  cursor: pointer;
  transition: border-color 150ms ease;
}

.home-theme:hover {
  border-color: var(--cu-color-primary);
}

.home-theme:focus-visible {
  outline: 2px solid var(--cu-color-primary);
  outline-offset: 2px;
}

.home-theme--active {
  outline: 2px solid var(--cu-color-primary);
  outline-offset: 2px;
}

.home-theme-samples {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.home-theme-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-theme-name {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
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
