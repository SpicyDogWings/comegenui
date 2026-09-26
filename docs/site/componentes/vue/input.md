---
title: Input
group: Formularios
---

<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/form/Input.vue";

const nombre = ref("");
</script>

<!--@include: ../../../componentes/vue/input.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <Input v-model="nombre" placeholder="Tu nombre" />
    <Input :model-value="nombre" disabled placeholder="Deshabilitado" />
    <Input model-value="42" type="number" color="primary" variant="outlined" />
  </div>
</ClientOnly>
