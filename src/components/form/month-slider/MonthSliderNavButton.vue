<script setup lang="ts">
import { computed, type PropType } from 'vue'
import Button from '@/components/buttons/Button.vue'
import LucideChevronLeft from '@/components/icons/LucideChevronLeft.vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import LucideChevronsLeft from '@/components/icons/LucideChevronsLeft.vue'
import LucideChevronsRight from '@/components/icons/LucideChevronsRight.vue'

const props = defineProps({
  direction: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
  double: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'neutral',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// `double` salta un año, el simple un mes. El label se usa para accesibilidad.
const label = computed(() => {
  const step = props.double ? 'año' : 'mes'
  const dir = props.direction === 'left' ? 'anterior' : 'siguiente'
  return `Ir al ${step} ${dir}`
})
</script>

<template>
  <Button
    class="cu-month-slider-nav"
    variant="ghost"
    :color="props.color"
    :disabled="props.disabled"
    :aria-label="label"
    @click="emit('click', $event)"
  >
    <LucideChevronsLeft v-if="props.double && props.direction === 'left'" :width="16" :height="16" />
    <LucideChevronLeft v-else-if="props.direction === 'left'" :width="16" :height="16" />
    <LucideChevronRight v-else-if="props.direction === 'right' && !props.double" :width="16" :height="16" />
    <LucideChevronsRight v-else :width="16" :height="16" />
  </Button>
</template>

<style scoped>
.cu-month-slider-nav {
  padding: var(--cu-space-sm);
  border-radius: var(--cu-radius-full);
  flex-shrink: 0;
}
</style>
