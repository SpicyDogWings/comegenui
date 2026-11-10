<script setup lang="ts">
import { Button } from "../src";
import { useTheme } from "@comegenui/tokens";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "ghost", "subtle", "link"] as const;
const sizes = ["sm", "md", "lg"] as const;

const { theme, toggleTheme } = useTheme({
  themes: ["light", "dark"],
  defaultTheme: "light",
});
</script>

<template>
  <main>
    <header>
      <h1>Button</h1>
      <Button variant="outlined" @click="toggleTheme">Tema: {{ theme }}</Button>
    </header>

    <section v-for="variant in variants" :key="variant">
      <h2>{{ variant }}</h2>
      <div class="row">
        <Button v-for="color in colors" :key="color" :color="color" :variant="variant">
          {{ color }}
        </Button>
      </div>
    </section>

    <section>
      <h2>sizes</h2>
      <div class="row">
        <Button v-for="size in sizes" :key="size" :size="size" variant="solid" color="primary">
          {{ size }}
        </Button>
      </div>
    </section>

    <section>
      <h2>estados</h2>
      <div class="row">
        <Button loading color="primary" variant="solid">loading</Button>
        <Button disabled color="danger" variant="solid">disabled</Button>
        <Button to="/destino" variant="link" color="primary">link</Button>
        <Button icon-only aria-label="Icono" variant="soft" color="success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </Button>
      </div>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 2rem;
  font-family: var(--cu-font-family-sans);
  background: var(--cu-color-surface);
  color: var(--cu-color-ink, var(--cu-color-neutral));
}
main {
  display: grid;
  gap: 1.5rem;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h2 {
  font-size: var(--cu-font-size-sm);
  text-transform: uppercase;
  opacity: 0.6;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cu-space-2);
  align-items: center;
}
</style>
