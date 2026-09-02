<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Blockquote from "@/components/information/Blockquote.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Colors', id: 'colors' },
  { label: 'Con formato', id: 'con-formato' },
];
</script>

<template>
  <PlaygroundLayout title="Blockquote" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <h2>Default</h2>
        <Blockquote html="<p>Esta es una cita importante con estilo por defecto.</p>" />
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <Blockquote color="primary" html="<p>Cita con color primary.</p>" />
        <Blockquote color="secondary" html="<p>Cita con color secondary.</p>" />
        <Blockquote color="neutral" html="<p>Cita con color neutral.</p>" />
        <Blockquote color="success" html="<p>Cita con color success.</p>" />
        <Blockquote color="warning" html="<p>Cita con color warning.</p>" />
        <Blockquote color="danger" html="<p>Cita con color danger.</p>" />
      </section>

      <hr class="playground-separator" />

      <section id="con-formato" class="playground-section">
        <h2>Con formato inline</h2>
        <Blockquote html="<p>Cita con <strong>negrita</strong> y <em>cursiva</em>.</p><p>Múltiples párrafos soportados.</p>" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
