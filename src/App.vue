<script setup lang="ts">
import Button from "./components/Button.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center gap-1">
    <Button color="primary" variant="soft">Priamry</Button>
    <Button color="neutral" variant="soft">Neutral</Button>
    <Button color="success" variant="soft">Success</Button>
    <Button color="warning" variant="soft">Warning</Button>
    <Button color="danger" variant="soft">Danger</Button>
  </div>
</template>
