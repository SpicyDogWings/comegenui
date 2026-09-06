<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import { getTokenDescription } from '@/config/css-tokens';
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Textarea from "@/components/form/Textarea.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const paises = [
  { value: 'ar', label: 'Argentina' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
];

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'With For', id: 'for' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Slot', id: 'slot' },
  { label: 'Native', id: 'native' },
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

const vueImport = `<script setup>
import Label from '@/components/form/Label.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
<\/script>

<template>
  <Label label="Correo electrónico" />
  <Label label="Nombre de usuario">
    <Input placeholder="Escribe tu nombre" />
  </Label>
</template>`;

const forVue = `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
<\/script>

<template>
  <Label label="Enfoca el input" for="label-demo-input" />
  <Input id="label-demo-input" placeholder="Recibo el foco al hacer click en el label" />
  <Label label="Sin for" />
  <Input placeholder="No recibo foco" />
</template>`;

const colorsVue = vueSnippet(`  <Label label="Default" />
  <Label label="Azul" color="#2563eb" />
  <Label label="Verde" color="#16a34a" />
  <Label label="Rojo" color="#dc2626" />`);

const slotVue = `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import Textarea from '@/components/form/Textarea.vue'

const paises = [
  { value: 'ar', label: 'Argentina' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
]
<\/script>

<template>
  <Label label="Usuario">
    <Input placeholder="Nombre de usuario" />
  </Label>
  <Label label="País">
    <Select :options="paises" />
  </Label>
  <Label label="Comentarios">
    <Textarea :rows="3" placeholder="Escribe aquí..." />
  </Label>
</template>`;

const nativeVue = `<template>
  <label for="native-usuario">Usuario</label>
  <input id="native-usuario" type="text" placeholder="Input nativo" />

  <label for="native-pais">País</label>
  <select id="native-pais">
    <option>Argentina</option>
    <option>México</option>
    <option>España</option>
  </select>

  <label for="native-comentarios">Comentarios</label>
  <textarea id="native-comentarios" rows="3" placeholder="Textarea nativo"></textarea>
</template>`;

const defaultVanilla = `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>

<cu-label label="Correo electrónico"></cu-label>
<cu-label label="Nombre de usuario">
  <cu-input placeholder="Escribe tu nombre"></cu-input>
</cu-label>`;

const forVanilla = `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>

<cu-label label="Enfoca el input" for="label-demo-input"></cu-label>
<cu-input id="label-demo-input" placeholder="Recibo el foco al hacer click en el label"></cu-input>
<cu-label label="Sin for"></cu-label>
<cu-input placeholder="No recibo foco"></cu-input>`;

const colorsVanilla = `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Primary" color="primary"></cu-label>
<cu-label label="Neutral" color="neutral"></cu-label>
<cu-label label="Success" color="success"></cu-label>
<cu-label label="Warning" color="warning"></cu-label>
<cu-label label="Danger" color="danger"></cu-label>`;

const slotVanilla = `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>
<script src="dist/CuSelect.umd.js"><\/script>
<script src="dist/CuTextarea.umd.js"><\/script>

<cu-label label="Usuario">
  <cu-input placeholder="Nombre de usuario"></cu-input>
</cu-label>
<cu-label label="País">
  <cu-select id="label-pais"></cu-select>
</cu-label>
<cu-label label="Comentarios">
  <cu-textarea rows="3" placeholder="Escribe aquí..."></cu-textarea>
</cu-label>

<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('label-pais').options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'mx', label: 'México' },
      { value: 'es', label: 'España' },
    ];
  });
<\/script>`;

const nativeVanilla = `<label for="native-usuario">Usuario</label>
<input id="native-usuario" type="text" placeholder="Input nativo" />

<label for="native-pais">País</label>
<select id="native-pais">
  <option>Argentina</option>
  <option>México</option>
  <option>España</option>
</select>

<label for="native-comentarios">Comentarios</label>
<textarea id="native-comentarios" rows="3" placeholder="Textarea nativo"></textarea>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const label_tokens = [
  '--label-fg',
  '--cu-font-sans',
  '--cu-space-xs',
];

const styleData = label_tokens.map(name => ({ name, description: getTokenDescription(name) }));

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
              <Input placeholder="Escribe tu nombre" />
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
            <Input id="label-demo-input" placeholder="Recibo el foco al hacer click en el label" />
            <Label label="Sin for" />
            <Input placeholder="No recibo foco" />
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
              <Input placeholder="Nombre de usuario" />
            </Label>
            <Label label="País">
              <Select :options="paises" />
            </Label>
            <Label label="Comentarios">
              <Textarea :rows="3" placeholder="Escribe aquí..." />
            </Label>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="native" class="playground-section">
        <div class="playground-heading">
          <h2>Native</h2>
        </div>
        <p class="playground-desc">
          Los elementos HTML nativos que CuLabel envuelve: <code>label</code> + <code>input</code> / <code>select</code> / <code>textarea</code>, sin estilos de la lib.
        </p>
        <SectionDemo :vue-code="nativeVue" :vanilla-code="nativeVanilla">
          <div class="playground-col" style="display:flex;flex-direction:column;gap:12px;max-width:320px">
            <label for="native-usuario">Usuario</label>
            <input id="native-usuario" type="text" placeholder="Input nativo" />

            <label for="native-pais">País</label>
            <select id="native-pais">
              <option>Argentina</option>
              <option>México</option>
              <option>España</option>
            </select>

            <label for="native-comentarios">Comentarios</label>
            <textarea id="native-comentarios" rows="3" placeholder="Textarea nativo"></textarea>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

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
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="[]" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
