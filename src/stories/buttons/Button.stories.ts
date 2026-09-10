// Generado por tools/stories/generate.mjs a partir de las props de Button.vue.
// (sin eventos declarados)

import { defineComponent, h, ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Button.stories.extras";

const ButtonLoadingExtra = defineComponent({
  name: "ButtonLoadingExtra",
  setup() {
    const entries: Array<{ idle: string; active: string; props?: Record<string, unknown> }> = [{"idle":"Click to Load","active":"Loading...","props":{"color":"primary","variant":"solid"}}];
    const loading = ref(entries.map(() => false));
    const trigger = (index: number) => {
      loading.value[index] = true;
      setTimeout(() => {
        loading.value[index] = false;
      }, 1500);
    };
    return () =>
      entries.map((entry, index) =>
        h(
          Button,
          { ...(entry.props ?? {}), loading: loading.value[index], onClick: () => trigger(index) },
          () => (loading.value[index] ? entry.active : entry.idle),
        ),
      );
  },
});

export const cuButtonStories: ComponentStory = {
  component: "cu-button",
  vue: Button,
  tokens: [
  '--btn-bg',
  '--btn-bg-hover',
  '--btn-bg-active',
  '--btn-soft',
  '--btn-soft-hover',
  '--btn-soft-active',
  '--btn-subtle',
  '--btn-subtle-hover',
  '--btn-subtle-active',
  '--btn-subtle-border',
  '--btn-ghost-hover',
  '--btn-ghost-active',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-size-lg',
  '--cu-font-weight-medium',
  '--cu-radius',
  '--cu-border-thin',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-space-xl',
],
  api: {
    props: [
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'size', type: 'string', default: '"md"', description: 'Tamaño del botón: sm, md, lg' },
  { name: 'type', type: 'string', default: '"button"', description: 'Tipo del button: button, submit, reset' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Estado deshabilitado' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner en lugar del contenido; deshabilita mientras está activo' },
  { name: 'to', type: 'string', default: '—', description: 'Si se define, el botón se renderiza como link (<a>)' },
  { name: 'target', type: 'string', default: '"_self"', description: 'Target del link cuando to está definido: _self, _blank, _parent, _top' },
],
    slots: [
  { name: 'default', type: 'slot', description: 'Contenido del botón: label y/o iconos SVG inline' },
],
    events: [
  { name: 'click', type: 'nativo', description: 'Activación del botón (mouse o teclado)' },
  { name: 'dblclick', type: 'nativo', description: 'Doble click' },
  { name: 'focus', type: 'nativo', description: 'El botón recibe foco' },
  { name: 'blur', type: 'nativo', description: 'El botón pierde el foco' },
  { name: 'mousedown', type: 'nativo', description: 'Botón del mouse presionado' },
  { name: 'mouseup', type: 'nativo', description: 'Botón del mouse soltado' },
  { name: 'mouseenter', type: 'nativo', description: 'El puntero entra al botón' },
  { name: 'mouseleave', type: 'nativo', description: 'El puntero sale del botón' },
  { name: 'keydown', type: 'nativo', description: 'Tecla presionada con foco en el botón' },
  { name: 'keyup', type: 'nativo', description: 'Tecla soltada con foco en el botón' },
  { name: 'contextmenu', type: 'nativo', description: 'Menú contextual (click derecho)' },
],
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", slots: {"default":"Guardar"} },
      ],
      vue: `  <Button>Guardar</Button>`,
      vanilla: `  <cu-button>Guardar</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "color",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Default: neutral",
      variants: [
        { id: "primary", props: {"color":"primary"}, slots: {"default":"Primary"} },
        { id: "secondary", props: {"color":"secondary"}, slots: {"default":"Secondary"} },
        { id: "neutral", props: {"color":"neutral"}, slots: {"default":"Neutral"} },
        { id: "success", props: {"color":"success"}, slots: {"default":"Success"} },
        { id: "warning", props: {"color":"warning"}, slots: {"default":"Warning"} },
        { id: "danger", props: {"color":"danger"}, slots: {"default":"Danger"} },
      ],
      vue: `  <Button color="primary">Primary</Button>
  <Button color="secondary">Secondary</Button>
  <Button color="neutral">Neutral</Button>
  <Button color="success">Success</Button>
  <Button color="warning">Warning</Button>
  <Button color="danger">Danger</Button>`,
      vanilla: `  <cu-button color="primary">Primary</cu-button>
  <cu-button color="secondary">Secondary</cu-button>
  <cu-button color="neutral">Neutral</cu-button>
  <cu-button color="success">Success</cu-button>
  <cu-button color="warning">Warning</cu-button>
  <cu-button color="danger">Danger</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "variant",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Default: ghost",
      variants: [
        { id: "solid", props: {"variant":"solid"}, slots: {"default":"Solid"} },
        { id: "outlined", props: {"variant":"outlined"}, slots: {"default":"Outlined"} },
        { id: "soft", props: {"variant":"soft"}, slots: {"default":"Soft"} },
        { id: "ghost", props: {"variant":"ghost"}, slots: {"default":"Ghost"} },
        { id: "subtle", props: {"variant":"subtle"}, slots: {"default":"Subtle"} },
        { id: "link", props: {"variant":"link"}, slots: {"default":"Link"} },
        { id: "none", props: {"variant":"none"}, slots: {"default":"None"} },
      ],
      vue: `  <Button variant="solid">Solid</Button>
  <Button variant="outlined">Outlined</Button>
  <Button variant="soft">Soft</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="subtle">Subtle</Button>
  <Button variant="link">Link</Button>
  <Button variant="none">None</Button>`,
      vanilla: `  <cu-button variant="solid">Solid</cu-button>
  <cu-button variant="outlined">Outlined</cu-button>
  <cu-button variant="soft">Soft</cu-button>
  <cu-button variant="ghost">Ghost</cu-button>
  <cu-button variant="subtle">Subtle</cu-button>
  <cu-button variant="link">Link</cu-button>
  <cu-button variant="none">None</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "aplica la clase cu-button--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.["variant"] as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-button").classes()).toContain(`cu-button--${value}`);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "size",
      title: "Sizes",
      badge: "md",
      badgeTitle: "Default: md",
      variants: [
        { id: "sm", props: {"size":"sm"}, slots: {"default":"sm"} },
        { id: "md", props: {"size":"md"}, slots: {"default":"md"} },
        { id: "lg", props: {"size":"lg"}, slots: {"default":"lg"} },
      ],
      vue: `  <Button size="sm">sm</Button>
  <Button size="md">md</Button>
  <Button size="lg">lg</Button>`,
      vanilla: `  <cu-button size="sm">sm</cu-button>
  <cu-button size="md">md</cu-button>
  <cu-button size="lg">lg</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "aplica la clase cu-button--{size}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.["size"] as string | undefined;
              if (!value) return;
              expect(wrapper.find(".cu-button").classes()).toContain(`cu-button--${value}`);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "links",
      title: "Links",
      variants: [
        { id: "external", props: {"to":"https://example.com","target":"_blank"}, slots: {"default":"External"} },
        { id: "internal", props: {"to":"/playground/components/button"}, slots: {"default":"Internal"} },
      ],
      vue: `  <Button to="https://example.com" target="_blank">External</Button>
  <Button to="/playground/components/button">Internal</Button>`,
      vanilla: `  <cu-button to="https://example.com" target="_blank">External</cu-button>
  <cu-button to="/playground/components/button">Internal</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "renderiza un <a> con href={to}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.["to"] as string | undefined;
              if (!value) return;
              const link = wrapper.find("a");
              expect(link.exists()).toBe(true);
              expect(link.attributes("href")).toBe(value);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "target",
      title: "Targets",
      badge: "_self",
      badgeTitle: "Default: _self",
      variants: [
        { id: "_self", props: {"target":"_self","to":"https://example.com"}, slots: {"default":"_self"} },
        { id: "_blank", props: {"target":"_blank","to":"https://example.com"}, slots: {"default":"_blank"} },
        { id: "_parent", props: {"target":"_parent","to":"https://example.com"}, slots: {"default":"_parent"} },
        { id: "_top", props: {"target":"_top","to":"https://example.com"}, slots: {"default":"_top"} },
      ],
      vue: `  <Button target="_self" to="https://example.com">_self</Button>
  <Button target="_blank" to="https://example.com">_blank</Button>
  <Button target="_parent" to="https://example.com">_parent</Button>
  <Button target="_top" to="https://example.com">_top</Button>`,
      vanilla: `  <cu-button target="_self" to="https://example.com">_self</cu-button>
  <cu-button target="_blank" to="https://example.com">_blank</cu-button>
  <cu-button target="_parent" to="https://example.com">_parent</cu-button>
  <cu-button target="_top" to="https://example.com">_top</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "renderiza un <a> con href={to}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.["to"] as string | undefined;
              if (!value) return;
              const link = wrapper.find("a");
              expect(link.exists()).toBe(true);
              expect(link.attributes("href")).toBe(value);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "type",
      title: "Types",
      badge: "button",
      badgeTitle: "Default: button",
      variants: [
        { id: "button", props: {"type":"button"}, slots: {"default":"button"} },
        { id: "submit", props: {"type":"submit"}, slots: {"default":"submit"} },
        { id: "reset", props: {"type":"reset"}, slots: {"default":"reset"} },
      ],
      vue: `  <Button type="button">button</Button>
  <Button type="submit">submit</Button>
  <Button type="reset">reset</Button>`,
      vanilla: `  <cu-button type="button">button</cu-button>
  <cu-button type="submit">submit</cu-button>
  <cu-button type="reset">reset</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: {"disabled":false}, slots: {"default":"Guardar"} },
        { id: "true", props: {"disabled":true}, slots: {"default":"Guardar"} },
      ],
      vue: `  <Button>Guardar</Button>
  <Button disabled>Guardar</Button>`,
      vanilla: `  <cu-button>Guardar</cu-button>
  <cu-button disabled>Guardar</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "disabled: refleja el atributo en el control",
            run({ wrapper, expect }, variant) {
              const control = wrapper.find("button, input, textarea, select");
              if (variant.props?.disabled) expect(control.attributes("disabled")).toBeDefined();
              else expect(control.attributes("disabled")).toBeUndefined();
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },

    {
      id: "loading",
      title: "Loading",
      badge: "false",
      badgeTitle: "Default: false",
      extra: ButtonLoadingExtra,
      variants: [
        { id: "false", props: {"loading":false}, slots: {"default":"Guardar"} },
        { id: "true", props: {"loading":true}, slots: {"default":"Guardar"} },
      ],
      vue: `  <Button>Guardar</Button>
  <Button loading>Guardar</Button>`,
      vanilla: `  <cu-button>Guardar</cu-button>
  <cu-button loading>Guardar</cu-button>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-button",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-button").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }, variant) {
              const text = variant.slots?.default;
              if (typeof text !== "string" || !text) return;
              expect(wrapper.text()).toContain(text);
            },
          },
          {
            name: "loading: muestra el spinner",
            run({ wrapper, expect }, variant) {
              if (variant.props?.loading) expect(wrapper.find(".cu-button-spinner").exists()).toBe(true);
              else expect(wrapper.find(".cu-button-spinner").exists()).toBe(false);
            },
          },
          // TODO: checks específicos (eventos, exposes).
        ],
      },
    },
  ],
};
