<script setup lang="ts">
defineProps<{
  to?: string;
  href?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
}>();

function stopIfDisabled(event: Event, disabled?: boolean) {
  if (disabled) event.preventDefault();
}
</script>

<template>
  <a
    v-if="to || href"
    class="khadgar-button"
    :class="[`khadgar-button--${variant ?? 'solid'}`, `khadgar-button--${size ?? 'md'}`]"
    :href="to ?? href"
    @click="stopIfDisabled($event, disabled)"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    class="khadgar-button"
    :class="[`khadgar-button--${variant ?? 'solid'}`, `khadgar-button--${size ?? 'md'}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.khadgar-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: var(--cu-color-primary);
  padding: 0;
}

.khadgar-button--link {
  text-decoration: none;
}

.khadgar-button--link:hover {
  text-decoration: underline;
}

.khadgar-button--sm {
  font-size: var(--cu-font-size-sm);
}

.khadgar-button--solid {
  background: var(--cu-color-primary);
  color: var(--cu-color-primary-text);
  padding: var(--cu-space-xs) var(--cu-space-md);
  border-radius: var(--cu-radius);
}
</style>