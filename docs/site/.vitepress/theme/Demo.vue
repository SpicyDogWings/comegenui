<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import type { KhadgarRow } from "@/plugins/khadgar/api";
import { byName } from "./data";
import { loadComponent } from "./registry";

const props = defineProps<{ name: string }>();

const meta = computed(() => byName.get(props.name));
const comp = shallowRef<unknown>(null);
const values = ref<Record<string, unknown>>({});

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

function kind(prop: KhadgarRow): "enum" | "boolean" | "number" | "text" {
  if (enumValues(prop.type)) return "enum";
  if (prop.type === "boolean") return "boolean";
  if (prop.type === "number") return "number";
  return "text";
}

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
    <div class="khadgar-demo">
      <div class="khadgar-demo__stage">
        <component :is="comp" :key="name" v-if="comp" v-bind="values">{{ name }}</component>
        <span v-else class="khadgar-demo__loading">Cargando demo…</span>
      </div>
      <div v-if="meta?.props.length" class="khadgar-demo__controls">
        <label v-for="prop in meta.props" :key="prop.name" class="khadgar-demo__control">
          <code>{{ prop.name }}</code>
          <select v-if="kind(prop) === 'enum'" v-model="values[prop.name]">
            <option v-for="value in enumValues(prop.type)" :key="value" :value="value">
              {{ value }}
            </option>
          </select>
          <input
            v-else-if="kind(prop) === 'boolean'"
            type="checkbox"
            v-model="values[prop.name]"
          />
          <input
            v-else-if="kind(prop) === 'number'"
            type="number"
            v-model.number="values[prop.name]"
          />
          <input v-else type="text" v-model="values[prop.name]" />
        </label>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.khadgar-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  margin: 20px 0;
  overflow: hidden;
}
.khadgar-demo__stage {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  background: var(--vp-c-bg-soft);
}
.khadgar-demo__loading {
  color: var(--vp-c-text-3);
  font-size: 13px;
}
.khadgar-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
}
.khadgar-demo__control {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}
.khadgar-demo__control code {
  color: var(--vp-c-text-2);
}
.khadgar-demo__control input[type="text"],
.khadgar-demo__control input[type="number"],
.khadgar-demo__control select {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 3px 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
</style>
