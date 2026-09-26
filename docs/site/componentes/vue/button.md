---
title: Button
group: Buttons
---

<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
</script>

<!--@include: ../../../componentes/vue/button.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo">
    <Button color="primary" variant="solid">solid</Button>
    <Button color="primary" variant="outlined">outlined</Button>
    <Button color="primary" variant="soft">soft</Button>
    <Button color="primary" variant="ghost">ghost</Button>
    <Button color="primary" variant="subtle">subtle</Button>
    <Button color="primary" variant="link">link</Button>
  </div>

  <div class="cu-demo">
    <Button size="sm">Chico</Button>
    <Button size="md">Medio</Button>
    <Button size="lg">Grande</Button>
    <Button color="danger" variant="solid" disabled>Deshabilitado</Button>
    <Button color="success" variant="solid" loading>Guardando…</Button>
  </div>
</ClientOnly>
