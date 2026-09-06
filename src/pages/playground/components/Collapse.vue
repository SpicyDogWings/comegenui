<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof Collapse> | null>(null);
const programmaticIsOpen = ref(false);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Default Open', id: 'default-open' },
  { label: 'Colors', id: 'colors' },
  { label: 'Nested', id: 'nested' },
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

// ── Snippets Vue ──

const vueImport = `<script setup>
import Collapse from '@/components/overlay/Collapse.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <Collapse label="More information">
    <p>This content is hidden by default and revealed when the trigger is clicked.</p>
  </Collapse>`);

const defaultOpenVue = vueSnippet(`  <Collapse label="Advanced options" :default-open="true">
    <p>Use default-open to render the content expanded on mount.</p>
  </Collapse>`);

const colorsVue = vueSnippet(`  <Collapse v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color" :label="color + ' options'" :color="color" :default-open="true">
    <p>The trigger uses the <strong>{{ color }}</strong> color token.</p>
  </Collapse>`);

const nestedVue = vueSnippet(`  <Collapse label="Parent section" color="primary" :default-open="true">
    <p>Collapses can be nested to build menus or accordion-like trees.</p>
    <Collapse label="Child section">
      <p>Deeply nested content with its own toggle.</p>
    </Collapse>
    <Collapse label="Another child" color="success">
      <p>Each level keeps an independent open state.</p>
    </Collapse>
  </Collapse>`);

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

// ── Snippets Vanilla ──

const collapseImportVanilla = `<script src="dist/CuCollapse.umd.js"><\/script>`;

const defaultVanilla = `${collapseImportVanilla}

<cu-collapse label="More information">
  <p>This content is hidden by default and revealed when the trigger is clicked.</p>
</cu-collapse>`;

const defaultOpenVanilla = `${collapseImportVanilla}

<cu-collapse label="Advanced options" default-open>
  <p>Use default-open to render the content expanded on mount.</p>
</cu-collapse>`;

const colorsVanilla = `${collapseImportVanilla}

<cu-collapse label="Primary options" color="primary" default-open><p>The trigger uses the <strong>primary</strong> color token.</p></cu-collapse>
<cu-collapse label="Secondary options" color="secondary" default-open><p>The trigger uses the <strong>secondary</strong> color token.</p></cu-collapse>
<cu-collapse label="Neutral options" color="neutral" default-open><p>The trigger uses the <strong>neutral</strong> color token.</p></cu-collapse>
<cu-collapse label="Success options" color="success" default-open><p>The trigger uses the <strong>success</strong> color token.</p></cu-collapse>
<cu-collapse label="Warning options" color="warning" default-open><p>The trigger uses the <strong>warning</strong> color token.</p></cu-collapse>
<cu-collapse label="Danger options" color="danger" default-open><p>The trigger uses the <strong>danger</strong> color token.</p></cu-collapse>`;

const nestedVanilla = `${collapseImportVanilla}

<cu-collapse label="Parent section" color="primary" default-open>
  <p>Collapses can be nested to build menus or accordion-like trees.</p>
  <cu-collapse label="Child section">
    <p>Deeply nested content with its own toggle.</p>
  </cu-collapse>
  <cu-collapse label="Another child" color="success">
    <p>Each level keeps an independent open state.</p>
  </cu-collapse>
</cu-collapse>`;

const programmaticVanilla = `${collapseImportVanilla}
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

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const collapse_tokens = [
  '--cu-space-2xs',
  '--cu-space-lg',
];

const styleData = collapse_tokens.map(name => ({ name, description: getTokenDescription(name) }));

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

      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <Collapse label="More information">
              <p>This content is hidden by default and revealed when the trigger is clicked.</p>
              <p>The chevron rotates 90° while the content animates its height.</p>
            </Collapse>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="default-open" class="playground-section">
        <div class="playground-heading">
          <h2>Default Open</h2>
          <Badge color="neutral" title="defaultOpen por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="defaultOpenVue" :vanilla-code="defaultOpenVanilla">
          <div class="playground-col">
            <Collapse label="Advanced options" :default-open="true">
              <p>Use <code>default-open</code> to render the content expanded on mount.</p>
            </Collapse>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-col">
            <Collapse
              v-for="color in colors"
              :key="color"
              :label="`${color.charAt(0).toUpperCase() + color.slice(1)} options`"
              :color="color"
              :default-open="true"
            >
              <p>The trigger uses the <strong>{{ color }}</strong> color token.</p>
            </Collapse>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="nested" class="playground-section">
        <div class="playground-heading">
          <h2>Nested</h2>
        </div>
        <SectionDemo :vue-code="nestedVue" :vanilla-code="nestedVanilla">
          <div class="playground-col">
            <Collapse label="Parent section" color="primary" :default-open="true">
              <p>Collapses can be nested to build menus or accordion-like trees.</p>
              <Collapse label="Child section">
                <p>Deeply nested content with its own toggle.</p>
              </Collapse>
              <Collapse label="Another child" color="success">
                <p>Each level keeps an independent open state.</p>
              </Collapse>
            </Collapse>
          </div>
        </SectionDemo>
      </section>

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

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" />

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
