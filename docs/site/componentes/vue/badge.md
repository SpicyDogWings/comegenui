---
title: Badge
group: Información
---

<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<!--@include: ../../../componentes/vue/badge.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo">
    <Badge>Neutral</Badge>
    <Badge color="primary">Primary</Badge>
    <Badge color="success" variant="solid">Activo</Badge>
    <Badge color="warning" variant="outlined">Pendiente</Badge>
    <Badge color="danger" variant="solid">Error</Badge>
  </div>
</ClientOnly>
