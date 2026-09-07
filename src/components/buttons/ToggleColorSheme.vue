<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import Button from './Button.vue'
import LucideSun from '../icons/LucideSun.vue'
import LucideMoon from '../icons/LucideMoon.vue'

const store = useThemeStore()

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

const isDark = computed(() => store.current === 'dark')

function toggle() {
  store.toggleLightDark()
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
