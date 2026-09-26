---
title: Alert
group: Información
---

<script setup lang="ts">
import Alert from "@/components/information/Alert.vue";
</script>

<!--@include: ../../skills/use-comegen/componentes/cu-alert.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <Alert color="success" title="Todo listo">Los cambios se guardaron.</Alert>
    <Alert color="warning" title="Atención" variant="outlined">
      Revisá los datos antes de continuar.
    </Alert>
    <Alert color="danger" title="Error" variant="solid">
      No se pudo conectar con el servidor.
    </Alert>
  </div>
</ClientOnly>
