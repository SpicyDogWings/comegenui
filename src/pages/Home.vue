<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import Card from "@/components/information/Card.vue";
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";

const features = [
  {
    color: "primary",
    title: "Web Components",
    description:
      "Custom Elements UMD por componente: un <script> y listo, en HTML plano o cualquier framework.",
  },
  {
    color: "secondary",
    title: "Temas y tokens",
    description:
      "Light, dark y sigacadv2 sobre un sistema de tokens CSS. Un data-theme cambia todo el ecosistema.",
  },
  {
    color: "success",
    title: "Agent-friendly",
    description:
      "La skill de uso viaja dentro del zip de la lib: los agentes del proyecto huésped ya saben consumirla.",
  },
];
</script>

<template>
  <section class="home">
    <header class="home-topbar">
      <div class="home-brand">
        <span class="home-brand-mark">C</span>
        <span class="home-brand-name">ComegenUI</span>
      </div>
      <div class="home-topbar-actions">
        <ToggleColorSheme />
      </div>
    </header>

    <main class="home-main">
      <section class="home-hero">
        <Badge color="primary" variant="subtle">Librería de Web Components</Badge>
        <h1 class="home-hero-title">Componentes que viajan con tu HTML</h1>
        <p class="home-hero-tagline">
          ComegenUI es una librería construida con Vue 3: usala como componentes
          Vue en tu proyecto o como custom elements UMD en cualquier stack, sin
          ataduras.
        </p>
        <div class="home-hero-actions">
          <Button color="primary" variant="solid" to="/playground/components/button">
            Ir a la documentación
          </Button>
          <Button color="neutral" variant="outlined" to="/playground/theme-builder">
            Theme Builder
          </Button>
        </div>
      </section>

      <section class="home-demo" aria-label="Demo en vivo">
        <div class="home-demo-row">
          <Button color="primary" variant="solid">Primary</Button>
          <Button color="success" variant="soft">Success</Button>
          <Button color="warning" variant="subtle">Warning</Button>
          <Button color="danger" variant="outlined">Danger</Button>
          <Button color="neutral" variant="ghost">Ghost</Button>
          <Badge color="primary" variant="subtle">En lib</Badge>
          <Badge color="success" variant="soft">v2.x</Badge>
        </div>
        <pre class="home-demo-code"><code>&lt;script src="dist/CuButton.umd.js"&gt;&lt;/script&gt;
&lt;cu-button color="primary"&gt;Click me&lt;/cu-button&gt;</code></pre>
      </section>

      <section class="home-features">
        <Card
          v-for="feature in features"
          :key="feature.title"
          :color="feature.color"
          variant="subtle"
          :title="feature.title"
        >
          {{ feature.description }}
        </Card>
      </section>
    </main>

    <footer class="home-footer">
      <p>Vue 3 + Custom Elements + UnoCSS · build UMD por componente</p>
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
  padding: 1rem 2rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.home-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.home-brand-mark {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  border-radius: var(--cu-radius);
  background: linear-gradient(135deg, var(--cu-color-primary), var(--cu-color-secondary));
  color: var(--cu-color-primary-text);
  font-weight: var(--cu-font-weight-bold);
  font-size: var(--cu-font-size-md);
}

.home-brand-name {
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-semibold);
}

.home-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 4.5rem 2rem;
}

.home-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 46rem;
}

.home-hero-title {
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: var(--cu-font-weight-bold);
  line-height: 1.1;
  background: linear-gradient(120deg, var(--cu-color-primary), var(--cu-color-secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.home-hero-tagline {
  font-size: var(--cu-font-size-md);
  line-height: var(--cu-line-height-relaxed);
  opacity: 0.7;
  max-width: 38rem;
}

.home-hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.home-demo {
  width: 100%;
  max-width: 52rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-lg);
  box-sizing: border-box;
}

.home-demo-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.home-demo-code {
  width: 100%;
  margin: 0;
  padding: 1rem 1.25rem;
  background-color: var(--cu-color-neutral);
  color: var(--cu-color-surface);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  line-height: var(--cu-line-height-relaxed);
  border-radius: var(--cu-radius);
  box-sizing: border-box;
}

.home-features {
  width: 100%;
  max-width: 60rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.home-footer {
  padding: 1.5rem 2rem;
  text-align: center;
}

.home-footer p {
  font-size: var(--cu-font-size-sm);
  opacity: 0.5;
}
</style>
