<script setup lang="ts">
import { computed, defineAsyncComponent, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PlaygroundLayout from "./PlaygroundLayout.vue";
import StoryBody from "./StoryBody.vue";
import { buildOutline } from "./outline";
import { playgroundKey, type PlaygroundRegistry } from "../keys";
import type { ComponentStory } from "../contract";

const route = useRoute();
const registry = inject<PlaygroundRegistry | null>(playgroundKey, null);
const name = computed(
  () => String(route.params.name ?? route.path.split("/").filter(Boolean).pop() ?? ""),
);

// Página física de override (si existe para este componente, mandan las
// páginas: el runtime genérico queda como fallback).
const PageOverride = computed(() => {
  const loader = registry?.getPage(name.value);
  return loader ? defineAsyncComponent(loader as () => Promise<never>) : null;
});

// Story cargada de forma perezosa (code-splitting por componente).
const entry = computed(() => registry?.getStory(name.value));
const story = ref<ComponentStory | null>(null);
const loading = ref(false);

watch(
  entry,
  async (current) => {
    story.value = null;
    if (!current) return;
    loading.value = true;
    try {
      story.value = (await current.load()) ?? null;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

const outlineItems = computed(() => (story.value ? buildOutline(story.value) : []));
</script>

<template>
  <component :is="PageOverride" v-if="PageOverride" />

  <PlaygroundLayout v-else-if="entry" :title="entry.name" :outlineItems="outlineItems">
    <p v-if="loading" class="playground-desc">Cargando…</p>
    <StoryBody v-else-if="story" :story="story" />
  </PlaygroundLayout>

  <PlaygroundLayout v-else :title="String(route.params.name)">
    <div class="playground-content">
      <p class="playground-desc">
        No hay story registrada para "<strong>{{ route.params.name }}</strong>".
      </p>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}
</style>
