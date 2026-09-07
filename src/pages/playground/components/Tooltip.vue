<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";

const outlineItems = [
  { label: 'Text', id: 'text' },
  { label: 'Content Slot', id: 'content' },
  { label: 'Positions', id: 'positions' },
  { label: 'Delay', id: 'delay' },
  { label: 'Colors', id: 'colors' },
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
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
    ],
  },
];

const componentTokens = [
  '--cu-color-neutral',
  '--cu-color-neutral-text',
  '--cu-font-size-xs',
  '--cu-radius-sm',
  '--cu-shadow-md',
  '--cu-space-xs',
  '--cu-space-sm',
];

const componentDeps = [
  { label: 'Popover', path: '/playground/components/popover' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'text', type: 'string', default: '""', description: 'Texto del tooltip. El slot #content tiene prioridad' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'position', type: 'string', default: '"top"', description: 'bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"center"', description: 'start, center, end' },
  { name: 'offset', type: 'number', default: '6', description: 'Distancia del tooltip al trigger (px)' },
  { name: 'delay', type: 'number', default: '200', description: 'Delay en ms hasta mostrar el tooltip' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'No muestra el tooltip' },
];

const slotsData = [
  { name: 'default', description: 'Trigger del tooltip (se le hace hover)' },
  { name: 'content', description: 'Contenido custom del tooltip. Si no se usa, se muestra la prop text' },
];

const vueImport = `<script setup>
import Tooltip from '@/components/overlay/Tooltip.vue'
import Button from '@/components/buttons/Button.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const textVue = vueSnippet(`  <Tooltip text="Guardar cambios">
    <Button>Hover me</Button>
  </Tooltip>`);
const textVanilla = `<script src="CuTooltip.umd.js"><\/script>

<cu-tooltip text="Guardar cambios">
  <button>Hover me</button>
</cu-tooltip>`;

const contentVue = vueSnippet(`  <Tooltip>
    <Button>Hover me</Button>
    <template #content>
      <strong>Contenido custom</strong>
      <br />
      Con varias líneas.
    </template>
  </Tooltip>`);
const contentVanilla = `<cu-tooltip>
  <button>Hover me</button>
  <span slot="content">
    <strong>Contenido custom</strong><br />
    Con varias líneas.
  </span>
</cu-tooltip>`;

const positionsVue = vueSnippet(`  <Tooltip text="Arriba" position="top"><Button>Top</Button></Tooltip>
  <Tooltip text="Abajo" position="bottom"><Button>Bottom</Button></Tooltip>
  <Tooltip text="Izquierda" position="left"><Button>Left</Button></Tooltip>
  <Tooltip text="Derecha" position="right"><Button>Right</Button></Tooltip>`);
const positionsVanilla = `<cu-tooltip text="Arriba" position="top"><button>Top</button></cu-tooltip>
<cu-tooltip text="Abajo" position="bottom"><button>Bottom</button></cu-tooltip>
<cu-tooltip text="Izquierda" position="left"><button>Left</button></cu-tooltip>
<cu-tooltip text="Derecha" position="right"><button>Right</button></cu-tooltip>`;

const delayVue = vueSnippet(`  <Tooltip text="Aparece rápido" :delay="50"><Button>50ms</Button></Tooltip>
  <Tooltip text="Aparece lento" :delay="1000"><Button>1000ms</Button></Tooltip>`);
const delayVanilla = `<cu-tooltip text="Aparece rápido" :delay="50"><button>50ms</button></cu-tooltip>
<cu-tooltip text="Aparece lento" :delay="1000"><button>1000ms</button></cu-tooltip>`;

const colorsVue = vueSnippet(`  <Tooltip color="primary" text="Primary"><Button>Primary</Button></Tooltip>
  <Tooltip color="secondary" text="Secondary"><Button>Secondary</Button></Tooltip>
  <Tooltip color="neutral" text="Neutral"><Button>Neutral</Button></Tooltip>
  <Tooltip color="success" text="Success"><Button>Success</Button></Tooltip>
  <Tooltip color="warning" text="Warning"><Button>Warning</Button></Tooltip>
  <Tooltip color="danger" text="Danger"><Button>Danger</Button></Tooltip>`);
const colorsVanilla = `<cu-tooltip color="primary" text="Primary"><button>Primary</button></cu-tooltip>
<cu-tooltip color="secondary" text="Secondary"><button>Secondary</button></cu-tooltip>
<cu-tooltip color="neutral" text="Neutral"><button>Neutral</button></cu-tooltip>
<cu-tooltip color="success" text="Success"><button>Success</button></cu-tooltip>
<cu-tooltip color="warning" text="Warning"><button>Warning</button></cu-tooltip>
<cu-tooltip color="danger" text="Danger"><button>Danger</button></cu-tooltip>`;
</script>

<template>
  <PlaygroundLayout title="Tooltip" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="text" class="playground-section">
        <div class="playground-heading">
          <h2>Text</h2>
          <Badge color="neutral" title="Posición por defecto">position="top"</Badge>
        </div>
        <SectionDemo :vue-code="textVue" :vanilla-code="textVanilla">
          <div class="playground-row">
            <Tooltip text="Guardar cambios">
              <Button>Hover me</Button>
            </Tooltip>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="content" class="playground-section">
        <div class="playground-heading">
          <h2>Content Slot</h2>
          <Badge color="neutral" title="Contenido custom del tooltip">#content</Badge>
        </div>
        <SectionDemo :vue-code="contentVue" :vanilla-code="contentVanilla">
          <div class="playground-row">
            <Tooltip>
              <Button>Hover me</Button>
              <template #content>
                <strong>Contenido custom</strong>
                <br />
                Con varias líneas.
              </template>
            </Tooltip>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Posición por defecto">position="top"</Badge>
        </div>
        <SectionDemo :vue-code="positionsVue" :vanilla-code="positionsVanilla">
          <div class="playground-row">
            <Tooltip text="Arriba" position="top"><Button>Top</Button></Tooltip>
            <Tooltip text="Abajo" position="bottom"><Button>Bottom</Button></Tooltip>
            <Tooltip text="Izquierda" position="left"><Button>Left</Button></Tooltip>
            <Tooltip text="Derecha" position="right"><Button>Right</Button></Tooltip>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="delay" class="playground-section">
        <div class="playground-heading">
          <h2>Delay</h2>
          <Badge color="neutral" title="Valor por defecto">200</Badge>
        </div>
        <SectionDemo :vue-code="delayVue" :vanilla-code="delayVanilla">
          <div class="playground-row">
            <Tooltip text="Aparece rápido" :delay="50"><Button>50ms</Button></Tooltip>
            <Tooltip text="Aparece lento" :delay="1000"><Button>1000ms</Button></Tooltip>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Valor por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <Tooltip color="primary" text="Primary"><Button>Primary</Button></Tooltip>
            <Tooltip color="secondary" text="Secondary"><Button>Secondary</Button></Tooltip>
            <Tooltip color="neutral" text="Neutral"><Button>Neutral</Button></Tooltip>
            <Tooltip color="success" text="Success"><Button>Success</Button></Tooltip>
            <Tooltip color="warning" text="Warning"><Button>Warning</Button></Tooltip>
            <Tooltip color="danger" text="Danger"><Button>Danger</Button></Tooltip>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="componentDeps" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>