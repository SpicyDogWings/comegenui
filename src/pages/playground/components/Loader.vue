<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Loader from "@/components/overlay/Loader.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Loading Animation', id: 'loading' },
  { label: 'Cooldown Animation', id: 'cooldown' },
  { label: 'Colors', id: 'colors' },
];

const cooldownKey = ref(0);
const showCooldown = ref(true);

function restartCooldown() {
  cooldownKey.value++;
  showCooldown.value = true;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"];
</script>

<template>
  <PlaygroundLayout title="Loader" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="loading" class="playground-section">
        <h2>Loading Animation</h2>
        <p class="playground-desc">Barra de carga infinita (slide de izquierda a derecha). Usada en tablas, dropdowns, etc.</p>
        <div class="playground-demo-box">
          <Loader color="primary" animation="loading" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="cooldown" class="playground-section">
        <h2>Cooldown Animation</h2>
        <p class="playground-desc">Barra que se vacía en el tiempo configurable. Se reinicia con cada tecla (estilo select nativo).</p>
        <div class="playground-demo-box">
          <Loader
            v-if="showCooldown"
            :key="cooldownKey"
            color="primary"
            animation="cooldown"
            :delay="2000"
          />
        </div>
        <div class="playground-row">
          <Button color="primary" variant="soft" @click="restartCooldown">
            Reiniciar cooldown
          </Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-grid">
          <div v-for="color in colors" :key="color">
            <span class="playground-label">{{ color }}</span>
            <div class="playground-demo-box">
              <Loader :color="color" animation="loading" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-demo-box {
  position: relative;
  height: 3px;
  background: var(--cu-color-neutral-subtle, rgba(0, 0, 0, 0.06));
  border-radius: 2px;
  overflow: hidden;
  min-width: 200px;
}

.playground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.playground-label {
  display: block;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}
</style>
