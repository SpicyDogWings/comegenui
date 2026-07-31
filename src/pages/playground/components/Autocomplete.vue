<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Autocomplete from "@/components/form/Autocomplete.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Min Chars', id: 'min-chars' },
];

const selected = ref("ts");
const items = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rs" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
];
</script>

<template>
  <PlaygroundLayout title="Autocomplete" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Autocomplete variant="soft" :items="items" placeholder="soft (default)" style="max-width:200px" />
          <Autocomplete variant="outlined" :items="items" placeholder="outlined" style="max-width:200px" />
          <Autocomplete variant="ghost" :items="items" placeholder="ghost" style="max-width:200px" />
          <Autocomplete variant="subtle" :items="items" placeholder="subtle" style="max-width:200px" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Autocomplete color="primary" :items="items" placeholder="primary" style="max-width:200px" />
          <Autocomplete color="secondary" :items="items" placeholder="secondary" style="max-width:200px" />
          <Autocomplete color="neutral" :items="items" placeholder="neutral" style="max-width:200px" />
          <Autocomplete color="success" :items="items" placeholder="success" style="max-width:200px" />
          <Autocomplete color="warning" :items="items" placeholder="warning" style="max-width:200px" />
          <Autocomplete color="danger" :items="items" placeholder="danger" style="max-width:200px" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <Autocomplete color="primary" disabled :items="items" placeholder="Disabled" style="max-width:300px" />
      </section>

      <hr class="playground-separator" />

      <section id="min-chars" class="playground-section">
        <h2>Min Chars (2)</h2>
        <Autocomplete :items="items" :min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px" />
      </section>

      <hr class="playground-separator" />

      <section id="selected" class="playground-section">
        <h2>With Value (v-model)</h2>
        <div class="playground-col">
          <Autocomplete v-model="selected" :items="items" placeholder="Search..." style="max-width:300px" />
          <p class="playground-code">Selected: {{ selected }}</p>
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
