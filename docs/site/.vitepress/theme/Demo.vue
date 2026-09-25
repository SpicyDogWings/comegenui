<script setup lang="ts">
import { computed, ref, shallowRef, watch, type Component } from "vue";
import type { KhadgarRow } from "@/plugins/khadgar/api";
import Input from "@/components/form/Input.vue";
import Label from "@/components/form/Label.vue";
import Select from "@/components/form/Select.vue";
import Switch from "@/components/form/Switch.vue";
import Card from "@/components/information/Card.vue";
import Collapse from "@/components/overlay/Collapse.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import LucidePlus from "@/components/icons/LucidePlus.vue";
import { byName } from "./data";
import { loadComponent } from "./registry";
import { samples } from "./samples";

const props = defineProps<{ name: string }>();

const meta = computed(() => byName.get(props.name));
const comp = shallowRef<unknown>(null);
const values = ref<Record<string, unknown>>({});
// Vista `any` de `values` para el v-model de los controles (sus modelos son
// tipados: string, boolean, etc.).
const controls = computed(() => values.value as Record<string, any>);

function parseDefault(value: string): unknown {
  const text = String(value).trim();
  if (text === "true") return true;
  if (text === "false") return false;
  if (text === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  if (/^[[{]/.test(text)) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

/** Valores de una unión de literales: `"a" | "b"` → `["a", "b"]`. */
function enumValues(type?: string): string[] | null {
  if (!type) return null;
  const parts = type.split("|").map((part) => part.trim());
  if (parts.length && parts.every((part) => /^"[^"]*"$/.test(part))) {
    return parts.map((part) => part.slice(1, -1));
  }
  return null;
}

/** Opciones de un `<Select>` a partir de una unión de literales. */
function enumOptions(prop: KhadgarRow) {
  return (enumValues(prop.type) ?? []).map((value) => ({ value, label: value }));
}

// Tipos primitivos/escalares que NO convierten una unión en "objeto".
const SCALAR_TYPES = new Set([
  "String", "Number", "Boolean", "Date", "File", "Array", "Object",
  "Record", "RegExp", "Component", "Promise", "Partial", "null", "undefined",
]);

// Interfaces primitivas que sí pueden ser una "lista" editable como texto.
const PRIMITIVE_IDS = new Set(["String", "Number", "Boolean", "Date"]);

// Props complejas que igual no queremos tratar como JSON (estilo/genéricas, o
// interfaces que exigen funciones como `CommandItem.action`).
const JSON_EXCLUDE = new Set([
  "Popover.panelClass",
  "InlineRenderer.tokens",
  "CommandPalette.commands",
]);

/** ¿La prop es un objeto/array (JSON-able)? Excluye funciones y `File`. */
function isJson(prop: KhadgarRow): boolean {
  const type = prop.type ?? "";
  if (/=>/.test(type) || /\bFile\b/.test(type) || /^any(\[\])?$/.test(type)) return false;
  if (JSON_EXCLUDE.has(`${props.name}.${prop.name}`)) return false;
  if (/\[\]|Record</.test(type) || /^\{/.test(type.trim())) return true;
  const ids = type.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
  return ids.some((id) => !SCALAR_TYPES.has(id));
}

/** ¿Es una lista de primitivos (`number[]`, `string[]`, `(string | Date)[]`)? */
function isPrimitiveList(prop: KhadgarRow): boolean {
  const type = prop.type ?? "";
  if (!/\[\]/.test(type)) return false;
  const ids = type.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [];
  return ids.every((id) => PRIMITIVE_IDS.has(id));
}

/** ¿La unión incluye `boolean` (`boolean` o `string | boolean`)? */
function hasBoolean(type?: string): boolean {
  if (!type) return false;
  return type.split("|").some((part) => part.trim() === "boolean");
}

/** ¿La unión incluye `Date` y no es un array? */
function isDateType(type?: string): boolean {
  if (!type || /\[\]/.test(type)) return false;
  return /\bDate\b/.test(type);
}

/** Objeto de ejemplo curado para una prop compleja (si existe). */
function sampleFor(prop: KhadgarRow): unknown {
  return samples[props.name]?.[prop.name];
}

function kind(prop: KhadgarRow): "enum" | "boolean" | "number" | "json" | "date" | "list" | "text" {
  const type = prop.type ?? "";
  // Las listas de primitivos se editan como texto separado por comas.
  if (isPrimitiveList(prop)) return "list";
  if (isJson(prop)) return "json";
  if (enumValues(type)) return "enum";
  if (hasBoolean(type)) return "boolean";
  if (isDateType(type)) return "date";
  if (type === "number") return "number";
  return "text";
}

/** Props complejas que se muestran como JSON en la sección de datos. */
const jsonProps = computed(() => (meta.value?.props ?? []).filter((prop) => kind(prop) === "json"));

/** JSON serializado del valor actual de una prop compleja. */
function jsonOf(prop: KhadgarRow): string {
  return JSON.stringify(values.value[prop.name] ?? null, null, 2);
}

/** Valor textual para el `Input`. Coerciona props complejas (arrays/objetos,
 *  fuera del playground) al string que el `Input` espera, sin warning de tipo. */
function textValue(prop: KhadgarRow): string {
  return String(controls.value[prop.name] ?? "");
}

function onTextInput(prop: KhadgarRow, value: string) {
  controls.value[prop.name] = value;
}

/** Valor `YYYY-MM-DD` para el `<input type="date">`. */
function dateValue(prop: KhadgarRow): string {
  const raw = controls.value[prop.name];
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${raw.getFullYear()}-${pad(raw.getMonth() + 1)}-${pad(raw.getDate())}`;
  }
  return typeof raw === "string" ? raw : "";
}

function onDateInput(prop: KhadgarRow, event: Event) {
  controls.value[prop.name] = (event.target as HTMLInputElement).value;
}

/** Valor textual de una lista de primitivos (`0, 6`). */
function listValue(prop: KhadgarRow): string {
  const raw = controls.value[prop.name];
  if (Array.isArray(raw)) return raw.join(", ");
  return typeof raw === "string" ? raw : "";
}

function onListInput(prop: KhadgarRow, value: string) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  controls.value[prop.name] = /number/.test(prop.type ?? "")
    ? parts.map(Number).filter((n) => !Number.isNaN(n))
    : parts;
}

// Agrupa los props por tipo de control (select → input → boolean), conservando
// el orden de declaración dentro de cada grupo. Los grupos vacíos no se pintan.
const controlGroups = computed(() =>
  [
    { id: "enum", label: "Opciones", kinds: ["enum"] },
    { id: "input", label: "Entrada", kinds: ["text", "number", "date", "list"] },
    { id: "boolean", label: "Booleanos", kinds: ["boolean"] },
  ]
    .map((group) => ({
      ...group,
      props: (meta.value?.props ?? []).filter((prop) =>
        group.kinds.includes(kind(prop)),
      ),
    }))
    .filter((group) => group.props.length > 0),
);

// Contenido del slot por componente: si no hay ícono, se usa el nombre.
const slotIcons: Record<string, Component> = { FloatingButton: LucidePlus };
const slotIcon = computed(() => slotIcons[props.name] ?? null);

// Componentes que se renderizan fuera del preview (ej. `position: fixed`): el
// stage queda vacío, así que se muestra un placeholder para que no parezca que
// nunca cargó. El componente igual se monta y se ve en vivo.
const outsidePreview = new Set(["FloatingButton"]);
const showOutside = computed(() => Boolean(comp.value) && outsidePreview.has(props.name));

async function load() {
  const name = props.name;
  const next: Record<string, unknown> = {};
  for (const prop of meta.value?.props ?? []) {
    const sample = sampleFor(prop);
    if (sample !== undefined) {
      // Objeto/valor de ejemplo curado; se clona para no mutar la muestra
      // compartida entre navegaciones.
      next[prop.name] = structuredClone(sample);
    } else if (isJson(prop)) {
      // Sin muestra: el default declarado (o []/{});
      const fallback =
        prop.default !== undefined
          ? parseDefault(prop.default)
          : (prop.type ?? "").includes("[]")
            ? []
            : {};
      next[prop.name] = structuredClone(fallback);
    } else if (prop.default !== undefined) {
      next[prop.name] = parseDefault(prop.default);
    }
  }
  values.value = next;
  comp.value = null; // evita que quede el componente anterior
  const loader = loadComponent(name);
  const loaded = loader ? await loader() : null;
  // Ignora respuestas viejas si ya se navegó a otro componente.
  if (props.name === name) comp.value = loaded;
}

// El `<Demo>` vive en el layout (persiste entre navegaciones SPA), así que hay
// que reaccionar al cambio de `name` en vez de cargar una sola vez en `onMounted`.
watch(() => props.name, load, { immediate: true });
</script>

<template>
  <ClientOnly>
    <Card class="khadgar-demo" variant="ghost">
      <div class="khadgar-demo__stage">
        <component :is="comp" :key="name" v-if="comp" v-bind="values">
          <component :is="slotIcon" v-if="slotIcon" />
          <template v-else>{{ name }}</template>
        </component>
        <span v-else class="khadgar-demo__loading">Cargando demo…</span>

        <div v-if="showOutside" class="khadgar-demo__outside">
          <component :is="slotIcon" class="khadgar-demo__outside-icon" v-if="slotIcon" />
          <span>Se renderiza flotando, en la esquina inferior derecha</span>
        </div>
      </div>

      <template v-if="meta?.props.length" #footer>
        <div class="khadgar-demo__footer">
        <div class="khadgar-demo__controls">
          <section v-for="group in controlGroups" :key="group.id" class="khadgar-demo__group">
            <span class="khadgar-demo__group-label">{{ group.label }}</span>
            <div class="khadgar-demo__group-fields">
              <Label
                v-for="prop in group.props"
                :key="prop.name"
                :label="prop.name"
                class="khadgar-demo__control"
              >
                <Select
                  v-if="kind(prop) === 'enum'"
                  v-model="controls[prop.name]"
                  :options="enumOptions(prop)"
                  fixed
                />
                <Switch v-else-if="kind(prop) === 'boolean'" v-model="controls[prop.name]" />
                <input
                  v-else-if="kind(prop) === 'number'"
                  type="number"
                  v-model.number="controls[prop.name]"
                />
                <input
                  v-else-if="kind(prop) === 'date'"
                  type="date"
                  :value="dateValue(prop)"
                  @input="onDateInput(prop, $event)"
                />
                <Input
                  v-else-if="kind(prop) === 'list'"
                  :model-value="listValue(prop)"
                  @update:model-value="(value: string) => onListInput(prop, value)"
                />
                <Input
                  v-else
                  :model-value="textValue(prop)"
                  @update:model-value="(value: string) => onTextInput(prop, value)"
                />
              </Label>
            </div>
          </section>
        </div>

        <div v-if="jsonProps.length" class="khadgar-demo__data">
          <span class="khadgar-demo__group-label">Datos</span>
          <Collapse
            v-for="prop in jsonProps"
            :key="prop.name"
            :label="prop.name"
            class="khadgar-demo__data-item"
          >
            <CodeBlock :code="jsonOf(prop)" language="json" />
          </Collapse>
        </div>
        </div>
      </template>
    </Card>
  </ClientOnly>
</template>

<style scoped>
.khadgar-demo {
  margin: 20px 0;
}
.khadgar-demo__stage {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  padding: var(--cu-space-xl) var(--cu-space-md);
}
.khadgar-demo__loading {
  color: var(--cu-color-neutral);
  opacity: 0.6;
  font-size: 13px;
}
/* Placeholder para componentes que se renderizan fuera del stage (fixed): así
   el preview no queda vacío y no parece que el componente no cargó. */
.khadgar-demo__outside {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--cu-space-sm);
  color: var(--cu-color-neutral);
  opacity: 0.55;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  text-align: center;
}
.khadgar-demo__outside-icon {
  font-size: 28px;
}
.khadgar-demo__footer {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-lg);
  width: 100%;
  min-width: 0;
}
/* Los grupos (select → input → boolean) se apilan en columna. */
.khadgar-demo__controls {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-lg);
  width: 100%;
}
/* Props complejas: un Collapse por prop con el JSON cargado (solo lectura). */
.khadgar-demo__data {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
  width: 100%;
}
.khadgar-demo__data-item :deep(.cu-code-block) {
  margin-bottom: 0;
}
.khadgar-demo__group {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}
.khadgar-demo__group-label {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cu-color-neutral);
  opacity: 0.45;
}
/* Grilla auto-ajustable: dentro de cada grupo los controles se reparten en
   columnas parejas. `auto-fill` mantiene el mismo ancho de columna entre
   grupos, aunque un grupo tenga menos controles que otro. */
.khadgar-demo__group-fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--cu-space-md);
}
.khadgar-demo__control {
  min-width: 0;
}
.khadgar-demo__control :deep(.cu-label-text) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* El Switch (32px) es más bajo que Input/Select (48px): se iguala la altura
   para que los controles de una misma fila queden a la misma línea. */
.khadgar-demo__control :deep(.cu-switch) {
  min-height: 48px;
}
/* El input numérico no tiene componente en la lib: se conserva nativo, pero
   con la piel del `Input` (variante soft) para no desentonar. */
.khadgar-demo__control input[type="number"],
.khadgar-demo__control input[type="date"] {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border: none;
  border-radius: var(--cu-radius-md);
  background-color: var(--cu-color-neutral-soft);
  color: var(--cu-color-neutral-text);
  box-sizing: border-box;
  width: 100%;
}
</style>
