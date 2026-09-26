---
title: Card
group: Información
---

<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
import Card from "@/components/information/Card.vue";
</script>

<!--@include: ../../../componentes/vue/card.md-->

## Demos en vivo

<ClientOnly>
  <div class="cu-demo">
    <Card title="Título" subtitle="Subtítulo">
      Contenido de la tarjeta.
      <template #footer>
        <Badge color="success" variant="solid">Activo</Badge>
      </template>
    </Card>
    <Card title="Outlined" variant="outlined">Otra tarjeta.</Card>
  </div>
</ClientOnly>
