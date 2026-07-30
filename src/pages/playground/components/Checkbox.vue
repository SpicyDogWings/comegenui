<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { ref } from "vue";

const checked1 = ref(false);
const checked2 = ref(true);
const checkboxRefs = ref<(InstanceType<typeof Checkbox> | null)[]>([]);

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
  <PlaygroundLayout title="Checkbox" :outlineItems="outlineItems">
    <div class="playground-checkbox">
      <section id="default" class="playground-checkbox-section">
        <h2>Default</h2>
        <div class="playground-checkbox-row">
          <Checkbox v-model="checked1" label="Accept terms" />
          <span class="playground-checkbox-label">{{ checked1 ? 'checked' : 'unchecked' }}</span>
        </div>
        <div class="playground-checkbox-row">
          <Checkbox v-model="checked2" label="Pre-checked" />
          <span class="playground-checkbox-label">{{ checked2 ? 'checked' : 'unchecked' }}</span>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Sizes -->
      <section id="sizes" class="playground-checkbox-section">
        <h2>Sizes</h2>
        <div class="playground-checkbox-row playground-checkbox-row--horizontal">
          <Checkbox size="md" label="md (default)" />
          <Checkbox size="sm" label="sm" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-checkbox-section">
        <h2>Colors</h2>
        <div class="playground-checkbox-row playground-checkbox-row--horizontal">
          <div v-for="color in colors" :key="color" class="playground-checkbox-item">
            <Checkbox :color="color" :label="color" :ref="(el) => checkboxRefs[colors.indexOf(color)] = el" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-checkbox-section">
        <h2>Disabled</h2>
        <div class="playground-checkbox-row playground-checkbox-row--horizontal">
          <Checkbox disabled label="Disabled unchecked" />
          <Checkbox :model-value="true" disabled label="Disabled checked" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-checkbox-section">
        <h2>Programmatic Control</h2>
        <div class="playground-checkbox-row">
          <Checkbox :ref="(el) => checkboxRefs[6] = el" label="Programmatic checkbox" />
          <div class="playground-checkbox-btn-group">
            <button @click="checkboxRefs[6]?.set(true)" class="playground-checkbox-btn">set(true)</button>
            <button @click="checkboxRefs[6]?.set(false)" class="playground-checkbox-btn">set(false)</button>
            <button @click="checkboxRefs[6]?.reset()" class="playground-checkbox-btn">reset()</button>
          </div>
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-checkbox {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}
.playground-checkbox h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}
.playground-checkbox-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.playground-checkbox-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.playground-checkbox-row--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}
.playground-checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}
.playground-checkbox-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}
.playground-checkbox-btn-group {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}
.playground-checkbox-btn {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background: var(--cu-color-surface);
  cursor: pointer;
}
.playground-checkbox-btn:hover {
  background: var(--cu-color-neutral-soft);
}
.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}
</style>
