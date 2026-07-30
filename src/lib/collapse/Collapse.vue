<script setup lang="ts">
import { ref } from 'vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'
import Button from '@/components/buttons/Button.vue'

const props = defineProps<{
  label: string
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)
const contentRef = ref<HTMLElement>()

function onEnter(el: Element) {
  const el_ = el as HTMLElement
  el_.style.height = '0'
  el_.style.overflow = 'hidden'
  el_.offsetHeight
  el_.style.height = el_.scrollHeight + 'px'
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
</script>

<template>
  <div class="cu-collapse">
    <Button class="cu-collapse-trigger" variant="none" color="neutral" @click="isOpen = !isOpen">
      <LucideChevronRight class="cu-collapse-chevron" :class="{ 'is-open': isOpen }" :width="14" :height="14" />
      {{ label }}
    </Button>
    <Transition
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
