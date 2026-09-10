<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Avatar from "@/components/information/Avatar.vue";
import { cuAvatarStories } from "@/stories/information/Avatar.stories";

const progInitials = ref('AB');
const progColor = ref('primary');
const progSize = ref('md');

const outlineItems = [
  ...cuAvatarStories.sections.map((section) => ({ label: section.title, id: section.id })),
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

const componentTokens = [
  '--avatar-bg',
  '--cu-font-weight-semibold',
  '--cu-font-size-xs',
  '--cu-font-size-sm',
  '--cu-font-size-md',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'initials', type: 'string', default: '""', description: 'Iniciales a mostrar (2 chars)' },
  { name: 'color', type: 'string', default: '""', description: 'primary, secondary, neutral, success, warning, danger. Si no se pasa, se resuelve por hash de las iniciales' },
  { name: 'size', type: 'string', default: '"md"', description: 'sm | md | lg' },
  { name: 'src', type: 'string', default: '""', description: 'URL de imagen (muestra foto en vez de iniciales)' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Avatar from '@/components/information/Avatar.vue'
import Button from '@/components/buttons/Button.vue'

const initials = ref('AB')
const color = ref('primary')
const size = ref('md')
<\/script>

<template>
  <Button @click="initials = 'XY'">initials = 'XY'</Button>
  <Button @click="color = 'success'">color = 'success'</Button>
  <Button @click="size = 'sm'">size = 'sm'</Button>
  <Button @click="size = 'lg'">size = 'lg'</Button>
  <Avatar :initials="initials" :color="color" :size="size" />
</template>`;
</script>

<template>
  <PlaygroundLayout title="Avatar" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuAvatarStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el avatar cambia en vivo. No expone métodos ni eventos: se maneja por props.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progInitials = 'XY'">initials = 'XY'</Button>
              <Button color="neutral" @click="progInitials = 'AB'">initials = 'AB'</Button>
              <Button color="neutral" @click="progColor = 'success'">color = 'success'</Button>
              <Button color="neutral" @click="progColor = 'warning'">color = 'warning'</Button>
              <Button color="neutral" @click="progSize = 'sm'">size = 'sm'</Button>
              <Button color="neutral" @click="progSize = 'lg'">size = 'lg'</Button>
            </div>
            <p class="playground-state">
              initials: <strong>{{ progInitials }}</strong>
              · color: <strong>{{ progColor }}</strong>
              · size: <strong>{{ progSize }}</strong>
            </p>
            <Avatar :initials="progInitials" :color="progColor" :size="progSize" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos (se maneja por props)" variant="ghost" compact />
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
