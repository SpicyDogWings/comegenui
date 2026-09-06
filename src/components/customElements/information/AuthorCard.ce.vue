<script setup lang="ts">
import AuthorCard from "../../information/AuthorCard.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  color: { type: String, default: "" },
  size: { type: String, default: "md" },
  src: { type: String, default: "" },
});
</script>

<template>
  <AuthorCard :name="props.name" :role="props.role" :color="props.color" :size="props.size" :src="props.src" />
</template>
