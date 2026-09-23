<template>
  <section class="khadgar-app-layout">
    <header class="khadgar-app-layout__topbar">
      <div class="khadgar-app-layout__left">
        <slot name="title" />
      </div>
      <div class="khadgar-app-layout__actions">
        <slot name="actions" />
      </div>
    </header>
    <main class="khadgar-app-layout__body">
      <slot />
    </main>
  </section>
</template>

<style scoped>
.khadgar-app-layout {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  font-family: var(--cu-font-sans);
}

.khadgar-app-layout__topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--cu-space-lg);
  padding: var(--cu-space-sm) var(--cu-space-xl);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.khadgar-app-layout__left,
.khadgar-app-layout__actions {
  display: flex;
  align-items: center;
  gap: var(--cu-space-md);
}

.khadgar-app-layout__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>