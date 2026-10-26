<script setup lang="ts">
import InlineRenderer from "@/components/markdown/InlineRenderer.vue";
import { marked } from "marked";

// Tokens inline reales de marked: el mismo shape que produce el parser interno.
const paragraph = marked.lexer(
  "Texto con **negrita**, *itálica*, `código`, ~~tachado~~ y un [link](https://example.com).",
)[0] as any;

const tokens: any[] = paragraph.tokens ?? [];
const tipos = tokens.map((token: any) => token.type).join(", ");
</script>

<template>
  <InlineRenderer :tokens="tokens" />
  <p class="cu-demo-output">tipos de token → {{ tipos }}</p>
</template>
