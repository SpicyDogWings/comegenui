<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import FileInput from "@/components/form/FileInput.vue";
import { ref } from "vue";

const file1 = ref<File | null>(null);
const file2 = ref<File | null>(null);
const file3 = ref<File | null>(null);
const fileInputRef = ref<InstanceType<typeof FileInput> | null>(null);

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'With Accept', id: 'accept' },
  { label: 'With Max Size', id: 'maxsize' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
];
</script>

<template>
  <PlaygroundLayout title="FileInput" :outlineItems="outlineItems">
    <div class="playground-file-input">

      <!-- Default -->
      <section id="default" class="playground-file-input-section">
        <h2>Default</h2>
        <div class="playground-file-input-row">
          <FileInput v-model="file1" />
          <p v-if="file1" class="playground-file-input-info">Selected: {{ file1.name }}</p>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- With Accept -->
      <section id="accept" class="playground-file-input-section">
        <h2>With Accept</h2>
        <div class="playground-file-input-row">
          <FileInput v-model="file2" accept=".pdf,.jpg,.png" placeholder="Subir documento" />
          <p v-if="file2" class="playground-file-input-info">Selected: {{ file2.name }}</p>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- With Max Size -->
      <section id="maxsize" class="playground-file-input-section">
        <h2>With Max Size</h2>
        <div class="playground-file-input-row">
          <FileInput v-model="file3" :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB" />
          <p v-if="file3" class="playground-file-input-info">Selected: {{ file3.name }}</p>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-file-input-section">
        <h2>Disabled</h2>
        <div class="playground-file-input-row">
          <FileInput disabled placeholder="No disponible" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programmatic -->
      <section id="programmatic" class="playground-file-input-section">
        <h2>Programmatic Control</h2>
        <div class="playground-file-input-row">
          <FileInput ref="fileInputRef" />
          <div class="playground-file-input-btn-group">
            <button @click="fileInputRef?.trigger()" class="playground-file-input-btn">trigger()</button>
            <button @click="fileInputRef?.reset()" class="playground-file-input-btn">reset()</button>
          </div>
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-file-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.playground-file-input h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-file-input-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-file-input-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.playground-file-input-info {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}

.playground-file-input-btn-group {
  display: flex;
  gap: var(--cu-space-sm);
}

.playground-file-input-btn {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background: var(--cu-color-surface);
  cursor: pointer;
}

.playground-file-input-btn:hover {
  background: var(--cu-color-neutral-soft);
}

.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}
</style>
