<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const code = `const total = items.reduce((sum, item) => sum + item.price, 0);
console.log(total);`;
</script>

<template>
  <CodeBlock variant="default" language="js" :code="code" />
  <CodeBlock variant="outlined" language="js" :code="code" />
  <CodeBlock variant="solid" language="js" :code="code" />
</template>
