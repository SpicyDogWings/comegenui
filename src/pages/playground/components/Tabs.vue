<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Table from "@/components/data/Table.vue";
import Tabs from "@/components/Tabs.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'With Icons', id: 'icons' },
  { label: 'Colors', id: 'colors' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const basicTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Settings' },
  { key: 'activity', label: 'Activity' },
];

const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const controlled = ref('first');
const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'tabs', type: 'TabItem[]', default: '— (requerido)', description: 'Pestañas' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"tabs"', description: 'tabs, pills, boxed, soft' },
  { name: 'size', type: 'string', default: '"md"', description: 'sm, md, lg' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita todas las pestañas' },
];

const slotsData = [
  { name: '{key}', description: 'Contenido del panel de la pestaña (slot dinámico por key)' },
  { name: 'tab-icon-{key}', description: 'Ícono del tab (slot dinámico por key)' },
];

const eventsData = [
  { name: 'update:modelValue', type: '(key: string) => void', description: 'Pestaña activa (v-model)' },
  { name: 'change', type: '(key: string) => void', description: 'Cambia la pestaña activa' },
];

const exposesData = [
  { name: 'getActive', type: '() => string', description: 'Key de la pestaña activa' },
  { name: 'setActive', type: '(key: string) => void', description: 'Activa la pestaña' },
  { name: 'next', type: '() => void', description: 'Activa la siguiente' },
  { name: 'prev', type: '() => void', description: 'Activa la anterior' },
];

const interfaceCode = `interface TabItem {
  key: string
  label: string
  disabled?: boolean
}`;

// ── Snippets Vue ──

const vueImport = `<script setup>
import Tabs from '@/components/Tabs.vue'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Settings' },
  { key: 'activity', label: 'Activity' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <Tabs v-for="variant in ['tabs', 'pills', 'boxed', 'soft']" :key="variant" :variant="variant" :tabs="tabs">
    <template #overview>Contenido Overview</template>
    <template #settings>Contenido Settings</template>
    <template #activity>Contenido Activity</template>
  </Tabs>`);

const iconsVue = `<script setup>
import Tabs from '@/components/Tabs.vue'

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'search', label: 'Search' },
  { key: 'settings', label: 'Settings' },
]
<\/script>

<template>
  <Tabs variant="tabs" :tabs="tabs">
    <template #tab-icon-home><svg ...></svg></template>
    <template #tab-icon-search><svg ...></svg></template>
    <template #tab-icon-settings><svg ...></svg></template>
    <template #home>Contenido Home</template>
    <template #search>Contenido Search</template>
    <template #settings>Contenido Settings</template>
  </Tabs>
</template>`;

const colorsVue = vueSnippet(`  <Tabs v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color" variant="pills" :color="color" :tabs="tabs">
    <template #overview>Contenido Overview</template>
    <template #settings>Contenido Settings</template>
    <template #activity>Contenido Activity</template>
  </Tabs>`);

const sizesVue = vueSnippet(`  <Tabs v-for="size in ['sm', 'md', 'lg']" :key="size" variant="boxed" :size="size" :tabs="tabs">
    <template #overview>Contenido Overview</template>
    <template #settings>Contenido Settings</template>
    <template #activity>Contenido Activity</template>
  </Tabs>`);

const disabledVue = vueSnippet(`  <!-- Todas deshabilitadas -->
  <Tabs variant="tabs" disabled :tabs="tabs">
    <template #overview>Contenido Overview</template>
    <template #settings>Contenido Settings</template>
    <template #activity>Contenido Activity</template>
  </Tabs>

  <!-- Solo una deshabilitada -->
  <Tabs variant="soft" :tabs="[
    { key: 'general', label: 'General' },
    { key: 'locked', label: 'Locked', disabled: true },
    { key: 'admin', label: 'Admin' },
  ]">
    <template #general>Contenido General</template>
    <template #locked>Contenido Locked</template>
    <template #admin>Contenido Admin</template>
  </Tabs>`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Button from '@/components/buttons/Button.vue'

const active = ref('first')
const tabsRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="active = 'first'">first</Button>
      <Button color="neutral" @click="active = 'second'">second</Button>
      <Button color="neutral" @click="active = 'third'">third</Button>
      <Button color="neutral" @click="tabsRef?.next()">next()</Button>
      <Button color="neutral" @click="tabsRef?.prev()">prev()</Button>
    </div>
    <Tabs ref="tabsRef" v-model="active" :tabs="[
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ]">
      <template #first>Contenido First</template>
      <template #second>Contenido Second</template>
      <template #third>Contenido Third</template>
    </Tabs>
  </div>
</template>`;

// ── Snippets Vanilla ──

const tabsImportVanilla = `<script src="dist/CuTabs.umd.js"><\/script>`;

const basicTabsVanilla = `    el.tabs = [
      { key: 'overview', label: 'Overview' },
      { key: 'settings', label: 'Settings' },
      { key: 'activity', label: 'Activity' },
    ];`;

const variantsVanilla = `${tabsImportVanilla}

<cu-tabs variant="tabs">
  <div slot="overview">Contenido Overview</div>
  <div slot="settings">Contenido Settings</div>
  <div slot="activity">Contenido Activity</div>
</cu-tabs>
<cu-tabs variant="pills">
  <div slot="overview">Contenido Overview</div>
  <div slot="settings">Contenido Settings</div>
  <div slot="activity">Contenido Activity</div>
</cu-tabs>
<cu-tabs variant="boxed">
  <div slot="overview">Contenido Overview</div>
  <div slot="settings">Contenido Settings</div>
  <div slot="activity">Contenido Activity</div>
</cu-tabs>
<cu-tabs variant="soft">
  <div slot="overview">Contenido Overview</div>
  <div slot="settings">Contenido Settings</div>
  <div slot="activity">Contenido Activity</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.querySelectorAll('cu-tabs').forEach((el) => {
${basicTabsVanilla}
    });
  });
<\/script>`;

const iconsVanilla = `${tabsImportVanilla}

<cu-tabs id="tabs-icons" variant="tabs">
  <span slot="tab-icon-home"><svg ...></svg></span>
  <span slot="tab-icon-search"><svg ...></svg></span>
  <span slot="tab-icon-settings"><svg ...></svg></span>
  <div slot="home">Contenido Home</div>
  <div slot="search">Contenido Search</div>
  <div slot="settings">Contenido Settings</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('tabs-icons').tabs = [
      { key: 'home', label: 'Home' },
      { key: 'search', label: 'Search' },
      { key: 'settings', label: 'Settings' },
    ];
  });
<\/script>`;

const colorsVanilla = `${tabsImportVanilla}

<cu-tabs id="tabs-primary" variant="pills" color="primary"></cu-tabs>
<cu-tabs id="tabs-secondary" variant="pills" color="secondary"></cu-tabs>
<cu-tabs id="tabs-neutral" variant="pills" color="neutral"></cu-tabs>
<cu-tabs id="tabs-success" variant="pills" color="success"></cu-tabs>
<cu-tabs id="tabs-warning" variant="pills" color="warning"></cu-tabs>
<cu-tabs id="tabs-danger" variant="pills" color="danger"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'].forEach((c) => {
      const el = document.getElementById('tabs-' + c);
${basicTabsVanilla}
    });
  });
<\/script>`;

const sizesVanilla = `${tabsImportVanilla}

<cu-tabs id="tabs-sm" variant="boxed" size="sm"></cu-tabs>
<cu-tabs id="tabs-md" variant="boxed" size="md"></cu-tabs>
<cu-tabs id="tabs-lg" variant="boxed" size="lg"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    ['sm', 'md', 'lg'].forEach((s) => {
      const el = document.getElementById('tabs-' + s);
${basicTabsVanilla}
    });
  });
<\/script>`;

const disabledVanilla = `${tabsImportVanilla}

<!-- Todas deshabilitadas -->
<cu-tabs id="tabs-disabled" variant="tabs" disabled></cu-tabs>

<!-- Solo una -->
<cu-tabs id="tabs-locked" variant="soft"></cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const all = document.getElementById('tabs-disabled');
${basicTabsVanilla}
    const locked = document.getElementById('tabs-locked');
    locked.tabs = [
      { key: 'general', label: 'General' },
      { key: 'locked', label: 'Locked', disabled: true },
      { key: 'admin', label: 'Admin' },
    ];
  });
<\/script>`;

const programmaticVanilla = `${tabsImportVanilla}
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="tabs-prog-first">first</cu-button>
  <cu-button id="tabs-prog-second">second</cu-button>
  <cu-button id="tabs-prog-third">third</cu-button>
  <cu-button id="tabs-prog-next">next()</cu-button>
  <cu-button id="tabs-prog-prev">prev()</cu-button>
</div>

<cu-tabs id="tabs-prog">
  <div slot="first">Contenido First</div>
  <div slot="second">Contenido Second</div>
  <div slot="third">Contenido Third</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('tabs-prog');
    tabs.tabs = [
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ];
    document.getElementById('tabs-prog-first').addEventListener('click', () => (tabs.modelValue = 'first'));
    document.getElementById('tabs-prog-second').addEventListener('click', () => (tabs.modelValue = 'second'));
    document.getElementById('tabs-prog-third').addEventListener('click', () => (tabs.modelValue = 'third'));
    document.getElementById('tabs-prog-next').addEventListener('click', () => tabs.next());
    document.getElementById('tabs-prog-prev').addEventListener('click', () => tabs.prev());
    tabs.addEventListener('update:modelValue', (e) => console.log('active:', e.detail));
  });
<\/script>`;
</script>

<template>
  <PlaygroundLayout title="Tabs" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">tabs</Badge>
        </div>
        <Button variant="link" to="#api-interfaces">Ver interfaz TabItem ↓</Button>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-variants">
            <Tabs variant="tabs" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
            <Tabs variant="pills" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
            <Tabs variant="boxed" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
            <Tabs variant="soft" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <div class="playground-heading">
          <h2>With Icons</h2>
        </div>
        <SectionDemo :vue-code="iconsVue" :vanilla-code="iconsVanilla">
          <div class="playground-variants">
            <Tabs variant="tabs" :tabs="[
              { key: 'home', label: 'Home' },
              { key: 'search', label: 'Search' },
              { key: 'settings', label: 'Settings' },
            ]">
              <template #tab-icon-home>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </template>
              <template #tab-icon-search>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </template>
              <template #tab-icon-settings>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </template>
              <template #home>Contenido Home</template>
              <template #search>Contenido Search</template>
              <template #settings>Contenido Settings</template>
            </Tabs>
            <Tabs variant="pills" :tabs="[
              { key: 'home', label: 'Home' },
              { key: 'search', label: 'Search' },
              { key: 'settings', label: 'Settings' },
            ]">
              <template #tab-icon-home>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </template>
              <template #tab-icon-search>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </template>
              <template #tab-icon-settings>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </template>
              <template #home>Contenido Home</template>
              <template #search>Contenido Search</template>
              <template #settings>Contenido Settings</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-variants">
            <Tabs v-for="color in colors" :key="color" variant="pills" :color="color" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
          <Badge color="neutral" title="size por defecto">md</Badge>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-col">
            <Tabs v-for="size in sizes" :key="size" variant="boxed" :size="size" :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue" :vanilla-code="disabledVanilla">
          <div class="playground-col">
            <Tabs variant="tabs" disabled :tabs="basicTabs">
              <template #overview>Contenido Overview</template>
              <template #settings>Contenido Settings</template>
              <template #activity>Contenido Activity</template>
            </Tabs>
            <Tabs variant="soft" :tabs="[
              { key: 'general', label: 'General' },
              { key: 'locked', label: 'Locked', disabled: true },
              { key: 'admin', label: 'Admin' },
            ]">
              <template #general>Contenido General</template>
              <template #locked>Contenido Locked</template>
              <template #admin>Contenido Admin</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — v-model y métodos en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="controlled = 'first'">first</Button>
              <Button color="neutral" @click="controlled = 'second'">second</Button>
              <Button color="neutral" @click="controlled = 'third'">third</Button>
              <Button color="neutral" @click="tabsRef?.next()">next()</Button>
              <Button color="neutral" @click="tabsRef?.prev()">prev()</Button>
            </div>
            <p class="playground-state">
              active: <strong>{{ controlled }}</strong>
            </p>
            <Tabs ref="tabsRef" v-model="controlled" :tabs="[
              { key: 'first', label: 'First' },
              { key: 'second', label: 'Second' },
              { key: 'third', label: 'Third' },
            ]">
              <template #first>Contenido First</template>
              <template #second>Contenido Second</template>
              <template #third>Contenido Third</template>
            </Tabs>
          </div>
        </SectionDemo>
      </section>

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

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-variants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.playground-variants :deep(.cu-tabs) {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
  padding: 1rem;
  background-color: var(--cu-color-surface);
}

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
