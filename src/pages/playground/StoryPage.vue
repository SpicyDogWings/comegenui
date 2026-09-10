<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from "@/templates/playground/PlaygroundStyle.vue";
import PlaygroundApiComponents from "@/templates/playground/PlaygroundApiComponents.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import { getStory } from "@/stories/registry";

const route = useRoute();
const entry = computed(() => getStory(String(route.params.name ?? "")));

const apiDeps = computed(() => entry.value?.story.api?.components ?? []);
const apiProps = computed(() => entry.value?.story.api?.props ?? []);
const apiSlots = computed(() => entry.value?.story.api?.slots ?? []);
const apiEvents = computed(() => entry.value?.story.api?.events ?? []);
const apiExposes = computed(() => entry.value?.story.api?.exposes ?? []);
const interfaceCode = computed(() => entry.value?.story.api?.interfaceCode);

const apiColumns = [
  { key: "name", label: "Nombre" },
  { key: "type", label: "Tipo" },
  { key: "default", label: "Default" },
  { key: "description", label: "Descripción" },
];

const outlineItems = computed(() => {
  const story = entry.value?.story;
  if (!story) return [];

  const items: { label: string; id: string; children?: { label: string; id: string }[] }[] = story.sections.map(
    (section) => ({ label: section.title, id: section.id }),
  );

  items.push({
    label: "Style",
    id: "style",
    children: [{ label: "CSS Variables", id: "style-variables" }],
  });

  const apiChildren: { label: string; id: string }[] = [];
  if (story.api?.components?.length) apiChildren.push({ label: "Components", id: "api-components" });
  apiChildren.push(
    { label: "Props", id: "api-props" },
    { label: "Slots", id: "api-slots" },
    { label: "Events", id: "api-events" },
    { label: "Exposes", id: "api-exposes" },
  );
  if (story.api?.interfaceCode) apiChildren.push({ label: "Interfaces", id: "api-interfaces" });
  items.push({ label: "API", id: "api", children: apiChildren });

  return items;
});
</script>

<template>
  <PlaygroundLayout v-if="entry" :title="entry.name" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="entry.story" />

      <hr class="playground-separator" />
      <PlaygroundStyle
        :tokens="entry.story.tokens ?? []"
        :sub-components="entry.story.subComponents"
      />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents v-if="apiDeps.length" :deps="apiDeps" />

        <h3 id="api-props">Props</h3>
        <Table
          :columns="apiColumns"
          :data="apiProps"
          empty="Sin props documentadas"
          variant="ghost"
          compact
        />

        <h3 id="api-slots">Slots</h3>
        <Table
          :columns="apiColumns"
          :data="apiSlots"
          empty="No tiene slots"
          variant="ghost"
          compact
        />

        <h3 id="api-events">Events</h3>
        <Table
          :columns="apiColumns"
          :data="apiEvents"
          empty="No emite eventos"
          variant="ghost"
          compact
        />

        <h3 id="api-exposes">Exposes</h3>
        <Table
          :columns="apiColumns"
          :data="apiExposes"
          empty="No expone métodos"
          variant="ghost"
          compact
        />

        <template v-if="interfaceCode">
          <h3 id="api-interfaces">Interfaces</h3>
          <CodeBlock :code="interfaceCode" language="ts" />
        </template>
      </section>
    </div>
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
