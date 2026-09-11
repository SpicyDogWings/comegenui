<template>
  <section class="cu-playground-app-layout">
    <header class="cu-playground-app-layout__topbar">
      <div class="cu-playground-app-layout__left">
        <slot name="title" />
      </div>
      <div class="cu-playground-app-layout__actions">
        <slot name="actions" />
      </div>
    </header>
    <main class="cu-playground-app-layout__body">
      <slot />
    </main>
  </section>
</template>

<style scoped>
.cu-playground-app-layout {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  font-family: var(--cu-font-sans);
}

.cu-playground-app-layout__topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--cu-space-lg);
  padding: var(--cu-space-sm) var(--cu-space-xl);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-playground-app-layout__left,
.cu-playground-app-layout__actions {
  display: flex;
  align-items: center;
  gap: var(--cu-space-md);
}

.cu-playground-app-layout__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>