<script setup lang="ts">
import { computed, inject } from "vue";
import StoryRenderer from "./StoryRenderer.vue";
import PlaygroundStyle from "./PlaygroundStyle.vue";
import PlaygroundApiComponents from "./PlaygroundApiComponents.vue";
import { chromeKey } from "../chrome";
import type { ComponentStory } from "../contract";

const props = defineProps<{ story: ComponentStory }>();

const chrome = inject(chromeKey)!;

const apiDeps = computed(() => props.story.api?.components ?? []);
const apiProps = computed(() => props.story.api?.props ?? []);
const apiSlots = computed(() => props.story.api?.slots ?? []);
const apiEvents = computed(() => props.story.api?.events ?? []);
const apiExposes = computed(() => props.story.api?.exposes ?? []);
const interfaceCode = computed(() => props.story.api?.interfaceCode);

const apiColumns = [
  { key: "name", label: "Nombre" },
  { key: "type", label: "Tipo" },
  { key: "default", label: "Default" },
  { key: "description", label: "Descripción" },
];
</script>

<template>
  <div class="playground-content">
    <StoryRenderer :story="story" />

    <hr class="playground-separator" />
    <PlaygroundStyle :tokens="story.tokens ?? []" :sub-components="story.subComponents" />

    <section id="api" class="playground-section">
      <h2>API</h2>

      <PlaygroundApiComponents v-if="apiDeps.length" :deps="apiDeps" />

      <h3 id="api-props">Props</h3>
      <component :is="chrome.table" :columns="apiColumns" :data="apiProps" empty="Sin props documentadas" variant="ghost" compact />

      <h3 id="api-slots">Slots</h3>
      <component :is="chrome.table" :columns="apiColumns" :data="apiSlots" empty="No tiene slots" variant="ghost" compact />

      <h3 id="api-events">Events</h3>
      <component :is="chrome.table" :columns="apiColumns" :data="apiEvents" empty="No emite eventos" variant="ghost" compact />

      <h3 id="api-exposes">Exposes</h3>
      <component :is="chrome.table" :columns="apiColumns" :data="apiExposes" empty="No expone métodos" variant="ghost" compact />

      <template v-if="interfaceCode">
        <h3 id="api-interfaces">Interfaces</h3>
        <component :is="chrome.codeBlock" :code="interfaceCode" language="ts" />
      </template>
    </section>
  </div>
</template>
