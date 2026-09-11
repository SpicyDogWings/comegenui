<script setup lang="ts">
import { computed } from "vue";
import StoryRenderer from "./StoryRenderer.vue";
import PlaygroundStyle from "./PlaygroundStyle.vue";
import PlaygroundApiComponents from "./PlaygroundApiComponents.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import type { ComponentStory } from "@/stories/types";

const props = defineProps<{ story: ComponentStory }>();

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
    <PlaygroundStyle :tokens="story.tokens ?? []" :classes="story.classes" :sub-components="story.subComponents" />

    <section id="api" class="playground-section">
      <h2>API</h2>

      <PlaygroundApiComponents v-if="apiDeps.length" :deps="apiDeps" />

      <h3 id="api-props">Props</h3>
      <Table :columns="apiColumns" :data="apiProps" empty="Sin props documentadas" variant="ghost" compact />

      <h3 id="api-slots">Slots</h3>
      <Table :columns="apiColumns" :data="apiSlots" empty="No tiene slots" variant="ghost" compact />

      <h3 id="api-events">Events</h3>
      <Table :columns="apiColumns" :data="apiEvents" empty="No emite eventos" variant="ghost" compact />

      <h3 id="api-exposes">Exposes</h3>
      <Table :columns="apiColumns" :data="apiExposes" empty="No expone métodos" variant="ghost" compact />

      <template v-if="interfaceCode">
        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" />
      </template>
    </section>
  </div>
</template>
