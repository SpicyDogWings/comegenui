<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Button from "@/components/buttons/Button.vue";
import { cuCollapseStories } from "@/stories/overlay/Collapse.stories";

const programmaticRef = ref<InstanceType<typeof Collapse> | null>(null);
const programmaticIsOpen = ref(false);

const outlineItems = [
  ...cuCollapseStories.sections.map((section) => ({ label: section.title, id: section.id })),
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

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Collapse from '@/components/overlay/Collapse.vue'
import Button from '@/components/buttons/Button.vue'

const collapseRef = ref(null)
const isOpen = ref(false)

function logState() {
  console.log('isOpen():', collapseRef.value.isOpen())
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="collapseRef?.open(); isOpen = true">open()</Button>
      <Button color="neutral" @click="collapseRef?.close(); isOpen = false">close()</Button>
      <Button color="neutral" @click="collapseRef?.toggle(); logState()">toggle()</Button>
    </div>
    <Collapse ref="collapseRef" label="Programmatic collapse" @toggle="isOpen = $event">
      <p>This collapse is controlled programmatically via open(), close(), and toggle() methods, and emits toggle events.</p>
    </Collapse>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuCollapse.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="col-prog-open">open()</cu-button>
  <cu-button id="col-prog-close">close()</cu-button>
  <cu-button id="col-prog-toggle">toggle()</cu-button>
</div>

<cu-collapse id="col-prog" label="Programmatic collapse">
  <p>This collapse is controlled programmatically via open(), close(), and toggle() methods, and emits toggle events.</p>
</cu-collapse>

<script>
  customElements.whenDefined('cu-collapse').then(() => {
    const collapse = document.getElementById('col-prog');
    document.getElementById('col-prog-open').addEventListener('click', () => collapse.open());
    document.getElementById('col-prog-close').addEventListener('click', () => collapse.close());
    document.getElementById('col-prog-toggle').addEventListener('click', () => collapse.toggle());
    collapse.addEventListener('toggle', (e) => console.log('isOpen():', e.detail));
  });
<\/script>`;

const componentTokens = [
  '--cu-space-2xs',
  '--cu-space-lg',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'label', type: 'string', default: '(required)', description: 'Texto del trigger (required)' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Renderiza el contenido expandido al montar' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
];

const slotsData = [
  { name: 'default', description: 'Contenido colapsable' },
];

const eventsData = [
  { name: 'toggle', type: '(value: boolean) => void', description: 'Cambia el estado (payload: isOpen)' },
];

const exposesData = [
  { name: 'open', type: '() => void', description: 'Expande el contenido' },
  { name: 'close', type: '() => void', description: 'Colapsa el contenido' },
  { name: 'toggle', type: '() => void', description: 'Expande/colapsa' },
  { name: 'isOpen', type: '() => boolean', description: 'Estado del collapse' },
];
</script>

<template>
  <PlaygroundLayout title="Collapse" :outlineItems="outlineItems">
    <div class="playground-content">
      <StoryRenderer :story="cuCollapseStories" />

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="programmaticRef?.open(); programmaticIsOpen = true">open()</Button>
              <Button color="neutral" @click="programmaticRef?.close(); programmaticIsOpen = false">close()</Button>
              <Button color="neutral" @click="programmaticRef?.toggle(); programmaticIsOpen = programmaticRef?.isOpen() ?? false">toggle()</Button>
            </div>
            <p class="playground-state">
              isOpen(): <strong>{{ programmaticIsOpen ? 'true' : 'false' }}</strong>
            </p>
            <Collapse
              ref="programmaticRef"
              label="Programmatic collapse"
              @toggle="programmaticIsOpen = $event"
            >
              <p>This collapse is controlled programmatically via <code>open()</code>, <code>close()</code>, and <code>toggle()</code> methods, and emits <code>toggle</code> events.</p>
            </Collapse>
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
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
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

.playground-state {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}
</style>
