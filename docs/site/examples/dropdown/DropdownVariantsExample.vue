<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
</script>

<template>
  <Dropdown label="primary / solid" color="primary" variant="solid">
    <p>Panel primary solid.</p>
  </Dropdown>
  <Dropdown label="secondary / outlined" color="secondary" variant="outlined">
    <p>Panel secondary outlined.</p>
  </Dropdown>
  <Dropdown label="success / soft" color="success" variant="soft">
    <p>Panel success soft.</p>
  </Dropdown>
  <Dropdown label="warning / ghost" color="warning" variant="ghost">
    <p>Panel warning ghost.</p>
  </Dropdown>
  <Dropdown label="danger / subtle" color="danger" variant="subtle">
    <p>Panel danger subtle.</p>
  </Dropdown>
  <Dropdown label="neutral / link" color="neutral" variant="link">
    <p>Panel neutral link.</p>
  </Dropdown>
</template>
