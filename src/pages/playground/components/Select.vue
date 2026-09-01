<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Select from "@/components/form/Select.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Selected Value', id: 'selected' },
  { label: 'Searchable', id: 'searchable' },
];

const selected = ref("opt1");
const searchSelected = ref("");
const options = [
  { value: "opt1", label: "Option 1" },
  { value: "opt2", label: "Option 2" },
  { value: "opt3", label: "Option 3" },
  { value: "opt4", label: "Option 4 (disabled)", disabled: true },
];

const countryOptions = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "co", label: "Colombia" },
  { value: "ec", label: "Ecuador" },
  { value: "mx", label: "México" },
  { value: "pe", label: "Perú" },
  { value: "uy", label: "Uruguay" },
  { value: "ve", label: "Venezuela" },
  { value: "py", label: "Paraguay" },
  { value: "bo", label: "Bolivia" },
];
</script>

<template>
  <PlaygroundLayout title="Select" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Select variant="soft" :options="options" placeholder="soft (default)" style="max-width:200px" />
          <Select variant="outlined" :options="options" placeholder="outlined" style="max-width:200px" />
          <Select variant="ghost" :options="options" placeholder="ghost" style="max-width:200px" />
          <Select variant="subtle" :options="options" placeholder="subtle" style="max-width:200px" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Select color="primary" :options="options" placeholder="primary" style="max-width:200px" />
          <Select color="secondary" :options="options" placeholder="secondary" style="max-width:200px" />
          <Select color="neutral" :options="options" placeholder="neutral" style="max-width:200px" />
          <Select color="success" :options="options" placeholder="success" style="max-width:200px" />
          <Select color="warning" :options="options" placeholder="warning" style="max-width:200px" />
          <Select color="danger" :options="options" placeholder="danger" style="max-width:200px" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <Select color="primary" disabled :options="options" placeholder="Disabled" style="max-width:300px" />
      </section>

      <hr class="playground-separator" />

      <section id="selected" class="playground-section">
        <h2>Selected Value (v-model)</h2>
        <div class="playground-col">
          <Select v-model="selected" :options="options" style="max-width:300px" />
          <p class="playground-code">Selected: {{ selected }}</p>
          <div class="playground-row" style="margin-top: 8px; gap: 8px;">
            <Button color="neutral" variant="ghost" @click="selected = 'opt1'">Set Option 1</Button>
            <Button color="neutral" variant="ghost" @click="selected = 'opt2'">Set Option 2</Button>
            <Button color="neutral" variant="ghost" @click="selected = 'opt3'">Set Option 3</Button>
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="searchable" class="playground-section">
        <h2>Searchable (searchEnabled)</h2>
        <p class="playground-code">
          Prop <code>searchEnabled</code> muestra un input dentro del dropdown para filtrar opciones.
          Escribe para filtrar la lista en tiempo real.
        </p>
        <div class="playground-col">
          <Select
            v-model="searchSelected"
            :options="countryOptions"
            search-enabled
            placeholder="Buscar país..."
            style="max-width:300px"
          />
          <p class="playground-code">Selected: {{ searchSelected || '(ninguno)' }}</p>
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
