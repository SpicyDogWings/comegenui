<script setup lang="ts">
import { ref, type PropType } from "vue";
import Button from "./Button.vue";
import LucideCopy from "@/components/icons/LucideCopy.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";

const props = defineProps({
  text: { type: String, required: true },
  label: { type: String, default: "" },
  copiedLabel: { type: String, default: "Copiado" },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "soft",
  },
});

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  if (!(await copyToClipboard(props.text))) return;
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => {
    copied.value = false;
  }, 2000);
}
async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // cae al fallback
    }
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
  }
}
</script>

<template>
  <Button
    :color="color"
    :variant="variant"
    class="cu-copy-button"
    :aria-label="copied ? copiedLabel : (label || 'Copiar')"
    @click="copy"
  >
    <LucideCheck v-if="copied" class="cu-copy-button-icon" />
    <LucideCopy v-else class="cu-copy-button-icon" />
    <Transition name="cu-copy-fade" mode="out-in">
      <span
        v-if="copied || label"
        :key="copied ? 'copied' : 'label'"
        class="cu-copy-button-text"
      >{{ copied ? copiedLabel : label }}</span>
    </Transition>
  </Button>
</template>

<style scoped>
.cu-copy-button-icon {
  width: 1em;
  height: 1em;
}

.cu-copy-button-text {
  white-space: nowrap;
}

/* clase duplicada a propósito: (0,3,0) le gana al global del playground
   ".playground[data-v] span" (0,2,1) que fuerza color neutral en los spans */
.cu-copy-button-text.cu-copy-button-text {
  color: inherit;
}

.cu-copy-fade-enter-active,
.cu-copy-fade-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.cu-copy-fade-enter-from,
.cu-copy-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
