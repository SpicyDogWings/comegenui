<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Modal from "@/components/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const defaultModalRef = ref<InstanceType<typeof Modal> | null>(null);
const persistentModalRef = ref<InstanceType<typeof Modal> | null>(null);
const colorModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const sizeModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const heightModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const programmaticModalRef = ref<InstanceType<typeof Modal> | null>(null);
const programmaticIsOpen = ref(false);
const iconModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);

const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const heights = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const iconExamples = [
  {
    color: "success" as const,
    title: "Success",
    description: "The operation completed successfully.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
  },
  {
    color: "warning" as const,
    title: "Warning",
    description: "Please review before continuing.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  },
  {
    color: "danger" as const,
    title: "Danger",
    description: "This action cannot be undone.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  },
];

function updateProgrammaticState() {
  programmaticIsOpen.value = programmaticModalRef.value?.isOpen ?? false;
}

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Icon', id: 'icons' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Heights', id: 'heights' },
  { label: 'Persistent', id: 'persistent' },
  { label: 'Programmatic', id: 'programmatic' },
];
</script>

<template>
  <PlaygroundLayout title="Modal" :outlineItems="outlineItems">
    <div class="playground-modal">

      <!-- Default -->
      <section id="default" class="playground-modal-section">
        <h2>Default</h2>
        <div class="playground-modal-row">
          <Button @click="defaultModalRef?.open()" color="primary" variant="solid">
            Open Modal
          </Button>
          <Modal ref="defaultModalRef" title="Default Modal" description="This is a default modal dialog.">
            <p>Modal content goes here. You can put any content inside the default slot.</p>
            <template #footer>
              <div class="playground-modal-footer-actions">
                <Button @click="defaultModalRef?.close()" color="neutral" variant="ghost">Cancel</Button>
                <Button @click="defaultModalRef?.close()" color="primary" variant="solid">Confirm</Button>
              </div>
            </template>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Colors -->
      <section id="colors" class="playground-modal-section">
        <h2>Colors</h2>
        <div class="playground-modal-row playground-modal-row--horizontal">
          <Button
            v-for="(color, index) in colors"
            :key="color"
            @click="colorModalRefs[index]?.open()"
            :color="color"
            variant="solid"
          >
            {{ color }}
          </Button>
          <Modal
            v-for="(color, index) in colors"
            :key="'modal-' + color"
            :ref="(el) => colorModalRefs[index] = el"
            :color="color"
            :title="color.charAt(0).toUpperCase() + color.slice(1) + ' Modal'"
          >
            <p>The title uses the <strong>{{ color }}</strong> color token. Background is always surface.</p>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- With Icon -->
      <section id="icons" class="playground-modal-section">
        <h2>With Icon</h2>
        <div class="playground-modal-row">
          <Button @click="iconModalRefs[0]?.open()" color="success" variant="solid">
            Success
          </Button>
          <Button @click="iconModalRefs[1]?.open()" color="warning" variant="solid">
            Warning
          </Button>
          <Button @click="iconModalRefs[2]?.open()" color="danger" variant="solid">
            Danger
          </Button>
          <Modal
            v-for="(item, index) in iconExamples"
            :key="item.color"
            :ref="(el) => iconModalRefs[index] = el"
            :color="item.color"
            :title="item.title"
          >
            <template #icon>
              <span v-html="item.icon"></span>
            </template>
            <p>{{ item.description }}</p>
            <template #footer>
              <div class="playground-modal-footer-actions">
                <Button @click="iconModalRefs[index]?.close()" :color="item.color" variant="solid">OK</Button>
              </div>
            </template>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Sizes -->
      <section id="sizes" class="playground-modal-section">
        <h2>Sizes</h2>
        <div class="playground-modal-row playground-modal-row--horizontal">
          <Button
            v-for="(size, index) in sizes"
            :key="size"
            @click="sizeModalRefs[index]?.open()"
            color="primary"
            variant="outlined"
          >
            {{ size }}
          </Button>
          <Modal
            v-for="(size, index) in sizes"
            :key="'size-' + size"
            :ref="(el) => sizeModalRefs[index] = el"
            :size="size"
            :title="'Size: ' + size"
          >
            <p>This modal has size <strong>{{ size }}</strong>.</p>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Heights -->
      <section id="heights" class="playground-modal-section">
        <h2>Heights</h2>
        <div class="playground-modal-row playground-modal-row--horizontal">
          <Button
            v-for="(height, index) in heights"
            :key="height"
            @click="heightModalRefs[index]?.open()"
            color="primary"
            variant="outlined"
          >
            {{ height }}
          </Button>
          <Modal
            v-for="(height, index) in heights"
            :key="'height-' + height"
            :ref="(el) => heightModalRefs[index] = el"
            :height="height"
            :title="'Height: ' + height"
          >
            <div style="min-height: 400px;">
              <p>This modal has height <strong>{{ height }}</strong>.</p>
              <p>The content area is tall to demonstrate scrolling behavior.</p>
            </div>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Persistent -->
      <section id="persistent" class="playground-modal-section">
        <h2>Persistent</h2>
        <div class="playground-modal-row">
          <Button @click="persistentModalRef?.open()" color="warning" variant="solid">
            Open Persistent Modal
          </Button>
          <Modal ref="persistentModalRef" title="Persistent Modal" persistent description="Cannot be closed by clicking outside or pressing Escape.">
            <p>Try clicking the backdrop or pressing Escape — it won't close.</p>
            <p>You must use the button below to close this modal.</p>
            <template #footer>
              <Button @click="persistentModalRef?.close()" color="warning" variant="solid">Got it</Button>
            </template>
          </Modal>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programmatic Control -->
      <section id="programmatic" class="playground-modal-section">
        <h2>Programmatic Control</h2>
        <div class="playground-modal-row">
          <div class="playground-modal-btn-group">
            <Button @click="programmaticModalRef?.open(); updateProgrammaticState()" color="primary" variant="solid">
              open()
            </Button>
            <Button @click="programmaticModalRef?.close(); updateProgrammaticState()" color="neutral" variant="ghost">
              close()
            </Button>
            <Button @click="programmaticModalRef?.toggle(); updateProgrammaticState()" color="primary" variant="outlined">
              toggle()
            </Button>
          </div>
          <p class="playground-modal-state">isOpen: <strong>{{ programmaticIsOpen }}</strong></p>
          <Modal
            ref="programmaticModalRef"
            title="Programmatic Modal"
            @opened="programmaticIsOpen = true"
            @closed="programmaticIsOpen = false"
          >
            <p>This modal is controlled programmatically via <code>open()</code>, <code>close()</code>, and <code>toggle()</code> methods.</p>
          </Modal>
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-modal h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-modal-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-modal-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.playground-modal-row--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.playground-modal-footer-actions {
  display: flex;
  gap: var(--cu-space-sm);
  justify-content: flex-end;
}

.playground-modal-btn-group {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}

.playground-modal-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}

.playground-separator {
  border: none;
  border-top: 1px solid var(--cu-border-color);
  margin: 0;
}
</style>
