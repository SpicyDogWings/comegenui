<script setup lang="ts">
const handleClick = (e: Event) => {
  // Obtener el host (cu-label) desde el elemento clickeado
  const target = e.currentTarget as HTMLElement;
  const host = target.getRootNode()?.host as HTMLElement | null;
  
  if (!host) return;
  
  // Buscar en todos los hijos del light DOM del host
  const allChildren = Array.from(host.children);
  
  for (const child of allChildren) {
    // Buscar cu-input o input en este hijo o sus descendientes
    let input: HTMLElement | null = null;
    
    if (child.tagName === "CU-INPUT" || child.tagName === "INPUT") {
      input = child;
    } else {
      input = child.querySelector("cu-input, input");
    }
    
    if (input) {
      // Intentar llamar al metodo focus del custom element
      if (typeof (input as any).focus === "function") {
        (input as any).focus();
        return;
      }
      // Fallback para inputs nativos
      input.focus();
      return;
    }
  }
};
</script>

<template>
  <label
    @click="handleClick"
    class="cursor-pointer inline-block font-sans"
  >
    <slot></slot>
  </label>
</template>

<style>
@unocss-placeholder;
</style>
