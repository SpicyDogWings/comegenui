<script setup lang="ts">
import { ref } from "vue";
import Tabs from "@/components/Tabs.vue";

const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);
const active = ref("a");
const salida = ref("");

const tabs = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
  { key: "c", label: "C" },
];

function getActive() {
  salida.value = `getActive() → "${tabsRef.value?.getActive()}"`;
}
function setActive() {
  tabsRef.value?.setActive("c");
  salida.value = 'setActive("c")';
}
function next() {
  tabsRef.value?.next();
  salida.value = "next()";
}
function prev() {
  tabsRef.value?.prev();
  salida.value = "prev()";
}
</script>

<template>
  <Tabs ref="tabsRef" v-model="active" :tabs="tabs" variant="solid" color="primary">
    <template #a>Panel A.</template>
    <template #b>Panel B.</template>
    <template #c>Panel C.</template>
  </Tabs>

  <div class="cu-demo-controls">
    <button type="button" @click="getActive">getActive()</button>
    <button type="button" @click="setActive">setActive("c")</button>
    <button type="button" @click="next">next()</button>
    <button type="button" @click="prev">prev()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
