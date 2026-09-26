---
title: Switch
group: Formularios
---

<script setup lang="ts">
import { ref } from "vue";
import Switch from "@/components/form/Switch.vue";

const activo = ref(true);
</script>

<!--@include: ../../skills/use-comegen/componentes/cu-switch.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo">
    <Switch v-model="activo" label="Activo" />
    <Switch color="success" label="Con color" :model-value="true" />
    <Switch size="sm" label="Chico" :model-value="false" />
    <Switch disabled label="Deshabilitado" :model-value="false" />
  </div>
</ClientOnly>
