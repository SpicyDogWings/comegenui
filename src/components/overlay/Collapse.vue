<script setup lang="ts">
import { ref, type PropType } from 'vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import Button from '@/components/buttons/Button.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: '',
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'neutral',
  },
})

const emit = defineEmits<{
  (e: 'toggle', isOpen: boolean): void
}>()

const isOpen = ref(props.defaultOpen)
const contentRef = ref<HTMLElement>()

function setOpen(value: boolean) {
  if (isOpen.value === value) return
  isOpen.value = value
  emit('toggle', value)
}

function toggle() {
  setOpen(!isOpen.value)
}

function open() {
  setOpen(true)
}

function close() {
  setOpen(false)
}

function onEnter(el: Element) {
  const el_ = el as HTMLElement
  el_.style.height = '0'
  el_.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    // El contenido puede colapsar a 0 con height:0 (hijos con altura relativa,
    // ej. AdvancedTable), lo que haría scrollHeight == 0. Se mide con height:auto
    // sin pintar y se restaura el 0 antes de animar en el frame siguiente.
    const prev = el_.style.height
    el_.style.height = ''
    const target = el_.scrollHeight
    el_.style.height = prev
    requestAnimationFrame(() => {
      el_.style.height = target + 'px'
    })
  })
  el_.addEventListener('transitionend', () => {
    el_.style.height = ''
    el_.style.overflow = ''
  }, { once: true })
}

function onAfterEnter(el: Element) {
  const el_ = el as HTMLElement
  el_.style.height = ''
  el_.style.overflow = ''
}

function onLeave(el: Element) {
  const el_ = el as HTMLElement
  el_.style.height = el_.scrollHeight + 'px'
  el_.style.overflow = 'hidden'
  el_.offsetHeight
  el_.style.height = '0'
}

function onAfterLeave(el: Element) {
  const el_ = el as HTMLElement
  el_.style.height = ''
  el_.style.overflow = ''
}

defineExpose({
  open,
  close,
  toggle,
  isOpen: () => isOpen.value,
})
</script>

<template>
  <div class="cu-collapse">
    <Button
      class="cu-collapse-trigger"
      :color="props.color"
      variant="ghost"
      @click="toggle()"
    >
      <LucideChevronRight class="cu-collapse-chevron" :class="{ 'is-open': isOpen }" :width="14" :height="14" />
      <span v-if="props.icon" class="cu-collapse-icon" v-html="props.icon"></span>
      <span class="cu-collapse-label">{{ props.label }}</span>
    </Button>
    <Transition
      appear
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="isOpen" ref="contentRef" class="cu-collapse-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cu-collapse {
  display: flex;
  flex-direction: column;
}

.cu-collapse-trigger {
  justify-content: flex-start;
  cursor: pointer;
}

.cu-collapse-chevron {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.cu-collapse-chevron.is-open {
  transform: rotate(90deg);
}

.cu-collapse-content {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  padding: 0 0 0 var(--cu-space-lg);
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
