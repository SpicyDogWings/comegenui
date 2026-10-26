/*! comegenui v5.2.1 · CuCalendar (cu-calendar) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, openBlock, ref, renderList, renderSlot, toDisplayString, unref, watch, withCtx, withKeys, withModifiers } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.1",
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
var LABEL_POSITIONS = ["start", "end"];
var TARGETS = [
	"_self",
	"_blank",
	"_parent",
	"_top"
];
var DATE_MODES = ["single", "range"];
var CARD_LAYOUTS = ["vertical", "horizontal"];
var ORIENTATIONS = ["horizontal", "vertical"];
var DIVIDER_VARIANTS = [
	"solid",
	"dashed",
	"dotted"
];
var SKELETON_SHAPES = [
	"rect",
	"circle",
	"text"
];
var SKELETON_ANIMATIONS = [
	"pulse",
	"wave",
	"none"
];
var SKELETON_RADII = [
	"none",
	"sm",
	"md",
	"lg",
	"full"
];
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
var isVariantFull = oneOf(VARIANTS_FULL);
var isVariantNoGhost = oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
oneOf(LABEL_POSITIONS);
var isTarget = oneOf(TARGETS);
var isDateMode = oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
oneOf(ORIENTATIONS);
oneOf(DIVIDER_VARIANTS);
oneOf(SKELETON_SHAPES);
oneOf(SKELETON_ANIMATIONS);
oneOf(SKELETON_RADII);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = ["width", "height"];
//#endregion
//#region src/components/icons/IconBase.vue
var IconBase_default = /* @__PURE__ */ defineComponent({
	__name: "IconBase",
	props: {
		width: {
			default: "1em",
			type: [Number, String]
		},
		height: {
			default: "1em",
			type: [Number, String]
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: __props.width,
				height: __props.height,
				viewBox: "0 0 24 24"
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$4);
		};
	}
});
//#endregion
//#region src/components/icons/LucideLoader.vue
var LucideLoader_default = /* @__PURE__ */ defineComponent({
	__name: "LucideLoader",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("g", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2"
				}, [
					createElementVNode("path", { d: "M12 2v4" }),
					createElementVNode("path", { d: "m16.2 7.8 2.9-2.9" }),
					createElementVNode("path", { d: "M18 12h4" }),
					createElementVNode("path", { d: "m16.2 16.2 2.9 2.9" }),
					createElementVNode("path", { d: "M12 18v4" }),
					createElementVNode("path", { d: "m4.9 19.1 2.9-2.9" }),
					createElementVNode("path", { d: "M2 12h4" }),
					createElementVNode("path", { d: "m4.9 4.9 2.9 2.9" })
				], -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/buttons/Button.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = ["href", "target"];
var _hoisted_2$1 = ["type", "disabled"];
var _hoisted_3$1 = ["type", "disabled"];
var Button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Button",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariantFull
		},
		/** Tamaño: `sm`, `md`, `lg` */
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		},
		/** Si se especifica, el botón se renderiza como `<a>` */
		to: {
			type: String,
			required: false
		},
		/** Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` */
		target: {
			type: String,
			required: false,
			default: "_self",
			validator: isTarget
		},
		/** Tipo del `<button>`: `button`, `submit`, `reset` */
		type: {
			type: String,
			required: false,
			default: "button"
		},
		/** Estado deshabilitado */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Antepone un spinner al contenido. Deshabilita el botón mientras está activo */
		loading: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["loading-change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const isDisabled = computed(() => props.disabled || props.loading);
		const emit = __emit;
		watch(() => props.loading, (value) => emit("loading-change", value));
		const colorStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-hover)`,
			"--btn-bg-active": `var(--cu-color-${props.color}-active)`,
			"--btn-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-ghost-active": `var(--cu-color-${props.color}-ghost-active)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-soft-active": `var(--cu-color-${props.color}-soft-active)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-active": `var(--cu-color-${props.color}-subtle-active)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		return (_ctx, _cache) => {
			return props.to ? (openBlock(), createElementBlock("a", {
				key: 0,
				href: props.to,
				target: props.target,
				class: normalizeClass([{ "cu-button--disabled": isDisabled.value }, "cu-button-link"])
			}, [createElementVNode("button", {
				type: props.type,
				class: normalizeClass([
					"cu-button",
					`cu-button--${props.variant}`,
					`cu-button--${props.size}`,
					{ "cu-button--disabled": isDisabled.value }
				]),
				style: normalizeStyle(colorStyles.value),
				disabled: isDisabled.value
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_2$1)], 10, _hoisted_1$3)) : (openBlock(), createElementBlock("button", {
				key: 1,
				type: props.type,
				class: normalizeClass([
					"cu-button",
					`cu-button--${props.variant}`,
					`cu-button--${props.size}`,
					{ "cu-button--disabled": isDisabled.value }
				]),
				style: normalizeStyle(colorStyles.value),
				disabled: isDisabled.value
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_3$1));
		};
	}
});
//#endregion
//#region src/components/buttons/Button.vue?vue&type=style&index=0&inline&scoped=50087dcd&lang.css
var Button_vue_vue_type_style_index_0_inline_scoped_50087dcd_lang_default = "\n.cu-button[data-v-50087dcd] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  box-sizing: border-box;\n  transition: all 150ms ease;\n}\n.cu-button[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  transform: scale(0.97);\n}\n.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* sizes (md = base; link mantiene su padding 0) */\n.cu-button--sm[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-xs);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-button--lg[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-lg);\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n}\n\n/* solid */\n.cu-button.cu-button--solid[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* ghost */\n.cu-button.cu-button--ghost[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* soft */\n.cu-button.cu-button--soft[data-v-50087dcd] {\n  background-color: var(--btn-soft);\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-active);\n}\n\n/* subtle */\n.cu-button.cu-button--subtle[data-v-50087dcd] {\n  background-color: var(--btn-subtle);\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-active);\n}\n\n/* outlined */\n.cu-button.cu-button--outlined[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-bg);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* link */\n.cu-button.cu-button--link[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  padding: 0;\n  box-shadow: none;\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button.cu-button--link[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  text-decoration-thickness: 2px;\n}\n\n/* none */\n.cu-button.cu-button--none[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* link wrapper */\n.cu-button-link[data-v-50087dcd] {\n  text-decoration: none;\n}\n.cu-button-link[data-v-50087dcd]:hover {\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button-link.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n\n/* icon-only */\n.cu-button--icon-only[data-v-50087dcd] {\n  padding: var(--cu-space-sm);\n}\n\n/* loading spinner */\n.cu-button-spinner[data-v-50087dcd] {\n  animation: cu-spin-50087dcd 0.8s linear infinite;\n}\n@keyframes cu-spin-50087dcd {\nfrom { transform: rotate(0deg);\n}\nto { transform: rotate(360deg);\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/buttons/Button.vue
var Button_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Button_vue_vue_type_script_setup_true_lang_default, [["styles", [Button_vue_vue_type_style_index_0_inline_scoped_50087dcd_lang_default]], ["__scopeId", "data-v-50087dcd"]]);
//#endregion
//#region src/components/icons/LucideChevronLeft.vue
var LucideChevronLeft_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronLeft",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m15 18l-6-6l6-6"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronRight.vue
var LucideChevronRight_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronRight",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m9 18l6-6l-6-6"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronsLeft.vue
var LucideChevronsLeft_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronsLeft",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m11 17l-5-5l5-5"
				}, null, -1), createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m18 17l-5-5l5-5"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronsRight.vue
var LucideChevronsRight_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronsRight",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m6 17l5-5l-5-5"
				}, null, -1), createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m13 17l5-5l-5-5"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/information/Badge.vue
var Badge_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Badge",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isVariant
		}
	},
	setup(__props) {
		const props = __props;
		const badgeStyles = computed(() => ({
			"--badge-bg": `var(--cu-color-${props.color})`,
			"--badge-text": `var(--cu-color-${props.color}-text)`,
			"--badge-soft": `var(--cu-color-${props.color}-soft)`,
			"--badge-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--badge-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--badge-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--badge-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: normalizeClass(["cu-badge", `cu-badge--${props.variant}`]),
				style: normalizeStyle(badgeStyles.value)
			}, [createCommentVNode(" Contenido textual o ícono del badge "), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 6);
		};
	}
}), [["styles", ["\n.cu-badge[data-v-1bc2eb6a] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-xs);\n  padding: var(--cu-space-2xs) var(--cu-space-sm);\n  border-radius: var(--cu-radius);\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  line-height: var(--cu-line-height-tight);\n  white-space: nowrap;\n  box-sizing: border-box;\n  border: var(--cu-border-thin) solid transparent;\n}\n\n/* solid */\n.cu-badge.cu-badge--solid[data-v-1bc2eb6a] {\n  background-color: var(--badge-bg);\n  color: var(--cu-color-surface);\n}\n\n/* soft */\n.cu-badge.cu-badge--soft[data-v-1bc2eb6a] {\n  background-color: var(--badge-soft);\n  color: var(--badge-text);\n}\n\n/* ghost */\n.cu-badge.cu-badge--ghost[data-v-1bc2eb6a] {\n  background-color: transparent;\n  color: var(--badge-text);\n}\n\n/* subtle */\n.cu-badge.cu-badge--subtle[data-v-1bc2eb6a] {\n  background-color: var(--badge-subtle);\n  color: var(--badge-text);\n  border-color: var(--badge-subtle-border);\n}\n\n/* outlined */\n.cu-badge.cu-badge--outlined[data-v-1bc2eb6a] {\n  background-color: transparent;\n  color: var(--badge-text);\n  border-color: var(--badge-bg);\n}\n"]], ["__scopeId", "data-v-1bc2eb6a"]]);
//#endregion
//#region src/components/controls/month-slider/MonthSliderLabel.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = [
	"role",
	"tabindex",
	"aria-label"
];
//#endregion
//#region src/components/controls/month-slider/MonthSliderLabel.vue
var MonthSliderLabel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MonthSliderLabel",
	props: {
		/** Texto principal del label (mes o año). */
		label: {
			type: String,
			required: true
		},
		/** Texto del año mostrado como badge al lado del label. */
		year: {
			type: String,
			default: ""
		},
		/** Deshabilita la interacción del label. */
		disabled: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: Boolean,
			default: true
		},
		/** Color semántico del label. */
		color: {
			type: String,
			default: "primary"
		},
		/** Variante visual del label. */
		variant: {
			type: String,
			default: "soft"
		},
		threshold: {
			type: Number,
			default: 96
		},
		steps: {
			type: Number,
			default: 1
		},
		canNavigatePrev: {
			type: Boolean,
			default: true
		},
		/** Indica si se puede navegar al paso siguiente. */
		canNavigateNext: {
			type: Boolean,
			default: true
		}
	},
	emits: ["navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const yearBadgeVariant = computed(() => props.variant === "solid" ? "subtle" : "solid");
		const root = ref(null);
		const dragging = ref(false);
		const offsetX = ref(0);
		const fired = ref(false);
		let pointerId = 0;
		let lastX = 0;
		let accX = 0;
		function onPointerDown(event) {
			if (props.disabled || !props.draggable) return;
			dragging.value = true;
			pointerId = event.pointerId;
			lastX = event.clientX;
			accX = 0;
			fired.value = false;
			root.value?.setPointerCapture(pointerId);
		}
		function onPointerMove(event) {
			if (!dragging.value || event.pointerId !== pointerId || fired.value) return;
			const dx = event.clientX - lastX;
			lastX = event.clientX;
			accX += dx;
			const dir = accX < 0 ? 1 : -1;
			if (dir === 1 ? !props.canNavigateNext : !props.canNavigatePrev) {
				accX = dir === 1 ? -props.threshold : props.threshold;
				offsetX.value = accX;
				return;
			}
			offsetX.value = Math.max(-props.threshold, Math.min(props.threshold, accX));
			if (Math.abs(accX) >= props.threshold) {
				emit("navigate", dir * props.steps);
				fired.value = true;
				offsetX.value = 0;
			}
		}
		function endDrag() {
			if (!dragging.value) return;
			dragging.value = false;
			fired.value = false;
			accX = 0;
			offsetX.value = 0;
			try {
				root.value?.releasePointerCapture(pointerId);
			} catch {}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "root",
				ref: root,
				class: normalizeClass(["cu-month-slider-label", [`cu-month-slider-label--${props.variant}`, {
					"is-draggable": props.draggable,
					"is-dragging": dragging.value,
					"is-fired": fired.value,
					"is-disabled": props.disabled
				}]]),
				style: normalizeStyle({ "--drag-offset": `${offsetX.value}px` }),
				role: props.draggable ? "button" : "group",
				tabindex: props.draggable ? 0 : -1,
				"aria-label": props.year ? `${props.label} ${props.year}` : props.label,
				onPointerdown: onPointerDown,
				onPointermove: onPointerMove,
				onPointerup: endDrag,
				onPointercancel: endDrag,
				onKeydown: [_cache[0] || (_cache[0] = withKeys(withModifiers(($event) => props.draggable && props.canNavigatePrev && emit("navigate", -1 * props.steps), ["prevent"]), ["left"])), _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => props.draggable && props.canNavigateNext && emit("navigate", props.steps), ["prevent"]), ["right"]))]
			}, [(openBlock(), createElementBlock("span", {
				key: props.label,
				class: "cu-month-slider-label-month"
			}, toDisplayString(props.label), 1)), props.year ? (openBlock(), createBlock(Badge_default, {
				key: props.year,
				class: "cu-month-slider-label-year",
				color: props.color,
				variant: yearBadgeVariant.value
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(props.year), 1)]),
				_: 1
			}, 8, ["color", "variant"])) : createCommentVNode("v-if", true)], 46, _hoisted_1$2);
		};
	}
}), [["styles", ["\n.cu-month-slider-label[data-v-8e08944d] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  min-width: 150px;\n  justify-content: center;\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: var(--cu-border-none) solid transparent;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-md);\n  font-weight: var(--cu-font-weight-semibold);\n  cursor: default;\n  user-select: none;\n  touch-action: pan-y;\n  transform: translateX(var(--drag-offset, 0px));\n  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease, color 0.25s ease;\n  will-change: transform;\n}\n\n/* solid: doble clase para ganarle a reglas globales del consumidor (convención del repo) */\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-8e08944d] {\n  background-color: var(--ms-accent);\n  color: var(--ms-surface);\n}\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-8e08944d]:hover {\n  background-color: var(--ms-accent-hover);\n}\n\n/* outlined */\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-8e08944d] {\n  background-color: transparent;\n  color: var(--ms-accent);\n  border: var(--cu-border-thin) solid var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-8e08944d]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* soft (default) */\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-8e08944d] {\n  background-color: var(--ms-soft);\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-8e08944d]:hover {\n  background-color: var(--ms-soft-hover);\n}\n\n/* ghost */\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-8e08944d] {\n  background-color: transparent;\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-8e08944d]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* subtle */\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-8e08944d] {\n  background-color: var(--ms-subtle);\n  color: var(--ms-accent);\n  border: var(--cu-border-thin) solid var(--ms-subtle-border);\n}\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-8e08944d]:hover {\n  background-color: var(--ms-subtle-hover);\n}\n\n/* El texto del mes lleva color explícito (inherit del root) con especificidad\n   suficiente para ganarle a reglas globales del consumidor tipo\n   `.playground :is(h1, ..., span, ...) { color: ... }` que pegan en spans internos.\n   La clase scoped [data-v] sube la regla a (0,3,0). */\n.cu-month-slider-label .cu-month-slider-label-month[data-v-8e08944d] {\n  color: inherit;\n}\n\n/* Sobre label solid, el badge del año (variante subtle) se pierde: el tinte\n   translúcido sobre el fondo solid oscuro no aporta contraste y el texto\n   (`--cu-color-{name}-text` = color oscurecido) queda casi negro e imperceptible.\n   Se invierte el badge: fondo = surface (color del texto del label) + texto = accent\n   (color del solid). Specificity (0,4,0) > `.cu-badge.cu-badge--subtle` (0,3,0). */\n.cu-month-slider-label.cu-month-slider-label--solid .cu-month-slider-label-year[data-v-8e08944d] {\n  background-color: var(--ms-surface);\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.is-draggable[data-v-8e08944d] {\n  cursor: grab;\n}\n.cu-month-slider-label.is-dragging[data-v-8e08944d] {\n  cursor: grabbing;\n  transition: none;\n}\n\n/* Al consumir la deslizada, el label vuelve con un rebote suave */\n.cu-month-slider-label.is-fired[data-v-8e08944d] {\n  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.cu-month-slider-label.is-disabled[data-v-8e08944d] {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.cu-month-slider-label[data-v-8e08944d]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--ms-accent);\n  outline-offset: var(--cu-space-2xs);\n}\n\n/* Entrada suave del texto al cambiar el mes (key en el span lo re-monta) */\n.cu-month-slider-label-month[data-v-8e08944d],\n.cu-month-slider-label-year[data-v-8e08944d] {\n  animation: cu-month-slide-in-8e08944d 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@keyframes cu-month-slide-in-8e08944d {\nfrom {\n    opacity: 0;\n    transform: translateY(5px);\n}\nto {\n    opacity: 1;\n    transform: translateY(0);\n}\n}\n"]], ["__scopeId", "data-v-8e08944d"]]);
//#endregion
//#region src/utils/date.ts
var DATE_RE = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
/** Normaliza cualquier `Date` a medianoche local. */
function normalizeDate(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
/** Primer día del mes local de una fecha. */
function normalizeMonth(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}
/** Primer día del mes actual. */
function startOfCurrentMonth(now = /* @__PURE__ */ new Date()) {
	return new Date(now.getFullYear(), now.getMonth(), 1);
}
/**
* Convierte `Date`, timestamp o `"YYYY-MM-DD"` a medianoche local.
* `''`, `null`, `undefined` y valores inválidos devuelven `null`.
*/
function parseDate(value) {
	if (value === null || value === void 0 || value === "") return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : normalizeDate(value);
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return null;
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : normalizeDate(d);
	}
	const m = value.trim().match(DATE_RE);
	const parsed = m ? new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, m[3] ? Number(m[3]) : 1) : new Date(value);
	if (Number.isNaN(parsed.getTime())) return null;
	return normalizeDate(parsed);
}
/** Igual que `parseDate` pero normalizado al primer día del mes. */
function parseMonth(value) {
	const d = parseDate(value);
	return d === null ? null : normalizeMonth(d);
}
/** Mismo día (año/mes/día) en hora local. */
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
/** Mismo mes (año/mes) en hora local. */
function sameMonth(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
/** Suma (o resta) meses, fijando el día al 1 para evitar overflow. */
function addMonths(date, delta) {
	return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
/** Tokens de mes soportados por el header del calendario/slider. */
var MONTH_FORMATS = [
	"MMMM",
	"MMM",
	"MM",
	"M"
];
/** Tokens de año soportados por el badge del slider. */
var YEAR_FORMATS = ["yyyy", "yy"];
var DEFAULT_MONTH_FORMAT = "MMMM";
var DEFAULT_YEAR_FORMAT = "yyyy";
/** ¿`value` es un formato de mes soportado? */
function isMonthFormat(value) {
	return typeof value === "string" && MONTH_FORMATS.includes(value);
}
/** ¿`value` es un formato de año soportado? */
function isYearFormat(value) {
	return typeof value === "string" && YEAR_FORMATS.includes(value);
}
/** Formato de mes válido o el default si no se soporta (enforcement runtime). */
function sanitizeMonthFormat(value) {
	return isMonthFormat(value) ? value : DEFAULT_MONTH_FORMAT;
}
/** Formato de año válido o el default si no se soporta (enforcement runtime). */
function sanitizeYearFormat(value) {
	return isYearFormat(value) ? value : DEFAULT_YEAR_FORMAT;
}
var FORMAT_TOKENS = [
	"yyyy",
	"MMMM",
	"MMM",
	"MM",
	"yy",
	"dd",
	"M"
];
/**
* Formatea una fecha con tokens `yyyy yy MMMM MMM MM M dd`.
* `capitalizeMonths: false` deja el mes tal cual lo da `Intl` (para MonthSlider).
*/
function formatDate(date, format, locale = "es", options = {}) {
	const { capitalizeMonths = true } = options;
	const pad = (n) => String(n).padStart(2, "0");
	const monthName = (long) => {
		const label = new Intl.DateTimeFormat(locale, { month: long ? "long" : "short" }).format(date);
		return capitalizeMonths ? label.charAt(0).toUpperCase() + label.slice(1) : label;
	};
	const values = {
		yyyy: () => String(date.getFullYear()),
		yy: () => String(date.getFullYear()).slice(-2),
		MMMM: () => monthName(true),
		MMM: () => monthName(false),
		MM: () => pad(date.getMonth() + 1),
		M: () => String(date.getMonth() + 1),
		dd: () => pad(date.getDate())
	};
	let out = "";
	let i = 0;
	while (i < format.length) {
		let matched = false;
		for (const token of FORMAT_TOKENS) if (format.startsWith(token, i)) {
			out += values[token]?.() ?? token;
			i += token.length;
			matched = true;
			break;
		}
		if (!matched) {
			out += format[i];
			i += 1;
		}
	}
	return out;
}
//#endregion
//#region src/components/controls/MonthSlider.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["aria-label"];
var ariaYearPrev = "Ir al año anterior";
var ariaMonthPrev = "Ir al mes anterior";
var ariaMonthNext = "Ir al mes siguiente";
var ariaYearNext = "Ir al año siguiente";
//#endregion
//#region src/components/controls/MonthSlider.vue
var MonthSlider_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MonthSlider",
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Formato del mes: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		locale: {
			type: String,
			default: "es"
		},
		yearNavigation: {
			type: [Boolean, String],
			default: true
		},
		variant: {
			type: String,
			default: "soft",
			validator: isVariant
		},
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		color: {
			type: String,
			default: "primary"
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update:modelValue", "change"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const minDate = computed(() => parseMonth(props.min));
		const maxDate = computed(() => parseMonth(props.max));
		function clampDate(date) {
			if (minDate.value && date < minDate.value) return minDate.value;
			if (maxDate.value && date > maxDate.value) return maxDate.value;
			return date;
		}
		const month = ref(clampDate(parseMonth(props.modelValue) ?? startOfCurrentMonth()));
		watch(() => props.modelValue, (value) => {
			if (value === null || value === void 0 || value === "") return;
			const parsed = clampDate(parseMonth(value) ?? startOfCurrentMonth());
			if (!sameMonth(parsed, month.value)) month.value = parsed;
		});
		watch([minDate, maxDate], () => {
			const next = clampDate(month.value);
			if (!sameMonth(next, month.value)) month.value = next;
		});
		const monthFormatValue = computed(() => sanitizeMonthFormat(props.monthFormat));
		const yearFormatValue = computed(() => sanitizeYearFormat(props.yearFormat));
		const formatMonth = (date, format) => formatDate(date, format, props.locale, { capitalizeMonths: false });
		const showYearNavigation = computed(() => props.yearNavigation !== false && props.yearNavigation !== "false" && props.yearNavigation !== "0");
		const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
		const showAutoYear = computed(() => month.value.getFullYear() !== currentYear.value);
		const monthLabel = computed(() => formatMonth(month.value, monthFormatValue.value));
		const yearLabel = computed(() => formatMonth(month.value, yearFormatValue.value));
		function setMonth(next) {
			if (props.disabled) return;
			const clamped = clampDate(next);
			if (sameMonth(clamped, month.value)) return;
			month.value = clamped;
			emit("update:modelValue", clamped);
			emit("change", clamped);
		}
		/** Avanza un mes (respetando max). */
		function nextMonth() {
			setMonth(addMonths(month.value, 1));
		}
		/** Retrocede un mes (respetando min). */
		function prevMonth() {
			setMonth(addMonths(month.value, -1));
		}
		/** Avanza un año manteniendo el mes. */
		function nextYear() {
			setMonth(new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1));
		}
		/** Retrocede un año manteniendo el mes. */
		function prevYear() {
			setMonth(new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1));
		}
		/** Navega al mes de la fecha indicada. */
		function goToMonth(value) {
			setMonth(parseMonth(value) ?? startOfCurrentMonth());
		}
		/** Devuelve el mes visible. */
		function getValue() {
			return new Date(month.value);
		}
		/** Establece el mes desde una fecha, timestamp o string. */
		function setValue(value) {
			if (value === null || value === void 0 || value === "") return;
			setMonth(parseMonth(value) ?? startOfCurrentMonth());
		}
		__expose({
			nextMonth,
			prevMonth,
			nextYear,
			prevYear,
			goToMonth,
			getValue,
			setValue
		});
		const canPrevMonth = computed(() => !minDate.value || month.value > minDate.value);
		const canNextMonth = computed(() => !maxDate.value || month.value < maxDate.value);
		const canPrevYear = computed(() => !minDate.value || new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1) >= minDate.value);
		const canNextYear = computed(() => !maxDate.value || new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1) <= maxDate.value);
		const colorStyles = computed(() => ({
			"--ms-accent": `var(--cu-color-${props.color})`,
			"--ms-accent-hover": `var(--cu-color-${props.color}-hover)`,
			"--ms-accent-text": `var(--cu-color-${props.color}-text)`,
			"--ms-soft": `var(--cu-color-${props.color}-soft)`,
			"--ms-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--ms-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--ms-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--ms-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
			"--ms-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--ms-surface": `var(--cu-color-surface)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-month-slider", { "is-disabled": props.disabled }]),
				style: normalizeStyle(colorStyles.value),
				role: "group",
				"aria-label": `Selector de mes: ${showAutoYear.value ? monthLabel.value + " " + yearLabel.value : monthLabel.value}`
			}, [
				showYearNavigation.value ? (openBlock(), createBlock(Button_default, {
					key: 0,
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canPrevYear.value,
					"aria-label": ariaYearPrev,
					onClick: _cache[0] || (_cache[0] = ($event) => prevYear())
				}, {
					default: withCtx(() => [createVNode(LucideChevronsLeft_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"])) : createCommentVNode("v-if", true),
				createVNode(Button_default, {
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canPrevMonth.value,
					"aria-label": ariaMonthPrev,
					onClick: _cache[1] || (_cache[1] = ($event) => prevMonth())
				}, {
					default: withCtx(() => [createVNode(LucideChevronLeft_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"]),
				createVNode(MonthSliderLabel_default, {
					label: monthLabel.value,
					year: showAutoYear.value ? yearLabel.value : "",
					disabled: props.disabled,
					color: props.color,
					variant: props.variant,
					"can-navigate-prev": canPrevMonth.value,
					"can-navigate-next": canNextMonth.value,
					onNavigate: _cache[2] || (_cache[2] = (dir) => setMonth(unref(addMonths)(month.value, dir)))
				}, null, 8, [
					"label",
					"year",
					"disabled",
					"color",
					"variant",
					"can-navigate-prev",
					"can-navigate-next"
				]),
				createVNode(Button_default, {
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canNextMonth.value,
					"aria-label": ariaMonthNext,
					onClick: _cache[3] || (_cache[3] = ($event) => nextMonth())
				}, {
					default: withCtx(() => [createVNode(LucideChevronRight_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"]),
				showYearNavigation.value ? (openBlock(), createBlock(Button_default, {
					key: 1,
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canNextYear.value,
					"aria-label": ariaYearNext,
					onClick: _cache[4] || (_cache[4] = ($event) => nextYear())
				}, {
					default: withCtx(() => [createVNode(LucideChevronsRight_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"])) : createCommentVNode("v-if", true)
			], 14, _hoisted_1$1);
		};
	}
}), [["styles", ["\n.cu-month-slider[data-v-ed7dba25] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-2xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-month-slider.is-disabled[data-v-ed7dba25] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-ed7dba25"]]);
//#endregion
//#region src/composables/useDateRange.ts
function useDateRange(options = {}) {
	const startValue = ref(parseDate(options.start?.() ?? null));
	const endValue = ref(parseDate(options.end?.() ?? null));
	const pickingEnd = computed(() => startValue.value !== null && endValue.value === null);
	watch(() => options.start?.(), (value) => {
		startValue.value = parseDate(value);
	});
	watch(() => options.end?.(), (value) => {
		endValue.value = parseDate(value);
	});
	function select(day) {
		if (!pickingEnd.value) {
			const hadEnd = endValue.value !== null;
			startValue.value = day;
			endValue.value = null;
			options.onStartChange?.(day);
			if (hadEnd) options.onEndChange?.(null);
			return;
		}
		if (day.getTime() < startValue.value.getTime()) {
			endValue.value = startValue.value;
			startValue.value = day;
			options.onStartChange?.(day);
			options.onEndChange?.(endValue.value);
		} else {
			endValue.value = day;
			options.onEndChange?.(day);
		}
		const range = {
			start: startValue.value,
			end: endValue.value
		};
		options.onSelect?.(range);
		options.onChange?.(range);
	}
	function clear() {
		startValue.value = null;
		endValue.value = null;
		options.onStartChange?.(null);
		options.onEndChange?.(null);
		options.onChange?.({
			start: null,
			end: null
		});
	}
	function setRange(start, end) {
		startValue.value = parseDate(start);
		endValue.value = parseDate(end);
		options.onStartChange?.(startValue.value);
		options.onEndChange?.(endValue.value);
		options.onChange?.({
			start: startValue.value,
			end: endValue.value
		});
	}
	return {
		startValue,
		endValue,
		pickingEnd,
		select,
		clear,
		setRange
	};
}
//#endregion
//#region src/components/controls/Calendar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-label"];
var _hoisted_2 = { class: "cu-calendar-header" };
var _hoisted_3 = {
	class: "cu-calendar-weekdays",
	role: "row"
};
var _hoisted_4 = { class: "cu-calendar-grid" };
var _hoisted_5 = ["disabled", "onClick"];
var _hoisted_6 = {
	key: 0,
	class: "cu-calendar-dots"
};
var _hoisted_7 = {
	key: 1,
	class: "cu-calendar-day--empty"
};
var WEEK_LENGTH = 7;
//#endregion
//#region src/components/controls/Calendar.vue
var Calendar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Calendar",
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		color: {
			type: String,
			default: "primary"
		},
		variant: {
			type: String,
			default: "soft",
			validator: isVariantNoGhost
		},
		disabled: {
			type: Boolean,
			default: false
		},
		disabledWeekdays: {
			type: [Array, String],
			default: () => []
		},
		disabledDates: {
			type: [Array, String],
			default: () => []
		},
		locale: {
			type: String,
			default: "es"
		},
		weekStart: {
			type: Number,
			default: 1,
			validator: (value) => value >= 0 && value <= 6
		},
		yearNavigation: {
			type: [Boolean, String],
			default: false
		},
		/** Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		events: {
			type: Array,
			default: () => []
		},
		rangeStart: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		rangeEnd: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		grid: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		},
		viewMonth: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Modo de selección: `single` (una fecha) o `range` (inicio + fin). */
		mode: {
			type: String,
			default: "single",
			validator: isDateMode
		}
	},
	emits: [
		"update:modelValue",
		"update:viewMonth",
		"update:rangeStart",
		"update:rangeEnd",
		"change",
		"select"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const minDate = computed(() => parseDate(props.min));
		const maxDate = computed(() => parseDate(props.max));
		const disabledWeekdayList = computed(() => {
			if (Array.isArray(props.disabledWeekdays)) return props.disabledWeekdays;
			if (typeof props.disabledWeekdays === "string" && props.disabledWeekdays.trim()) return props.disabledWeekdays.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
			return [];
		});
		const disabledDateList = computed(() => {
			return (Array.isArray(props.disabledDates) ? props.disabledDates : typeof props.disabledDates === "string" && props.disabledDates.trim() ? props.disabledDates.split(",") : []).map((d) => parseDate(String(d).trim())).filter((d) => d !== null);
		});
		function clampMonth(date) {
			if (minDate.value) {
				const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1);
				if (date < limit) return limit;
			}
			if (maxDate.value) {
				const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1);
				if (date > limit) return limit;
			}
			return date;
		}
		const today = /* @__PURE__ */ new Date();
		const internalViewMonth = ref(clampMonth(parseDate(props.modelValue) ?? startOfCurrentMonth()));
		const viewMonthProp = computed(() => parseDate(props.viewMonth));
		const viewMonth = computed(() => viewMonthProp.value ?? internalViewMonth.value);
		const isViewMonthControlled = computed(() => viewMonthProp.value !== null);
		/** Cambia el mes visible (respeta el consumidor si `viewMonth` está controlado). */
		function setViewMonth(next) {
			const target = clampMonth(new Date(next.getFullYear(), next.getMonth(), 1));
			if (isViewMonthControlled.value) emit("update:viewMonth", target);
			else internalViewMonth.value = target;
		}
		const selectedValue = ref(parseDate(props.modelValue));
		watch(() => props.modelValue, (value) => {
			const parsed = parseDate(value);
			selectedValue.value = parsed;
			if (parsed === null || isViewMonthControlled.value) return;
			internalViewMonth.value = clampMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
		});
		watch([minDate, maxDate], () => {
			if (isViewMonthControlled.value) return;
			internalViewMonth.value = clampMonth(internalViewMonth.value);
		});
		const isRange = computed(() => props.mode === "range");
		const { startValue: rangeValueStart, endValue: rangeValueEnd, select: selectRange, clear: clearRange, setRange: setRangeValue } = useDateRange({
			start: () => props.rangeStart,
			end: () => props.rangeEnd,
			onStartChange: (value) => emit("update:rangeStart", value),
			onEndChange: (value) => emit("update:rangeEnd", value),
			onChange: (value) => emit("change", value),
			onSelect: (value) => emit("select", value)
		});
		const canPrevMonth = computed(() => {
			if (!minDate.value) return true;
			const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1);
			return viewMonth.value > limit;
		});
		const canNextMonth = computed(() => {
			if (!maxDate.value) return true;
			const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1);
			return viewMonth.value < limit;
		});
		/** Avanza al mes siguiente (respetando max). */
		function nextMonth() {
			if (props.disabled || !canNextMonth.value) return;
			setViewMonth(addMonths(viewMonth.value, 1));
		}
		/** Retrocede al mes anterior (respetando min). */
		function prevMonth() {
			if (props.disabled || !canPrevMonth.value) return;
			setViewMonth(addMonths(viewMonth.value, -1));
		}
		/** Navega al mes de la fecha indicada. */
		function goToMonth(value) {
			const parsed = parseDate(value);
			if (parsed === null) return;
			setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
		}
		function onMonthChange(date) {
			setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
		}
		const dayLabels = computed(() => {
			const base = new Date(2026, 7, 2);
			const labels = [];
			for (let i = 0; i < WEEK_LENGTH; i++) {
				const label = new Intl.DateTimeFormat(props.locale, { weekday: "short" }).format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
				labels.push(label.charAt(0).toUpperCase() + label.slice(1));
			}
			return [...labels.slice(props.weekStart), ...labels.slice(0, props.weekStart)];
		});
		const weeks = computed(() => {
			const year = viewMonth.value.getFullYear();
			const month = viewMonth.value.getMonth();
			const offset = (new Date(year, month, 1).getDay() - props.weekStart + WEEK_LENGTH) % WEEK_LENGTH;
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const cells = [];
			for (let i = 0; i < offset; i++) cells.push({ date: null });
			for (let day = 1; day <= daysInMonth; day++) cells.push({ date: new Date(year, month, day) });
			const rows = [];
			for (let i = 0; i < cells.length; i += WEEK_LENGTH) rows.push(cells.slice(i, i + WEEK_LENGTH));
			return rows;
		});
		const monthLabel = computed(() => {
			const label = new Intl.DateTimeFormat(props.locale, {
				month: "long",
				year: "numeric"
			}).format(viewMonth.value);
			return label.charAt(0).toUpperCase() + label.slice(1);
		});
		function getEventsForDay(day) {
			return props.events.filter((ev) => sameDay(parseDate(ev.date), day));
		}
		function isDisabledDay(day) {
			if (props.disabled) return true;
			if (minDate.value && day < minDate.value) return true;
			if (maxDate.value && day > maxDate.value) return true;
			if (disabledWeekdayList.value.includes(day.getDay())) return true;
			if (disabledDateList.value.some((d) => sameDay(day, d))) return true;
			return false;
		}
		function selectDay(day) {
			if (isDisabledDay(day)) return;
			if (isRange.value) {
				selectRange(day);
				return;
			}
			selectedValue.value = day;
			emit("update:modelValue", day);
			emit("change", day);
			emit("select", day);
		}
		function dayClasses(day) {
			const selected = !isRange.value && selectedValue.value !== null && sameDay(day, selectedValue.value);
			const inRange = isInRange(day);
			return {
				"cu-calendar-day--selected": selected,
				"cu-calendar-day--today": sameDay(day, today) && !selected,
				"cu-calendar-day--range": inRange,
				"cu-calendar-day--range-start": rangeStartVal.value !== null && sameDay(day, rangeStartVal.value),
				"cu-calendar-day--range-end": rangeEndVal.value !== null && sameDay(day, rangeEndVal.value),
				[`cu-calendar-day--${props.variant}`]: selected
			};
		}
		const rangeStartVal = computed(() => isRange.value ? rangeValueStart.value : null);
		const rangeEndVal = computed(() => isRange.value ? rangeValueEnd.value : null);
		function isInRange(day) {
			if (!isRange.value) return false;
			const start = rangeStartVal.value;
			const end = rangeEndVal.value;
			if (!start || !end) return false;
			const s = start.getTime();
			const e = end.getTime();
			const d = day.getTime();
			return d >= Math.min(s, e) && d <= Math.max(s, e);
		}
		/** Devuelve la fecha seleccionada (modo `single`). */
		function getValue() {
			return selectedValue.value;
		}
		/** Establece la fecha seleccionada y emite los eventos de cambio (modo `single`). */
		function setValue(value) {
			const parsed = parseDate(value);
			if (parsed === null) return;
			selectedValue.value = parsed;
			setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
			emit("update:modelValue", parsed);
			emit("change", parsed);
		}
		/** Devuelve el rango seleccionado (modo `range`). */
		function getRange() {
			return {
				start: rangeValueStart.value,
				end: rangeValueEnd.value
			};
		}
		/** Setea el rango y emite los eventos de cambio (modo `range`). */
		function setRange(start, end) {
			setRangeValue(start, end);
		}
		/** Limpia el rango seleccionado (modo `range`). */
		function clear() {
			clearRange();
		}
		__expose({
			nextMonth,
			prevMonth,
			goToMonth,
			getValue,
			setValue,
			getRange,
			setRange,
			clear
		});
		const colorStyles = computed(() => ({
			"--cal-accent": `var(--cu-color-${props.color})`,
			"--cal-accent-hover": `var(--cu-color-${props.color}-hover)`,
			"--cal-soft": `var(--cu-color-${props.color}-soft)`,
			"--cal-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--cal-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--cal-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--cal-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
			"--cal-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-calendar", {
					"is-disabled": props.disabled,
					"cu-calendar--year-nav": __props.yearNavigation,
					"cu-calendar--grid": props.grid,
					"cu-calendar--border": props.border
				}]),
				style: normalizeStyle(colorStyles.value),
				role: "grid",
				"aria-label": monthLabel.value
			}, [
				createCommentVNode(" Header: MonthSlider del repo (chevrons + label con drag + navegación de año) "),
				createElementVNode("div", _hoisted_2, [createVNode(MonthSlider_default, {
					"model-value": viewMonth.value,
					min: __props.min,
					max: __props.max,
					color: __props.color,
					variant: __props.variant,
					locale: __props.locale,
					"year-navigation": __props.yearNavigation,
					"month-format": __props.monthFormat,
					"year-format": __props.yearFormat,
					disabled: __props.disabled,
					onChange: onMonthChange
				}, null, 8, [
					"model-value",
					"min",
					"max",
					"color",
					"variant",
					"locale",
					"year-navigation",
					"month-format",
					"year-format",
					"disabled"
				])]),
				createCommentVNode(" Días de la semana "),
				createElementVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(dayLabels.value, (label, i) => {
					return openBlock(), createElementBlock("span", {
						key: i,
						class: "cu-calendar-weekday"
					}, toDisplayString(label), 1);
				}), 128))]),
				createCommentVNode(" Grilla de días: 7 columnas que se reparten el ancho del contenedor "),
				createElementVNode("div", _hoisted_4, [(openBlock(true), createElementBlock(Fragment, null, renderList(weeks.value, (week, wi) => {
					return openBlock(), createElementBlock("div", {
						key: wi,
						class: "cu-calendar-week",
						role: "row"
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(week, (cell, ci) => {
						return openBlock(), createElementBlock(Fragment, { key: ci }, [cell.date ? (openBlock(), createElementBlock("button", {
							key: 0,
							type: "button",
							class: normalizeClass(["cu-calendar-day", dayClasses(cell.date)]),
							disabled: isDisabledDay(cell.date),
							role: "gridcell",
							onClick: ($event) => selectDay(cell.date)
						}, [createTextVNode(toDisplayString(cell.date.getDate()) + " ", 1), getEventsForDay(cell.date).length ? (openBlock(), createElementBlock("span", _hoisted_6, [(openBlock(true), createElementBlock(Fragment, null, renderList(getEventsForDay(cell.date), (ev, ei) => {
							return openBlock(), createElementBlock("span", {
								key: ei,
								class: "cu-calendar-dot",
								style: normalizeStyle(ev.color ? { "--dot-color": ev.color.startsWith("var(") ? ev.color : `var(--cu-color-${ev.color})` } : void 0)
							}, null, 4);
						}), 128))])) : createCommentVNode("v-if", true)], 10, _hoisted_5)) : (openBlock(), createElementBlock("span", _hoisted_7))], 64);
					}), 128))]);
				}), 128))])
			], 14, _hoisted_1);
		};
	}
}), [["styles", ["\n.cu-calendar[data-v-6a284605] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  width: 100%;\n  min-width: 240px;\n  font-family: var(--cu-font-sans);\n  box-sizing: border-box;\n}\n\n/* Con navegación de año (4 botones del MonthSlider + label min 150px) el header\n   necesita más ancho que la grilla: forzamos min-width para evitar overflow. */\n.cu-calendar--year-nav[data-v-6a284605] {\n  min-width: 330px;\n}\n.cu-calendar.is-disabled[data-v-6a284605] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-calendar-header[data-v-6a284605] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-2xs);\n}\n\n/* 7 columnas: cada una ocupa 1/7 del ancho que mida el contenedor */\n.cu-calendar-weekdays[data-v-6a284605],\n.cu-calendar-week[data-v-6a284605] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: var(--cu-space-2xs);\n}\n.cu-calendar-weekday[data-v-6a284605] {\n  text-align: center;\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  opacity: var(--cu-alpha-subtle, 0.6);\n  padding: var(--cu-space-2xs) 0;\n}\n.cu-calendar-day[data-v-6a284605] {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: inherit;\n  font-family: inherit;\n  font-size: var(--cu-font-size-sm);\n  cursor: pointer;\n  transition: background-color 150ms ease, color 150ms ease;\n  box-sizing: border-box;\n}\n\n/* Doble clase (convención del repo): ganarle en cascada a reglas globales\n   del consumidor (reset CSS, `.playground button`, etc.) */\n.cu-calendar-day.cu-calendar-day[data-v-6a284605]:hover:not(:disabled) {\n  background: var(--cal-ghost-hover);\n}\n.cu-calendar-day.cu-calendar-day[data-v-6a284605]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n/* Hoy: transparente + número en color accent (look ghost). Sin fondo para no\n   confundirse con el día seleccionado — se distingue solo por el color. */\n.cu-calendar-day.cu-calendar-day--today[data-v-6a284605] {\n  background: transparent;\n  color: var(--cal-accent);\n  font-weight: var(--cu-font-weight-semibold);\n}\n\n/* Variantes del día seleccionado */\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-6a284605] {\n  background: var(--cal-accent);\n  /* texto sobre solid SIEMPRE con surface (blanco), nunca -text (es el color oscurecido) */\n  color: var(--cu-color-surface);\n}\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-6a284605]:hover:not(:disabled) {\n  background: var(--cal-accent-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--outlined[data-v-6a284605] {\n  outline: 1.5px solid var(--cal-accent);\n  color: var(--cal-accent);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-6a284605] {\n  background: var(--cal-soft);\n  color: var(--cal-accent);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-6a284605]:hover:not(:disabled) {\n  background: var(--cal-soft-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--subtle[data-v-6a284605] {\n  background: var(--cal-subtle);\n  color: var(--cal-accent);\n  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--cal-subtle-border);\n}\n.cu-calendar-day--empty[data-v-6a284605] {\n  aspect-ratio: 1;\n}\n\n/* ── Grid interno: líneas separadoras entre días ── */\n.cu-calendar--grid .cu-calendar-weekdays[data-v-6a284605],\n.cu-calendar--grid .cu-calendar-week[data-v-6a284605] {\n  gap: 0;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-6a284605],\n.cu-calendar--grid .cu-calendar-day--empty[data-v-6a284605] {\n  border-right: var(--cu-border-thin) solid var(--cu-border-color);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: 0;\n}\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day[data-v-6a284605],\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day--empty[data-v-6a284605] {\n  border-bottom: none;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-6a284605]:nth-child(7n),\n.cu-calendar--grid .cu-calendar-day--empty[data-v-6a284605]:nth-child(7n) {\n  border-right: none;\n}\n\n/* ── Borde exterior: marco alrededor de la cuadrícula de días ── */\n.cu-calendar--border .cu-calendar-grid[data-v-6a284605] {\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  overflow: hidden;\n}\n\n/* ── Rango ── */\n.cu-calendar-day.cu-calendar-day--range[data-v-6a284605] {\n  background: var(--cal-soft);\n  border-radius: 0;\n}\n.cu-calendar-day.cu-calendar-day--range-start[data-v-6a284605] {\n  background: var(--cal-accent);\n  color: var(--cu-color-surface);\n  border-radius: var(--cu-radius-sm) 0 0 var(--cu-radius-sm);\n}\n.cu-calendar-day.cu-calendar-day--range-end[data-v-6a284605] {\n  background: var(--cal-accent);\n  color: var(--cu-color-surface);\n  border-radius: 0 var(--cu-radius-sm) var(--cu-radius-sm) 0;\n}\n.cu-calendar-day--range-start.cu-calendar-day--range-end[data-v-6a284605] {\n  border-radius: var(--cu-radius-sm);\n}\n\n/* ── Puntos de eventos ── */\n.cu-calendar-day[data-v-6a284605] {\n  position: relative;\n}\n.cu-calendar-dots[data-v-6a284605] {\n  position: absolute;\n  bottom: var(--cu-space-2xs);\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: var(--cu-space-2xs);\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.cu-calendar-dot[data-v-6a284605] {\n  width: var(--cu-space-xs);\n  height: var(--cu-space-xs);\n  border-radius: 50%;\n  background: var(--dot-color, var(--cal-accent));\n  display: block;\n}\n"]], ["__scopeId", "data-v-6a284605"]]);
//#endregion
//#region src/lib/controls/calendar.ts
var CuCalendar = defineComegenElement("cu-calendar", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Calendar.ce",
	props: {
		/** Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver «Formato de fechas») */
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fecha mínima seleccionable (días anteriores quedan deshabilitados) */
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fecha máxima seleccionable */
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "primary"
		},
		/** Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) */
		variant: {
			type: String,
			default: "soft"
		},
		/** Deshabilita todo el calendario */
		disabled: {
			type: Boolean,
			default: false
		},
		/** Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` */
		disabledWeekdays: {
			type: [Array, String],
			default: ""
		},
		/** Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` */
		disabledDates: {
			type: [Array, String],
			default: ""
		},
		/** Locale para nombres de mes y días de la semana */
		locale: {
			type: String,
			default: "es"
		},
		/** Día en que arranca la semana: `0` = domingo, `1` = lunes */
		weekStart: {
			type: Number,
			default: 1
		},
		/** Muestra botones `«`/`»` para saltar de año en el header */
		yearNavigation: {
			type: [Boolean, String],
			default: false
		},
		/** Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		/** Eventos a señalar con puntos bajo la fecha (ver «Eventos (puntos)»). Se asigna como propiedad JS */
		events: {
			type: Array,
			default: () => []
		},
		/** Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS */
		rangeStart: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fin del rango. Se asigna como propiedad JS */
		rangeEnd: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` */
		grid: {
			type: Boolean,
			default: false
		},
		/** Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` */
		border: {
			type: Boolean,
			default: false
		},
		/** Mes visible (primer día) controlado desde afuera. Navegar emite `update:viewMonth`. Se asigna como propiedad JS */
		viewMonth: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Modo de selección: `single` (una fecha) o `range` (inicio + fin) */
		mode: {
			type: String,
			default: "single"
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const calendarRef = ref(null);
		const instance = getCurrentInstance();
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const host = (el?.getRootNode())?.host || el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		/** Va al mes siguiente (respeta `max`) */
		function nextMonth() {
			calendarRef.value?.nextMonth();
		}
		/** Va al mes anterior (respeta `min`) */
		function prevMonth() {
			calendarRef.value?.prevMonth();
		}
		/** Navega al mes de la fecha dada */
		function goToMonth(value) {
			calendarRef.value?.goToMonth(value);
		}
		/** Devuelve la fecha seleccionada (modo `single`) */
		function getValue() {
			return calendarRef.value?.getValue() ?? null;
		}
		/** Selecciona una fecha (acepta string/number/Date) */
		function setValue(value) {
			calendarRef.value?.setValue(value);
		}
		/** Devuelve el rango seleccionado (modo `range`) */
		function getRange() {
			return calendarRef.value?.getRange() ?? {
				start: null,
				end: null
			};
		}
		/** Setea el rango (acepta string/number/Date) (modo `range`) */
		function setRange(start, end) {
			calendarRef.value?.setRange(start, end);
		}
		/** Limpia el rango seleccionado (modo `range`) */
		function clear() {
			calendarRef.value?.clear();
		}
		__expose({
			nextMonth,
			prevMonth,
			goToMonth,
			getValue,
			setValue,
			getRange,
			setRange,
			clear
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Calendar_default, {
				ref_key: "calendarRef",
				ref: calendarRef,
				"model-value": props.modelValue,
				min: props.min,
				max: props.max,
				color: props.color,
				variant: props.variant,
				disabled: props.disabled,
				locale: props.locale,
				"week-start": props.weekStart,
				"year-navigation": props.yearNavigation,
				"month-format": props.monthFormat,
				"year-format": props.yearFormat,
				"disabled-weekdays": props.disabledWeekdays,
				"disabled-dates": props.disabledDates,
				events: props.events,
				"range-start": props.rangeStart,
				"range-end": props.rangeEnd,
				grid: props.grid,
				border: props.border,
				"view-month": props.viewMonth,
				mode: props.mode,
				onSelect: _cache[0] || (_cache[0] = ($event) => ceEmit("select", $event)),
				onChange: _cache[1] || (_cache[1] = ($event) => ceEmit("change", $event)),
				"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => ceEmit("update:modelValue", $event)),
				"onUpdate:viewMonth": _cache[3] || (_cache[3] = ($event) => ceEmit("update:viewMonth", $event)),
				"onUpdate:rangeStart": _cache[4] || (_cache[4] = ($event) => ceEmit("update:rangeStart", $event)),
				"onUpdate:rangeEnd": _cache[5] || (_cache[5] = ($event) => ceEmit("update:rangeEnd", $event))
			}, null, 8, [
				"model-value",
				"min",
				"max",
				"color",
				"variant",
				"disabled",
				"locale",
				"week-start",
				"year-navigation",
				"month-format",
				"year-format",
				"disabled-weekdays",
				"disabled-dates",
				"events",
				"range-start",
				"range-end",
				"grid",
				"border",
				"view-month",
				"mode"
			]);
		};
	}
}), [["styles", ["\n:host {\n  display: inline-block;\n}\n"]]]));
//#endregion
export { CuCalendar as default };
