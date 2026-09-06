<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import YearSlider from "@/components/controls/YearSlider.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof YearSlider> | null>(null);
const programmaticValue = ref<number | null>(null);

function readValue() {
  programmaticValue.value = programmaticRef.value?.getValue() ?? null;
}

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
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
import YearSlider from '@/components/controls/YearSlider.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <YearSlider />`);

const minMaxVue = vueSnippet(`  <YearSlider :min="2020" :max="2030" />
  <YearSlider :min="2024" :max="2028" variant="outlined" />
  <YearSlider min="2020-01-01" max="2030-01-01" variant="soft" />`);

const variantsVue = vueSnippet(`  <YearSlider v-for="variant in ['solid', 'outlined', 'soft', 'ghost', 'subtle']" :key="variant" :variant="variant" />`);

const colorsVue = vueSnippet(`  <YearSlider color="primary" />
  <YearSlider color="secondary" />
  <YearSlider color="neutral" />
  <YearSlider color="success" />
  <YearSlider color="warning" />
  <YearSlider color="danger" />`);

const disabledVue = vueSnippet(`  <YearSlider disabled />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import YearSlider from '@/components/controls/YearSlider.vue'
import Button from '@/components/buttons/Button.vue'

const programmaticRef = ref(null)
const value = ref(null)

function readValue() {
  value.value = programmaticRef.value?.getValue() ?? null
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
      <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
      <Button color="neutral" @click="programmaticRef?.goToYear(2035); readValue()">goToYear(2035)</Button>
    </div>
    <YearSlider ref="programmaticRef" @change="readValue" />
  </div>
</template>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const styleData = [
  { name: '--cu-font-sans', description: 'Fuente' },
  { name: '--cu-space-2xs', description: 'Espaciado interno' },
  { name: '--cu-color-surface', description: 'Color superficie' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'number | string | null', default: 'null', description: 'Año (v-model)' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'min', type: 'number | string | null', default: 'null', description: 'Año mínimo' },
  { name: 'max', type: 'number | string | null', default: 'null', description: 'Año máximo' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el control' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: '(value: number) => void', description: 'Al cambiar el año (v-model)' },
  { name: 'change', type: '(value: number) => void', description: 'Al cambiar el año' },
];

const exposesData = [
  { name: 'nextYear', type: '() => void', description: 'Avanza un año' },
  { name: 'prevYear', type: '() => void', description: 'Retrocede un año' },
  { name: 'goToYear', type: '(value: number | string) => void', description: 'Va al año indicado' },
  { name: 'getValue', type: '() => number | null', description: 'Devuelve el año actual' },
  { name: 'setValue', type: '(value: number | string) => void', description: 'Setea el año' },
];
</script>

<template>
  <PlaygroundLayout title="YearSlider" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Muestra el año actual y navega de 1 en 1 con <code>&lt;</code> / <code>&gt;</code> o arrastrando el label (swipe: izquierda = año siguiente).
        </p>
        <SectionDemo :vue-code="defaultVue">
          <div class="playground-col">
            <YearSlider />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <div class="playground-heading">
          <h2>Límites</h2>
        </div>
        <SectionDemo :vue-code="minMaxVue">
          <div class="playground-col">
            <p class="playground-desc">
              Con <code>min</code> y <code>max</code> la navegación queda limitada: los botones se deshabilitan en el borde y el drag "choca" contra la pared (podés arrastrar el label).
              Acepta años (<code>2020</code>) o fechas estilo MonthSlider (<code>"2020-01-01"</code>).
            </p>
            <YearSlider :min="2020" :max="2030" />
            <YearSlider :min="2024" :max="2028" variant="outlined" />
            <YearSlider min="2020-01-01" max="2030-01-01" variant="soft" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variantes</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue">
          <div class="playground-col">
            <YearSlider v-for="variant in variants" :key="variant" :variant="variant" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colores</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue">
          <div class="playground-col">
            <YearSlider v-for="color in colors" :key="color" :color="color" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue">
          <div class="playground-col">
            <YearSlider :disabled="true" />
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
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
              <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
              <Button color="neutral" @click="programmaticRef?.goToYear(2035); readValue()">goToYear(2035)</Button>
            </div>
            <p class="playground-state">
              getValue(): <strong>{{ programmaticValue ?? '—' }}</strong>
            </p>
            <YearSlider ref="programmaticRef" @change="readValue" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

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
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
