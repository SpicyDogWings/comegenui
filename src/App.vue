<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "./components/Table.ce.vue";
import Textarea from "./components/Textarea.ce.vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const posts = ref<any[]>([]);
const textareaValue = ref("");
const isModalOpen = ref(false);
const isPrimaryModalOpen = ref(false);
const isPersistentModalOpen = ref(false);
const isFullModalOpen = ref(false);
const modalMessage = ref("");

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  posts.value = await response.json();
});

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título", editable: true, singleClick: true },
  { key: "body", label: "Contenido", editable: true, inputType: "textarea" },
];

function openModal() {
  isModalOpen.value = true;
  modalMessage.value = "Este es un modal básico con botones dentro.";
}

function openPrimaryModal() {
  isPrimaryModalOpen.value = true;
}

function openPersistentModal() {
  isPersistentModalOpen.value = true;
  modalMessage.value = "Modal persistente. No se cierra haciendo clic fuera o con ESC.";
}

function openFullModal() {
  isFullModalOpen.value = true;
  modalMessage.value = "Modal a pantalla completa.";
}

function closePersistentModal() {
  isPersistentModalOpen.value = false;
}
</script>

<template>
  <div class="p-6 min-h-screen bg-charcoal-50">
    <h1 class="text-2xl font-bold mb-6 text-charcoal-800">Componentes ComegenUI</h1>

    <!-- Demo Modals -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-charcoal-700">Demo de Modal</h2>
      <div class="flex flex-wrap gap-4">
        <Button color="primary" variant="solid" @click="openModal">
          Modal Básico
        </Button>
        <Button color="success" variant="solid" @click="openPrimaryModal">
          Modal Primario
        </Button>
        <Button color="danger" variant="solid" @click="openPersistentModal">
          Modal Persistente
        </Button>
        <Button color="warning" variant="solid" @click="openFullModal">
          Modal Completo
        </Button>
      </div>
      
      <!-- Modal Básico -->
      <Modal v-model="isModalOpen" title="Modal Básico" size="md" color="neutral">
        <p class="mb-4 text-charcoal-700">{{ modalMessage }}</p>
        
        <template #footer>
          <Button color="neutral" variant="outlined" @click="isModalOpen = false">
            Cancelar
          </Button>
          <Button color="primary" variant="solid" @click="isModalOpen = false">
            Aceptar
          </Button>
        </template>
      </Modal>

      <!-- Modal Primario -->
      <Modal v-model="isPrimaryModalOpen" title="Modal Primario" size="lg" color="primary">
        <p class="mb-4 text-charcoal-700">
          Este modal tiene el tema primario. Puedes personalizar el color, tamaño y contenido.
        </p>
        <p class="mb-4 text-charcoal-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
        </p>
        
        <template #footer>
          <Button color="primary" variant="ghost" @click="isPrimaryModalOpen = false">
            Cerrar
          </Button>
        </template>
      </Modal>

      <!-- Modal Persistente -->
      <Modal 
        v-model="isPersistentModalOpen" 
        title="Modal Persistente" 
        size="md" 
        color="danger"
        :persistent="true"
        :closable="false"
      >
        <p class="mb-4 text-charcoal-700">{{ modalMessage }}</p>
        <p class="mb-4 text-charcoal-600 text-sm">
          Este modal no se cierra con el backdrop o ESC. Usa el botón para cerrarlo.
        </p>
        
        <template #footer>
          <Button color="danger" variant="solid" @click="closePersistentModal">
            Entendido
          </Button>
        </template>
      </Modal>

      <!-- Modal Full -->
      <Modal v-model="isFullModalOpen" title="Modal Completo" size="full" color="warning">
        <div class="p-4">
          <p class="mb-4 text-charcoal-700">{{ modalMessage }}</p>
          <Table
            :data="posts.slice(0, 5)"
            :columns="columns"
            class="mb-4"
          />
        </div>
        
        <template #header>
          <div class="flex items-center gap-2">
            <span class="text-2xl">📋</span>
          </div>
        </template>
        
        <template #footer>
          <Button color="warning" variant="outlined" @click="isFullModalOpen = false">
            Salir
          </Button>
        </template>
      </Modal>
    </section>

    <!-- Tabla original -->
    <section>
      <h2 class="text-xl font-semibold mb-4 text-charcoal-700">Tabla de Posts</h2>
      <Table
        :data="posts"
        :columns="columns"
        :pagination="true"
        :items-per-page="10"
        class="mb-6"
      />
    </section>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
