<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'
import Input from '@/components/form/Input.vue'
import CodeBlock from '@/components/markdown/CodeBlock.vue'

interface ThemeConfig {
  themes: Record<string, Record<string, string>>
  typography: Record<string, any>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: { color: string }
  borders: { width: Record<string, string>, color: Record<string, string> }
}

const props = defineProps<{
  themeName: string
  cssOutput: string
}>()

const emit = defineEmits<{
  (e: 'update:themeName', value: string): void
  (e: 'import', config: ThemeConfig): void
  (e: 'export'): void
  (e: 'reset'): void
  (e: 'copy-css'): void
  (e: 'download-css'): void
}>()

const modalRef = ref<InstanceType<typeof Modal> | null>(null)
const importFileInput = ref<HTMLInputElement | null>(null)

function open() {
  modalRef.value?.open()
}

function close() {
  modalRef.value?.close()
}

function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target?.result as string) as ThemeConfig
      emit('import', config)
    } catch {
      alert('Invalid JSON file')
    }
  }
  reader.readAsText(file)
  input.value = ''
}

defineExpose({ open, close })
</script>

<template>
  <Modal ref="modalRef" title="Export" size="full" height="xl" @close="close">
    <div class="tm-layout">
      <div class="tm-sidebar">
        <div class="tm-section">
          <h3>Theme Name</h3>
          <Input
            :model-value="themeName"
            @update:model-value="emit('update:themeName', $event)"
            placeholder="my-theme"
          />
        </div>

        <div class="tm-section">
          <h3>Acciones</h3>
          <div class="tm-actions">
            <input ref="importFileInput" type="file" accept=".json" @change="handleImport" class="tm-file-input" />
            <Button color="secondary" variant="soft" @click="importFileInput?.click()">Import JSON</Button>
            <Button color="secondary" @click="emit('export')">Export JSON</Button>
            <Button color="neutral" @click="emit('reset')">Reset Defaults</Button>
          </div>
        </div>

        <div class="tm-section">
          <h3>CSS</h3>
          <div class="tm-output-actions">
            <Button color="primary" variant="ghost" @click="emit('copy-css')">Copy CSS</Button>
            <Button color="primary" variant="ghost" @click="emit('download-css')">Download CSS</Button>
          </div>
        </div>
      </div>

      <div class="tm-main">
        <h3>CSS Output</h3>
        <CodeBlock :code="cssOutput" language="css" variant="solid" class="tm-code-block" />
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.tm-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  height: 100%;
}

.tm-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tm-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.tm-section h3 {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0 0 0.5rem 0;
  color: var(--cu-color-neutral);
}

.tm-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tm-actions .tm-btn {
  width: 100%;
}

.tm-file-input {
  display: none;
}

.tm-output-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tm-code-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: 300px;
  overflow: hidden;
  border-radius: var(--cu-radius-sm);
}

.tm-code-block :deep(.cu-code-block) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tm-code-block :deep(.cu-code-block-pre) {
  flex: 1;
  overflow: auto !important;
  max-height: none !important;
}
</style>
