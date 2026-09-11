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
    class="cu-playground-button"
    :class="[`cu-playground-button--${variant ?? 'solid'}`, `cu-playground-button--${size ?? 'md'}`]"
    :href="to ?? href"
    @click="stopIfDisabled($event, disabled)"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    class="cu-playground-button"
    :class="[`cu-playground-button--${variant ?? 'solid'}`, `cu-playground-button--${size ?? 'md'}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.cu-playground-button {
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

.cu-playground-button--link {
  text-decoration: none;
}

.cu-playground-button--link:hover {
  text-decoration: underline;
}

.cu-playground-button--sm {
  font-size: var(--cu-font-size-sm);
}

.cu-playground-button--solid {
  background: var(--cu-color-primary);
  color: var(--cu-color-primary-text);
  padding: var(--cu-space-xs) var(--cu-space-md);
  border-radius: var(--cu-radius);
}
</style>