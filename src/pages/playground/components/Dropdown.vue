<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Dropdown from "@/components/Dropdown.vue";
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
  { label: 'Aligns', id: 'aligns' },
  { label: 'Placements', id: 'placements' },
  { label: 'Contenedor', id: 'container' },
  { label: 'Custom toggle', id: 'custom-toggle' },
  { label: 'Fixed', id: 'fixed' },
  { label: 'Programático', id: 'programmatic' },
  { label: 'Eventos', id: 'events' },
  { label: 'Disabled', id: 'disabled' },
];
</script>

<template>
  <PlaygroundLayout title="Dropdown" :outlineItems="outlineItems">
    <div class="playground-content">

      <section id="variants" class="playground-section">
        <h2>Variants</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <h2>Positions</h2>
        <div class="playground-row">
          <Dropdown label="Bottom (default)" position="bottom">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Bottom</Button>
          </Dropdown>
          <Dropdown label="Top" position="top">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Top</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="aligns" class="playground-section">
        <h2>Aligns</h2>
        <div class="playground-row">
          <Dropdown label="Start" align="start">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Start</Button>
          </Dropdown>
          <Dropdown label="Center" align="center">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Center</Button>
          </Dropdown>
          <Dropdown label="End" align="end">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">End</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="placements" class="playground-section">
        <h2>Placements (position + align combinados)</h2>
        <p class="playground-desc">
          <code>placement="bottom-end"</code>, <code>"top-start"</code>, <code>"top-end"</code>… anulan <code>position</code>/<code>align</code>.
        </p>
        <div class="playground-row">
          <Dropdown label="Bottom-start" placement="bottom-start">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
          </Dropdown>
          <Dropdown label="Bottom-end" placement="bottom-end">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
          </Dropdown>
          <Dropdown label="Bottom-center" placement="bottom-center">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
          </Dropdown>
          <Dropdown label="Top-start" placement="top-start">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
          </Dropdown>
          <Dropdown label="Top-end" placement="top-end">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- El dropdown es un contenedor: cualquier contenido adentro del panel -->
      <section id="container" class="playground-section">
        <h2>Dropdown como contenedor</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="custom-toggle" class="playground-section">
        <h2>Custom toggle (slot #toggle)</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="fixed" class="playground-section">
        <h2>Fixed Position</h2>
        <div class="playground-row">
          <Dropdown label="Fixed Menu" fixed>
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Control programático</h2>
        <p class="playground-desc">
          Métodos expuestos: <code>open()</code>, <code>close()</code>, <code>toggle()</code>, <code>isOpen()</code>.
        </p>
        <div class="playground-row">
          <Button @click="dropdownRef?.open(); syncState()" color="primary" variant="solid">open()</Button>
          <Button @click="dropdownRef?.close(); syncState()" color="neutral" variant="ghost">close()</Button>
          <Button @click="dropdownRef?.toggle(); syncState()" color="success" variant="soft">toggle()</Button>
        </div>
        <p class="playground-desc">
          Estado: <strong>{{ dropdownState ? 'abierto' : 'cerrado' }}</strong>
        </p>
        <div class="playground-row">
          <Dropdown ref="dropdownRef" label="Controlado por código">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 1</Button>
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Item 2</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <h2>Eventos open / close</h2>
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
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-row">
          <Dropdown label="Disabled" disabled />
        </div>
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
</style>
