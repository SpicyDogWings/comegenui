<script setup lang="ts">
import Avatar from "../../information/Avatar.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String, default: "" },
  size: { type: String, default: "md" },
  initials: { type: String, default: "" },
  src: { type: String, default: "" },
});
</script>

<template>
  <Avatar :color="props.color" :size="props.size" :initials="props.initials" />
</template>
