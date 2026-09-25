<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import type { KhadgarRow } from "@/plugins/khadgar/api";
import Input from "@/components/form/Input.vue";
import Label from "@/components/form/Label.vue";
import Select from "@/components/form/Select.vue";
import Switch from "@/components/form/Switch.vue";
import Card from "@/components/information/Card.vue";
import { byName } from "./data";
import { loadComponent } from "./registry";

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

function kind(prop: KhadgarRow): "enum" | "boolean" | "number" | "text" {
  if (enumValues(prop.type)) return "enum";
  if (prop.type === "boolean") return "boolean";
  if (prop.type === "number") return "number";
  return "text";
}

/** Valor textual para el `Input`. Coerciona props complejas (arrays/objetos,
 *  fuera del playground) al string que el `Input` espera, sin warning de tipo. */
function textValue(prop: KhadgarRow): string {
  return String(controls.value[prop.name] ?? "");
}

function onTextInput(prop: KhadgarRow, value: string) {
  controls.value[prop.name] = value;
}

// Agrupa los props por tipo de control (select → input → boolean), conservando
// el orden de declaración dentro de cada grupo. Los grupos vacíos no se pintan.
const controlGroups = computed(() =>
  [
    { id: "enum", label: "Opciones", kinds: ["enum"] },
    { id: "input", label: "Entrada", kinds: ["text", "number"] },
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

async function load() {
  const name = props.name;
  const next: Record<string, unknown> = {};
  for (const prop of meta.value?.props ?? []) {
    if (prop.default !== undefined) next[prop.name] = parseDefault(prop.default);
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
        <component :is="comp" :key="name" v-if="comp" v-bind="values">{{ name }}</component>
        <span v-else class="khadgar-demo__loading">Cargando demo…</span>
      </div>

      <template v-if="meta?.props.length" #footer>
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
                <Input
                  v-else
                  :model-value="textValue(prop)"
                  @update:model-value="(value: string) => onTextInput(prop, value)"
                />
              </Label>
            </div>
          </section>
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
/* Los grupos (select → input → boolean) se apilan en columna. */
.khadgar-demo__controls {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-lg);
  width: 100%;
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
.khadgar-demo__control input[type="number"] {
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
