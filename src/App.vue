<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button color="primary" variant="outlined">Priamry</Button>
    <Button color="neutral" variant="outlined">Neutral</Button>
    <Button color="success" variant="outlined">Success</Button>
    <Button color="warning" variant="outlined">Warning</Button>
    <Button color="danger" variant="outlined">Danger</Button>
  </div>
</template>
