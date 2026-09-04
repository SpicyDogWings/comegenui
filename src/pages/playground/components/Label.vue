<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Label from "@/components/form/Label.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'With For', id: 'for' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Slot', id: 'slot' },
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

const vueImport = `<script setup>
import Label from '@/components/form/Label.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <Label label="Correo electrónico" />
  <Label label="Nombre de usuario">
    <input type="text" placeholder="Escribe tu nombre" />
  </Label>`);

const forVue = vueSnippet(`  <Label label="Enfoca el input" for="label-demo-input" />
  <input id="label-demo-input" type="text" placeholder="Recibo el foco al hacer click en el label" />
  <Label label="Sin for" />
  <input type="text" placeholder="No recibo foco" />`);

const colorsVue = vueSnippet(`  <Label label="Default" />
  <Label label="Azul" color="#2563eb" />
  <Label label="Verde" color="#16a34a" />
  <Label label="Rojo" color="#dc2626" />`);

const slotVue = vueSnippet(`  <Label label="Usuario">
    <input type="text" placeholder="Nombre de usuario" />
  </Label>
  <Label label="País">
    <select>
      <option>Argentina</option>
      <option>México</option>
      <option>España</option>
    </select>
  </Label>
  <Label label="Comentarios">
    <textarea rows="3" placeholder="Escribe aquí..."></textarea>
  </Label>`);

const defaultVanilla = `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Correo electrónico"></cu-label>
<cu-label label="Nombre de usuario">
  <input type="text" placeholder="Escribe tu nombre" />
</cu-label>`;

const forVanilla = `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Enfoca el input" for="label-demo-input"></cu-label>
<input id="label-demo-input" type="text" placeholder="Recibo el foco al hacer click en el label" />
<cu-label label="Sin for"></cu-label>
<input type="text" placeholder="No recibo foco" />`;

const colorsVanilla = `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Primary" color="primary"></cu-label>
<cu-label label="Neutral" color="neutral"></cu-label>
<cu-label label="Success" color="success"></cu-label>
<cu-label label="Warning" color="warning"></cu-label>
<cu-label label="Danger" color="danger"></cu-label>`;

const slotVanilla = `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Usuario">
  <input type="text" placeholder="Nombre de usuario" />
</cu-label>
<cu-label label="País">
  <select>
    <option>Argentina</option>
    <option>México</option>
    <option>España</option>
  </select>
</cu-label>
<cu-label label="Comentarios">
  <textarea rows="3" placeholder="Escribe aquí..."></textarea>
</cu-label>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'for', type: 'string', default: '""', description: 'ID del elemento a enfocar al hacer click en el texto del label' },
  { name: 'label', type: 'string', default: '""', description: 'Texto del label; si está vacío no se renderiza el span' },
  { name: 'color', type: 'string', default: '"#2c2c2c"', description: 'Color del texto (valor CSS). En cu-label acepta nombres semánticos: primary, neutral, success, warning, danger' },
  { name: 'hightContrast', type: 'boolean', default: 'false', description: 'Alto contraste. Typo persistente del codebase (documentado tal cual); declarado pero sin efecto visual en la versión actual' },
];

const slotsData = [
  { name: 'default', type: 'slot', description: 'Contenido bajo el texto del label: inputs, selects, textareas, etc.' },
];

const eventsData = [
  { name: 'click', type: 'custom', description: 'Click en el texto del label; antes enfoca el elemento for si está definido' },
];
</script>

<template>
  <PlaygroundLayout title="Label" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <Label label="Correo electrónico" />
            <Label label="Nombre de usuario">
              <input type="text" placeholder="Escribe tu nombre" />
            </Label>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="for" class="playground-section">
        <div class="playground-heading">
          <h2>With For</h2>
        </div>
        <SectionDemo :vue-code="forVue" :vanilla-code="forVanilla">
          <div class="playground-col">
            <Label label="Enfoca el input" for="label-demo-input" />
            <input id="label-demo-input" type="text" placeholder="Recibo el foco al hacer click en el label" />
            <Label label="Sin for" />
            <input type="text" placeholder="No recibo foco" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">#2c2c2c</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <Label label="Default" />
            <Label label="Azul" color="#2563eb" />
            <Label label="Verde" color="#16a34a" />
            <Label label="Rojo" color="#dc2626" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="slot" class="playground-section">
        <div class="playground-heading">
          <h2>With Slot</h2>
        </div>
        <SectionDemo :vue-code="slotVue" :vanilla-code="slotVanilla">
          <div class="playground-col">
            <Label label="Usuario">
              <input type="text" placeholder="Nombre de usuario" />
            </Label>
            <Label label="País">
              <select>
                <option>Argentina</option>
                <option>México</option>
                <option>España</option>
              </select>
            </Label>
            <Label label="Comentarios">
              <textarea rows="3" placeholder="Escribe aquí..."></textarea>
            </Label>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
