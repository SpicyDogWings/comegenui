<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";
import Alert from "./components/Alert.ce.vue";

const smModalRef = ref<InstanceType<typeof Modal> | null>(null);
const mdModalRef = ref<InstanceType<typeof Modal> | null>(null);
const lgModalRef = ref<InstanceType<typeof Modal> | null>(null);
const xlModalRef = ref<InstanceType<typeof Modal> | null>(null);
const fullModalRef = ref<InstanceType<typeof Modal> | null>(null);

const showAlert = ref(true);
const showSuccessAlert = ref(true);
const showWarningAlert = ref(true);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Sizes</h1>

    <div class="flex gap-4 mb-6 flex-wrap">
      <Button @click="smModalRef?.open()" color="primary">SM</Button>
      <Button @click="mdModalRef?.open()" color="primary">MD</Button>
      <Button @click="lgModalRef?.open()" color="primary">LG</Button>
      <Button @click="xlModalRef?.open()" color="primary">XL</Button>
      <Button @click="fullModalRef?.open()" color="primary">FULL</Button>
    </div>

    <!-- Alert Examples -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-4">Alert Examples</h2>
      
      <div class="flex flex-col gap-4">
        <!-- Success Alert with icon and close button -->
        <Alert
          v-if="showSuccessAlert"
          title="Éxito"
          color="success"
          variant="soft"
          close
          @close="showSuccessAlert = false"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </template>
          <p class="text-sm">La operación se completó correctamente.</p>
        </Alert>

        <!-- Warning Alert with icon -->
        <Alert
          v-if="showWarningAlert"
          title="Advertencia"
          color="warning"
          variant="subtle"
          close
          @close="showWarningAlert = false"
        >
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </template>
          <p class="text-sm">Tenga cuidado con esta acción.</p>
        </Alert>

        <!-- Danger Alert without icon -->
        <Alert
          v-if="showAlert"
          title="Error"
          color="danger"
          variant="outlined"
          close
          @close="showAlert = false"
        >
          <p class="text-sm">Algo salió mal. Intente de nuevo.</p>
        </Alert>

        <!-- Toggle Buttons -->
        <div class="flex gap-2 mt-4">
          <Button @click="showAlert = !showAlert" color="danger" variant="ghost">
            {{ showAlert ? 'Ocultar' : 'Mostrar' }} Error
          </Button>
          <Button @click="showSuccessAlert = !showSuccessAlert" color="success" variant="ghost">
            {{ showSuccessAlert ? 'Ocultar' : 'Mostrar' }} Éxito
          </Button>
          <Button @click="showWarningAlert = !showWarningAlert" color="warning" variant="ghost">
            {{ showWarningAlert ? 'Ocultar' : 'Mostrar' }} Advertencia
          </Button>
        </div>
      </div>
    </div>

    <!-- SM -->
    <Modal ref="smModalRef" title="Small" size="sm">
      <p class="mb-4">Modal Small (max-w-sm)</p>
      <template #footer>
        <Button @click="smModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- MD -->
    <Modal ref="mdModalRef" title="Medium" size="md">
      <p class="mb-4">Modal Medium (max-w-md) - por defecto</p>
      <template #footer>
        <Button @click="mdModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- LG -->
    <Modal ref="lgModalRef" title="Large" size="lg">
      <p class="mb-4">Modal Large (max-w-lg)</p>
      <template #footer>
        <Button @click="lgModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- XL -->
    <Modal ref="xlModalRef" title="Extra Large" size="xl">
      <p class="mb-4">Modal XL (max-w-xl)</p>
      <template #footer>
        <Button @click="xlModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- FULL -->
    <Modal ref="fullModalRef" title="Full Screen" size="full">
      <p class="mb-4">Modal Full (max-w-[90vw])</p>
      <template #footer>
        <Button @click="fullModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
