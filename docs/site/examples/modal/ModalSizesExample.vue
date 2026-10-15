<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
const values = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const size = ref("md");
const height = ref("auto");

function abrir(tipo: "size" | "height", value: string) {
  if (tipo === "size") size.value = value;
  else height.value = value;
  modal.value?.open();
}
</script>

<template>
  <Button
    v-for="value in values"
    :key="`size-${value}`"
    size="sm"
    @click="abrir('size', value)"
  >
    size: {{ value }}
  </Button>
  <Button
    v-for="value in values"
    :key="`height-${value}`"
    size="sm"
    variant="soft"
    @click="abrir('height', value)"
  >
    height: {{ value }}
  </Button>

  <Modal ref="modal" :size="size" :height="height" :title="`size=${size} · height=${height}`">
    <p><code>size</code> controla el ancho y <code>height</code>, el alto.</p>
  </Modal>
</template>
