<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import Alert from "@/components/information/Alert.vue";

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
const popoverState = ref(false);

function syncState() {
  popoverState.value = popoverRef.value?.isOpen() || false;
}

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Custom Toggle', id: 'custom-toggle' },
  { label: 'Positions', id: 'positions' },
  { label: 'Fixed', id: 'fixed' },
  { label: 'Hover', id: 'hover' },
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
  '--cu-color-surface',
  '--cu-shadow-xl',
  '--cu-radius-md',
  '--cu-space-sm',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'position', type: 'string', default: '"bottom"', description: 'bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'start, center, end' },
  { name: 'offset', type: 'number', default: '4', description: 'Distancia del panel al trigger (px)' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Panel en position:fixed con coordenadas de viewport (sigue al trigger en scroll)' },
  { name: 'panelWidth', type: 'string', default: '""', description: 'Ancho del panel (CSS). Vacío = width:100% del trigger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'No abre ni hace toggle' },
  { name: 'hover', type: 'boolean', default: 'false', description: 'Abre con mouseenter, cierra con mouseleave' },
  { name: 'hoverDelay', type: 'number', default: '200', description: 'Delay del hover en ms' },
  { name: 'role', type: 'string', default: '""', description: 'role del panel (menu, tooltip, dialog…)' },
  { name: 'panelClass', type: 'string | string[] | Record', default: '""', description: 'Clase(s) extra del panel' },
];

const slotsData = [
  { name: 'toggle', description: 'Trigger. Scoped: { toggle, isOpen }. Si no se usa, renderiza el panel sin trigger propio' },
  { name: 'default', description: 'Contenido del panel' },
];

const eventsData = [
  { name: 'open', type: '() => void', description: 'Se abrió el panel' },
  { name: 'close', type: '() => void', description: 'Se cerró el panel' },
];

const exposesData = [
  { name: 'open()', type: '() => void', description: 'Abre el panel' },
  { name: 'close()', type: '() => void', description: 'Cierra el panel' },
  { name: 'toggle()', type: '() => void', description: 'Alterna abierto/cerrado' },
  { name: 'isOpen()', type: '() => boolean', description: 'Estado actual' },
];

const vueImport = `<script setup>
import Popover from '@/components/overlay/Popover.vue'
import Button from '@/components/buttons/Button.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Popover>
    <template #toggle="{ toggle }">
      <Button @click="toggle">Abrir</Button>
    </template>
    <p>Contenido del panel.</p>
  </Popover>`);

const customToggleVue = vueSnippet(`  <Popover align="end">
    <template #toggle="{ toggle, isOpen }">
      <Input placeholder="Escribí para ver el panel" @focus="toggle" />
    </template>
    <p>Panel abierto desde el focus del input.</p>
  </Popover>`);

const positionsVue = vueSnippet(`  <!-- position: bottom | top | left | right — align: start | center | end -->
  <Popover position="top" align="center">
    <template #toggle="{ toggle }"><Button @click="toggle">Top</Button></template>
    <p>Panel arriba centrado.</p>
  </Popover>
  <Popover position="left">
    <template #toggle="{ toggle }"><Button @click="toggle">Left</Button></template>
    <p>Panel a la izquierda.</p>
  </Popover>
  <Popover position="right">
    <template #toggle="{ toggle }"><Button @click="toggle">Right</Button></template>
    <p>Panel a la derecha.</p>
  </Popover>`);

const fixedVue = vueSnippet(`  <Popover fixed position="top" align="center">
    <template #toggle="{ toggle }"><Button @click="toggle">Fixed</Button></template>
    <p>Panel en fixed: sigue al trigger al scrollear.</p>
  </Popover>`);

const hoverVue = vueSnippet(`  <!-- hover: abre con mouseenter, cierra con mouseleave -->
  <Popover hover :offset="6" role="tooltip">
    <template #toggle><Button>Hover me</Button></template>
    <p>Tooltip rápido.</p>
  </Popover>`);

const programmaticVue = vueSnippet(`  <div style="display:flex;gap:.5rem">
    <Button color="neutral" @click="popoverRef?.open()">open()</Button>
    <Button color="neutral" @click="popoverRef?.close()">close()</Button>
    <Button color="neutral" @click="popoverRef?.toggle()">toggle()</Button>
  </div>
  <Popover ref="popoverRef" @open="sync" @close="sync">
    <template #toggle="{ toggle }"><Button @click="toggle">Trigger</Button></template>
    <p>Panel controlado por API.</p>
  </Popover>`);
</script>

<template>
  <PlaygroundLayout title="Popover" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
          <Badge color="neutral" title="Posición por defecto">position="bottom"</Badge>
        </div>
        <SectionDemo :vue-code="basicVue">
          <div class="playground-row">
            <Popover>
              <template #toggle="{ toggle }">
                <Button @click="toggle">Abrir</Button>
              </template>
              <Alert color="neutral" variant="subtle">Contenido del panel.</Alert>
            </Popover>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="custom-toggle" class="playground-section">
        <div class="playground-heading">
          <h2>Custom Toggle</h2>
          <Badge color="neutral" title="Slot usado para el trigger">#toggle</Badge>
        </div>
        <SectionDemo :vue-code="customToggleVue">
          <div class="playground-col">
            <Popover align="end">
              <template #toggle="{ toggle }">
                <Input placeholder="Focalizame para abrir el panel" @focus="toggle" />
              </template>
              <Alert color="primary" variant="subtle">Panel abierto desde el focus del input.</Alert>
            </Popover>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Posición por defecto">position="bottom"</Badge>
        </div>
        <SectionDemo :vue-code="positionsVue">
          <div class="playground-row">
            <Popover position="top" align="center" :offset="8">
              <template #toggle="{ toggle }"><Button @click="toggle">Top</Button></template>
              <Alert color="neutral" variant="subtle">Panel arriba centrado.</Alert>
            </Popover>
            <Popover position="left" :offset="8">
              <template #toggle="{ toggle }"><Button @click="toggle">Left</Button></template>
              <Alert color="neutral" variant="subtle">Panel a la izquierda.</Alert>
            </Popover>
            <Popover position="right" :offset="8">
              <template #toggle="{ toggle }"><Button @click="toggle">Right</Button></template>
              <Alert color="neutral" variant="subtle">Panel a la derecha.</Alert>
            </Popover>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fixed" class="playground-section">
        <div class="playground-heading">
          <h2>Fixed</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="fixedVue">
          <div class="playground-col">
            <Popover fixed position="top" align="center" :offset="8">
              <template #toggle="{ toggle }"><Button @click="toggle">Fixed</Button></template>
              <Alert color="neutral" variant="subtle">Panel en fixed: sigue al trigger al scrollear.</Alert>
            </Popover>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="hover" class="playground-section">
        <div class="playground-heading">
          <h2>Hover</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="hoverVue">
          <div class="playground-row">
            <Popover hover :offset="6" role="tooltip">
              <template #toggle><Button>Hover me</Button></template>
              <Alert color="neutral" variant="subtle">Tooltip rápido.</Alert>
            </Popover>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el panel cambia en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="popoverRef?.open()">open()</Button>
              <Button color="neutral" @click="popoverRef?.close()">close()</Button>
              <Button color="neutral" @click="popoverRef?.toggle()">toggle()</Button>
            </div>
            <p class="playground-state">isOpen: <strong>{{ popoverState }}</strong></p>
            <Popover
              ref="popoverRef"
              @open="syncState"
              @close="syncState"
            >
              <template #toggle="{ toggle }"><Button @click="toggle">Trigger</Button></template>
              <Alert color="warning" variant="subtle">Panel controlado por API.</Alert>
            </Popover>
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

<style scoped>
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

.playground-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.playground-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}
</style>