<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import Avatar from "@/components/information/Avatar.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'With Image', id: 'with-image' },
  { label: 'Colors', id: 'colors' },
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

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const avatarStyleData = [
  { name: '--avatar-bg', description: 'Color de fondo (resuelto desde --cu-color-{color})' },
  { name: '--cu-font-weight-semibold', description: 'Peso de las iniciales' },
  { name: '--cu-font-size-xs', description: 'Iniciales tamaño sm' },
  { name: '--cu-font-size-sm', description: 'Iniciales tamaño md' },
  { name: '--cu-font-size-md', description: 'Iniciales tamaño lg' },
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

const defaultVue = `<script setup>
import Avatar from '@/components/information/Avatar.vue'
<\/script>

<template>
  <Avatar initials="JD" />
  <Avatar initials="AB" />
  <Avatar initials="XY" />
</template>`;
const defaultVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuAvatar.umd.js"><\/script>

<cu-avatar initials="JD" />
<cu-avatar initials="AB" />
<cu-avatar initials="XY" />`;

const sizesVue = `<Avatar initials="SM" size="sm" />
<Avatar initials="MD" size="md" />
<Avatar initials="LG" size="lg" />`;
const sizesVanilla = `<cu-avatar initials="SM" size="sm" />
<cu-avatar initials="MD" size="md" />
<cu-avatar initials="LG" size="lg" />`;

const withImageVue = `<Avatar src="https://i.pravatar.cc/150?img=3" />
<Avatar src="https://i.pravatar.cc/150?img=8" />
<Avatar src="https://i.pravatar.cc/150?img=15" />`;
const withImageVanilla = `<cu-avatar src="https://i.pravatar.cc/150?img=3" />
<cu-avatar src="https://i.pravatar.cc/150?img=8" />
<cu-avatar src="https://i.pravatar.cc/150?img=15" />`;

const colorsVue = `<Avatar initials="PR" color="primary" />
<Avatar initials="SC" color="secondary" />
<Avatar initials="SU" color="success" />
<Avatar initials="WA" color="warning" />
<Avatar initials="DA" color="danger" />`;
const colorsVanilla = `<cu-avatar initials="PR" color="primary" />
<cu-avatar initials="SC" color="secondary" />
<cu-avatar initials="SU" color="success" />
<cu-avatar initials="WA" color="warning" />
<cu-avatar initials="DA" color="danger" />`;

const progInitials = ref('AB');
const progColor = ref('primary');
const progSize = ref('md');

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
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
          <Badge color="neutral" title="Color auto por hash de iniciales">auto</Badge>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-row">
            <Avatar initials="JD" />
            <Avatar initials="AB" />
            <Avatar initials="XY" />
            <Avatar initials="MK" />
            <Avatar initials="PL" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
          <Badge color="neutral" title="Tamaño por defecto">md</Badge>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-row">
            <Avatar initials="SM" size="sm" />
            <Avatar initials="MD" size="md" />
            <Avatar initials="LG" size="lg" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="with-image" class="playground-section">
        <div class="playground-heading">
          <h2>With Image</h2>
          <Badge color="neutral" title="Con prop src — muestra foto">image</Badge>
        </div>
        <SectionDemo :vue-code="withImageVue" :vanilla-code="withImageVanilla">
          <div class="playground-row">
            <Avatar src="https://i.pravatar.cc/150?img=3" />
            <Avatar src="https://i.pravatar.cc/150?img=8" />
            <Avatar src="https://i.pravatar.cc/150?img=15" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color explícito">explicit</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <Avatar initials="PR" color="primary" />
            <Avatar initials="SC" color="secondary" />
            <Avatar initials="SU" color="success" />
            <Avatar initials="WA" color="warning" />
            <Avatar initials="DA" color="danger" />
          </div>
        </SectionDemo>
      </section>

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

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="avatarStyleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

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
