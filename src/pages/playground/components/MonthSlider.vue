<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof MonthSlider> | null>(null);
const programmaticValue = ref<Date | null>(null);

function readValue() {
  programmaticValue.value = programmaticRef.value?.getValue() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Sin año', id: 'no-year-nav' },
  { label: 'Formatos', id: 'formats' },
  { label: 'Año distinto', id: 'other-year' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Min / Max', id: 'min-max' },
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
import MonthSlider from '@/components/controls/MonthSlider.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <MonthSlider />`);

const noYearNavVue = vueSnippet(`  <MonthSlider :year-navigation="false" />`);

const formatsVue = vueSnippet(`  <MonthSlider month-format="MMMM" />
  <MonthSlider month-format="MMM" />
  <MonthSlider month-format="MMMM yyyy" />
  <MonthSlider month-format="MM/yyyy" />
  <MonthSlider month-format="MMM yy" />`);

const otherYearVue = vueSnippet(`  <MonthSlider model-value="2025-03-01" />
  <MonthSlider model-value="2027-11-15" month-format="MMM" />
  <MonthSlider model-value="2025-03-01" variant="solid" />`);

const variantsVue = vueSnippet(`  <MonthSlider v-for="variant in ['solid', 'outlined', 'soft', 'ghost', 'subtle']" :key="variant" :variant="variant" />`);

const minMaxVue = vueSnippet(`  <MonthSlider min="2026-01-01" max="2026-12-01" />
  <MonthSlider min="2024-06-01" max="2028-06-01" month-format="MMM yyyy" variant="outlined" />
  <MonthSlider min="2026-05-01" model-value="2025-01-01" />`);

const colorsVue = vueSnippet(`  <MonthSlider color="primary" />
  <MonthSlider color="secondary" />
  <MonthSlider color="neutral" />
  <MonthSlider color="success" />
  <MonthSlider color="warning" />
  <MonthSlider color="danger" />`);

const disabledVue = vueSnippet(`  <MonthSlider disabled />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import MonthSlider from '@/components/controls/MonthSlider.vue'
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
      <Button color="neutral" @click="programmaticRef?.nextMonth(); readValue()">nextMonth()</Button>
      <Button color="neutral" @click="programmaticRef?.prevMonth(); readValue()">prevMonth()</Button>
      <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
      <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
      <Button color="neutral" @click="programmaticRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
    </div>
    <MonthSlider ref="programmaticRef" @change="readValue" />
  </div>
</template>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const monthslider_tokens = [
  '--cu-font-sans',
  '--cu-space-2xs',
  '--cu-color-surface',
];

const styleData = monthslider_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentTokens = [
  '--ms-accent',
  '--ms-accent-hover',
  '--ms-accent-text',
  '--ms-soft',
  '--ms-soft-hover',
  '--ms-subtle',
  '--ms-subtle-border',
  '--ms-subtle-hover',
  '--ms-ghost-hover',
  '--ms-surface',
  '--cu-font-sans',
  '--cu-space-2xs',
];

const componentDeps = [
  { label: 'MonthSliderLabel', path: '/playground/components/month-slider' }
];

const styleSubComponents = [
  { label: 'MonthSliderLabel', path: '/playground/components/month-slider#style' }
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string | number | Date | null', default: 'null', description: 'Valor (v-model)' },
  { name: 'monthFormat', type: 'string', default: '"MMMM"', description: 'Formato del mes (tokens MM MMM MMMM)' },
  { name: 'yearFormat', type: 'string', default: '"yyyy"', description: 'Formato del año (tokens yy yyyy)' },
  { name: 'locale', type: 'string', default: '"es"', description: 'Locale de los nombres' },
  { name: 'yearNavigation', type: 'boolean', default: 'true', description: 'Habilita navegación de años (‹ ‹‹)' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'min', type: 'string | number | Date | null', default: 'null', description: 'Mes mínimo' },
  { name: 'max', type: 'string | number | Date | null', default: 'null', description: 'Mes máximo' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el control' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: '(value: Date) => void', description: 'Al cambiar el mes (v-model)' },
  { name: 'change', type: '(value: Date) => void', description: 'Al cambiar el mes' },
];

const exposesData = [
  { name: 'nextMonth', type: '() => void', description: 'Avanza un mes' },
  { name: 'prevMonth', type: '() => void', description: 'Retrocede un mes' },
  { name: 'nextYear', type: '() => void', description: 'Avanza un año' },
  { name: 'prevYear', type: '() => void', description: 'Retrocede un año' },
  { name: 'goToMonth', type: '(value: string | number | Date) => void', description: 'Va al mes indicado' },
  { name: 'getValue', type: '() => Date | null', description: 'Devuelve el valor actual' },
  { name: 'setValue', type: '(value: string | number | Date) => void', description: 'Setea el valor' },
];
</script>

<template>
  <PlaygroundLayout title="MonthSlider" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Muestra el mes actual. Si el año es el actual, el año se oculta; si navegás a otro año, aparece al lado del mes.
        </p>
        <SectionDemo :vue-code="defaultVue">
          <div class="playground-col">
            <MonthSlider />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="no-year-nav" class="playground-section">
        <div class="playground-heading">
          <h2>Sin navegación de año</h2>
          <Badge color="neutral" title="yearNavigation por defecto">true</Badge>
        </div>
        <SectionDemo :vue-code="noYearNavVue">
          <div class="playground-col">
            <p class="playground-desc">
              Con <code>year-navigation="false"</code> se ocultan los botones <code>&lt;&lt;</code> / <code>&gt;&gt;</code>.
            </p>
            <MonthSlider :year-navigation="false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="formats" class="playground-section">
        <div class="playground-heading">
          <h2>Formatos</h2>
          <Badge color="neutral" title="monthFormat por defecto">MMMM</Badge>
        </div>
        <SectionDemo :vue-code="formatsVue">
          <div class="playground-col">
            <p class="playground-desc">
              Tokens: <code>MMMM</code> (largo), <code>MMM</code> (corto), <code>MM</code>/<code>M</code> (número), <code>yyyy</code>/<code>yy</code> (año).
              Si el formato incluye año, se respeta tal cual.
            </p>
            <MonthSlider month-format="MMMM" />
            <MonthSlider month-format="MMM" />
            <MonthSlider month-format="MMMM yyyy" />
            <MonthSlider month-format="MM/yyyy" />
            <MonthSlider month-format="MMM yy" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="other-year" class="playground-section">
        <div class="playground-heading">
          <h2>Año distinto al actual</h2>
        </div>
        <SectionDemo :vue-code="otherYearVue">
          <div class="playground-col">
            <p class="playground-desc">
              Con <code>model-value="2025-03-01"</code> el año aparece automáticamente porque no es el año en curso.
            </p>
            <MonthSlider model-value="2025-03-01" />
            <MonthSlider model-value="2027-11-15" month-format="MMM" />
            <MonthSlider model-value="2025-03-01" variant="solid" />
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
            <MonthSlider v-for="variant in variants" :key="variant" :variant="variant" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <div class="playground-heading">
          <h2>Fechas mínima y máxima</h2>
        </div>
        <SectionDemo :vue-code="minMaxVue">
          <div class="playground-col">
            <p class="playground-desc">
              Con <code>min</code> y <code>max</code> la navegación queda limitada: los botones se deshabilitan al llegar al borde y el drag se recorta.
            </p>
            <MonthSlider min="2026-01-01" max="2026-12-01" />
            <MonthSlider min="2024-06-01" max="2028-06-01" month-format="MMM yyyy" variant="outlined" />
            <MonthSlider min="2026-05-01" model-value="2025-01-01" />
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
            <MonthSlider v-for="color in colors" :key="color" :color="color" />
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
            <MonthSlider :disabled="true" />
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
              <Button color="neutral" @click="programmaticRef?.nextMonth(); readValue()">nextMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.prevMonth(); readValue()">prevMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
              <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
              <Button color="neutral" @click="programmaticRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
            </div>
            <p class="playground-state">
              getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
            </p>
            <MonthSlider ref="programmaticRef" @change="readValue" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>        <PlaygroundApiComponents :deps="componentDeps" />

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
