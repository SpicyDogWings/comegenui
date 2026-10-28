<script setup lang="ts">
import { ref } from "vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";

const show = ref(true);
const alertRef = ref<InstanceType<typeof Alert> | null>(null);

function reopen() {
  alertRef.value?.open();
}
</script>

<template>
  <Alert
    ref="alertRef"
    v-model:show="show"
    color="warning"
    variant="outlined"
    title="Atención"
    close
  >
    <template #icon>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </template>

    Usá el botón de cerrar del header (`close`) o el slot <code>icon</code>.
  </Alert>

  <div v-if="!show" class="cu-demo-controls">
    <Button color="warning" variant="soft" @click="reopen">Mostrar de nuevo</Button>
  </div>
</template>
