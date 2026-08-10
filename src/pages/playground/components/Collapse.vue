<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof Collapse> | null>(null);
const programmaticIsOpen = ref(false);

function updateProgrammaticState() {
  programmaticIsOpen.value = programmaticRef.value?.isOpen() ?? false;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Default Open', id: 'default-open' },
  { label: 'Colors', id: 'colors' },
  { label: 'Nested', id: 'nested' },
  { label: 'Programmatic', id: 'programmatic' },
];
</script>

<template>
  <PlaygroundLayout title="Collapse" :outlineItems="outlineItems">
    <div class="playground-collapse">

      <!-- Default -->
      <section id="default" class="playground-collapse-section">
        <h2>Default</h2>
        <div class="playground-collapse-col">
          <Collapse label="More information">
            <p>This content is hidden by default and revealed when the trigger is clicked.</p>
            <p>The chevron rotates 90° while the content animates its height.</p>
          </Collapse>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Default Open -->
      <section id="default-open" class="playground-collapse-section">
        <h2>Default Open</h2>
        <div class="playground-collapse-col">
          <Collapse label="Advanced options" :default-open="true">
            <p>Use <code>default-open</code> to render the content expanded on mount.</p>
          </Collapse>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Colors -->
      <section id="colors" class="playground-collapse-section">
        <h2>Colors</h2>
        <div class="playground-collapse-col">
          <Collapse
            v-for="color in colors"
            :key="color"
            :label="`${color.charAt(0).toUpperCase() + color.slice(1)} options`"
            :color="color"
            :default-open="true"
          >
            <p>The trigger uses the <strong>{{ color }}</strong> color token.</p>
          </Collapse>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Nested -->
      <section id="nested" class="playground-collapse-section">
        <h2>Nested</h2>
        <div class="playground-collapse-col">
          <Collapse label="Parent section" color="primary" :default-open="true">
            <p>Collapses can be nested to build menus or accordion-like trees.</p>
            <Collapse label="Child section">
              <p>Deeply nested content with its own toggle.</p>
            </Collapse>
            <Collapse label="Another child" color="success">
              <p>Each level keeps an independent open state.</p>
            </Collapse>
          </Collapse>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programmatic Control -->
      <section id="programmatic" class="playground-collapse-section">
        <h2>Programmatic Control</h2>
        <div class="playground-collapse-col">
          <div class="playground-collapse-row">
            <Button @click="programmaticRef?.open(); updateProgrammaticState()" color="primary" variant="solid">
              open()
            </Button>
            <Button @click="programmaticRef?.close(); updateProgrammaticState()" color="neutral" variant="ghost">
              close()
            </Button>
            <Button @click="programmaticRef?.toggle(); updateProgrammaticState()" color="primary" variant="outlined">
              toggle()
            </Button>
          </div>
          <p class="playground-collapse-state">isOpen: <strong>{{ programmaticIsOpen }}</strong></p>
          <Collapse
            ref="programmaticRef"
            label="Programmatic collapse"
            @toggle="programmaticIsOpen = $event"
          >
            <p>This collapse is controlled programmatically via <code>open()</code>, <code>close()</code>, and <code>toggle()</code> methods, and emits <code>toggle</code> events.</p>
          </Collapse>
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-collapse {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-collapse h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-collapse-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-collapse-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.playground-collapse-row {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}

.playground-collapse-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
