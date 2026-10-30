<script setup lang="ts">
import { computed, nextTick, ref, useId, watch, type PropType } from "vue";
import DOMPurify from 'dompurify'
import { isColor, isSize, isTabsVariant } from '@/utils/validators'

interface TabItem {
  key: string;
  label: string;
  // Icono del tab como HTML/SVG string (render con v-html), consistente con
  // label. Si la tab no trae icon, se usa el slot dinámico tab-icon-{key}.
  icon?: string;
  disabled?: boolean;
  // Mantiene el panel montado aunque no esté activo (v-show, no v-if):
  // el estado de los componentes internos sobrevive al cambio de tab.
  keepAlive?: boolean;
}

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "primary",
    validator: isColor,
  },
  variant: {
    type: String as PropType<'ghost' | 'solid' | 'boxed' | 'soft'>,
    required: false,
    default: "ghost",
    validator: isTabsVariant,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
    validator: isSize,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// El campo `icon` es HTML/SVG del consumidor: se sanitiza antes de `v-html`.
// DOMPurify deja intactos los SVG válidos y elimina `<script>`, handlers `on*`
// y URLs peligrosas (`javascript:`), que ejecutarían en el documento anfitrión.
const sanitizeIcon = (html?: string) => (html ? DOMPurify.sanitize(html) : undefined)

// `tabs` puede llegar null/undefined (p. ej. `el.tabs = null` en el custom
// element) o con items basura: sin esta normalización el render lanzaba
// `Cannot read properties of null (reading 'find')`. Se filtran sólo los items
// sin `key` utilizable, conservando el orden del array original.
const tabList = computed<TabItem[]>(() => {
  const raw = Array.isArray(props.tabs) ? props.tabs : []
  return raw
    .filter((t): t is TabItem => !!t && typeof t === 'object' && typeof t.key === 'string' && t.key.length > 0)
    .map((t) => ({ ...t, icon: sanitizeIcon(t.icon) }))
})

const emit = defineEmits(["change"]);
/** Clave del tab activo (v-model). */
const active = defineModel<string>({ default: "" });

// Un color fuera del set no tiene tokens: el tab activo quedaba sin fondo y con
// el texto del tema encima (invisible en light). Cae al color por defecto.
const safeColor = computed(() => (isColor(props.color) ? props.color : 'primary'))

// El tab activo es `modelValue` si apunta a una tab habilitada; si no, el
// primero habilitado. Una tab deshabilitada nunca queda activa: sería la única
// con `tabindex="0"` y, al estar disabled, el tablist quedaría sin parada de
// teclado (la navegación por flechas y `setActive` ya la saltean).
const activeKey = computed(() => {
  const requested = tabList.value.find((t) => t.key === active.value)
  if (requested && !requested.disabled) return requested.key
  return tabList.value.find((t) => !t.disabled)?.key ?? "";
});

const tabRefs = ref<Record<string, HTMLElement | null>>({});

// Las tabs se renderizan en el light DOM (Vue), así que sus ids conviven con
// los del resto de la página: un prefijo por instancia evita colisiones entre
// dos `<Tabs>` con las mismas keys. `useId()` es único por app; la key se
// sanitiza para que sea un id válido (sin espacios ni caracteres raros).
const uid = useId();
const idSafe = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, "-");
const idPrefix = `cu-tabs-${idSafe(uid)}`;

// Cuando la tab enfocada desaparece (el consumidor la saca del array), el
// navegador manda el foco a BODY y el tablist queda sin parada de teclado.
// Si el foco estaba en la tab que se fue, se traslada a la nueva activa.
let focusedKey: string | null = null;
const onTabFocus = (key: string) => { focusedKey = key; };

watch(activeKey, async (next, prev) => {
  if (!prev || next === prev || focusedKey !== prev) return;
  await nextTick();
  const activeEl = document.activeElement;
  if ((!activeEl || activeEl === document.body) && next) {
    tabRefs.value[next]?.focus();
    focusedKey = next;
  }
});

const tabStyles = computed(() => ({
  '--tabs-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--tabs-solid-text': `var(--cu-color-surface)`,
  '--tabs-text': `var(--cu-color-${safeColor.value}-text)`,
  '--tabs-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--tabs-soft-hover': `var(--cu-color-${safeColor.value}-soft-hover)`,
  '--tabs-soft-active': `var(--cu-color-${safeColor.value}-soft-active)`,
  '--tabs-subtle-border': `var(--cu-color-${safeColor.value}-subtle-border)`,
}));

const isTabDisabled = (tab: TabItem) => props.disabled || !!tab.disabled;

const panelId = (key: string) => `${idPrefix}-panel-${idSafe(key)}`;
const tabId = (key: string) => `${idPrefix}-tab-${idSafe(key)}`;
// El panel sólo existe en el DOM cuando la tab está activa (v-if) o es
// keepAlive; `aria-controls` a un id inexistente es un IDREF inválido, así que
// sólo se declara cuando apunta a algo real.
const hasPanel = (tab: TabItem) => !!tab.keepAlive || tab.key === activeKey.value;

const select = (key: string) => {
  if (props.disabled) return;
  const tab = tabList.value.find((t) => t.key === key);
  if (!tab || tab.disabled) return;
  if (key === activeKey.value) return;
  active.value = key;
  emit("change", key);
};

function focusTab(key: string) {
  tabRefs.value[key]?.focus();
}

const move = (dir: -1 | 1) => {
  if (props.disabled || tabList.value.length === 0) return;
  const idx = tabList.value.findIndex((t) => t.key === activeKey.value);
  const length = tabList.value.length;
  for (let i = 1; i <= length; i++) {
    const nextIdx = (idx + dir * i + length) % length;
    const tab = tabList.value[nextIdx];
    if (tab && !tab.disabled) {
      select(tab.key);
      focusTab(tab.key);
      return;
    }
  }
};

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
  else if (e.key === "Home") { e.preventDefault(); const first = tabList.value.find((t) => !t.disabled); if (first) { select(first.key); focusTab(first.key); } }
  else if (e.key === "End") { e.preventDefault(); const last = [...tabList.value].reverse().find((t) => !t.disabled); if (last) { select(last.key); focusTab(last.key); } }
}

/** Devuelve la clave del tab activo. */
function getActive() { return activeKey.value; }
/** Activa el tab con la clave indicada. */
function setActive(key: string) { select(key); }
/** Avanza al siguiente tab habilitado. */
function next() { move(1); }
/** Retrocede al tab habilitado anterior. */
function prev() { move(-1); }

defineExpose({ getActive, setActive, next, prev });
</script>

<template>
  <div
    class="cu-tabs"
    :class="[`cu-tabs--${props.variant}`, `cu-tabs--${props.size}`, { 'cu-tabs--disabled': props.disabled }]"
    :style="tabStyles"
  >
    <div class="cu-tabs-header" role="tablist" :aria-orientation="'horizontal'" @keydown="onKeydown">
      <button
        v-for="tab in tabList"
        :key="tab.key"
        :ref="(el) => { tabRefs[tab.key] = el as HTMLElement | null; }"
        type="button"
        class="cu-tabs-tab"
        :class="{ 'cu-tabs-tab--active': tab.key === activeKey }"
        role="tab"
        :aria-selected="tab.key === activeKey"
        :aria-controls="hasPanel(tab) ? panelId(tab.key) : undefined"
        :id="tabId(tab.key)"
        :disabled="isTabDisabled(tab)"
        :tabindex="tab.key === activeKey ? 0 : -1"
        @focus="onTabFocus(tab.key)"
        @click="select(tab.key)"
      >
        <span v-if="tab.icon" class="cu-tabs-tab-icon" v-html="tab.icon"></span>
        <slot v-else :name="`tab-icon-${tab.key}`"></slot>
        {{ tab.label }}
      </button>
    </div>

    <!-- Panels: los keepAlive se montan siempre y se ocultan con v-show (estado
         persistente); los normales se montan solo cuando están activos (v-if). -->
    <template v-for="tab in tabList" :key="tab.key">
      <div
        v-if="tab.keepAlive || tab.key === activeKey"
        v-show="tab.key === activeKey"
        :id="panelId(tab.key)"
        class="cu-tabs-panel"
        role="tabpanel"
        :aria-labelledby="tabId(tab.key)"
      >
        <slot :name="tab.key"></slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cu-tabs {
  box-sizing: border-box;
  font-family: var(--cu-font-sans);
}

.cu-tabs-header {
  display: flex;
  gap: var(--cu-space-2xs);
  box-sizing: border-box;
  /* Muchas tabs en un contenedor angosto: el tablist mantiene UNA fila y
     scrollea en horizontal en vez de desbordar la caja del componente. Las
     tabs no se aplastan (`flex: 0 0 auto`): conservan su ancho mínimo de
     contenido y el scroll queda en el header. */
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--cu-border-color) transparent;
}

.cu-tabs-tab {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
  box-sizing: border-box;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  flex: 0 0 auto;
}

.cu-tabs-tab:hover:not(:disabled) {
  color: var(--tabs-text);
}

/* El icono hereda el color del tab (default/hover/active). Se encadena
   .cu-tabs-tab para ganar especificidad frente a reglas del huésped tipo
   `.playground :is(span)` (0,2,1): scoped esto compila a 0,3,0. */
.cu-tabs-tab .cu-tabs-tab-icon {
  color: inherit;
  display: inline-flex;
  align-items: center;
}

/* :deep() para alcanzar el svg inyectado via v-html (no lleva data-v scoped) */
.cu-tabs-tab-icon :deep(svg) {
  color: inherit;
  width: 1em;
  height: 1em;
}

.cu-tabs-tab:focus-visible {
  outline: var(--cu-border-thin) solid var(--cu-border-color-focus);
  outline-offset: var(--cu-space-2xs);
}

.cu-tabs-tab:disabled {
  opacity: var(--cu-alpha-muted, 0.5);
  cursor: not-allowed;
}

/* Sizes */
.cu-tabs--sm .cu-tabs-tab {
  padding: var(--cu-space-xs) var(--cu-space-sm);
  font-size: var(--cu-font-size-xs);
}

.cu-tabs--md .cu-tabs-tab {
  padding: var(--cu-space-sm) var(--cu-space-md);
  font-size: var(--cu-font-size-sm);
}

.cu-tabs--lg .cu-tabs-tab {
  padding: var(--cu-space-md) var(--cu-space-lg);
  font-size: var(--cu-font-size-md);
}

/* Variant: ghost (underline) */
.cu-tabs--ghost .cu-tabs-header {
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-tabs--ghost .cu-tabs-tab {
  border-bottom: var(--cu-border-thin) solid transparent;
  border-radius: var(--cu-radius-sm) var(--cu-radius-sm) 0 0;
  margin-bottom: calc(var(--cu-border-thin) * -1);
}

.cu-tabs--ghost .cu-tabs-tab--active {
  color: var(--tabs-text);
  border-bottom-color: var(--tabs-text);
}

/* Variant: solid */
.cu-tabs--solid .cu-tabs-header {
  padding-bottom: var(--cu-space-xs);
}

.cu-tabs--solid .cu-tabs-tab {
  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));
}

.cu-tabs--solid .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--solid .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

.cu-tabs--solid .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

/* Variant: boxed */
.cu-tabs--boxed .cu-tabs-header {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
  background-color: var(--cu-color-surface);
  padding: var(--cu-space-2xs);
}

.cu-tabs--boxed .cu-tabs-tab {
  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));
}

.cu-tabs--boxed .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

/* Variant: soft (soft container box + solid active) */
.cu-tabs--soft .cu-tabs-header {
  border: none;
  border-radius: var(--cu-radius-md);
  background-color: var(--tabs-soft);
  padding: var(--cu-space-xs);
}

.cu-tabs--soft .cu-tabs-tab {
  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));
}

.cu-tabs--soft .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-solid);
  color: var(--tabs-solid-text);
}

.cu-tabs-panel {
  padding-top: var(--cu-space-md);
  font-size: var(--cu-font-size-md);
}

.cu-tabs--disabled {
  opacity: var(--cu-alpha-disabled, 0.7);
}
</style>
