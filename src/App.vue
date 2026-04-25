<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button color="primary" variant="link">Priamry</Button>
    <Button color="neutral" variant="link">Neutral</Button>
    <Button color="success" variant="link">Success</Button>
    <Button color="warning" variant="link">Warning</Button>
    <Button color="danger" variant="link">Danger</Button>
  </div>
</template>
