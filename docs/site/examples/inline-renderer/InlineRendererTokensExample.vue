<script setup lang="ts">
import { ref } from "vue";
import InlineRenderer from "@/components/markdown/InlineRenderer.vue";

// Tokens inline con la forma que produce marked (token.type + tokens/text/href).
const tokens = ref<any[]>([
  { type: "text", text: "Texto plano, " },
  { type: "strong", tokens: [{ type: "text", text: "negrita" }] },
  { type: "text", text: ", " },
  { type: "em", tokens: [{ type: "text", text: "itálica" }] },
  { type: "text", text: ", " },
  { type: "codespan", text: "código inline" },
  { type: "text", text: ", " },
  { type: "del", tokens: [{ type: "text", text: "tachado" }] },
  { type: "text", text: " y " },
  { type: "link", href: "https://vuejs.org", tokens: [{ type: "text", text: "un enlace" }] },
  { type: "br" },
  { type: "text", text: "Segunda línea con " },
  {
    type: "image",
    href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' rx='3' fill='%2342b883'/%3E%3C/svg%3E",
    text: "icono",
  },
  { type: "text", text: " y un escape: " },
  { type: "escape", text: "\\*" },
]);
</script>

<template>
  <InlineRenderer :tokens="tokens" />
</template>