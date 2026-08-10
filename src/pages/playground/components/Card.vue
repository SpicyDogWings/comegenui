<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Card from "@/components/information/Card.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Layouts', id: 'layouts' },
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Media', id: 'media' },
  { label: 'With Footer', id: 'footer' },
  { label: 'Custom Slots', id: 'slots' },
];
</script>

<template>
  <PlaygroundLayout title="Card" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <h2>Default</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="layouts" class="playground-section">
        <h2>Layouts</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="card-grid">
          <Card title="Ghost" variant="ghost">Variante por defecto.</Card>
          <Card title="Outlined" variant="outlined" color="primary">Variante outlined.</Card>
          <Card title="Soft" variant="soft" color="primary">Variante soft.</Card>
          <Card title="Subtle" variant="subtle" color="primary">Variante subtle.</Card>
          <Card title="Solid" variant="solid" color="primary">Variante solid.</Card>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="card-grid">
          <Card v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const" :key="color" :title="color" :color="color" variant="soft">
            Tarjeta de color {{ color }}.
          </Card>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="media" class="playground-section">
        <h2>With Media</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="footer" class="playground-section">
        <h2>With Footer</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="slots" class="playground-section">
        <h2>Custom Slots</h2>
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
