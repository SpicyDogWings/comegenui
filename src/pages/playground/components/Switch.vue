<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const checked1 = ref(false);
const checked2 = ref(true);
const switchRefs = ref<(InstanceType<typeof Switch> | null)[]>([]);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
];
</script>

<template>
  <PlaygroundLayout title="Switch" :outlineItems="outlineItems">
    <div class="playground-switch">

      <!-- Default -->
      <section id="default" class="playground-switch-section">
        <h2>Default</h2>
        <div class="playground-switch-row">
          <Switch v-model="checked1" />
          <span class="playground-switch-label">{{ checked1 ? 'ON' : 'OFF' }}</span>
        </div>
        <div class="playground-switch-row">
          <Switch v-model="checked2" />
          <span class="playground-switch-label">{{ checked2 ? 'ON' : 'OFF' }}</span>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Sizes -->
      <section id="sizes" class="playground-switch-section">
        <h2>Sizes</h2>
        <div class="playground-switch-row playground-switch-row--horizontal">
          <div class="playground-switch-item">
            <Switch size="md" />
            <span class="playground-switch-label">md (default)</span>
          </div>
          <div class="playground-switch-item">
            <Switch size="sm" />
            <span class="playground-switch-label">sm</span>
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Colors -->
      <section id="colors" class="playground-switch-section">
        <h2>Colors</h2>
        <div class="playground-switch-row playground-switch-row--horizontal">
          <div v-for="color in colors" :key="color" class="playground-switch-item">
            <Switch :color="color" :ref="(el) => switchRefs[colors.indexOf(color)] = el" />
            <span class="playground-switch-label">{{ color }}</span>
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-switch-section">
        <h2>Disabled</h2>
        <div class="playground-switch-row playground-switch-row--horizontal">
          <div class="playground-switch-item">
            <Switch disabled />
            <span class="playground-switch-label">OFF (disabled)</span>
          </div>
          <div class="playground-switch-item">
            <Switch :model-value="true" disabled />
            <span class="playground-switch-label">ON (disabled)</span>
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programmatic -->
      <section id="programmatic" class="playground-switch-section">
        <h2>Programmatic Control</h2>
        <div class="playground-switch-row">
          <div class="playground-switch-item">
            <Switch :ref="(el) => switchRefs[6] = el" />
            <span class="playground-switch-label">Programmatic switch</span>
          </div>
          <div class="playground-switch-btn-group">
            <button @click="switchRefs[6]?.set(true)" class="playground-switch-btn">set(true)</button>
            <button @click="switchRefs[6]?.set(false)" class="playground-switch-btn">set(false)</button>
            <button @click="switchRefs[6]?.reset()" class="playground-switch-btn">reset()</button>
          </div>
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-switch {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-switch h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-switch-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-switch-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.playground-switch-row--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.playground-switch-item {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.playground-switch-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-switch-btn-group {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}

.playground-switch-btn {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background: var(--cu-color-surface);
  cursor: pointer;
}

.playground-switch-btn:hover {
  background: var(--cu-color-neutral-soft);
}

.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}
</style>
