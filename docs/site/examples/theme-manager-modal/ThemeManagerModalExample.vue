<script setup lang="ts">
import { ref } from "vue";
import ThemeManagerModal from "@/components/theme/ThemeManagerModal.vue";
import Button from "@/components/buttons/Button.vue";

const modalRef = ref<InstanceType<typeof ThemeManagerModal> | null>(null);
const themeName = ref("mi-tema");

const cssOutput = `:root {
  --cu-color-primary: #6366f1;
  --cu-radius: 8px;
}`;

const log = ref<string[]>([]);

function record(entry: string) {
  log.value = [entry, ...log.value].slice(0, 6);
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button color="primary" variant="solid" @click="modalRef?.open()">open()</Button>
    <Button color="neutral" variant="ghost" @click="modalRef?.close()">close()</Button>
  </div>

  <p class="cu-demo-output">themeName → {{ themeName }}</p>
  <p class="cu-demo-output">{{ log.length ? log.join("\n") : "Sin eventos todavía." }}</p>

  <ThemeManagerModal
    ref="modalRef"
    v-model:theme-name="themeName"
    :css-output="cssOutput"
    @reset="record('reset')"
    @import="record('import')"
    @export="record('export')"
    @copy-css="record('copy-css')"
    @download-css="record('download-css')"
  />
</template>
