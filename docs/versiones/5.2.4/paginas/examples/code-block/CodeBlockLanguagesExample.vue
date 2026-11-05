<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const typescript = `interface User {
  name: string;
  role: "admin" | "user";
}

function greet(user: User): string {
  return \`Hola, \${user.name}\`;
}`;

const bash = `pnpm install
pnpm build
git status`;
</script>

<template>
  <CodeBlock language="typescript" :line-numbers="true" :code="typescript" />
  <CodeBlock language="bash" :code="bash" />
</template>
