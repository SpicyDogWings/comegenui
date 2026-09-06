<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import { getTokenDescription } from '@/config/css-tokens';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
const dropdownState = ref(false);
const lastEvent = ref("");

function syncState() {
  dropdownState.value = dropdownRef.value?.isOpen() || false;
}

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Positions', id: 'positions' },
  { label: 'Contenedor', id: 'container' },
  { label: 'Custom toggle', id: 'custom-toggle' },
  { label: 'Fixed', id: 'fixed' },
  { label: 'Eventos', id: 'events' },
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
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

// ── Snippets Vue ──

const vueImport = `<script setup>
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const itemContent = `<Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>`;

const variantsVue = vueSnippet(`  <Dropdown label="Solid" variant="solid">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Soft" variant="soft">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Ghost" variant="ghost">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Outlined" variant="outlined">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Subtle" variant="subtle">
    ${itemContent}
  </Dropdown>`);

const colorsVue = vueSnippet(`  <Dropdown color="primary" label="Primary">
    ${itemContent}
  </Dropdown>
  <Dropdown color="secondary" label="Secondary">
    ${itemContent}
  </Dropdown>
  <Dropdown color="neutral" label="Neutral">
    ${itemContent}
  </Dropdown>
  <Dropdown color="success" label="Success">
    ${itemContent}
  </Dropdown>
  <Dropdown color="warning" label="Warning">
    ${itemContent}
  </Dropdown>
  <Dropdown color="danger" label="Danger">
    ${itemContent}
  </Dropdown>`);

const positionsVue = vueSnippet(`  <!-- position: bottom | top | left | right — align: start | center | end -->
  <Dropdown label="Default">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Bottom + start" position="bottom" align="start">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Bottom + center" position="bottom" align="center">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Bottom + end" position="bottom" align="end">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Top + start" position="top" align="start">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Top + center" position="top" align="center">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Top + end" position="top" align="end">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Right + start" position="right" align="start">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Right + center" position="right" align="center">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Right + end" position="right" align="end">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Left + start" position="left" align="start">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Left + center" position="left" align="center">
    ${itemContent}
  </Dropdown>
  <Dropdown label="Left + end" position="left" align="end">
    ${itemContent}
  </Dropdown>`);

const containerVue = vueSnippet(`  <!-- El panel acepta cualquier contenido -->
  <Dropdown label="Calendario en el panel" panel-width="280px">
    <Calendar model-value="2026-08-11" />
  </Dropdown>

  <Dropdown label="Form en el panel" panel-width="240px">
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <strong>Crear acceso</strong>
      <input type="text" placeholder="Nombre" />
      <input type="email" placeholder="Correo" />
      <Button variant="soft" color="primary" style="width:100%">Crear</Button>
    </div>
  </Dropdown>

  <Dropdown label="Lista rica" panel-width="200px">
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Nuevo documento</Button>
    <Button variant="ghost" color="danger" style="width:100%;justify-content:flex-start">Eliminar</Button>
  </Dropdown>`);

const customToggleVue = `<script setup>
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'
<\/script>

<template>
  <!-- El trigger puede ser cualquier cosa: slot #toggle (recibe toggle e isOpen) -->
  <Dropdown>
    <template #toggle="{ toggle, isOpen }">
      <Button variant="outlined" color="primary" @click="toggle">
        <span>☰ Menú</span>
        <span>{{ isOpen ? '▲' : '▼' }}</span>
      </Button>
    </template>
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Perfil</Button>
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Ajustes</Button>
    <Button variant="ghost" color="danger" style="width:100%;justify-content:flex-start">Salir</Button>
  </Dropdown>

  <Dropdown>
    <template #toggle="{ toggle, isOpen }">
      <Button variant="soft" color="neutral" :aria-expanded="isOpen" @click="toggle">⋯</Button>
    </template>
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Editar</Button>
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Duplicar</Button>
  </Dropdown>
</template>`;

const fixedVue = vueSnippet(`  <Dropdown label="Bottom fixed" fixed>
    ${itemContent}
  </Dropdown>
  <Dropdown label="Top fixed" position="top" fixed>
    ${itemContent}
  </Dropdown>
  <Dropdown label="Right fixed" position="right" fixed>
    ${itemContent}
  </Dropdown>
  <Dropdown label="Left fixed" position="left" fixed>
    ${itemContent}
  </Dropdown>`);

const eventsVue = `<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'

const lastEvent = ref('')
<\/script>

<template>
  <Dropdown label="Emito open/close" @open="lastEvent = 'open'" @close="lastEvent = 'close'">
    <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
  </Dropdown>
  <p>Último evento: {{ lastEvent || '—' }}</p>
</template>`;

const disabledVue = vueSnippet(`  <Dropdown label="Disabled" disabled />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'

const dropdownRef = ref(null)
const isOpen = ref(false)

function logState() {
  console.log('isOpen():', dropdownRef.value.isOpen())
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="dropdownRef?.open(); isOpen = true">open()</Button>
      <Button color="neutral" @click="dropdownRef?.close(); isOpen = false">close()</Button>
      <Button color="neutral" @click="dropdownRef?.toggle(); logState()">toggle()</Button>
    </div>
    <Dropdown ref="dropdownRef" label="Controlado por código" @open="isOpen = true" @close="isOpen = false">
      <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 1</Button>
      <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 2</Button>
    </Dropdown>
  </div>
</template>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const dropdown_tokens = [
  '--cu-font-sans',
  '--cu-radius-md',
  '--cu-shadow-xl',
  '--cu-space-sm',
  '--cu-color-surface',
];

const styleData = dropdown_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [{ label: 'Button', path: '/playground/components/button' }, { label: 'Loader', path: '/playground/components/loader' }];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el trigger' },
  { name: 'label', type: 'string', default: '""', description: 'Texto del trigger (si no hay slot #toggle)' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'start, center, end' },
  { name: 'offset', type: 'number', default: '4', description: 'Separación del panel (px)' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Panel position: fixed (viewport, via getBoundingClientRect)' },
  { name: 'panelWidth', type: 'string', default: '""', description: 'Ancho del panel (CSS, ej: "280px"). Vacío = 100% del trigger' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Estado de carga del trigger' },
  { name: 'cooldown', type: 'boolean', default: 'false', description: 'Cooldown tras cerrar el panel' },
  { name: 'cooldownKey', type: 'number', default: '0', description: 'Key para reiniciar el cooldown' },
  { name: 'delay', type: 'number', default: '2000', description: 'Duración del cooldown (ms)' },
];

const slotsData = [
  { name: 'default', description: 'Contenido del panel (cualquier cosa: items, form, calendario…)' },
  { name: 'toggle', description: 'Trigger custom (scoped: toggle, isOpen)' },
];

const eventsData = [
  { name: 'open', type: '() => void', description: 'Se abre el panel' },
  { name: 'close', type: '() => void', description: 'Se cierra el panel' },
];

const exposesData = [
  { name: 'open', type: '() => void', description: 'Abre el panel' },
  { name: 'close', type: '() => void', description: 'Cierra el panel' },
  { name: 'toggle', type: '() => void', description: 'Abre/cierra el panel' },
  { name: 'get', type: '() => boolean', description: 'Estado del panel' },
  { name: 'set', type: '(value: boolean) => void', description: 'Setea el estado' },
  { name: 'reset', type: '() => void', description: 'Resetea el estado' },
  { name: 'isOpen', type: '() => boolean', description: 'Estado del panel' },
];
</script>

<template>
  <PlaygroundLayout title="Dropdown" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">ghost</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue">
          <div class="playground-row">
            <Dropdown label="Solid" variant="solid">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown label="Soft" variant="soft">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown label="Ghost" variant="ghost">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown label="Outlined" variant="outlined">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown label="Subtle" variant="subtle">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue">
          <div class="playground-row">
            <Dropdown color="primary" label="Primary">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown color="secondary" label="Secondary">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown color="neutral" label="Neutral">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown color="success" label="Success">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown color="warning" label="Warning">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
            <Dropdown color="danger" label="Danger">
              <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
            </Dropdown>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Posiciones — todas las combinaciones</h2>
          <Badge color="neutral" title="position + align por defecto">bottom + start</Badge>
        </div>
        <SectionDemo :vue-code="positionsVue">
          <div class="playground-col">
            <div class="playground-position-group">
              <span class="playground-position-group-title">default</span>
              <div class="playground-row">
                <Dropdown label="Default">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
              </div>
            </div>

            <div class="playground-position-group">
              <span class="playground-position-group-title">bottom</span>
              <div class="playground-row">
                <Dropdown label="Start" position="bottom" align="start">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="Center" position="bottom" align="center">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="End" position="bottom" align="end">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
              </div>
            </div>

            <div class="playground-position-group playground-position-group--top">
              <span class="playground-position-group-title">top</span>
              <div class="playground-row">
                <Dropdown label="Start" position="top" align="start">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="Center" position="top" align="center">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="End" position="top" align="end">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
              </div>
            </div>

            <div class="playground-position-group">
              <span class="playground-position-group-title">right</span>
              <div class="playground-row">
                <Dropdown label="Start" position="right" align="start">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="Center" position="right" align="center">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="End" position="right" align="end">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
              </div>
            </div>

            <div class="playground-position-group playground-position-group--left">
              <span class="playground-position-group-title">left</span>
              <div class="playground-row">
                <Dropdown label="Start" position="left" align="start">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="Center" position="left" align="center">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
                <Dropdown label="End" position="left" align="end">
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
                </Dropdown>
              </div>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <!-- El dropdown es un contenedor: cualquier contenido adentro del panel -->
      <section id="container" class="playground-section">
        <div class="playground-heading">
          <h2>Dropdown como contenedor</h2>
        </div>
        <SectionDemo :vue-code="containerVue">
          <div class="playground-col">
            <p class="playground-desc">
              El panel acepta <strong>cualquier contenido</strong>: el dropdown solo aporta toggle, posicionamiento y cierre (click-afuera / Escape).
              Así funciona el <code>DatePicker</code>: un <code>Calendar</code> adentro del panel.
            </p>
            <div class="playground-row">
              <Dropdown label="Calendario en el panel" panel-width="280px">
                <Calendar model-value="2026-08-11" />
              </Dropdown>

              <Dropdown label="Form en el panel" panel-width="240px">
                <div style="display: flex; flex-direction: column; gap: var(--cu-space-sm);">
                  <strong>Crear acceso</strong>
                  <input
                    type="text"
                    placeholder="Nombre"
                    style="padding: var(--cu-space-sm); border-radius: var(--cu-radius-sm); border: var(--cu-border-thin) solid var(--cu-border-color); font-family: var(--cu-font-sans);"
                  />
                  <input
                    type="email"
                    placeholder="Correo"
                    style="padding: var(--cu-space-sm); border-radius: var(--cu-radius-sm); border: var(--cu-border-thin) solid var(--cu-border-color); font-family: var(--cu-font-sans);"
                  />
                  <Button variant="soft" color="primary" style="width:100%">Crear</Button>
                </div>
              </Dropdown>

              <Dropdown label="Lista rica" panel-width="200px">
                <div>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">📄 Nuevo documento</Button>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">📁 Subir archivos</Button>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">🔍 Buscar</Button>
                  <hr style="margin: var(--cu-space-2xs) 0; border: none; border-top: var(--cu-border-thin) solid var(--cu-border-color);" />
                  <Button variant="ghost" color="danger" style="width:100%;justify-content:flex-start">🗑 Eliminar</Button>
                </div>
              </Dropdown>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="custom-toggle" class="playground-section">
        <div class="playground-heading">
          <h2>Custom toggle (slot #toggle)</h2>
        </div>
        <SectionDemo :vue-code="customToggleVue">
          <div class="playground-col">
            <p class="playground-desc">
              El trigger puede ser cualquier cosa: usá el slot <code>#toggle</code> (recibe <code>toggle</code> e <code>isOpen</code>).
            </p>
            <div class="playground-row">
              <Dropdown>
                <template #toggle="{ toggle, isOpen }">
                  <Button variant="outlined" color="primary" @click="toggle">
                    <span>☰ Menú</span>
                    <span>{{ isOpen ? '▲' : '▼' }}</span>
                  </Button>
                </template>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">👤 Perfil</Button>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">⚙️ Ajustes</Button>
                <Button variant="ghost" color="danger" style="width:100%;justify-content:flex-start">🚪 Salir</Button>
              </Dropdown>

              <Dropdown>
                <template #toggle="{ toggle, isOpen }">
                  <Button class="cu-button--icon-only" variant="soft" color="neutral" :aria-expanded="isOpen" @click="toggle">
                    ⋯
                  </Button>
                </template>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Editar</Button>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Duplicar</Button>
              </Dropdown>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="fixed" class="playground-section">
        <div class="playground-heading">
          <h2>Fixed Position</h2>
          <Badge color="neutral" title="fixed por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="fixedVue">
          <div class="playground-col">
            <div class="playground-row">
              <Dropdown label="Bottom fixed" fixed>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
              </Dropdown>
              <div class="playground-dropdown-demo--top">
                <Dropdown label="Top fixed" position="top" fixed>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
                </Dropdown>
              </div>
              <Dropdown label="Right fixed" position="right" fixed>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
              </Dropdown>
              <div class="playground-dropdown-demo--left">
                <Dropdown label="Left fixed" position="left" fixed>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
                  <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
                </Dropdown>
              </div>
            </div>
            <p class="playground-desc">
              Con <code>fixed</code> el panel se fija al viewport y las 4 posiciones calculan con <code>getBoundingClientRect()</code>.
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <div class="playground-heading">
          <h2>Eventos open / close</h2>
        </div>
        <SectionDemo :vue-code="eventsVue">
          <div class="playground-col">
            <div class="playground-row">
              <Dropdown
                label="Emito open/close"
                @open="lastEvent = 'open'"
                @close="lastEvent = 'close'"
              >
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
              </Dropdown>
            </div>
            <p class="playground-desc">Último evento: <strong>{{ lastEvent || '—' }}</strong></p>
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
          <div class="playground-row">
            <Dropdown label="Disabled" disabled />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el panel abre acá al lado.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="dropdownRef?.open(); dropdownState = true">open()</Button>
              <Button color="neutral" @click="dropdownRef?.close(); dropdownState = false">close()</Button>
              <Button color="neutral" @click="dropdownRef?.toggle(); dropdownState = dropdownRef?.isOpen() ?? false">toggle()</Button>
            </div>
            <p class="playground-state">
              isOpen(): <strong>{{ dropdownState ? 'true' : 'false' }}</strong>
            </p>
            <div class="playground-row">
              <Dropdown ref="dropdownRef" label="Controlado por código" @open="dropdownState = true" @close="dropdownState = false">
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 1</Button>
                <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 2</Button>
              </Dropdown>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />

        <h4>Sub-componentes con estilos propios</h4>
        <ul class="playground-component-links">
          <li><a href="/playground/components/button" class="playground-component-link">Button</a> — revisá sus variables CSS en su propia sección Style</li>
          <li><a href="/playground/components/loader" class="playground-component-link">Loader</a> — revisá sus variables CSS en su propia sección Style</li>
        </ul>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-components">Components</h3>
        <p class="playground-desc">
          Este componente usa los siguientes sub-componentes:
        </p>
        <ul class="playground-component-links">
          <li v-for="dep in [{ label: 'Button', path: '/playground/components/button' }, { label: 'Loader', path: '/playground/components/loader' }]" :key="dep.label">
            <a :href="dep.path" class="playground-component-link">{ dep.label }</a>
          </li>
        </ul>

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
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}

/* Grupos de posiciones del dropdown */
.playground-position-group {
  margin-top: 1.25rem;
}

.playground-position-group-title {
  display: block;
  font-size: var(--cu-font-size-xs);
  font-weight: 600;
  color: var(--cu-color-neutral);
  font-family: var(--cu-font-mono);
  margin-bottom: 0.5rem;
}

/* Espacio para que el panel en position="top" no se recorte contra el header */
.playground-position-group--top {
  margin-top: 170px;
}

/* Espacio para que el panel en position="left" no se recorte contra el borde */
.playground-position-group--left {
  margin-left: 240px;
}
</style>
