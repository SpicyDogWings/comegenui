<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button>Normal</Button>
    <Button color="primary">Priamry</Button>
    <Button color="neutral">Neutral</Button>
    <Button color="success">Success</Button>
    <Button color="warning">Warning</Button>
    <Button color="danger">Danger</Button>
  </div>
</template>
