<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Tabs from "@/components/Tabs.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'With Icons', id: 'icons' },
  { label: 'Colors', id: 'colors' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Controlled', id: 'controlled' },
];

const basicTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Settings' },
  { key: 'activity', label: 'Activity' },
];

const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const controlled = ref('first');
</script>

<template>
  <PlaygroundLayout title="Tabs" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <h2>With Icons</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-variants">
          <Tabs v-for="color in colors" :key="color" variant="pills" :color="color" :tabs="basicTabs">
            <template #overview>Contenido Overview</template>
            <template #settings>Contenido Settings</template>
            <template #activity>Contenido Activity</template>
          </Tabs>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <h2>Sizes</h2>
        <div class="playground-column">
          <Tabs v-for="size in sizes" :key="size" variant="boxed" :size="size" :tabs="basicTabs">
            <template #overview>Contenido Overview</template>
            <template #settings>Contenido Settings</template>
            <template #activity>Contenido Activity</template>
          </Tabs>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="controlled" class="playground-section">
        <h2>Controlled</h2>
        <div class="playground-row">
          <Button color="primary" variant="soft" @click="controlled = 'first'">Ir a First</Button>
          <Button color="secondary" variant="soft" @click="controlled = 'second'">Ir a Second</Button>
          <Button color="danger" variant="soft" @click="controlled = 'third'">Ir a Third</Button>
        </div>
        <Tabs v-model="controlled" :tabs="[
          { key: 'first', label: 'First' },
          { key: 'second', label: 'Second' },
          { key: 'third', label: 'Third' },
        ]">
          <template #first>Contenido First</template>
          <template #second>Contenido Second</template>
          <template #third>Contenido Third</template>
        </Tabs>
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
</style>
