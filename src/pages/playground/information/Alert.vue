<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const showAlert = ref(true);

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Close', id: 'close' },
  { label: 'v-model:show', id: 'toggle' },
  { label: 'With Icon', id: 'icons' },
];
</script>

<template>
  <PlaygroundLayout title="Alert" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-col">
          <Alert title="Solid" color="primary" variant="solid">This is a solid alert.</Alert>
          <Alert title="Soft" color="primary" variant="soft">This is a soft alert.</Alert>
          <Alert title="Ghost" color="primary" variant="ghost">This is a ghost alert.</Alert>
          <Alert title="Subtle" color="primary" variant="subtle">This is a subtle alert.</Alert>
          <Alert title="Outlined" color="primary" variant="outlined">This is an outlined alert.</Alert>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-col">
          <Alert title="Primary" color="primary">Primary alert</Alert>
          <Alert title="Secondary" color="secondary">Secondary alert</Alert>
          <Alert title="Neutral" color="neutral">Neutral alert</Alert>
          <Alert title="Success" color="success">Success alert</Alert>
          <Alert title="Warning" color="warning">Warning alert</Alert>
          <Alert title="Danger" color="danger">Danger alert</Alert>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="close" class="playground-section">
        <h2>With Close</h2>
        <Alert title="Closeable" color="primary" close>Click the X to close this alert.</Alert>
      </section>

      <hr class="playground-separator" />

      <section id="toggle" class="playground-section">
        <h2>v-model:show</h2>
        <div class="playground-col">
          <Button @click="showAlert = !showAlert">Toggle Alert ({{ showAlert ? 'visible' : 'hidden' }})</Button>
          <Alert v-model:show="showAlert" title="Toggleable" color="success" close>This alert is controlled via v-model:show.</Alert>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <h2>With Icon</h2>
        <Alert title="Info" color="primary" variant="soft">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </template>
          This alert has an icon in the title.
        </Alert>
      </section>
    </div>
  </PlaygroundLayout>
</template>
