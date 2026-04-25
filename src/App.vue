<script setup lang="ts">
import Button from "./components/Button.ce.vue";
import Badge from "./components/Badge.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center gap-4">
    <div class="flex gap-1">
      <Button color="primary" variant="solid">Primary</Button>
      <Button color="neutral" variant="solid">Neutral</Button>
      <Button color="success" variant="solid">Success</Button>
      <Button color="warning" variant="solid">Warning</Button>
      <Button color="danger" variant="solid">Danger</Button>
    </div>
    <div class="flex gap-1">
      <Badge color="primary" variant="solid">New</Badge>
      <Badge color="neutral" variant="soft">12</Badge>
      <Badge color="success" variant="subtle">Online</Badge>
      <Badge color="warning" variant="outlined">Pending</Badge>
      <Badge color="danger" variant="ghost">Urgent</Badge>
    </div>
  </div>
</template>
