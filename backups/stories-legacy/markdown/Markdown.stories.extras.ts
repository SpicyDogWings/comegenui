import { defineComponent, h, ref } from "vue";
import Markdown from "@/components/markdown/Markdown.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const MD = `# Título

Párrafo con **negrita** y *cursiva*.

## Lista

- Item uno
- Item dos

\`\`\`js
console.log('hola')
\`\`\``;

interface MarkdownInstance {
  headingIds: () => string[];
}

const MarkdownProgrammatic = defineComponent({
  name: "MarkdownProgrammatic",
  setup() {
    const mdRef = ref<InstanceType<typeof Markdown> | null>(null);
    const ids = ref<string[]>([]);

    const read = () => {
      const md = mdRef.value as unknown as MarkdownInstance | null;
      ids.value = md ? md.headingIds() : [];
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "headingIds()"),
        ]),
        h("p", { class: "playground-state" }, [
          "headingIds(): ",
          h("strong", ids.value.join(", ") || "—"),
        ]),
        h(Markdown, { ref: mdRef, onParsed: (next: string[]) => (ids.value = next) }, () => MD),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Markdown from '@/components/markdown/Markdown.vue'
import Button from '@/components/buttons/Button.vue'

const mdRef = ref(null)
const ids = ref([])

const read = () => (ids.value = mdRef.value.headingIds())
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">headingIds()</Button>
    </div>
    <p class="playground-state">headingIds(): <strong>{{ ids.join(', ') || '—' }}</strong></p>
    <Markdown ref="mdRef" @parsed="ids = $event">
# Título

## Lista
    </Markdown>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuMarkdown.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="md-get" color="neutral">headingIds()</cu-button>
  </div>
  <p id="md-state">headingIds(): —</p>
  <cu-markdown id="md">
# Título

## Lista
  </cu-markdown>
</div>

<script>
  customElements.whenDefined('cu-markdown').then(() => {
    const md = document.getElementById('md');
    const state = document.getElementById('md-state');
    document.getElementById('md-get').addEventListener('click', () => {
      state.textContent = 'headingIds(): ' + (md.headingIds().join(', ') || '—');
    });
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description: "Patio de juegos del expose headingIds() sobre una instancia en vivo.",
    render: () => h(MarkdownProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
