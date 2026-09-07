<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import SideOver from "@/components/overlay/SideOver.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import Input from "@/components/form/Input.vue";
import Textarea from "@/components/form/Textarea.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Positions', id: 'positions' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Fullscreen', id: 'fullscreen' },
  { label: 'Persistent', id: 'persistent' },
  { label: 'Formulario', id: 'form' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [{ label: 'CSS Variables', id: 'style-variables' }],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
    ],
  },
];

const openRight = ref(false);
const openLeft = ref(false);
const openTop = ref(false);
const openBottom = ref(false);
const openSm = ref(false);
const openMd = ref(false);
const openLg = ref(false);
const openXl = ref(false);
const openFull = ref(false);
const openPersistent = ref(false);
const openForm = ref(false);
const programmatic = ref(false);

const vueImport = `<script setup lang="ts">
import SideOver from '@/components/overlay/SideOver.vue'

const open = ref(false)
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Button @click="open = true">Abrir</Button>
  <SideOver v-model="open" title="Título" position="left">
    <p>Panel que desliza desde la izquierda.</p>
  </SideOver>`);

const sizesVue = vueSnippet(`  <Button @click="open = true">Abrir</Button>
  <SideOver v-model="open" title="Tamaño md" size="md">
    <p>Los presets de tamaño siguen el mismo esquema que Modal: sm | md | lg | xl | full.</p>
  </SideOver>`);

const fullVue = vueSnippet(`  <SideOver v-model="open" title="Fullscreen" fullscreen position="bottom">
    <p>Ocupa toda la pantalla (100dvh).</p>
  </SideOver>`);

const persistentVue = vueSnippet(`  <!-- No se cierra por backdrop, Escape ni el botón de cerrar -->
  <SideOver v-model="open" title="Persistent" persistent>
    <p>Solo se cierra con open=false</p>
    <Button @click="open = false">Cerrar</Button>
  </SideOver>`);

const vanillaImport = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuSideOver.umd.js"><\/script>`;

const vanillaSnippet = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Título" position="left" size="300px">
  <div>
    <p>Panel desde la izquierda.</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const sizesVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Tamaño md" position="right" size="md">
  <div>
    <p>Presets: sm | md | lg | xl | full</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const fullscreenVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Fullscreen" position="bottom" fullscreen>
  <div>
    <p>Ocupa toda la pantalla (100dvh).</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const persistentVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Persistent" position="right" persistent>
  <div>
    <p>Se cierra solo programáticamente</p>
    <button onclick="document.querySelector('#side').close()">Cerrar</button>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const formBody = `<form style="display:flex;flex-direction:column;gap:1rem">
    <label>Nombre<br><input type="text" placeholder="Nombre" style="width:100%;padding:0.5rem"></label>
    <label>Email<br><input type="email" placeholder="Email" style="width:100%;padding:0.5rem"></label>
    <label>Teléfono<br><input type="tel" placeholder="Teléfono" style="width:100%;padding:0.5rem"></label>
    <label>Empresa<br><input type="text" placeholder="Empresa" style="width:100%;padding:0.5rem"></label>
    <label>Cargo<br><input type="text" placeholder="Cargo" style="width:100%;padding:0.5rem"></label>
    <label>Dirección<br><input type="text" placeholder="Dirección" style="width:100%;padding:0.5rem"></label>
    <label>Ciudad<br><input type="text" placeholder="Ciudad" style="width:100%;padding:0.5rem"></label>
    <label>País<br><input type="text" placeholder="País" style="width:100%;padding:0.5rem"></label>
    <label>Comentarios<br><textarea placeholder="Comentarios" rows="3" style="width:100%;padding:0.5rem"></textarea></label>
    <button type="submit" style="padding:0.5rem">Guardar</button>
  </form>`;

const formVue = vueSnippet(`  <SideOver v-model="open" title="Nuevo registro" size="md">
${formBody}
  </SideOver>`);

const formVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Nuevo registro" position="right" size="md">
${formBody}
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const componentTokens = [
  '--cu-color-surface',
  '--cu-shadow-xl',
  '--cu-radius-md',
  '--cu-font-sans',
  '--cu-border-color',
  '--cu-sideover-size-md',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'boolean', default: 'false', description: 'Abre/cierra el panel (v-model)' },
  { name: 'title', type: 'string', default: '""', description: 'Título del panel. Se muestra en el header junto al botón de cerrar' },
  { name: 'position', type: '"left" | "right" | "top" | "bottom"', default: '"right"', description: 'Desde qué borde desliza el panel' },
  { name: 'size', type: 'string', default: '"300px"', description: 'Ancho (left/right) o alto (top/bottom) del panel. Acepta CSS ("300px", "40vw") o preset "sm" | "md" | "lg" | "xl" | "full". Ignorado en fullscreen' },
  { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Ocupa toda la pantalla (inset 0)' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'No se cierra por backdrop, Escape ni el botón de cerrar (que se oculta)' },
  { name: 'zIndex', type: 'number', default: '1100', description: 'Z-index del overlay' },
];

const slotsData = [
  { name: 'default', type: 'contenido', default: '—', description: 'Contenido del panel' },
];

const eventsData = [
  { name: 'update:modelValue', type: 'boolean', description: 'Se emite al abrir/cerrar' },
  { name: 'close', type: '—', description: 'Se emite cuando se cierra (backdrop/Escape)' },
];
</script>

<template>
  <PlaygroundLayout title="SideOver" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Valor por defecto">right</Badge>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="vanillaSnippet">
          <div class="playground-row">
            <Button @click="openRight = true" color="primary" variant="soft">Right</Button>
            <Button @click="openLeft = true" variant="soft">Left</Button>
            <Button @click="openTop = true" variant="soft">Top</Button>
            <Button @click="openBottom = true" variant="soft">Bottom</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
          <Badge color="neutral" title="Presets como Modal">sm | md | lg | xl | full</Badge>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-row">
            <Button @click="openSm = true" variant="soft">sm</Button>
            <Button @click="openMd = true" color="primary" variant="soft">md</Button>
            <Button @click="openLg = true" variant="soft">lg</Button>
            <Button @click="openXl = true" variant="soft">xl</Button>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fullscreen" class="playground-section">
        <div class="playground-heading">
          <h2>Fullscreen</h2>
          <Badge color="neutral" title="Ocupa toda la pantalla">fullscreen</Badge>
        </div>
        <SectionDemo :vue-code="fullVue" :vanilla-code="fullscreenVanilla">
          <Button @click="openFull = true" color="primary" variant="soft">Abrir fullscreen</Button>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="persistent" class="playground-section">
        <div class="playground-heading">
          <h2>Persistent</h2>
          <Badge color="neutral" title="No se cierra por backdrop, Escape ni botón">persistent</Badge>
        </div>
        <SectionDemo :vue-code="persistentVue" :vanilla-code="persistentVanilla">
          <Button @click="openPersistent = true" color="warning" variant="soft">Abrir persistent</Button>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="form" class="playground-section">
        <div class="playground-heading">
          <h2>Formulario</h2>
          <Badge color="neutral" title="El contenido scrollea, el header queda fijo">scroll interno</Badge>
        </div>
        <SectionDemo :vue-code="formVue" :vanilla-code="formVanilla">
          <Button @click="openForm = true" color="primary" variant="soft">Abrir formulario</Button>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <div class="playground-row">
          <Button @click="programmatic = true" color="primary" variant="solid">open()</Button>
          <Button @click="programmatic = false" variant="ghost">close()</Button>
        </div>
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
      </section>

    </div>
  </PlaygroundLayout>

  <SideOver v-model="openRight" title="Right" position="right"><div class="sideover-demo"><p>Panel desde la derecha.</p></div></SideOver>
  <SideOver v-model="openLeft" title="Left" position="left" size="300px"><div class="sideover-demo"><p>Panel desde la izquierda.</p></div></SideOver>
  <SideOver v-model="openTop" title="Top" position="top" size="200px"><div class="sideover-demo"><p>Panel desde arriba.</p></div></SideOver>
  <SideOver v-model="openBottom" title="Bottom" position="bottom" size="200px"><div class="sideover-demo"><p>Panel desde abajo.</p></div></SideOver>
  <SideOver v-model="openSm" title="sm — 320px" position="right" size="sm"><div class="sideover-demo"><p>Preset sm.</p></div></SideOver>
  <SideOver v-model="openMd" title="md — 400px" position="right" size="md"><div class="sideover-demo"><p>Preset md.</p></div></SideOver>
  <SideOver v-model="openLg" title="lg — 512px" position="right" size="lg"><div class="sideover-demo"><p>Preset lg.</p></div></SideOver>
  <SideOver v-model="openXl" title="xl — 640px" position="right" size="xl"><div class="sideover-demo"><p>Preset xl.</p></div></SideOver>
  <SideOver v-model="openFull" title="Fullscreen" fullscreen position="bottom"><div class="sideover-demo"><p>Ocupa toda la pantalla.</p></div></SideOver>
  <SideOver v-model="openPersistent" title="Persistent" position="right" persistent>
    <div class="sideover-demo">
      <p>Se cierra solo con open=false</p>
      <Button @click="openPersistent = false" color="primary" variant="soft">Cerrar</Button>
    </div>
  </SideOver>
  <SideOver v-model="openForm" title="Nuevo registro" position="right" size="md">
    <form class="sideover-form">
      <label>Nombre<br /><Input placeholder="Nombre" /></label>
      <label>Email<br /><Input placeholder="Email" type="email" /></label>
      <label>Teléfono<br /><Input placeholder="Teléfono" type="tel" /></label>
      <label>Empresa<br /><Input placeholder="Empresa" /></label>
      <label>Cargo<br /><Input placeholder="Cargo" /></label>
      <label>Dirección<br /><Input placeholder="Dirección" /></label>
      <label>Ciudad<br /><Input placeholder="Ciudad" /></label>
      <label>País<br /><Input placeholder="País" /></label>
      <label>Comentarios<br /><Textarea placeholder="Comentarios" rows="3" /></label>
      <Button color="primary" variant="solid" @click="openForm = false">Guardar</Button>
    </form>
  </SideOver>
  <SideOver v-model="programmatic" title="Programmatic" position="right" size="300px"><div class="sideover-demo"><p>Controlado por open() / close().</p></div></SideOver>
</template>

<style scoped>
.sideover-demo h3 {
  margin: 0 0 var(--cu-space-sm);
}
.sideover-form {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
}
.sideover-form label {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
}
</style>