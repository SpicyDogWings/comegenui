<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Button from "@/components/buttons/Button.vue";

const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);

function toggleLoading1() {
  loading1.value = true;
  setTimeout(() => { loading1.value = false; }, 2000);
}
function toggleLoading2() {
  loading2.value = true;
  setTimeout(() => { loading2.value = false; }, 2000);
}
function toggleLoading3() {
  loading3.value = true;
  setTimeout(() => { loading3.value = false; }, 2000);
}

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'With Icon', id: 'icons' },
  { label: 'Loading', id: 'loading' },
  { label: 'As Link', id: 'links' },
  { label: 'Full Width', id: 'fullwidth' },
];
</script>

<template>
  <PlaygroundLayout title="Button" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Button color="primary" variant="solid">Solid</Button>
          <Button color="primary" variant="soft">Soft</Button>
          <Button color="primary" variant="ghost">Ghost</Button>
          <Button color="primary" variant="subtle">Subtle</Button>
          <Button color="primary" variant="outlined">Outlined</Button>
          <Button color="primary" variant="link">Link</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="neutral">Neutral</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="danger">Danger</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-row">
          <Button color="primary" disabled>Primary</Button>
          <Button color="secondary" disabled>Secondary</Button>
          <Button color="neutral" disabled>Neutral</Button>
          <Button color="success" disabled>Success</Button>
          <Button color="warning" disabled>Warning</Button>
          <Button color="danger" disabled>Danger</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <h2>Sizes</h2>
        <div class="playground-row playground-row--center">
          <Button color="primary" class="playground-btn-sm">Small</Button>
          <Button color="primary">Medium</Button>
          <Button color="primary" class="playground-btn-lg">Large</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <h2>With Icon</h2>
        <div class="playground-row">
          <Button color="primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            Next
          </Button>
          <Button color="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back
          </Button>
          <Button color="danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Delete
          </Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="loading" class="playground-section">
        <h2>Loading</h2>
        <div class="playground-row">
          <Button color="primary" :loading="loading1" @click="toggleLoading1">
            {{ loading1 ? 'Loading...' : 'Click to Load' }}
          </Button>
          <Button color="secondary" variant="soft" :loading="loading2" @click="toggleLoading2">
            {{ loading2 ? 'Saving...' : 'Save' }}
          </Button>
          <Button color="danger" variant="solid" :loading="loading3" @click="toggleLoading3">
            {{ loading3 ? 'Deleting...' : 'Delete' }}
          </Button>
          <Button color="primary" :loading="true">Always Loading</Button>
          <Button color="primary" loading disabled>Disabled + Loading</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="links" class="playground-section">
        <h2>As Link</h2>
        <div class="playground-row">
          <Button color="primary" to="https://google.com" target="_blank">External Link</Button>
          <Button color="secondary" to="/playground/buttons/button">Internal Link</Button>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="fullwidth" class="playground-section">
        <h2>Full Width</h2>
        <div class="playground-col">
          <Button color="primary" variant="solid" style="width:100%">Full Width Solid</Button>
          <Button color="success" variant="soft" style="width:100%">Full Width Soft</Button>
          <Button color="warning" variant="outlined" style="width:100%">Full Width Outlined</Button>
          <Button color="danger" variant="subtle" style="width:100%">Full Width Subtle</Button>
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
