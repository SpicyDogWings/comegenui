<script setup lang="ts">
import Checkbox from "./components/form/Checkbox.ce.vue";

const variants = ["outlined", "soft", "ghost", "subtle", "none"] as const;
const colors = ["primary", "neutral", "success", "warning", "danger"] as const;
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Checkbox Demo - All Variants & Colors</h1>

    <div v-for="variant in variants" :key="variant" class="mb-8">
      <h2 class="text-lg font-semibold mb-4 capitalized">
        Variant: {{ variant }}
      </h2>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="color in colors"
          :key="color"
          class="flex flex-col items-center gap-2"
        >
          <span class="text-sm text-charcoal-600 capitalized">{{ color }}</span>
          <Checkbox
            :variant="variant"
            :color="color"
            :checked="true"
            :label="`${variant}-${color}`"
          />
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h2 class="text-lg font-semibold mb-4">States Demo</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium mb-2">Checked (primary / outlined)</h3>
          <Checkbox variant="outlined" color="primary" :checked="true" label="Checked" />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-2">Unchecked (primary / outlined)</h3>
          <Checkbox variant="outlined" color="primary" :checked="true" label="Unchecked" />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-2">Disabled (checked)</h3>
          <Checkbox variant="outlined" color="primary" :checked="true" :disabled="true" label="Disabled checked" />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-2">Disabled (unchecked)</h3>
          <Checkbox variant="outlined" color="primary" :checked="true" :disabled="true" label="Disabled unchecked" />
        </div>
        <div>
          <h3 class="text-sm font-medium mb-2">All variants (primary)</h3>
          <div class="space-y-2">
            <Checkbox v-for="v in variants" :key="v" :variant="v" color="primary" :checked="true" :label="v" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
