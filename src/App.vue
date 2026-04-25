<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button color="primary" variant="ghost">Priamry</Button>
    <Button color="neutral" variant="ghost">Neutral</Button>
    <Button color="success" variant="ghost">Success</Button>
    <Button color="warning" variant="ghost">Warning</Button>
    <Button color="danger" variant="ghost">Danger</Button>
  </div>
</template>
