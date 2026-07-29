<script setup lang="ts">
import { ref } from 'vue'
import LucideChevronRight from '@/components/icons/LucideChevronRight.vue'

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
    <button class="cu-collapse-trigger" @click="isOpen = !isOpen">
      <LucideChevronRight class="cu-collapse-chevron" :class="{ 'is-open': isOpen }" :width="14" :height="14" />
      {{ label }}
    </button>
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
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  color: var(--cu-color-neutral);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  cursor: pointer;
  text-align: left;
  border-radius: var(--cu-radius-md);
  transition: background-color 0.15s;
}

.cu-collapse-trigger:hover {
  background-color: var(--cu-color-primary-subtle-hover);
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
  gap: 0.25rem;
  padding: 0.25rem 0 0.25rem 0.75rem;
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
