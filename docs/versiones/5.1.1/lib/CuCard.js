/*! comegenui v5.1.1 · CuCard (cu-card) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, openBlock, renderSlot, toDisplayString, useSlots, withCtx } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.1.1",
	"format": "esm",
	"variant": "shared",
	"type": "esm-shared"
};
/** Valor de metadata con fallback `dev` (fuera de build no existe). */
function metaText(value) {
	return typeof value === "string" && value ? value : "dev";
}
/** `cu-alert` → `CuAlert` (nombre del bundle / global de la UMD). */
function pascalCase(tag) {
	return tag.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}
/** `cu-alert` + `5.0.0-alpha.3` → `cu-alert--v5-0-0-alpha-3`. */
function toVersionedTag(tag, version) {
	const slug = version.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
	return slug ? `${tag}--v${slug}` : tag;
}
function versionOf(ctor) {
	return ctor.comegen?.version;
}
function attachMeta(ctor, meta) {
	Object.defineProperty(ctor, "comegen", {
		value: meta,
		configurable: true
	});
	Object.defineProperty(ctor.prototype, "comegen", {
		get: () => meta,
		configurable: true
	});
	return ctor;
}
/** Un constructor nuevo por tag: el registry no admite el mismo en dos nombres. */
function makeElement(component, meta) {
	return attachMeta(defineCustomElement(component), meta);
}
/**
* Registra el tag base con guarda: si ya lo tomó otra versión se conserva la
* primera y se avisa. El tag versionado (`<cu-x--v…>`) se registra siempre, así
* conviven versiones distintas del mismo componente en la misma página.
*/
function register(tag, component, meta) {
	if (typeof customElements === "undefined") return null;
	let base = null;
	const current = customElements.get(tag);
	if (!current) {
		base = makeElement(component, meta);
		customElements.define(tag, base);
	} else if (versionOf(current) !== meta.version) {
		const own = versionOf(current);
		const detail = own ? `v${own}` : "una versión desconocida";
		console.warn(`[comegenui] <${tag}> ya está registrado (${detail}); se mantiene esa versión. La v${meta.version} quedó disponible como <${meta.versionedTag}>.`);
	}
	if (!customElements.get(meta.versionedTag)) customElements.define(meta.versionedTag, makeElement(component, meta));
	return base;
}
/**
* Define y registra un custom element de ComegenUI adjuntándole sus metadatos de
* bundle (`CuX.comegen` y `el.comegen`). Reemplaza al par
* `defineCustomElement` + `customElements.define` en los entry points de `src/lib`.
*/
function defineComegenElement(tag, component) {
	const version = typeof BUILD_META.version === "string" && BUILD_META.version ? BUILD_META.version : "dev";
	const meta = Object.freeze({
		lib: "comegenui",
		name: pascalCase(tag),
		tag,
		version,
		format: metaText(BUILD_META.format),
		variant: metaText(BUILD_META.variant),
		type: metaText(BUILD_META.type),
		versionedTag: toVersionedTag(tag, version)
	});
	return register(tag, component, meta) ?? makeElement(component, meta);
}
//#endregion
//#region src/utils/validators.ts
/** Set cerrado de strings: devuelve un type-guard listo para `validator`. */
function oneOf(values) {
	const allowed = new Set(values);
	return (value) => typeof value === "string" && allowed.has(value);
}
var COLORS = [
	"primary",
	"secondary",
	"neutral",
	"success",
	"warning",
	"danger"
];
var COLORS_BASE = [
	"primary",
	"neutral",
	"success",
	"warning",
	"danger"
];
var VARIANTS = [
	"solid",
	"outlined",
	"soft",
	"ghost",
	"subtle"
];
var VARIANTS_FULL = [
	"solid",
	"outlined",
	"soft",
	"ghost",
	"subtle",
	"link",
	"none"
];
var VARIANTS_NO_GHOST = [
	"solid",
	"outlined",
	"soft",
	"subtle"
];
var VARIANTS_FIELD = [
	"outlined",
	"soft",
	"ghost",
	"subtle"
];
var VARIANTS_FIELD_NONE = [
	"outlined",
	"soft",
	"ghost",
	"subtle",
	"none"
];
var VARIANTS_TABS = [
	"ghost",
	"solid",
	"boxed",
	"soft"
];
var SIZES = [
	"sm",
	"md",
	"lg"
];
var SIZES_SM = ["sm", "md"];
var MODAL_SIZES = [
	"auto",
	"sm",
	"md",
	"lg",
	"xl",
	"full"
];
var ALIGNS = [
	"start",
	"center",
	"end"
];
var TEXT_ALIGNS = [
	"left",
	"center",
	"right"
];
var POSITIONS = [
	"bottom",
	"top",
	"left",
	"right"
];
var POSITIONS_VERTICAL = ["bottom", "top"];
var TRIGGERS = ["click", "hover"];
var BUTTON_TYPES = [
	"button",
	"submit",
	"reset"
];
var INPUT_TYPES = [
	"text",
	"password",
	"email",
	"number",
	"tel",
	"url",
	"search"
];
var TARGETS = [
	"_self",
	"_blank",
	"_parent",
	"_top"
];
var DATE_MODES = ["single", "range"];
var CARD_LAYOUTS = ["vertical", "horizontal"];
var NAVBAR_RESPONSIVE_MODES = [
	"auto",
	"side",
	"fullscreen"
];
var NAVBAR_SEARCH_MODES = ["filter", "scroll"];
var SELECT_SEARCH_MODES = ["startsWith", "includes"];
var CELLS_IMPORTER_INPUT_TYPES = ["input", "zone"];
oneOf(COLORS);
oneOf(COLORS_BASE);
var isVariant = oneOf(VARIANTS);
oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
oneOf(TARGETS);
oneOf(DATE_MODES);
var isCardLayout = oneOf(CARD_LAYOUTS);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/information/Card.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "cu-card-media"
};
var _hoisted_2 = ["src"];
var _hoisted_3 = { class: "cu-card-body" };
var _hoisted_4 = {
	key: 0,
	class: "cu-card-header"
};
var _hoisted_5 = {
	key: 0,
	class: "cu-card-title"
};
var _hoisted_6 = {
	key: 1,
	class: "cu-card-subtitle"
};
var _hoisted_7 = { class: "cu-card-content" };
var _hoisted_8 = {
	key: 1,
	class: "cu-card-footer"
};
var Card_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Card",
	props: {
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariant
		},
		layout: {
			type: String,
			required: false,
			default: "vertical",
			validator: isCardLayout
		},
		title: {
			type: String,
			required: false
		},
		subtitle: {
			type: String,
			required: false
		},
		image: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const slots = useSlots();
		function slotHasContent(name) {
			const fn = slots[name];
			if (!fn) return false;
			return fn().some((vnode) => {
				if (typeof vnode.type === "symbol") return false;
				if (vnode.type === "comment") return false;
				if (vnode.type === "text" && typeof vnode.children === "string" && !vnode.children.trim()) return false;
				return true;
			});
		}
		const props = __props;
		const colorStyles = computed(() => ({
			"--card-bg": `var(--cu-color-${props.color})`,
			"--card-text": `var(--cu-color-${props.color}-text)`,
			"--card-soft": `var(--cu-color-${props.color}-soft)`,
			"--card-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--card-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		const hasMedia = computed(() => slotHasContent("media"));
		const hasHeader = computed(() => slotHasContent("header"));
		const hasFooter = computed(() => slotHasContent("footer"));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("article", {
				class: normalizeClass([
					"cu-card",
					`cu-card--${props.variant}`,
					`cu-card--${props.layout}`
				]),
				style: normalizeStyle(colorStyles.value)
			}, [props.image || hasMedia.value ? (openBlock(), createElementBlock("div", _hoisted_1, [hasMedia.value ? renderSlot(_ctx.$slots, "media", {}, void 0, true, 0) : props.image ? (openBlock(), createElementBlock("img", {
				key: 1,
				src: props.image,
				alt: "",
				class: "cu-card-image"
			}, null, 8, _hoisted_2)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_3, [
				props.title || props.subtitle || hasHeader.value ? (openBlock(), createElementBlock("header", _hoisted_4, [hasHeader.value ? renderSlot(_ctx.$slots, "header", {}, void 0, true, 0) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [props.title ? (openBlock(), createElementBlock("h3", _hoisted_5, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true), props.subtitle ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(props.subtitle), 1)) : createCommentVNode("v-if", true)], 64))])) : createCommentVNode("v-if", true),
				createElementVNode("div", _hoisted_7, [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				hasFooter.value ? (openBlock(), createElementBlock("footer", _hoisted_8, [renderSlot(_ctx.$slots, "footer", {}, void 0, true)])) : createCommentVNode("v-if", true)
			])], 6);
		};
	}
});
//#endregion
//#region src/components/information/Card.vue?vue&type=style&index=0&inline&scoped=1da5cc99&lang.css
var Card_vue_vue_type_style_index_0_inline_scoped_1da5cc99_lang_default = "\n.cu-card[data-v-1da5cc99] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  border-radius: var(--cu-radius-lg);\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  background-color: var(--cu-color-surface);\n  color: var(--cu-color-neutral);\n  border: var(--cu-border-thin) solid transparent;\n}\n\n/* ghost */\n.cu-card.cu-card--ghost[data-v-1da5cc99] {\n  background-color: var(--cu-color-surface);\n  color: var(--cu-color-neutral);\n  border-color: var(--cu-border-color);\n  box-shadow: var(--cu-shadow-md);\n}\n\n/* solid */\n.cu-card.cu-card--solid[data-v-1da5cc99] {\n  background-color: var(--card-bg);\n  color: var(--cu-color-surface);\n}\n.cu-card.cu-card--solid .cu-card-title[data-v-1da5cc99] {\n  color: var(--cu-color-surface);\n}\n\n/* soft */\n.cu-card.cu-card--soft[data-v-1da5cc99] {\n  background-color: var(--card-soft);\n  color: var(--card-text);\n}\n\n/* subtle */\n.cu-card.cu-card--subtle[data-v-1da5cc99] {\n  background-color: var(--card-subtle);\n  color: var(--card-text);\n  border-color: var(--card-subtle-border);\n}\n\n/* outlined */\n.cu-card.cu-card--outlined[data-v-1da5cc99] {\n  background-color: transparent;\n  color: var(--card-text);\n  border-color: var(--card-bg);\n}\n.cu-card-media[data-v-1da5cc99] {\n  width: 100%;\n  overflow: hidden;\n}\n.cu-card-image[data-v-1da5cc99] {\n  display: block;\n  width: 100%;\n  height: auto;\n  object-fit: cover;\n}\n\n/* horizontal: media al costado, contenido a la derecha */\n.cu-card--horizontal[data-v-1da5cc99] {\n  flex-direction: row;\n}\n.cu-card--horizontal .cu-card-media[data-v-1da5cc99] {\n  flex: 0 0 40%;\n  max-width: 40%;\n}\n.cu-card--horizontal .cu-card-image[data-v-1da5cc99] {\n  height: 100%;\n  min-height: 100%;\n  object-fit: cover;\n}\n.cu-card--horizontal .cu-card-body[data-v-1da5cc99] {\n  flex: 1;\n}\n.cu-card-body[data-v-1da5cc99] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-md);\n  padding: var(--cu-space-lg);\n  box-sizing: border-box;\n}\n.cu-card-header[data-v-1da5cc99] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n}\n.cu-card-title[data-v-1da5cc99] {\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: inherit;\n}\n.cu-card-subtitle[data-v-1da5cc99] {\n  font-size: var(--cu-font-size-sm);\n  opacity: 0.75;\n  margin: 0;\n  color: inherit;\n}\n.cu-card-content[data-v-1da5cc99] {\n  color: inherit;\n  line-height: var(--cu-line-height-relaxed);\n}\n.cu-card-footer[data-v-1da5cc99] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  padding-top: var(--cu-space-md);\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Card.vue
var Card_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Card_vue_vue_type_script_setup_true_lang_default, [["styles", [Card_vue_vue_type_style_index_0_inline_scoped_1da5cc99_lang_default]], ["__scopeId", "data-v-1da5cc99"]]);
//#endregion
//#region src/lib/information/card.ts
var CuCard = defineComegenElement("cu-card", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Card.ce",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** `ghost` (default), `outlined`, `soft`, `subtle`, `solid` */
		variant: {
			type: String,
			default: "ghost"
		},
		/** `vertical` (media arriba) o `horizontal` (media al costado) */
		layout: {
			type: String,
			default: "vertical"
		},
		/** Título del header */
		title: String,
		/** Subtítulo bajo el título */
		subtitle: String,
		/** URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) */
		image: String
	},
	setup(__props) {
		const props = __props;
		const instance = getCurrentInstance();
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const host = el?.getRootNode()?.host || el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Card_default, {
				color: props.color,
				variant: props.variant,
				layout: props.layout,
				title: props.title,
				subtitle: props.subtitle,
				image: props.image,
				onClick: _cache[0] || (_cache[0] = ($event) => ceEmit("click", $event))
			}, {
				media: withCtx(() => [createCommentVNode(" Contenido de la parte superior (si no se usa el prop `image`). Reemplaza la imagen "), renderSlot(_ctx.$slots, "media")]),
				header: withCtx(() => [createCommentVNode(" Reemplaza el título/subtítulo por defecto "), renderSlot(_ctx.$slots, "header")]),
				footer: withCtx(() => [createCommentVNode(" Contenido al pie de la tarjeta (se separa con una línea) "), renderSlot(_ctx.$slots, "footer")]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"color",
				"variant",
				"layout",
				"title",
				"subtitle",
				"image"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.block{display:block;}\n.pie{padding-inline-end:1rem;};\n:host {\n  display: block;\n  width: 100%;\n}\n"]]]));
//#endregion
export { CuCard as default };
