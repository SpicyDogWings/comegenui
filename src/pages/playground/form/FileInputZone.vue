<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import FileInputZone from "@/components/form/FileInputZone.vue";
import { ref } from "vue";

const files1 = ref<File | File[] | null>(null);
const files2 = ref<File | File[] | null>(null);
const files3 = ref<File | File[] | null>(null);
const fileZoneRef = ref<InstanceType<typeof FileInputZone> | null>(null);

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Multiple', id: 'multiple' },
  { label: 'With Accept', id: 'accept' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
];
</script>

<template>
  <PlaygroundLayout title="FileInputZone" :outlineItems="outlineItems">
    <div class="playground-file-zone">

      <!-- Default -->
      <section id="default" class="playground-file-zone-section">
        <h2>Default</h2>
        <div class="playground-file-zone-row">
          <FileInputZone v-model="files1" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Multiple -->
      <section id="multiple" class="playground-file-zone-section">
        <h2>Multiple</h2>
        <div class="playground-file-zone-row">
          <FileInputZone v-model="files2" multiple placeholder="Sube varios archivos" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- With Accept -->
      <section id="accept" class="playground-file-zone-section">
        <h2>With Accept</h2>
        <div class="playground-file-zone-row">
          <FileInputZone v-model="files3" accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-file-zone-section">
        <h2>Disabled</h2>
        <div class="playground-file-zone-row">
          <FileInputZone disabled placeholder="No disponible" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programmatic -->
      <section id="programmatic" class="playground-file-zone-section">
        <h2>Programmatic Control</h2>
        <div class="playground-file-zone-row">
          <FileInputZone ref="fileZoneRef" />
          <div class="playground-file-zone-btn-group">
            <button @click="fileZoneRef?.trigger()" class="playground-file-zone-btn">trigger()</button>
            <button @click="fileZoneRef?.reset()" class="playground-file-zone-btn">reset()</button>
          </div>
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-file-zone {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
}

.playground-file-zone h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-file-zone-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-file-zone-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.playground-file-zone-btn-group {
  display: flex;
  gap: var(--cu-space-sm);
}

.playground-file-zone-btn {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  border: var(--cu-border-thin) solid var(--cu-border-color);
  background: var(--cu-color-surface);
  cursor: pointer;
}

.playground-file-zone-btn:hover {
  background: var(--cu-color-neutral-soft);
}

.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}
</style>
