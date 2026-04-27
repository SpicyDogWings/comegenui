<script setup lang="ts">
import Input from "./components/Input.ce.vue";
</script>

<template>
  <div class="w-screen h-screen flex flex-col gap-8 p-6">
    <h1 class="text-2xl font-bold">Inputs - disabled & readOnly</h1>
    
    <div class="flex flex-wrap gap-4">
      <Input
        color="primary"
        placeholder="Normal"
        class="w-64"
      />
      <Input
        color="primary"
        placeholder="Disabled"
        disabled
        class="w-64"
      />
      <Input
        color="primary"
        placeholder="Read only"
        readOnly
        class="w-64"
      />
      <Input
        color="primary"
        placeholder="Disabled + Read only"
        disabled
        readOnly
        class="w-64"
      />
    </div>

    <div class="flex flex-wrap gap-4">
      <Input
        color="success"
        placeholder="Normal"
        class="w-64"
      />
      <Input
        color="success"
        placeholder="Disabled"
        disabled
        class="w-64"
      />
      <Input
        color="success"
        placeholder="Read only"
        readOnly
        class="w-64"
      />
      <Input
        color="success"
        placeholder="Disabled + Read only"
        disabled
        readOnly
        class="w-64"
      />
    </div>

    <div class="flex flex-wrap gap-4">
      <Input
        color="danger"
        placeholder="Normal"
        class="w-64"
      />
      <Input
        color="danger"
        placeholder="Disabled"
        disabled
        class="w-64"
      />
      <Input
        color="danger"
        placeholder="Read only"
        readOnly
        class="w-64"
      />
      <Input
        color="danger"
        placeholder="Disabled + Read only"
        disabled
        readOnly
        class="w-64"
      />
    </div>
  </div>
</template>
