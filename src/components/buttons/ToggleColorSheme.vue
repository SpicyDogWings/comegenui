<script setup lang="ts">
import { computed } from 'vue'
import { theme, setTheme } from '@/plugins/cu-tokens'
import Button from './Button.vue'
import LucideSun from '../icons/LucideSun.vue'
import LucideMoon from '../icons/LucideMoon.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'ghost',
  },
  size: {
    type: Number,
    default: 20,
  },
})

const isDark = computed(() => theme.value === 'dark')

function toggle() {
  setTheme(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <Button
    :variant="variant"
    class="cu-button--icon-only"
    @click="toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <LucideSun v-if="isDark" :width="size" :height="size" />
    <LucideMoon v-else :width="size" :height="size" />
  </Button>
</template>
