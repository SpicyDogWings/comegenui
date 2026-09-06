<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import { getTokenDescription } from '@/config/css-tokens';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const defaultModalRef = ref<InstanceType<typeof Modal> | null>(null);
const defaultFooterModalRef = ref<InstanceType<typeof Modal> | null>(null);
const persistentModalRef = ref<InstanceType<typeof Modal> | null>(null);
const persistentDefaultFooterModalRef = ref<InstanceType<typeof Modal> | null>(null);
const colorModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const sizeModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const heightModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const iconModalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
const programmaticModalRef = ref<InstanceType<typeof Modal> | null>(null);
const programmaticIsOpen = ref(false);

const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const heights = ["auto", "sm", "md", "lg", "xl", "full"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const iconExamples = [
  {
    color: "success" as const,
    title: "Success",
    description: "The operation completed successfully.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
  },
  {
    color: "warning" as const,
    title: "Warning",
    description: "Please review before continuing.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  },
  {
    color: "danger" as const,
    title: "Danger",
    description: "This action cannot be undone.",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  },
];

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Default Footer', id: 'default-footer' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Icon', id: 'icons' },
  { label: 'Sizes', id: 'sizes' },
  { label: 'Heights', id: 'heights' },
  { label: 'Persistent', id: 'persistent' },
  { label: 'Persistent Default Footer', id: 'persistent-default-footer' },
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
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const modalRef = ref(null)
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <Button color="neutral" @click="modalRef?.open()">Open Modal</Button>
  <Modal ref="modalRef" title="Default Modal" description="This is a default modal with neutral color.">
    <p>Modal content goes here. The title color is neutral by default.</p>
  </Modal>`);

const defaultFooterVue = vueSnippet(`  <Button color="neutral" @click="modalRef?.open()">Open Modal (no footer slot)</Button>
  <Modal ref="modalRef" title="Default Footer" description="No footer slot provided, so a 'Cerrar' button is shown.">
    <p>This modal doesn't have a custom footer slot. The default "Cerrar" button is shown automatically.</p>
  </Modal>`);

const colorsVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']
const refs = ref([])
<\/script>

<template>
  <Button v-for="(color, i) in colors" :key="color" :color="color" variant="solid" @click="refs[i]?.open()">
    {{ color }}
  </Button>
  <Modal
    v-for="(color, i) in colors"
    :key="color"
    :ref="el => refs[i] = el"
    :color="color"
    :title="color.charAt(0).toUpperCase() + color.slice(1) + ' Modal'"
  >
    <p>The title uses the <strong>{{ color }}</strong> color token. Background is always surface.</p>
  </Modal>
</template>`;

const iconsVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const items = [
  { color: 'success', title: 'Success', description: 'The operation completed successfully.', icon: '<svg ...></svg>' },
  { color: 'warning', title: 'Warning', description: 'Please review before continuing.', icon: '<svg ...></svg>' },
  { color: 'danger', title: 'Danger', description: 'This action cannot be undone.', icon: '<svg ...></svg>' },
]
const refs = ref([])
<\/script>

<template>
  <Button v-for="(item, i) in items" :key="item.color" :color="item.color" variant="solid" @click="refs[i]?.open()">
    {{ item.title }}
  </Button>
  <Modal v-for="(item, i) in items" :key="item.color" :ref="el => refs[i] = el" :color="item.color" :title="item.title">
    <template #icon>
      <span v-html="item.icon"></span>
    </template>
    <p>{{ item.description }}</p>
    <template #footer>
      <Button :color="item.color" variant="solid" @click="refs[i]?.close()">OK</Button>
    </template>
  </Modal>
</template>`;

const sizesVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const sizes = ['auto', 'sm', 'md', 'lg', 'xl', 'full']
const refs = ref([])
<\/script>

<template>
  <Button v-for="(size, i) in sizes" :key="size" color="neutral" variant="outlined" @click="refs[i]?.open()">
    {{ size }}
  </Button>
  <Modal v-for="(size, i) in sizes" :key="size" :ref="el => refs[i] = el" :size="size" :title="'Size: ' + size">
    <p>This modal has size <strong>{{ size }}</strong>.</p>
  </Modal>
</template>`;

const heightsVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const heights = ['auto', 'sm', 'md', 'lg', 'xl', 'full']
const refs = ref([])
<\/script>

<template>
  <Button v-for="(height, i) in heights" :key="height" color="neutral" variant="outlined" @click="refs[i]?.open()">
    {{ height }}
  </Button>
  <Modal v-for="(height, i) in heights" :key="height" :ref="el => refs[i] = el" :height="height" :title="'Height: ' + height">
    <div style="min-height: 400px;">
      <p>This modal has height <strong>{{ height }}</strong>.</p>
      <p>The content area is tall to demonstrate scrolling behavior.</p>
    </div>
  </Modal>
</template>`;

const persistentVue = vueSnippet(`  <Button color="neutral" @click="modalRef?.open()">Open Persistent Modal (custom footer)</Button>
  <Modal ref="modalRef" title="Persistent Modal" persistent description="Cannot be closed by clicking outside or pressing Escape.">
    <p>Try clicking the backdrop or pressing Escape — it won't close.</p>
    <template #footer>
      <Button color="neutral" variant="solid" @click="modalRef?.close()">Got it</Button>
    </template>
  </Modal>`);

const persistentDefaultFooterVue = vueSnippet(`  <Button color="neutral" @click="modalRef?.open()">Open Persistent Modal (default footer)</Button>
  <Modal
    ref="modalRef"
    title="Delete Item"
    persistent
    color="danger"
    description="This action cannot be undone."
    @cancel="console.log('cancel')"
    @accept="console.log('accept')"
  >
    <p>Are you sure you want to delete this item?</p>
  </Modal>`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const modalRef = ref(null)
const isOpen = ref(false)

function logState() {
  console.log('isOpen():', modalRef.value.isOpen())
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="modalRef?.open(); isOpen = true">open()</Button>
      <Button color="neutral" @click="modalRef?.close(); isOpen = false">close()</Button>
      <Button color="neutral" @click="modalRef?.toggle(); logState()">toggle()</Button>
    </div>
    <Modal ref="modalRef" title="Programmatic Modal" @opened="isOpen = true" @closed="isOpen = false">
      <p>This modal is controlled programmatically via open(), close(), and toggle() methods.</p>
    </Modal>
  </div>
</template>`;

// ── Snippets Vanilla ──

const modalImportVanilla = `<script src="dist/CuModal.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>`;

const defaultVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="modal-default-open" color="primary" variant="solid">Open Modal</cu-button>
</div>

<cu-modal id="modal-default" title="Default Modal" description="This is a default modal with neutral color.">
  <p>Modal content goes here. The title color is neutral by default.</p>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    document.getElementById('modal-default-open').addEventListener('click', () => {
      document.getElementById('modal-default').open();
    });
  });
<\/script>`;

const defaultFooterVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="modal-nf-open" color="primary" variant="solid">Open Modal (no footer slot)</cu-button>
</div>

<cu-modal id="modal-nf" title="Default Footer" description="No footer slot → botón Cerrar por defecto.">
  <p>This modal doesn't have a custom footer slot. The default "Cerrar" button is shown automatically.</p>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    document.getElementById('modal-nf-open').addEventListener('click', () => {
      document.getElementById('modal-nf').open();
    });
  });
<\/script>`;

const colorsVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="btn-color-primary" color="primary" variant="solid">primary</cu-button>
  <cu-button id="btn-color-secondary" color="secondary" variant="solid">secondary</cu-button>
  <cu-button id="btn-color-neutral" color="neutral" variant="solid">neutral</cu-button>
  <cu-button id="btn-color-success" color="success" variant="solid">success</cu-button>
  <cu-button id="btn-color-warning" color="warning" variant="solid">warning</cu-button>
  <cu-button id="btn-color-danger" color="danger" variant="solid">danger</cu-button>
</div>

<cu-modal id="modal-color-primary" color="primary" title="Primary Modal"><p>The title uses the <strong>primary</strong> color token.</p></cu-modal>
<cu-modal id="modal-color-secondary" color="secondary" title="Secondary Modal"><p>The title uses the <strong>secondary</strong> color token.</p></cu-modal>
<cu-modal id="modal-color-neutral" color="neutral" title="Neutral Modal"><p>The title uses the <strong>neutral</strong> color token.</p></cu-modal>
<cu-modal id="modal-color-success" color="success" title="Success Modal"><p>The title uses the <strong>success</strong> color token.</p></cu-modal>
<cu-modal id="modal-color-warning" color="warning" title="Warning Modal"><p>The title uses the <strong>warning</strong> color token.</p></cu-modal>
<cu-modal id="modal-color-danger" color="danger" title="Danger Modal"><p>The title uses the <strong>danger</strong> color token.</p></cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'].forEach((c) => {
      document.getElementById('btn-color-' + c).addEventListener('click', () => {
        document.getElementById('modal-color-' + c).open();
      });
    });
  });
<\/script>`;

const iconsVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="btn-icon-success" color="success" variant="solid">Success</cu-button>
</div>

<cu-modal id="modal-icon-success" color="success" title="Success">
  <span slot="icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></span>
  <p>The operation completed successfully.</p>
  <div slot="footer">
    <cu-button id="btn-icon-ok" color="success" variant="solid">OK</cu-button>
  </div>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    const modal = document.getElementById('modal-icon-success');
    document.getElementById('btn-icon-success').addEventListener('click', () => modal.open());
    document.getElementById('btn-icon-ok').addEventListener('click', () => modal.close());
  });
<\/script>`;

const sizesVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="btn-size-auto" color="neutral" variant="outlined">auto</cu-button>
  <cu-button id="btn-size-sm" color="neutral" variant="outlined">sm</cu-button>
  <cu-button id="btn-size-md" color="neutral" variant="outlined">md</cu-button>
  <cu-button id="btn-size-lg" color="neutral" variant="outlined">lg</cu-button>
  <cu-button id="btn-size-xl" color="neutral" variant="outlined">xl</cu-button>
  <cu-button id="btn-size-full" color="neutral" variant="outlined">full</cu-button>
</div>

<cu-modal id="modal-size-auto" size="auto" title="Size: auto"><p>This modal has size <strong>auto</strong>.</p></cu-modal>
<cu-modal id="modal-size-sm" size="sm" title="Size: sm"><p>This modal has size <strong>sm</strong>.</p></cu-modal>
<cu-modal id="modal-size-md" size="md" title="Size: md"><p>This modal has size <strong>md</strong>.</p></cu-modal>
<cu-modal id="modal-size-lg" size="lg" title="Size: lg"><p>This modal has size <strong>lg</strong>.</p></cu-modal>
<cu-modal id="modal-size-xl" size="xl" title="Size: xl"><p>This modal has size <strong>xl</strong>.</p></cu-modal>
<cu-modal id="modal-size-full" size="full" title="Size: full"><p>This modal has size <strong>full</strong>.</p></cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    ['auto', 'sm', 'md', 'lg', 'xl', 'full'].forEach((s) => {
      document.getElementById('btn-size-' + s).addEventListener('click', () => {
        document.getElementById('modal-size-' + s).open();
      });
    });
  });
<\/script>`;

const heightsVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="btn-height-auto" color="neutral" variant="outlined">auto</cu-button>
  <cu-button id="btn-height-sm" color="neutral" variant="outlined">sm</cu-button>
  <cu-button id="btn-height-md" color="neutral" variant="outlined">md</cu-button>
  <cu-button id="btn-height-lg" color="neutral" variant="outlined">lg</cu-button>
  <cu-button id="btn-height-xl" color="neutral" variant="outlined">xl</cu-button>
  <cu-button id="btn-height-full" color="neutral" variant="outlined">full</cu-button>
</div>

<cu-modal id="modal-height-auto" height="auto" title="Height: auto"><p>This modal has height <strong>auto</strong>.</p></cu-modal>
<cu-modal id="modal-height-sm" height="sm" title="Height: sm"><p>This modal has height <strong>sm</strong>.</p></cu-modal>
<cu-modal id="modal-height-md" height="md" title="Height: md"><p>This modal has height <strong>md</strong>.</p></cu-modal>
<cu-modal id="modal-height-lg" height="lg" title="Height: lg"><p>This modal has height <strong>lg</strong>.</p></cu-modal>
<cu-modal id="modal-height-xl" height="xl" title="Height: xl"><p>This modal has height <strong>xl</strong>.</p></cu-modal>
<cu-modal id="modal-height-full" height="full" title="Height: full"><p>This modal has height <strong>full</strong>.</p></cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    ['auto', 'sm', 'md', 'lg', 'xl', 'full'].forEach((h) => {
      document.getElementById('btn-height-' + h).addEventListener('click', () => {
        document.getElementById('modal-height-' + h).open();
      });
    });
  });
<\/script>`;

const persistentVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="modal-pers-open" color="warning" variant="solid">Open Persistent Modal (custom footer)</cu-button>
</div>

<cu-modal id="modal-pers" title="Persistent Modal" persistent description="Cannot be closed by clicking outside or pressing Escape.">
  <p>Try clicking the backdrop or pressing Escape — it won't close.</p>
  <div slot="footer">
    <cu-button id="btn-pers-close" color="warning" variant="solid">Got it</cu-button>
  </div>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    const modal = document.getElementById('modal-pers');
    document.getElementById('modal-pers-open').addEventListener('click', () => modal.open());
    document.getElementById('btn-pers-close').addEventListener('click', () => modal.close());
  });
<\/script>`;

const persistentDefaultFooterVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="modal-del-open" color="danger" variant="solid">Open Persistent Modal (default footer)</cu-button>
</div>

<cu-modal id="modal-del" title="Delete Item" persistent color="danger" description="This action cannot be undone.">
  <p>Are you sure you want to delete this item?</p>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    const modal = document.getElementById('modal-del');
    document.getElementById('modal-del-open').addEventListener('click', () => modal.open());
    modal.addEventListener('cancel', () => console.log('cancel'));
    modal.addEventListener('accept', () => console.log('accept'));
  });
<\/script>`;

const programmaticVanilla = `${modalImportVanilla}

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="modal-prog-open">open()</cu-button>
  <cu-button id="modal-prog-close">close()</cu-button>
  <cu-button id="modal-prog-toggle">toggle()</cu-button>
</div>

<cu-modal id="modal-prog" title="Programmatic Modal">
  <p>This modal is controlled programmatically via open(), close(), and toggle() methods.</p>
</cu-modal>

<script>
  customElements.whenDefined('cu-modal').then(() => {
    const modal = document.getElementById('modal-prog');
    document.getElementById('modal-prog-open').addEventListener('click', () => modal.open());
    document.getElementById('modal-prog-close').addEventListener('click', () => modal.close());
    document.getElementById('modal-prog-toggle').addEventListener('click', () => modal.toggle());
    modal.addEventListener('opened', () => console.log('isOpen():', modal.isOpen()));
    modal.addEventListener('closed', () => console.log('isOpen():', modal.isOpen()));
  });
<\/script>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const modal_tokens = [
  '--modal-color',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-lg',
  '--cu-font-weight-bold',
  '--cu-radius',
  '--cu-shadow-xl',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-color-surface',
  '--cu-color-neutral',
];

const styleData = modal_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [{ label: 'Button', path: '/playground/components/button' }];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'title', type: 'string', default: '""', description: 'Título del modal' },
  { name: 'description', type: 'string', default: '""', description: 'Descripción bajo el título' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'No cierra con click-afuera ni Escape' },
  { name: 'size', type: 'string', default: '"auto"', description: 'auto, sm, md, lg, xl, full' },
  { name: 'height', type: 'string', default: '"auto"', description: 'auto, sm, md, lg, xl, full' },
];

const slotsData = [
  { name: 'default', description: 'Contenido del modal' },
  { name: 'icon', description: 'Icono junto al título' },
  { name: 'footer', description: 'Acciones del footer. Sin slot → botón "Cerrar" por defecto (emite cancel/accept)' },
];

const eventsData = [
  { name: 'close', type: '(value: boolean) => void', description: 'El modal pide cerrarse (backdrop, Escape o botón)' },
  { name: 'opened', type: '(value: boolean) => void', description: 'El modal se abrió' },
  { name: 'closed', type: '(value: boolean) => void', description: 'El modal se cerró' },
  { name: 'cancel', type: '() => void', description: 'Botón Cancelar del footer por defecto' },
  { name: 'accept', type: '() => void', description: 'Botón Aceptar del footer por defecto' },
];

const exposesData = [
  { name: 'open', type: '() => void', description: 'Abre el modal' },
  { name: 'close', type: '() => void', description: 'Cierra el modal' },
  { name: 'toggle', type: '() => void', description: 'Abre/cierra el modal' },
  { name: 'isOpen', type: '() => boolean', description: 'Estado del modal' },
];
</script>

<template>
  <PlaygroundLayout title="Modal" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-row">
            <Button @click="defaultModalRef?.open()" color="primary" variant="solid">
              Open Modal
            </Button>
            <Modal ref="defaultModalRef" title="Default Modal" description="This is a default modal with neutral color.">
              <p>Modal content goes here. The title color is neutral by default.</p>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="default-footer" class="playground-section">
        <div class="playground-heading">
          <h2>Default Footer</h2>
        </div>
        <SectionDemo :vue-code="defaultFooterVue" :vanilla-code="defaultFooterVanilla">
          <div class="playground-row">
            <Button @click="defaultFooterModalRef?.open()" color="primary" variant="solid">
              Open Modal (no footer slot)
            </Button>
            <Modal ref="defaultFooterModalRef" title="Default Footer" description="No footer slot provided, so a 'Cerrar' button is shown.">
              <p>This modal doesn't have a custom footer slot. The default "Cerrar" button is shown automatically.</p>
            </Modal>
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
            <div class="playground-row">
              <Button
                v-for="(color, index) in colors"
                :key="color"
                @click="colorModalRefs[index]?.open()"
                :color="color"
                variant="solid"
              >
                {{ color }}
              </Button>
            </div>
            <Modal
              v-for="(color, index) in colors"
              :key="'modal-' + color"
              :ref="(el) => colorModalRefs[index] = el"
              :color="color"
              :title="color.charAt(0).toUpperCase() + color.slice(1) + ' Modal'"
            >
              <p>The title uses the <strong>{{ color }}</strong> color token. Background is always surface.</p>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <div class="playground-heading">
          <h2>With Icon</h2>
        </div>
        <SectionDemo :vue-code="iconsVue" :vanilla-code="iconsVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button @click="iconModalRefs[0]?.open()" color="success" variant="solid">
                Success
              </Button>
              <Button @click="iconModalRefs[1]?.open()" color="warning" variant="solid">
                Warning
              </Button>
              <Button @click="iconModalRefs[2]?.open()" color="danger" variant="solid">
                Danger
              </Button>
            </div>
            <Modal
              v-for="(item, index) in iconExamples"
              :key="item.color"
              :ref="(el) => iconModalRefs[index] = el"
              :color="item.color"
              :title="item.title"
            >
              <template #icon>
                <span v-html="item.icon"></span>
              </template>
              <p>{{ item.description }}</p>
              <template #footer>
                <div class="modal-footer-actions">
                  <Button @click="iconModalRefs[index]?.close()" :color="item.color" variant="solid">OK</Button>
                </div>
              </template>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="sizes" class="playground-section">
        <div class="playground-heading">
          <h2>Sizes</h2>
          <Badge color="neutral" title="size por defecto">auto</Badge>
        </div>
        <SectionDemo :vue-code="sizesVue" :vanilla-code="sizesVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button
                v-for="(size, index) in sizes"
                :key="size"
                @click="sizeModalRefs[index]?.open()"
                color="neutral"
                variant="outlined"
              >
                {{ size }}
              </Button>
            </div>
            <Modal
              v-for="(size, index) in sizes"
              :key="'size-' + size"
              :ref="(el) => sizeModalRefs[index] = el"
              :size="size"
              :title="'Size: ' + size"
            >
              <p>This modal has size <strong>{{ size }}</strong>.</p>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="heights" class="playground-section">
        <div class="playground-heading">
          <h2>Heights</h2>
          <Badge color="neutral" title="height por defecto">auto</Badge>
        </div>
        <SectionDemo :vue-code="heightsVue" :vanilla-code="heightsVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button
                v-for="(height, index) in heights"
                :key="height"
                @click="heightModalRefs[index]?.open()"
                color="neutral"
                variant="outlined"
              >
                {{ height }}
              </Button>
            </div>
            <Modal
              v-for="(height, index) in heights"
              :key="'height-' + height"
              :ref="(el) => heightModalRefs[index] = el"
              :height="height"
              :title="'Height: ' + height"
            >
              <div style="min-height: 400px;">
                <p>This modal has height <strong>{{ height }}</strong>.</p>
                <p>The content area is tall to demonstrate scrolling behavior.</p>
              </div>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="persistent" class="playground-section">
        <div class="playground-heading">
          <h2>Persistent</h2>
          <Badge color="neutral" title="persistent por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="persistentVue" :vanilla-code="persistentVanilla">
          <div class="playground-row">
            <Button @click="persistentModalRef?.open()" color="warning" variant="solid">
              Open Persistent Modal (custom footer)
            </Button>
            <Modal ref="persistentModalRef" title="Persistent Modal" persistent description="Cannot be closed by clicking outside or pressing Escape.">
              <p>Try clicking the backdrop or pressing Escape — it won't close.</p>
              <template #footer>
                <Button @click="persistentModalRef?.close()" color="warning" variant="solid">Got it</Button>
              </template>
            </Modal>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="persistent-default-footer" class="playground-section">
        <div class="playground-heading">
          <h2>Persistent Default Footer</h2>
        </div>
        <SectionDemo :vue-code="persistentDefaultFooterVue" :vanilla-code="persistentDefaultFooterVanilla">
          <div class="playground-row">
            <Button @click="persistentDefaultFooterModalRef?.open()" color="danger" variant="solid">
              Open Persistent Modal (default footer)
            </Button>
            <Modal
              ref="persistentDefaultFooterModalRef"
              title="Delete Item"
              persistent
              color="danger"
              description="This action cannot be undone."
              @cancel="console.log('cancel')"
              @accept="console.log('accept')"
            >
              <p>Are you sure you want to delete this item?</p>
            </Modal>
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
              <Button color="neutral" @click="programmaticModalRef?.open(); programmaticIsOpen = true">open()</Button>
              <Button color="neutral" @click="programmaticModalRef?.close(); programmaticIsOpen = false">close()</Button>
              <Button color="neutral" @click="programmaticModalRef?.toggle(); programmaticIsOpen = programmaticModalRef?.isOpen() ?? false">toggle()</Button>
            </div>
            <p class="playground-state">
              isOpen(): <strong>{{ programmaticIsOpen ? 'true' : 'false' }}</strong>
            </p>
            <Modal
              ref="programmaticModalRef"
              title="Programmatic Modal"
              @opened="programmaticIsOpen = true"
              @closed="programmaticIsOpen = false"
            >
              <p>This modal is controlled programmatically via <code>open()</code>, <code>close()</code>, and <code>toggle()</code> methods.</p>
            </Modal>
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
          <li v-for="dep in [{ label: 'Button', path: '/playground/components/button' }]" :key="dep.label">
            <Button :to="dep.path" variant="link" size="sm">{{ dep.label }}</Button>
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
.modal-footer-actions {
  display: flex;
  gap: var(--cu-space-sm);
  justify-content: flex-end;
}
</style>
