<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;

const paletteColor = ref<Record<string, InstanceType<typeof CommandPalette> | null>>({});
const paletteSize = ref<Record<string, InstanceType<typeof CommandPalette> | null>>({});

const commands = [
  { id: "a", label: "Comando A", action: () => {} },
  { id: "b", label: "Comando B", action: () => {} },
];
</script>

<template>
  <Button
    v-for="color in colors"
    :key="`color-${color}`"
    size="sm"
    @click="paletteColor[color]?.open()"
  >
    color: {{ color }}
  </Button>
  <Button
    v-for="size in sizes"
    :key="`size-${size}`"
    size="sm"
    variant="soft"
    @click="paletteSize[size]?.open()"
  >
    size / height: {{ size }}
  </Button>

  <CommandPalette
    v-for="color in colors"
    :key="`p-${color}`"
    :ref="(el) => { paletteColor[color] = el as InstanceType<typeof CommandPalette> | null }"
    :title="`Paleta ${color}`"
    :placeholder="`Buscar (${color})…`"
    :color="color"
    :commands="commands"
  />
  <CommandPalette
    v-for="size in sizes"
    :key="`ps-${size}`"
    :ref="(el) => { paletteSize[size] = el as InstanceType<typeof CommandPalette> | null }"
    :title="`size ${size}`"
    :size="size"
    :height="size"
    :commands="commands"
  />
</template>
