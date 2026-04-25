<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button color="primary" variant="solid">Priamry</Button>
    <Button color="neutral" variant="solid">Neutral</Button>
    <Button color="success" variant="solid">Success</Button>
    <Button color="warning" variant="solid">Warning</Button>
    <Button color="danger" variant="solid">Danger</Button>
  </div>
</template>
