<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import Card from "@/components/information/Card.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Layouts', id: 'layouts' },
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Media', id: 'media' },
  { label: 'With Footer', id: 'footer' },
  { label: 'Custom Slots', id: 'slots' },
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

const componentTokens = [
  '--card-bg',
  '--card-text',
  '--card-soft',
  '--card-subtle',
  '--card-subtle-border',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-lg',
  '--cu-font-weight-bold',
  '--cu-line-height-relaxed',
  '--cu-radius-lg',
  '--cu-shadow-md',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-space-2xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'ghost, outlined, soft, subtle, solid' },
  { name: 'layout', type: 'string', default: '"vertical"', description: 'vertical (media arriba) | horizontal (media al costado)' },
  { name: 'title', type: 'string', default: '—', description: 'Título (reemplazado por el slot #header)' },
  { name: 'subtitle', type: 'string', default: '—', description: 'Subtítulo bajo el title' },
  { name: 'image', type: 'string', default: '—', description: 'URL de imagen de la media (alternativa al slot #media)' },
];

const slotsData = [
  { name: 'default', description: 'Contenido principal' },
  { name: 'media', description: 'Media personalizada (reemplaza image)' },
  { name: 'header', description: 'Reemplaza title/subtitle' },
  { name: 'footer', description: 'Acciones o info adicional' },
];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];

const defaultVue = `<script setup>
import Card from '@/components/information/Card.vue'
<\/script>

<template>
  <Card title="Tarjeta de información" subtitle="Subtítulo descriptivo">
    Contenido principal de la tarjeta.
  </Card>
</template>`;
const defaultVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuCard.umd.js"><\/script>

<cu-card title="Tarjeta de información" subtitle="Subtítulo descriptivo">
  Contenido principal de la tarjeta.
</cu-card>`;

const layoutsVue = `<Card layout="horizontal" title="Horizontal" subtitle="Imagen al costado"
  image="https://picsum.photos/seed/cu-card-h/400/300">
  Media a la izquierda, contenido a la derecha.
</Card>

<Card layout="horizontal" title="Con slot media" color="primary" variant="soft">
  <template #media>
    <div class="media-side">Side</div>
  </template>
  Media al costado con slot.
</Card>

<Card layout="vertical" title="Vertical" subtitle="Imagen arriba (default)"
  image="https://picsum.photos/seed/cu-card-v/400/300">
  La media se muestra arriba del contenido.
</Card>`;
const layoutsVanilla = `<script src="CuCard.umd.js"><\/script>

<cu-card layout="horizontal" title="Horizontal" subtitle="Imagen al costado"
  image="https://picsum.photos/seed/cu-card-h/400/300">
  Media a la izquierda, contenido a la derecha.
</cu-card>

<cu-card layout="vertical" title="Vertical" image="...">
  La media se muestra arriba del contenido.
</cu-card>`;

const variantsVue = `<Card title="Ghost" variant="ghost">Variante por defecto.</Card>
<Card title="Outlined" variant="outlined" color="primary">Variante outlined.</Card>
<Card title="Soft" variant="soft" color="primary">Variante soft.</Card>
<Card title="Subtle" variant="subtle" color="primary">Variante subtle.</Card>
<Card title="Solid" variant="solid" color="primary">Variante solid.</Card>`;
const variantsVanilla = `<cu-card title="Ghost" variant="ghost">Variante por defecto.</cu-card>
<cu-card title="Outlined" variant="outlined" color="primary">Variante outlined.</cu-card>
<cu-card title="Soft" variant="soft" color="primary">Variante soft.</cu-card>
<cu-card title="Subtle" variant="subtle" color="primary">Variante subtle.</cu-card>
<cu-card title="Solid" variant="solid" color="primary">Variante solid.</cu-card>`;

const colorsVue = `<Card title="Primary" color="primary" variant="soft">Tarjeta primary.</Card>
<Card title="Secondary" color="secondary" variant="soft">Tarjeta secondary.</Card>
<Card title="Success" color="success" variant="soft">Tarjeta success.</Card>`;
const colorsVanilla = `<cu-card title="Primary" color="primary" variant="soft">Tarjeta primary.</cu-card>
<cu-card title="Secondary" color="secondary" variant="soft">Tarjeta secondary.</cu-card>
<cu-card title="Success" color="success" variant="soft">Tarjeta success.</cu-card>`;

const mediaVue = `<Card title="Con imagen" subtitle="Usa el prop image"
  image="https://picsum.photos/seed/cu-card/600/300">
  La imagen se muestra arriba.
</Card>

<Card title="Con slot media" subtitle="Usa el slot #media">
  <template #media>
    <div class="media-block">Contenido personalizado.</div>
  </template>
  El slot permite cualquier elemento.
</Card>`;
const mediaVanilla = `<script src="CuCard.umd.js"><\/script>

<cu-card title="Con imagen" image="https://picsum.photos/seed/cu-card/600/300">
  La imagen se muestra arriba.
</cu-card>

<cu-card title="Con slot media">
  <div slot="media" class="media-block">Contenido personalizado.</div>
  El slot permite cualquier elemento.
</cu-card>`;

const footerVue = `<Card title="Acciones" subtitle="Botones en el footer">
  Usá el slot #footer para acciones.
  <template #footer>
    <Button color="primary" variant="soft">Aceptar</Button>
    <Button color="neutral" variant="ghost">Cancelar</Button>
  </template>
</Card>`;
const footerVanilla = `<script src="CuCard.umd.js"><\/script>

<cu-card title="Acciones">
  Usá el slot #footer para acciones.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Aceptar</cu-button>
    <cu-button color="neutral" variant="ghost">Cancelar</cu-button>
  </div>
</cu-card>`;

const slotsVue = `<Card title="Header personalizado" color="primary">
  <template #header>
    <h3>Título custom</h3>
    <Badge color="primary" variant="soft">Custom</Badge>
  </template>
  El slot #header reemplaza título/subtítulo.
</Card>`;
const slotsVanilla = `<script src="CuCard.umd.js"><\/script>

<cu-card title="Header personalizado" color="primary">
  <div slot="header">
    <h3>Título custom</h3>
    <cu-badge color="primary" variant="soft">Custom</cu-badge>
  </div>
  El slot #header reemplaza título/subtítulo.
</cu-card>`;

const progVariant = ref('ghost');
const progLayout = ref('vertical');

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Card from '@/components/information/Card.vue'
import Button from '@/components/buttons/Button.vue'

const variant = ref('ghost')
const layout = ref('vertical')
<\/script>

<template>
  <Button @click="variant = 'solid'">variant = 'solid'</Button>
  <Button @click="layout = 'horizontal'">layout = 'horizontal'</Button>
  <Card title="En vivo" :variant="variant" :layout="layout">
    La tarjeta cambia por props.
  </Card>
</template>`;
</script>

<template>
  <PlaygroundLayout title="Card" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <h2>Default</h2>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="card-grid">
            <Card title="Tarjeta de información" subtitle="Subtítulo descriptivo">
              Contenido principal de la tarjeta. Sirve para mostrar información agrupada de forma visual y jerárquica.
            </Card>
            <Card title="Sin subtítulo">
              Una tarjeta simple sin subtítulo ni footer, solo con su contenido.
            </Card>
            <Card>
              Sin título tampoco. Solo el contenido directo dentro de la tarjeta.
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="layouts" class="playground-section">
        <h2>Layouts</h2>
        <SectionDemo :vue-code="layoutsVue" :vanilla-code="layoutsVanilla">
          <div class="card-grid">
            <Card
              layout="horizontal"
              title="Horizontal"
              subtitle="Imagen al costado"
              image="https://picsum.photos/seed/comegen-card-h/400/300"
            >
              La media (imagen o slot) se muestra a la izquierda y el contenido a la derecha.
            </Card>
            <Card
              layout="horizontal"
              title="Con slot media"
              color="primary"
              variant="soft"
            >
              <template #media>
                <div class="media-side">Side</div>
              </template>
              Usá <code>layout="horizontal"</code> para media al lado del contenido.
            </Card>
            <Card
              layout="vertical"
              title="Vertical"
              subtitle="Imagen arriba (default)"
              image="https://picsum.photos/seed/comegen-card-v/400/300"
            >
              Layout vertical: la media se muestra arriba del contenido.
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="card-grid">
            <Card title="Ghost" variant="ghost">Variante por defecto.</Card>
            <Card title="Outlined" variant="outlined" color="primary">Variante outlined.</Card>
            <Card title="Soft" variant="soft" color="primary">Variante soft.</Card>
            <Card title="Subtle" variant="subtle" color="primary">Variante subtle.</Card>
            <Card title="Solid" variant="solid" color="primary">Variante solid.</Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="card-grid">
            <Card v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const" :key="color" :title="color" :color="color" variant="soft">
              Tarjeta de color {{ color }}.
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="media" class="playground-section">
        <h2>With Media</h2>
        <SectionDemo :vue-code="mediaVue" :vanilla-code="mediaVanilla">
          <div class="card-grid">
            <Card
              title="Con imagen"
              subtitle="Usa el prop image"
              image="https://picsum.photos/seed/comegen-card/600/300"
            >
              La imagen se muestra arriba, con el cuerpo de la tarjeta debajo.
            </Card>
            <Card title="Con slot media" subtitle="Usa el slot #media">
              <template #media>
                <div class="media-block">Contenido personalizado del slot media.</div>
              </template>
              El slot permite incrustar cualquier elemento, no solo imágenes.
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="footer" class="playground-section">
        <h2>With Footer</h2>
        <SectionDemo :vue-code="footerVue" :vanilla-code="footerVanilla">
          <div class="card-grid">
            <Card title="Acciones" subtitle="Botones en el footer">
              Usá el slot <code>#footer</code> para acciones o información adicional.
              <template #footer>
                <Button color="primary" variant="soft">Aceptar</Button>
                <Button color="neutral" variant="ghost">Cancelar</Button>
              </template>
            </Card>
            <Card title="Info" color="success" variant="soft">
              Footer con badge de estado.
              <template #footer>
                <Badge color="success" variant="solid">Activo</Badge>
              </template>
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="slots" class="playground-section">
        <h2>Custom Slots</h2>
        <SectionDemo :vue-code="slotsVue" :vanilla-code="slotsVanilla">
          <div class="card-grid">
            <Card title="Header personalizado" color="primary">
              <template #header>
                <h3 class="custom-header">Título custom en el header</h3>
                <Badge color="primary" variant="soft">Custom</Badge>
              </template>
              El slot <code>#header</code> reemplaza el título/subtítulo por defecto.
            </Card>
            <Card>
              <template #media>
                <div class="media-gradient">Banner de color</div>
              </template>
              <template #footer>
                <span class="muted">Footer minimalista</span>
              </template>
              Combinación de slots media + footer.
            </Card>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la tarjeta cambia en vivo. No expone métodos ni eventos: se maneja por props.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progVariant = 'solid'">variant = 'solid'</Button>
              <Button color="neutral" @click="progVariant = 'outlined'">variant = 'outlined'</Button>
              <Button color="neutral" @click="progVariant = 'ghost'">variant = 'ghost'</Button>
              <Button color="neutral" @click="progLayout = progLayout === 'vertical' ? 'horizontal' : 'vertical'">toggle layout</Button>
            </div>
            <p class="playground-state">
              variant: <strong>{{ progVariant }}</strong>
              · layout: <strong>{{ progLayout }}</strong>
            </p>
            <div class="prog-card">
              <Card title="En vivo" subtitle="Cambia por props" :variant="progVariant" :layout="progLayout" color="primary">
                La tarjeta se re-renderiza con cada cambio de prop.
              </Card>
            </div>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <hr class="playground-separator" />      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos (se maneja por props)" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.prog-card {
  max-width: 420px;
}

.custom-header {
  margin: 0;
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
}

.media-block {
  padding: 2rem;
  text-align: center;
  background-color: var(--cu-color-primary-soft);
  color: var(--cu-color-primary);
}

.media-side {
  height: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cu-color-primary);
  color: var(--cu-color-surface);
  font-weight: var(--cu-font-weight-semibold);
}

.media-gradient {
  padding: 2.5rem;
  text-align: center;
  background: linear-gradient(135deg, var(--cu-color-primary), var(--cu-color-secondary));
  color: var(--cu-color-surface);
  font-weight: var(--cu-font-weight-semibold);
}

.muted {
  font-size: var(--cu-font-size-xs);
  opacity: 0.6;
}
</style>

<style>
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
