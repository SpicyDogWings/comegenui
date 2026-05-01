<script setup lang="ts">
import { ref } from "vue";
import Button from "./components/Button.ce.vue";
import Alert from "./components/Alert.ce.vue";

const successAlertRef = ref<InstanceType<typeof Alert> | null>(null);
const warningAlertRef = ref<InstanceType<typeof Alert> | null>(null);
const dangerAlertRef = ref<InstanceType<typeof Alert> | null>(null);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Alert Examples</h1>

    <!-- Alert Examples -->
    <div class="mb-8">
      <div class="flex flex-col gap-4">
        <!-- Success Alert with icon and close button -->
        <Alert
          ref="successAlertRef"
          title="Éxito"
          color="success"
          variant="soft"
          close
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
          ref="warningAlertRef"
          title="Advertencia"
          color="warning"
          variant="subtle"
          close
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
          ref="dangerAlertRef"
          title="Error"
          color="danger"
          variant="outlined"
          close
        >
          <p class="text-sm">Algo salió mal. Intente de nuevo.</p>
        </Alert>

        <!-- Control Buttons -->
        <div class="flex gap-2 mt-4">
          <Button @click="dangerAlertRef?.toggle()" color="danger" variant="ghost">
            {{ dangerAlertRef?.isOpen ? 'Ocultar' : 'Mostrar' }} Error
          </Button>
          <Button @click="successAlertRef?.toggle()" color="success" variant="ghost">
            {{ successAlertRef?.isOpen ? 'Ocultar' : 'Mostrar' }} Éxito
          </Button>
          <Button @click="warningAlertRef?.toggle()" color="warning" variant="ghost">
            {{ warningAlertRef?.isOpen ? 'Ocultar' : 'Mostrar' }} Advertencia
          </Button>
          <Button @click="successAlertRef?.open()" color="primary" variant="ghost">
            Abrir Éxito
          </Button>
          <Button @click="successAlertRef?.close()" color="danger" variant="ghost">
            Cerrar Éxito
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
