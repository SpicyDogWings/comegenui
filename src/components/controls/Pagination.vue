<script setup lang="ts">
import { computed, ref, watch, type PropType } from 'vue';
import { isFieldVariantNone } from '@/utils/validators'
import Button from "../buttons/Button.vue";
import Select from "../form/Select.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String as PropType<'outlined' | 'soft' | 'ghost' | 'subtle' | 'none'>,
    required: false,
    default: "soft",
    validator: isFieldVariantNone,
  },
  currentPage: {
    type: Number,
    required: false,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: false,
    default: 1,
  },
  totalItems: {
    type: Number,
    required: false,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10,
  },
  showPageSize: {
    type: Boolean,
    required: false,
    default: false,
  },
  pageSizeOptions: {
    type: Array as () => number[],
    required: false,
    default: () => [5, 10, 20, 50],
  },
  showFirstAndLast: {
    type: Boolean,
    required: false,
    default: false,
  },

});

const emit = defineEmits<{
  /** Página nueva elegida, como número. */
  (e: 'update:currentPage', value: number): void
  /** Tamaño de página nuevo, como número. */
  (e: 'update:itemsPerPage', value: number): void
}>();

/** `totalPages` como entero ≥ 1: un decimal (`2.7`) agregaba un botón «3» que no hacía nada. */
const pageCount = computed(() => {
  const total = Math.trunc(Number(props.totalPages));
  return Number.isFinite(total) ? Math.max(1, total) : 1;
});

/**
 * Página realmente renderizable. `currentPage` puede quedar fuera de `[1, totalPages]`
 * (el consumidor achica los totales, o llega un `current-page` inválido): sin el clamp
 * la info mostraba rangos imposibles («Mostrando 241 - 45 de 45») y ningún botón
 * navegaba. No se emite nada: la prop la manda el consumidor.
 */
const activePage = computed(() => {
  const page = Math.trunc(Number(props.currentPage));
  return Number.isFinite(page) ? Math.min(Math.max(1, page), pageCount.value) : 1;
});

/** `itemsPerPage` saneado para el rango: 0/negativo/NaN invertían la info («Mostrando 1 - 0»). */
const perPage = computed(() => {
  const value = Math.trunc(Number(props.itemsPerPage));
  return Number.isFinite(value) && value > 0 ? value : 1;
});

/** `totalItems` saneado: un negativo mostraba «de -10». */
const itemCount = computed(() => {
  const value = Math.trunc(Number(props.totalItems));
  return Number.isFinite(value) && value > 0 ? value : 0;
});

const pageSizeValue = ref(String(perPage.value));

watch(() => perPage.value, (val) => {
  pageSizeValue.value = String(val);
});

// El tamaño actual siempre es una opción: si `itemsPerPage` no está en
// `pageSizeOptions`, el Select no lo encontraba y mostraba "Seleccionar..."
// (sin opción que represente el valor vigente). Se agrega y se ordena.
// `pageSizeOptions` puede no ser un array (atributo HTML, `v-bind` roto): sin la
// guarda se spreadaba un string carácter por carácter ("[", "0", ...) o rompía el render;
// en ese caso se cae al listado por defecto (el mismo del `default` de la prop).
const pageSizeOptionsFormatted = computed(() => {
  const configured = (Array.isArray(props.pageSizeOptions) ? props.pageSizeOptions : [5, 10, 20, 50])
    .map((option) => Number(option))
    .filter((option) => Number.isFinite(option) && option > 0);
  const sizes = new Set([...configured, perPage.value]);
  return [...sizes]
    .sort((a, b) => a - b)
    .map(opt => ({ value: String(opt), label: String(opt) }));
});

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= pageCount.value) {
    emit("update:currentPage", page);
  }
};

const handlePageSizeChange = (val: string) => {
  const size = Number(val);
  if (!Number.isFinite(size) || size <= 0) return;
  pageSizeValue.value = String(size);
  emit("update:itemsPerPage", size);
  emit("update:currentPage", 1);
};

const startItem = computed(() => {
  if (itemCount.value === 0) return 0;
  const start = (activePage.value - 1) * perPage.value + 1;
  // Con totales incoherentes (`totalItems` menor que lo que implican página × tamaño)
  // el rango arrancaba después del total: «Mostrando 106 - 95 de 95».
  return Math.min(start, itemCount.value);
});

const endItem = computed(() => {
  return Math.min(activePage.value * perPage.value, itemCount.value);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = pageCount.value;
  const current = activePage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (props.showFirstAndLast) {
      pages.push(1);
      if (current > 3) pages.push("...");
    }

    let midStart = current - 1;
    let midEnd = current + 1;

    if (props.showFirstAndLast) {
      midStart = Math.max(2, midStart);
      midEnd = Math.min(total - 1, midEnd);
    } else {
      midStart = Math.max(1, midStart);
      midEnd = Math.min(total, midEnd);
    }

    if (midEnd - midStart < 2) {
      if (midStart === (props.showFirstAndLast ? 2 : 1)) {
        midEnd = midStart + 2;
      } else {
        midStart = midEnd - 2;
      }
    }

    for (let i = midStart; i <= midEnd; i++) pages.push(i);

    if (props.showFirstAndLast) {
      if (current < total - 2) pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});
</script>

<template>
  <div
    v-if="pageCount > 1 || showPageSize"
    class="cu-pagination"
  >
    <span class="cu-pagination-info">
      Mostrando {{ startItem }} - {{ endItem }} de {{ itemCount }}
    </span>

    <div class="cu-pagination-controls">
      <div v-if="showPageSize" class="cu-pagination-page-size">
        <span class="cu-pagination-label">Por página:</span>
        <Select
          :model-value="pageSizeValue"
          :options="pageSizeOptionsFormatted"
          :color="props.color"
          style="width: calc(var(--cu-space-3xl) * 2)"
          @select="(opt) => handlePageSizeChange(opt.value)"
        />
      </div>

      <nav class="cu-pagination-pages" aria-label="Paginación">
        <Button
          @click="handlePageChange(activePage - 1)"
          :disabled="activePage === 1"
          :color="props.color"
          :variant="props.variant"
        >
          Anterior
        </Button>

        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span v-if="page === '...'" class="cu-pagination-ellipsis" aria-hidden="true">...</span>
          <Button
            v-else
            @click="handlePageChange(Number(page))"
            :aria-label="`Página ${page}`"
            :aria-current="activePage === page ? 'page' : undefined"
            :color="props.color"
            :variant="activePage === page ? 'solid' : props.variant"
          >
            {{ page }}
          </Button>
        </template>

        <Button
          @click="handlePageChange(activePage + 1)"
          :disabled="activePage === pageCount"
          :color="props.color"
          :variant="props.variant"
        >
          Siguiente
        </Button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.cu-pagination {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: var(--cu-space-md);
  gap: var(--cu-space-md);
  box-sizing: border-box;
}

.cu-pagination-info {
  display: none;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  font-family: var(--cu-font-sans);
}

@media (min-width: 768px) {
  .cu-pagination-info {
    display: inline;
  }
}

.cu-pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--cu-space-sm);
}

.cu-pagination-page-size {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
}

.cu-pagination-label {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  font-family: var(--cu-font-sans);
}

.cu-pagination-pages {
  display: flex;
  align-items: center;
  gap: var(--cu-space-xs);
}

.cu-pagination-ellipsis {
  padding: var(--cu-space-xs) var(--cu-space-sm);
  color: var(--cu-color-neutral-text-muted);
  font-size: var(--cu-font-size-sm);
  font-family: var(--cu-font-sans);
}
</style>
