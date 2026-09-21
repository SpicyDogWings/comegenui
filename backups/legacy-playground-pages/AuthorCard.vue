<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import AuthorCard from "@/components/information/AuthorCard.vue";
import PlaygroundStyle from "@/templates/playground/PlaygroundStyle.vue";
import PlaygroundApiComponents from "@/templates/playground/PlaygroundApiComponents.vue";
import { cuAuthorCardStories } from "@/stories/information/AuthorCard.stories";


const outlineItems = [
  ...cuAuthorCardStories.sections.map((section) => ({ label: section.title, id: section.id })),
  { label: "Programmatic", id: "programmatic" },
  {
    label: "Style",
    id: "style",
    children: [{ label: "CSS Variables", id: "style-variables" }],
  },
  {
    label: "API",
    id: "api",
    children: [
      { label: "Components", id: "api-components" },
      { label: "Props", id: "api-props" },
      { label: "Slots", id: "api-slots" },
      { label: "Events", id: "api-events" },
      { label: "Exposes", id: "api-exposes" },
    ],
  },
];

const authorCardTokens = [
  "--cu-font-size-sm",
  "--cu-font-weight-medium",
  "--cu-color-neutral",
  "--cu-line-height-tight",
  "--cu-font-size-xs",
];

const componentDeps = [
  { label: "Avatar", path: "/playground/components/avatar" },
];

const styleSubComponents = [
  { label: "Avatar", path: "/playground/components/avatar#style" },
];

const apiColumns = [
  { key: "name", label: "Nombre" },
  { key: "type", label: "Tipo" },
  { key: "default", label: "Default" },
  { key: "description", label: "Descripción" },
];

const propsData = [
  {
    name: "name",
    type: "string",
    default: "—",
    description: "Nombre del autor (requerido)",
  },
  {
    name: "role",
    type: "string",
    default: '""',
    description: "Rol o cargo del autor",
  },
  {
    name: "color",
    type: "string",
    default: '""',
    description:
      "primary, secondary, neutral, success, warning, danger. Si no se pasa, se resuelve por hash del nombre",
  },
  {
    name: "size",
    type: "string",
    default: '"md"',
    description: "sm | md | lg",
  },
  {
    name: "src",
    type: "string",
    default: '""',
    description: "URL de imagen (muestra foto en vez de iniciales)",
  },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const progColor = ref("primary");
const progSize = ref("md");

const programmaticVue = `<script setup>
import { ref } from 'vue'
import AuthorCard from '@/components/information/AuthorCard.vue'
import Button from '@/components/buttons/Button.vue'

const color = ref('primary')
const size = ref('md')
<\/script>

<template>
  <Button @click="color = 'success'">color = 'success'</Button>
  <Button @click="color = 'warning'">color = 'warning'</Button>
  <Button @click="size = 'sm'">size = 'sm'</Button>
  <Button @click="size = 'lg'">size = 'lg'</Button>
  <AuthorCard name="Demo User" role="Interactive" :color="color" :size="size" />
</template>`;
</script>

<template>
  <PlaygroundLayout title="AuthorCard" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuAuthorCardStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la tarjeta cambia
          en vivo. No expone métodos ni eventos: se maneja por props.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progColor = 'success'"
                >color = 'success'</Button
              >
              <Button color="neutral" @click="progColor = 'warning'"
                >color = 'warning'</Button
              >
              <Button color="neutral" @click="progColor = 'primary'"
                >color = 'primary'</Button
              >
              <Button color="neutral" @click="progSize = 'sm'"
                >size = 'sm'</Button
              >
              <Button color="neutral" @click="progSize = 'lg'"
                >size = 'lg'</Button
              >
            </div>
            <p class="playground-state">
              color: <strong>{{ progColor }}</strong> · size:
              <strong>{{ progSize }}</strong>
            </p>
            <AuthorCard
              name="Demo User"
              role="Interactive"
              :color="progColor"
              :size="progSize"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle
        :tokens="authorCardTokens"
        :sub-components="styleSubComponents"
      />

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />
        <h3 id="api-props">Props</h3>
        <Table
          :columns="apiColumns"
          :data="propsData"
          variant="ghost"
          compact
        />

        <h3 id="api-slots">Slots</h3>
        <Table
          :columns="apiColumns"
          :data="slotsData"
          empty="No tiene slots"
          variant="ghost"
          compact
        />

        <h3 id="api-events">Events</h3>
        <Table
          :columns="apiColumns"
          :data="eventsData"
          empty="No emite eventos"
          variant="ghost"
          compact
        />

        <h3 id="api-exposes">Exposes</h3>
        <Table
          :columns="apiColumns"
          :data="exposesData"
          empty="No expone métodos (se maneja por props)"
          variant="ghost"
          compact
        />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.playground-heading h2 {
  margin: 0;
}

.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.playground-state {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}
</style>
