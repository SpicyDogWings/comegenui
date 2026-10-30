<script setup lang="ts">
import { ref } from "vue";
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";

const clicks = ref(0);
</script>

<template>
  <Label
    for="label-target"
    label="Nombre (click enfoca el input de abajo)"
    color="primary"
    @click="clicks++"
  />
  <Input id="label-target" placeholder="Elemento con id label-target" />
  <pre class="cu-demo-output">click → {{ clicks }} vez/veces</pre>
</template>
