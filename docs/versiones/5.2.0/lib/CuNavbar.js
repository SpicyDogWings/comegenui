/*! comegenui v5.2.0 · CuNavbar (cu-navbar) · esm-shared · Vue externo (bare import) */
import { Fragment, Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, inject, isRef, mergeModels, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, resolveComponent, shallowRef, toDisplayString, toValue, unref, useModel, useTemplateRef, vShow, watch, withCtx, withDirectives } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.0",
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
var isColor = oneOf(COLORS);
oneOf(COLORS_BASE);
oneOf(VARIANTS);
var isVariantFull = oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
var isFieldVariant = oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
var isAlign = oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
var isInputType = oneOf(INPUT_TYPES);
oneOf(LABEL_POSITIONS);
var isTarget = oneOf(TARGETS);
oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
oneOf(ORIENTATIONS);
oneOf(DIVIDER_VARIANTS);
oneOf(SKELETON_SHAPES);
oneOf(SKELETON_ANIMATIONS);
oneOf(SKELETON_RADII);
var isNavbarResponsiveMode = oneOf(NAVBAR_RESPONSIVE_MODES);
var isNavbarSearchMode = oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
/*!
* vue-router v5.3.1
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
Array.isArray;
/**
* Allows overriding the current route returned by `useRoute` in tests. rl
* stands for route location
*
* @internal
*/
var routeLocationKey = Symbol("");
/**
* Returns the current route location. Equivalent to using `$route` inside
* templates.
*/
function useRoute(_name) {
	return inject(routeLocationKey);
}
//#endregion
//#region src/components/overlay/SideOver.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$10 = ["data-size"];
var _hoisted_2$5 = {
	key: 0,
	class: "cu-sideover-header"
};
var _hoisted_3$5 = {
	key: 0,
	class: "cu-sideover-title"
};
var _hoisted_4$4 = { class: "cu-sideover-body" };
var SideOver_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SideOver",
	props: {
		modelValue: {
			type: Boolean,
			required: false,
			default: false
		},
		title: {
			type: String,
			required: false,
			default: ""
		},
		position: {
			type: String,
			required: false,
			default: "right",
			validator: isPosition
		},
		size: {
			type: String,
			required: false,
			default: "300px"
		},
		fullscreen: {
			type: Boolean,
			required: false,
			default: false
		},
		persistent: {
			type: Boolean,
			required: false,
			default: false
		},
		zIndex: {
			type: Number,
			required: false,
			default: 1100
		},
		/** Teleporta el panel a `body`; el CE lo desactiva para conservar el slot. */
		teleport: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:modelValue", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		function close() {
			if (props.persistent) return;
			emit("update:modelValue", false);
			emit("close");
		}
		function onKeydown(e) {
			if (e.key === "Escape" && props.modelValue) close();
		}
		let prevOverflow = "";
		watch(() => props.modelValue, (open) => {
			if (open) {
				prevOverflow = document.body.style.overflow;
				document.body.style.overflow = "hidden";
			} else document.body.style.overflow = prevOverflow;
		});
		onMounted(() => {
			document.addEventListener("keydown", onKeydown);
		});
		onUnmounted(() => {
			document.removeEventListener("keydown", onKeydown);
			document.body.style.overflow = prevOverflow;
		});
		const PRESET_SIZES = [
			"sm",
			"md",
			"lg",
			"xl",
			"full"
		];
		const isPresetSize = computed(() => PRESET_SIZES.includes(props.size));
		const panelStyle = computed(() => {
			if (props.fullscreen) return {};
			if (isPresetSize.value) return {};
			if (props.position === "left" || props.position === "right") return { width: props.size };
			return { height: props.size };
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, {
				to: "body",
				disabled: !props.teleport
			}, [createVNode(Transition, { name: "cu-sideover" }, {
				default: withCtx(() => [__props.modelValue ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "cu-sideover",
					style: normalizeStyle({ zIndex: props.zIndex }),
					role: "dialog",
					"aria-modal": "true"
				}, [createElementVNode("div", {
					class: "cu-sideover-backdrop",
					onClick: close
				}), createElementVNode("div", {
					class: normalizeClass(["cu-sideover-panel", [`cu-sideover-panel--${props.position}`, { "cu-sideover-panel--fullscreen": props.fullscreen }]]),
					"data-size": isPresetSize.value ? props.size : void 0,
					style: normalizeStyle(panelStyle.value)
				}, [props.title || !props.persistent ? (openBlock(), createElementBlock("header", _hoisted_2$5, [props.title ? (openBlock(), createElementBlock("h2", _hoisted_3$5, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true), !props.persistent ? (openBlock(), createElementBlock("button", {
					key: 1,
					type: "button",
					class: "cu-sideover-close",
					"aria-label": "Cerrar panel",
					onClick: close
				}, [..._cache[0] || (_cache[0] = [createElementVNode("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					width: "20",
					height: "20",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [createElementVNode("path", { d: "M18 6 6 18" }), createElementVNode("path", { d: "m6 6 12 12" })], -1)])])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_4$4, [renderSlot(_ctx.$slots, "default", {}, void 0, true)])], 14, _hoisted_1$10)], 4)) : createCommentVNode("v-if", true)]),
				_: 3
			})], 8, ["disabled"]);
		};
	}
});
//#endregion
//#region src/components/overlay/SideOver.vue?vue&type=style&index=0&inline&scoped=4030b6bd&lang.css
var SideOver_vue_vue_type_style_index_0_inline_scoped_4030b6bd_lang_default = "\n.cu-sideover[data-v-4030b6bd] {\n  position: fixed;\n  inset: 0;\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-backdrop[data-v-4030b6bd] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.4);\n}\n.cu-sideover-panel[data-v-4030b6bd] {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--cu-color-surface);\n  box-shadow: var(--cu-shadow-xl);\n  overflow: hidden;\n}\n.cu-sideover-panel--left[data-v-4030b6bd] { top: 0; left: 0; bottom: 0;\n}\n.cu-sideover-panel--right[data-v-4030b6bd] { top: 0; right: 0; bottom: 0;\n}\n.cu-sideover-panel--top[data-v-4030b6bd] { top: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--bottom[data-v-4030b6bd] { bottom: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--fullscreen[data-v-4030b6bd] { inset: 0; width: 100vw !important; height: 100dvh !important;\n}\n\n/* Presets de tamaño: se resuelven via CSS vars (override con\n   --cu-sideover-size-{sm|md|lg|xl|full} en el host) */\n.cu-sideover-panel[data-size='sm'][data-v-4030b6bd] { --cu-sideover-dimension: var(--cu-sideover-size-sm, 320px);\n}\n.cu-sideover-panel[data-size='md'][data-v-4030b6bd] { --cu-sideover-dimension: var(--cu-sideover-size-md, 400px);\n}\n.cu-sideover-panel[data-size='lg'][data-v-4030b6bd] { --cu-sideover-dimension: var(--cu-sideover-size-lg, 512px);\n}\n.cu-sideover-panel[data-size='xl'][data-v-4030b6bd] { --cu-sideover-dimension: var(--cu-sideover-size-xl, 640px);\n}\n.cu-sideover-panel[data-size='full'][data-v-4030b6bd] { --cu-sideover-dimension: var(--cu-sideover-size-full, 100%);\n}\n.cu-sideover-panel--left[data-size][data-v-4030b6bd],\n.cu-sideover-panel--right[data-size][data-v-4030b6bd] { width: var(--cu-sideover-dimension);\n}\n.cu-sideover-panel--top[data-size][data-v-4030b6bd],\n.cu-sideover-panel--bottom[data-size][data-v-4030b6bd] { height: var(--cu-sideover-dimension);\n}\n.cu-sideover-header[data-v-4030b6bd] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  flex-shrink: 0;\n}\n.cu-sideover-title[data-v-4030b6bd] {\n  margin: 0;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-close[data-v-4030b6bd] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  padding: var(--cu-space-2xs);\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: var(--cu-color-neutral);\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.cu-sideover-close[data-v-4030b6bd]:hover { background-color: var(--cu-color-neutral-subtle-hover);\n}\n.cu-sideover-close[data-v-4030b6bd]:focus-visible {\n  outline: 2px solid var(--cu-color-primary);\n  outline-offset: 2px;\n}\n.cu-sideover-body[data-v-4030b6bd] {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: var(--cu-space-lg);\n}\n\n/* Transición: scrim con fade + panel deslizando desde su borde */\n.cu-sideover-enter-active[data-v-4030b6bd],\n.cu-sideover-leave-active[data-v-4030b6bd] {\n  transition: opacity 0.25s ease;\n}\n.cu-sideover-enter-active .cu-sideover-panel[data-v-4030b6bd],\n.cu-sideover-leave-active .cu-sideover-panel[data-v-4030b6bd] {\n  transition: transform 0.25s ease;\n}\n.cu-sideover-enter-from[data-v-4030b6bd],\n.cu-sideover-leave-to[data-v-4030b6bd] {\n  opacity: 0;\n}\n.cu-sideover-enter-from .cu-sideover-panel--left[data-v-4030b6bd],\n.cu-sideover-leave-to .cu-sideover-panel--left[data-v-4030b6bd] { transform: translateX(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--right[data-v-4030b6bd],\n.cu-sideover-leave-to .cu-sideover-panel--right[data-v-4030b6bd] { transform: translateX(100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--top[data-v-4030b6bd],\n.cu-sideover-leave-to .cu-sideover-panel--top[data-v-4030b6bd] { transform: translateY(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--bottom[data-v-4030b6bd],\n.cu-sideover-leave-to .cu-sideover-panel--bottom[data-v-4030b6bd] { transform: translateY(100%);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/overlay/SideOver.vue
var SideOver_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SideOver_vue_vue_type_script_setup_true_lang_default, [["styles", [SideOver_vue_vue_type_style_index_0_inline_scoped_4030b6bd_lang_default]], ["__scopeId", "data-v-4030b6bd"]]);
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$9 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$9);
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
var _hoisted_1$8 = ["href", "target"];
var _hoisted_2$4 = ["type", "disabled"];
var _hoisted_3$4 = ["type", "disabled"];
//#endregion
//#region src/components/buttons/Button.vue
var Button_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
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
			], 14, _hoisted_2$4)], 10, _hoisted_1$8)) : (openBlock(), createElementBlock("button", {
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
			], 14, _hoisted_3$4));
		};
	}
}), [["styles", ["\n.cu-button[data-v-50087dcd] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  box-sizing: border-box;\n  transition: all 150ms ease;\n}\n.cu-button[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  transform: scale(0.97);\n}\n.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* sizes (md = base; link mantiene su padding 0) */\n.cu-button--sm[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-xs);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-button--lg[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-lg);\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n}\n\n/* solid */\n.cu-button.cu-button--solid[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* ghost */\n.cu-button.cu-button--ghost[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* soft */\n.cu-button.cu-button--soft[data-v-50087dcd] {\n  background-color: var(--btn-soft);\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-active);\n}\n\n/* subtle */\n.cu-button.cu-button--subtle[data-v-50087dcd] {\n  background-color: var(--btn-subtle);\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-active);\n}\n\n/* outlined */\n.cu-button.cu-button--outlined[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-bg);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* link */\n.cu-button.cu-button--link[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  padding: 0;\n  box-shadow: none;\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button.cu-button--link[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  text-decoration-thickness: 2px;\n}\n\n/* none */\n.cu-button.cu-button--none[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* link wrapper */\n.cu-button-link[data-v-50087dcd] {\n  text-decoration: none;\n}\n.cu-button-link[data-v-50087dcd]:hover {\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button-link.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n\n/* icon-only */\n.cu-button--icon-only[data-v-50087dcd] {\n  padding: var(--cu-space-sm);\n}\n\n/* loading spinner */\n.cu-button-spinner[data-v-50087dcd] {\n  animation: cu-spin-50087dcd 0.8s linear infinite;\n}\n@keyframes cu-spin-50087dcd {\nfrom { transform: rotate(0deg);\n}\nto { transform: rotate(360deg);\n}\n}\n"]], ["__scopeId", "data-v-50087dcd"]]);
//#endregion
//#region src/components/overlay/Collapse.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = { class: "cu-collapse" };
var _hoisted_2$3 = ["innerHTML"];
var _hoisted_3$3 = { class: "cu-collapse-text" };
var _hoisted_4$3 = { class: "cu-collapse-label" };
var _hoisted_5$3 = {
	key: 0,
	class: "cu-collapse-description"
};
//#endregion
//#region src/components/overlay/Collapse.vue
var Collapse_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Collapse",
	props: {
		label: {
			type: String,
			required: true
		},
		/** Ícono del trigger (SVG/HTML). */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		/** Texto secundario que se muestra bajo el label en el trigger. */
		description: {
			type: String,
			required: false,
			default: ""
		},
		defaultOpen: {
			type: Boolean,
			default: false
		},
		/** Deshabilita el trigger: no responde al click del usuario. */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		color: {
			type: String,
			default: "neutral"
		}
	},
	emits: ["toggle"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const isOpen = ref(props.defaultOpen);
		const contentRef = ref();
		function setOpen(value) {
			if (isOpen.value === value) return;
			isOpen.value = value;
			emit("toggle", value);
		}
		/** Alterna el estado del collapse. */
		function toggle() {
			if (props.disabled) return;
			setOpen(!isOpen.value);
		}
		/** Abre el collapse. */
		function open() {
			if (props.disabled) return;
			setOpen(true);
		}
		/** Cierra el collapse. */
		function close() {
			setOpen(false);
		}
		function onEnter(el) {
			const el_ = el;
			el_.style.height = "0";
			el_.style.overflow = "hidden";
			requestAnimationFrame(() => {
				const prev = el_.style.height;
				el_.style.height = "";
				const target = el_.scrollHeight;
				el_.style.height = prev;
				requestAnimationFrame(() => {
					el_.style.height = target + "px";
				});
			});
			el_.addEventListener("transitionend", () => {
				el_.style.height = "";
				el_.style.overflow = "";
			}, { once: true });
		}
		function onAfterEnter(el) {
			const el_ = el;
			el_.style.height = "";
			el_.style.overflow = "";
		}
		function onLeave(el) {
			const el_ = el;
			el_.style.height = el_.scrollHeight + "px";
			el_.style.overflow = "hidden";
			el_.offsetHeight;
			el_.style.height = "0";
		}
		function onAfterLeave(el) {
			const el_ = el;
			el_.style.height = "";
			el_.style.overflow = "";
		}
		__expose({
			open,
			close,
			toggle,
			/** Devuelve true si el collapse está abierto. */
			isOpen: () => isOpen.value
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$7, [createVNode(Button_default, {
				class: "cu-collapse-trigger",
				color: props.color,
				variant: "ghost",
				disabled: props.disabled,
				onClick: _cache[0] || (_cache[0] = ($event) => toggle())
			}, {
				default: withCtx(() => [
					createVNode(LucideChevronRight_default, {
						class: normalizeClass(["cu-collapse-chevron", { "is-open": isOpen.value }]),
						width: 14,
						height: 14
					}, null, 8, ["class"]),
					props.icon ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: "cu-collapse-icon",
						innerHTML: props.icon
					}, null, 8, _hoisted_2$3)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$3, [createElementVNode("span", _hoisted_4$3, toDisplayString(props.label), 1), props.description ? (openBlock(), createElementBlock("p", _hoisted_5$3, toDisplayString(props.description), 1)) : createCommentVNode("v-if", true)])
				]),
				_: 1
			}, 8, ["color", "disabled"]), createVNode(Transition, {
				appear: "",
				onEnter,
				onAfterEnter,
				onLeave,
				onAfterLeave,
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createElementVNode("div", {
					ref_key: "contentRef",
					ref: contentRef,
					class: "cu-collapse-content"
				}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 512), [[vShow, isOpen.value]])]),
				_: 3
			})]);
		};
	}
}), [["styles", ["\n.cu-collapse[data-v-5cf213b6] {\n  display: flex;\n  flex-direction: column;\n}\n.cu-collapse-trigger[data-v-5cf213b6] {\n  justify-content: flex-start;\n  cursor: pointer;\n}\n.cu-collapse-trigger[data-v-5cf213b6]:disabled {\n  cursor: not-allowed;\n}\n.cu-collapse-chevron[data-v-5cf213b6] {\n  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.cu-collapse-chevron.is-open[data-v-5cf213b6] {\n  transform: rotate(90deg);\n}\n.cu-collapse-text[data-v-5cf213b6] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  min-width: 0;\n  text-align: left;\n}\n.cu-collapse-description[data-v-5cf213b6] {\n  margin: 0;\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-normal);\n  opacity: 0.7;\n}\n.cu-collapse-content[data-v-5cf213b6] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  padding: 0 0 0 var(--cu-space-lg);\n  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n"]], ["__scopeId", "data-v-5cf213b6"]]);
//#endregion
//#region src/components/information/Loader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$6 = { class: "cu-loader" };
//#endregion
//#region src/components/information/Loader.vue
var Loader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Loader",
	props: {
		color: {
			type: String,
			required: false,
			default: "primary"
		},
		animation: {
			type: String,
			required: false,
			default: "loading"
		},
		delay: {
			type: Number,
			required: false,
			default: 2e3
		}
	},
	setup(__props) {
		const props = __props;
		const loaderStyles = computed(() => ({
			"--cu-loader-color": `var(--cu-color-${props.color})`,
			"--cu-loader-delay": `${props.delay}ms`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$6, [createElementVNode("div", {
				class: normalizeClass(["cu-loader-bar", `cu-loader-bar--${props.animation}`]),
				style: normalizeStyle(loaderStyles.value)
			}, null, 6)]);
		};
	}
}), [["styles", ["\n.cu-loader[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  overflow: hidden;\n  height: 3px;\n}\n.cu-loader-bar[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  background: var(--cu-loader-color);\n}\n.cu-loader-bar--loading[data-v-045244b1] {\n  width: 60%;\n  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);\n  animation: cu-loader-slide-045244b1 1.5s ease-in-out infinite;\n}\n.cu-loader-bar--cooldown[data-v-045244b1] {\n  left: 0;\n  width: 100%;\n  animation: cu-loader-cooldown-045244b1 var(--cu-loader-delay) linear forwards;\n}\n@keyframes cu-loader-slide-045244b1 {\n0% { left: -100%;\n}\n50% { left: 0%;\n}\n100% { left: 100%;\n}\n}\n@keyframes cu-loader-cooldown-045244b1 {\nfrom { width: 100%;\n}\nto { width: 0%;\n}\n}\n"]], ["__scopeId", "data-v-045244b1"]]);
//#endregion
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = ["role"];
var HOVER_REGISTRY_KEY = "__cu_hover_registry__";
//#endregion
//#region src/components/overlay/Popover.vue
var Popover_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Popover",
	props: {
		position: {
			type: String,
			required: false,
			default: "bottom",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "start",
			validator: isAlign
		},
		offset: {
			type: Number,
			required: false,
			default: 4
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		panelWidth: {
			type: String,
			required: false,
			default: ""
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		hover: {
			type: Boolean,
			required: false,
			default: false
		},
		hoverDelay: {
			type: Number,
			required: false,
			default: 200
		},
		role: {
			type: String,
			required: false,
			default: ""
		},
		panelClass: {
			type: [
				String,
				Array,
				Object
			],
			required: false,
			default: ""
		}
	},
	emits: ["open", "close"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const effectivePosition = computed(() => props.position);
		const effectiveAlign = computed(() => props.align);
		const panelPos = ref({
			top: "0px",
			left: "0px"
		});
		const panelStyle = computed(() => {
			const base = {
				backgroundColor: "var(--cu-popover-bg, var(--cu-color-surface))",
				minWidth: "var(--cu-popover-min-width, 200px)",
				maxWidth: "var(--cu-popover-max-width, 80vw)"
			};
			if (props.fixed) return {
				...base,
				position: "fixed",
				...panelPos.value,
				zIndex: "10000",
				...props.panelWidth ? { width: props.panelWidth } : {}
			};
			base.position = "absolute";
			base.zIndex = "1000";
			base.width = props.panelWidth || "var(--cu-popover-width, 100%)";
			const pos = effectivePosition.value;
			if (pos === "bottom") {
				base.top = "100%";
				base.marginTop = `${props.offset}px`;
			} else if (pos === "top") {
				base.bottom = "100%";
				base.marginBottom = `${props.offset}px`;
			} else if (pos === "right") {
				base.left = "100%";
				base.marginLeft = `${props.offset}px`;
			} else if (pos === "left") {
				base.right = "100%";
				base.marginRight = `${props.offset}px`;
			}
			if (pos === "left" || pos === "right") {
				if (effectiveAlign.value === "start") base.top = "0";
				else if (effectiveAlign.value === "end") base.bottom = "0";
				else {
					base.top = "50%";
					base.transform = "translateY(-50%)";
				}
			} else if (effectiveAlign.value === "start") base.left = "0";
			else if (effectiveAlign.value === "end") base.right = "0";
			else {
				base.left = "50%";
				base.transform = "translateX(-50%)";
			}
			return base;
		});
		const isOpen = ref(false);
		const popoverRef = ref(null);
		let closedByOutsideClick = false;
		function onDocumentClick(e) {
			if (!isOpen.value || !popoverRef.value) return;
			if (!e.composedPath().includes(popoverRef.value)) {
				closedByOutsideClick = true;
				isOpen.value = false;
				emit("close");
				setTimeout(() => {
					closedByOutsideClick = false;
				}, 0);
			}
		}
		function onKeyDown(e) {
			if (e.key === "Escape" && isOpen.value) {
				isOpen.value = false;
				emit("close");
			}
		}
		const SCROLL_OPTS = {
			capture: true,
			passive: true
		};
		onMounted(() => {
			document.addEventListener("click", onDocumentClick, true);
			document.addEventListener("keydown", onKeyDown);
			window.addEventListener("resize", onViewportChange);
			document.addEventListener("scroll", onViewportChange, SCROLL_OPTS);
		});
		onUnmounted(() => {
			unregisterHover();
			document.removeEventListener("click", onDocumentClick, true);
			document.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("resize", onViewportChange);
			document.removeEventListener("scroll", onViewportChange, SCROLL_OPTS);
			document.removeEventListener("mousemove", onPointerMove, true);
			pointerListening = false;
		});
		function positionPanel() {
			if (!props.fixed || !popoverRef.value) return;
			const r = popoverRef.value.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const pos = effectivePosition.value;
			const align = effectiveAlign.value;
			const style = {};
			if (pos === "bottom") {
				style.top = `${r.bottom + props.offset}px`;
				if (align === "start") style.left = `${r.left}px`;
				else if (align === "end") style.right = `${vw - r.right}px`;
				else {
					style.left = `${r.left + r.width / 2}px`;
					style.transform = "translateX(-50%)";
				}
			} else if (pos === "top") {
				style.bottom = `${vh - r.top + props.offset}px`;
				if (align === "start") style.left = `${r.left}px`;
				else if (align === "end") style.right = `${vw - r.right}px`;
				else {
					style.left = `${r.left + r.width / 2}px`;
					style.transform = "translateX(-50%)";
				}
			} else if (pos === "right") {
				style.left = `${r.right + props.offset}px`;
				if (align === "start") style.top = `${r.top}px`;
				else if (align === "end") style.bottom = `${vh - r.bottom}px`;
				else {
					style.top = `${r.top + r.height / 2}px`;
					style.transform = "translateY(-50%)";
				}
			} else {
				style.right = `${vw - r.left + props.offset}px`;
				if (align === "start") style.top = `${r.top}px`;
				else if (align === "end") style.bottom = `${vh - r.bottom}px`;
				else {
					style.top = `${r.top + r.height / 2}px`;
					style.transform = "translateY(-50%)";
				}
			}
			panelPos.value = style;
		}
		function onViewportChange() {
			if (isOpen.value && props.fixed) positionPanel();
		}
		let hoverTimer = null;
		let hoverCloseTimer = null;
		function hoverRegistry() {
			const g = globalThis;
			return g[HOVER_REGISTRY_KEY] ??= [];
		}
		function registerHoverOpen() {
			const el = popoverRef.value;
			if (!el) return;
			const reg = hoverRegistry();
			const toClose = reg.filter((entry) => entry.el !== el && !entry.el.contains(el));
			reg.push({
				el,
				close
			});
			for (const entry of toClose) entry.close();
		}
		function unregisterHover() {
			const el = popoverRef.value;
			if (!el) return;
			const reg = hoverRegistry();
			const idx = reg.findIndex((entry) => entry.el === el);
			if (idx !== -1) reg.splice(idx, 1);
		}
		let lastPointer = {
			x: -1,
			y: -1
		};
		let pointerListening = false;
		function ensurePointerListener() {
			if (pointerListening) return;
			pointerListening = true;
			document.addEventListener("mousemove", onPointerMove, true);
		}
		function onPointerMove(e) {
			lastPointer = {
				x: e.clientX,
				y: e.clientY
			};
		}
		function isPointerInside() {
			const el = popoverRef.value;
			if (!el) return false;
			const panel = el.querySelector(".cu-popover-panel");
			const rects = [el.getBoundingClientRect()];
			if (panel) rects.push(panel.getBoundingClientRect());
			return rects.some((r) => lastPointer.x >= r.left && lastPointer.x <= r.right && lastPointer.y >= r.top && lastPointer.y <= r.bottom);
		}
		function onMouseEnter() {
			if (!props.hover || props.disabled) return;
			if (hoverTimer) clearTimeout(hoverTimer);
			if (hoverCloseTimer) {
				clearTimeout(hoverCloseTimer);
				hoverCloseTimer = null;
			}
			if (props.hoverDelay === 0) open();
			else hoverTimer = setTimeout(() => open(), props.hoverDelay);
		}
		function onMouseLeave() {
			if (!props.hover) return;
			if (hoverTimer) clearTimeout(hoverTimer);
			ensurePointerListener();
			if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
			hoverCloseTimer = setTimeout(() => {
				if (isPointerInside()) return;
				close();
			}, 120);
		}
		function open() {
			if (props.disabled) return;
			positionPanel();
			isOpen.value = true;
			emit("open");
			if (props.hover) registerHoverOpen();
		}
		function close() {
			if (!isOpen.value) return;
			isOpen.value = false;
			emit("close");
			unregisterHover();
		}
		function toggle() {
			if (props.disabled) return;
			if (closedByOutsideClick) {
				closedByOutsideClick = false;
				return;
			}
			if (isOpen.value) close();
			else open();
		}
		__expose({
			open,
			close,
			toggle,
			isOpen: () => isOpen.value
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "popoverRef",
				ref: popoverRef,
				class: "cu-popover",
				onMouseenter: onMouseEnter,
				onMouseleave: onMouseLeave
			}, [renderSlot(_ctx.$slots, "toggle", {
				toggle,
				isOpen: isOpen.value
			}, void 0, true), isOpen.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				style: normalizeStyle(panelStyle.value),
				class: normalizeClass(["cu-popover-panel", __props.panelClass]),
				role: __props.role || void 0
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1$5)) : createCommentVNode("v-if", true)], 544);
		};
	}
}), [["styles", ["\n.cu-popover[data-v-0d8e4328] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.cu-popover-panel[data-v-0d8e4328] {\n  padding: var(--cu-space-sm);\n  border-radius: var(--cu-radius-md);\n  font-family: var(--cu-font-sans);\n  box-shadow: var(--cu-shadow-xl);\n}\n"]], ["__scopeId", "data-v-0d8e4328"]]);
//#endregion
//#region src/components/overlay/Dropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = ["onClick"];
var _hoisted_2$2 = ["innerHTML"];
var _hoisted_3$2 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_4$2 = {
	key: 0,
	class: "cu-dropdown-menu-divider"
};
var _hoisted_5$2 = ["href", "onClick"];
var _hoisted_6$2 = ["innerHTML"];
var _hoisted_7$2 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_8$1 = ["disabled", "onClick"];
var _hoisted_9 = ["innerHTML"];
var _hoisted_10 = { class: "cu-dropdown-menu-item-label" };
//#endregion
//#region src/components/overlay/Dropdown.vue
var Dropdown_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Dropdown",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariantFull
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** Ícono del trigger (SVG/HTML). */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		trigger: {
			type: String,
			required: false,
			default: "click"
		},
		position: {
			type: String,
			required: false,
			default: "bottom",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "start",
			validator: isAlign
		},
		offset: {
			type: Number,
			required: false,
			default: 4
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		panelWidth: {
			type: String,
			required: false,
			default: ""
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldown: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldownKey: {
			type: Number,
			required: false,
			default: 0
		},
		delay: {
			type: Number,
			required: false,
			default: 2e3
		},
		items: {
			type: Array,
			required: false,
			default: () => []
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["open", "close"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		/** Valor seleccionado (v-model). */
		const selectedValue = useModel(__props, "modelValue");
		const emit = __emit;
		const popoverRef = ref(null);
		const isNested = ref(false);
		function detectNested() {
			const el = popoverRef.value?.$el;
			if (!el) return;
			let parent = el.parentElement;
			while (parent) {
				if (parent.classList.contains("cu-dropdown")) {
					isNested.value = true;
					return;
				}
				parent = parent.parentElement;
			}
		}
		onMounted(() => {
			detectNested();
		});
		const instance = getCurrentInstance();
		const positionExplicit = computed(() => instance?.vnode?.props?.position !== void 0);
		const effectivePosition = computed(() => isNested.value && !positionExplicit.value ? "right" : props.position);
		const effectiveAlign = computed(() => props.align);
		const panelClass = computed(() => ({
			"cu-dropdown-panel": true,
			"cu-dropdown-panel--loading": props.loading
		}));
		function onItemClick(item) {
			if (item.disabled || item.divider) return;
			if (item.onClick) item.onClick();
			popoverRef.value?.close();
		}
		/** Devuelve el valor seleccionado. */
		function get() {
			return selectedValue.value;
		}
		/** Setea el valor seleccionado. */
		function set(val) {
			selectedValue.value = val;
		}
		/** Limpia el valor seleccionado. */
		function reset() {
			selectedValue.value = "";
		}
		__expose({
			/** Abre el panel. */
			open: () => popoverRef.value?.open(),
			/** Cierra el panel. */
			close: () => popoverRef.value?.close(),
			/** Alterna la visibilidad del panel. */
			toggle: () => popoverRef.value?.toggle(),
			get,
			set,
			reset,
			/** Devuelve true si el panel está abierto. */
			isOpen: () => popoverRef.value?.isOpen() ?? false
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Popover_default, {
				ref_key: "popoverRef",
				ref: popoverRef,
				position: effectivePosition.value,
				align: effectiveAlign.value,
				offset: __props.offset,
				fixed: __props.fixed,
				"panel-width": __props.panelWidth,
				disabled: __props.disabled,
				hover: __props.trigger === "hover",
				"hover-delay": 0,
				role: "menu",
				"panel-class": panelClass.value,
				class: normalizeClass(["cu-dropdown", { "cu-dropdown--nested": isNested.value }]),
				onOpen: _cache[0] || (_cache[0] = ($event) => emit("open")),
				onClose: _cache[1] || (_cache[1] = ($event) => emit("close"))
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [renderSlot(_ctx.$slots, "toggle", {
					toggle,
					isOpen
				}, () => [isNested.value ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					class: "cu-dropdown-menu-item",
					onClick: toggle
				}, [
					__props.icon ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: "cu-dropdown-menu-item-icon",
						innerHTML: __props.icon
					}, null, 8, _hoisted_2$2)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$2, toDisplayString(__props.label || "Submenú"), 1),
					createVNode(LucideChevronRight_default, {
						width: 14,
						height: 14,
						class: "cu-dropdown-menu-item-chevron"
					})
				], 8, _hoisted_1$4)) : (openBlock(), createBlock(Button_default, {
					key: 1,
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					onClick: toggle
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.label || "Dropdown"), 1)]),
					_: 1
				}, 8, [
					"color",
					"variant",
					"disabled",
					"onClick"
				]))], true)]),
				default: withCtx(() => [
					__props.loading ? (openBlock(), createBlock(Loader_default, {
						key: 0,
						color: __props.color,
						animation: "loading"
					}, null, 8, ["color"])) : createCommentVNode("v-if", true),
					__props.cooldown && !__props.loading ? (openBlock(), createBlock(Loader_default, {
						key: __props.cooldownKey,
						color: __props.color,
						animation: "cooldown",
						delay: __props.delay
					}, null, 8, ["color", "delay"])) : createCommentVNode("v-if", true),
					!__props.loading ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.items, (item, i) => {
						return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_4$2)) : item.to || item.href ? (openBlock(), createElementBlock("a", {
							key: 1,
							href: item.to || item.href,
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_6$2)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7$2, toDisplayString(item.label), 1)], 10, _hoisted_5$2)) : (openBlock(), createElementBlock("button", {
							key: 2,
							type: "button",
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							disabled: item.disabled,
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_9)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_10, toDisplayString(item.label), 1)], 10, _hoisted_8$1))], 64);
					}), 128)), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 64)) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 8, [
				"position",
				"align",
				"offset",
				"fixed",
				"panel-width",
				"disabled",
				"hover",
				"panel-class",
				"class"
			]);
		};
	}
}), [["styles", ["\n/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo\n   ajustes específicos del dropdown sobre el panel del Popover. */\n.cu-dropdown[data-v-f001459f] .cu-dropdown-panel--loading {\n  pointer-events: none;\n}\n\n/* Dropdown anidado: ocupa el ancho de la fila del menú padre y el panel en\n   cascada es más angosto (auto) */\n.cu-dropdown.cu-dropdown--nested[data-v-f001459f] {\n  display: block;\n  width: 100%;\n  --cu-popover-width: auto;\n  --cu-popover-min-width: 160px;\n}\n.cu-dropdown-panel--nested[data-v-f001459f] {\n  padding: var(--cu-space-2xs);\n}\n\n/* Item de menú nativo (hojas + trigger de submenú anidado) */\n.cu-dropdown-menu-item[data-v-f001459f] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  width: 100%;\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral);\n  text-decoration: none;\n  border-radius: var(--cu-radius-sm);\n  transition: background-color 150ms ease;\n}\n.cu-dropdown-menu-item[data-v-f001459f]:hover:not(.cu-dropdown-menu-item--disabled) {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-dropdown-menu-item--disabled[data-v-f001459f] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-dropdown-menu-item-label[data-v-f001459f] {\n  text-align: left;\n  white-space: nowrap;\n}\n.cu-dropdown-menu-item-chevron[data-v-f001459f] {\n  flex-shrink: 0;\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-dropdown-menu-item-icon[data-v-f001459f] {\n  flex-shrink: 0;\n  opacity: var(--cu-alpha-subtle, 0.6);\n}\n.cu-dropdown-menu-divider[data-v-f001459f] {\n  margin: var(--cu-space-2xs) 0;\n  border: 0;\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n"]], ["__scopeId", "data-v-f001459f"]]);
//#endregion
//#region src/components/navigation/NavbarMenu.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = { class: "cu-navbar-menu" };
var _hoisted_2$1 = ["href"];
var _hoisted_3$1 = ["innerHTML"];
var _hoisted_4$1 = { class: "cu-navbar-menu-item-label" };
var _hoisted_5$1 = {
	key: 2,
	class: "cu-navbar-menu-item cu-navbar-menu-item--disabled"
};
var _hoisted_6$1 = ["innerHTML"];
var _hoisted_7$1 = { class: "cu-navbar-menu-item-label" };
//#endregion
//#region src/components/navigation/NavbarMenu.vue
var NavbarMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "NavbarMenu",
	props: {
		/** Items del nivel de menú. */
		items: {
			type: Array,
			required: true
		},
		/** Disparador de los submenús: click o hover. */
		trigger: {
			type: String,
			required: false,
			default: "click"
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			const _component_NavbarMenu = resolveComponent("NavbarMenu", true);
			return openBlock(), createElementBlock("div", _hoisted_1$3, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.items, (item) => {
				return openBlock(), createElementBlock(Fragment, { key: item.path || item.label }, [item.children?.length ? (openBlock(), createBlock(Dropdown_default, {
					key: 0,
					label: item.label,
					icon: item.icon,
					trigger: props.trigger
				}, {
					default: withCtx(() => [createVNode(_component_NavbarMenu, {
						items: item.children,
						trigger: props.trigger
					}, null, 8, ["items", "trigger"])]),
					_: 2
				}, 1032, [
					"label",
					"icon",
					"trigger"
				])) : item.path ? (openBlock(), createElementBlock("a", {
					key: 1,
					href: item.path,
					class: "cu-navbar-menu-item"
				}, [item.icon ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: "cu-navbar-menu-icon",
					innerHTML: item.icon
				}, null, 8, _hoisted_3$1)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_4$1, toDisplayString(item.label), 1)], 8, _hoisted_2$1)) : (openBlock(), createElementBlock("span", _hoisted_5$1, [item.icon ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: "cu-navbar-menu-icon",
					innerHTML: item.icon
				}, null, 8, _hoisted_6$1)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7$1, toDisplayString(item.label), 1)]))], 64);
			}), 128))]);
		};
	}
}), [["styles", ["\n.cu-navbar-menu[data-v-72342907] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  min-width: 180px;\n}\n.cu-navbar-menu-item[data-v-72342907] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-md);\n  width: 100%;\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral);\n  text-decoration: none;\n  border-radius: var(--cu-radius-sm);\n  transition: background-color 150ms ease;\n}\n.cu-navbar-menu-item[data-v-72342907]:hover:not(.cu-navbar-menu-item--disabled) {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-navbar-menu-item--disabled[data-v-72342907] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-navbar-menu-item-label[data-v-72342907] {\n  text-align: left;\n  white-space: nowrap;\n}\n.cu-navbar-menu-icon[data-v-72342907] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  width: 1.25rem;\n  line-height: 1;\n}\n"]], ["__scopeId", "data-v-72342907"]]);
//#endregion
//#region node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.6.0-rc.11_@typescript+typescript6@6.0.2_/node_modules/@vueuse/shared/dist/index.js
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
//#endregion
//#region node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.6.0-rc.11_@typescript+typescript6@6.0.2_/node_modules/@vueuse/core/dist/index.js
var defaultWindow = isClient ? window : void 0;
isClient && window.document;
isClient && window.navigator;
isClient && window.location;
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
/**
* Track or set the focus state of a DOM element.
*
* @see https://vueuse.org/useFocus
* @param target The target element for the focus and blur events.
* @param options
*/
function useFocus(target, options = {}) {
	const { initialValue = false, focusVisible = false, preventScroll = false } = options;
	const innerFocused = shallowRef(false);
	const targetElement = computed(() => unrefElement(target));
	const listenerOptions = { passive: true };
	useEventListener(targetElement, "focus", (event) => {
		var _matches, _ref;
		if (!focusVisible || ((_matches = (_ref = event.target).matches) === null || _matches === void 0 ? void 0 : _matches.call(_ref, ":focus-visible"))) innerFocused.value = true;
	}, listenerOptions);
	useEventListener(targetElement, "blur", () => innerFocused.value = false, listenerOptions);
	const focused = computed({
		get: () => innerFocused.value,
		set(value) {
			var _targetElement$value, _targetElement$value2;
			if (!value && innerFocused.value) (_targetElement$value = targetElement.value) === null || _targetElement$value === void 0 || _targetElement$value.blur();
			else if (value && !innerFocused.value) (_targetElement$value2 = targetElement.value) === null || _targetElement$value2 === void 0 || _targetElement$value2.focus({ preventScroll });
		}
	});
	watch(targetElement, () => {
		focused.value = initialValue;
	}, {
		immediate: true,
		flush: "post"
	});
	return { focused };
}
Number.POSITIVE_INFINITY;
//#endregion
//#region src/components/form/Input.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = [
	"type",
	"placeholder",
	"value",
	"disabled",
	"readonly"
];
//#endregion
//#region src/components/form/Input.vue
var Input_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Input",
	props: /*@__PURE__*/ mergeModels({
		startValue: {
			type: String,
			required: false
		},
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isFieldVariant
		},
		type: {
			type: String,
			required: false,
			default: "text",
			validator: isInputType
		},
		placeholder: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Tamaño del input (sm | md | lg). */
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const value = useModel(__props, "modelValue");
		const props = __props;
		const sizeClass = computed(() => props.size !== "md" ? `cu-input--${props.size}` : "");
		const { focused: inputFocus } = useFocus(useTemplateRef("input"));
		const inputStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-bg-active": `var(--cu-color-${props.color}-ghost-active)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		/** Devuelve el valor actual del input. */
		const get = () => value.value;
		/** Setea el valor del input. */
		const set = (newValue) => {
			value.value = String(newValue);
		};
		/** Limpia el input. */
		const reset = () => {
			value.value = "";
		};
		__expose({
			get,
			set,
			reset,
			/** Enfoca el input. */
			focus: () => inputFocus.value = true
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("input", {
				ref: "input",
				type: props.type,
				placeholder: props.placeholder,
				value: value.value,
				onInput: _cache[0] || (_cache[0] = ($event) => value.value = $event.target.value),
				class: normalizeClass(["cu-input", [
					`cu-input--${props.variant}`,
					sizeClass.value,
					{ "cu-input--disabled": props.disabled }
				]]),
				style: normalizeStyle(inputStyles.value),
				disabled: props.disabled,
				readonly: props.readOnly
			}, null, 46, _hoisted_1$2);
		};
	}
}), [["styles", ["\n.cu-input[data-v-416af2a0] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius-md);\n  border: none;\n  outline: none;\n  width: 100%;\n  box-sizing: border-box;\n  background-color: var(--btn-bg);\n  color: var(--cu-color-neutral-text);\n  transition: all 150ms ease;\n}\n\n/* sizes */\n.cu-input--sm[data-v-416af2a0] {\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  font-size: var(--cu-font-size-xs);\n}\n.cu-input--lg[data-v-416af2a0] {\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n  font-size: var(--cu-font-size-md);\n}\n.cu-input[data-v-416af2a0]::placeholder {\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-input[data-v-416af2a0]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n\n/* subtle */\n.cu-input--subtle[data-v-416af2a0] {\n  background-color: var(--btn-subtle);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--subtle[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n\n/* soft */\n.cu-input--soft[data-v-416af2a0] {\n  background-color: var(--btn-soft);\n}\n.cu-input--soft[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n\n/* ghost */\n.cu-input--ghost[data-v-416af2a0] {\n  background-color: transparent;\n}\n.cu-input--ghost[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* outlined */\n.cu-input--outlined[data-v-416af2a0] {\n  background-color: transparent;\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--outlined[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* disabled */\n.cu-input--disabled[data-v-416af2a0] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-416af2a0"]]);
//#endregion
//#region src/components/navigation/NavbarList.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = {
	key: 0,
	class: "cu-navbar-header"
};
var _hoisted_2 = ["title", "aria-pressed"];
var _hoisted_3 = { "aria-hidden": "true" };
var _hoisted_4 = ["title", "onClick"];
var _hoisted_5 = ["innerHTML"];
var _hoisted_6 = ["innerHTML"];
var _hoisted_7 = { class: "cu-navbar-label" };
var _hoisted_8 = {
	key: 1,
	class: "cu-navbar-empty"
};
//#endregion
//#region src/components/navigation/NavbarList.vue
var NavbarList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "NavbarList",
	props: /*@__PURE__*/ mergeModels({
		/** Items del menú. */
		items: {
			type: Array,
			required: true
		},
		/** Habilita el buscador de items. */
		search: {
			type: Boolean,
			default: false
		},
		/** Placeholder del buscador. */
		searchPlaceholder: {
			type: String,
			default: "Buscar..."
		},
		/** Modo de búsqueda: filter (filtra items) o scroll (resalta y desplaza). */
		searchMode: {
			type: String,
			default: "filter"
		},
		/** Campos sobre los que busca el filtro. */
		searchFields: {
			type: Array,
			default: () => []
		},
		/** Modo compacto: solo iconos o la inicial. */
		compact: {
			type: Boolean,
			default: false
		},
		/** Muestra el botón para compactar y expandir. */
		compactable: {
			type: Boolean,
			default: false
		},
		/** Inicia los submenús colapsados. */
		collapsed: {
			type: Boolean,
			default: false
		},
		/** Disparador de los submenús: click o hover. */
		trigger: {
			type: String,
			default: "click"
		},
		/** Path activo para resaltar el item correspondiente. */
		activePath: {
			type: String,
			default: ""
		},
		/** Item a resaltar por búsqueda en modo scroll. */
		highlightTarget: {
			type: Object,
			default: null
		},
		/** Item activo según la ruta actual. */
		activeItem: {
			type: Object,
			default: null
		}
	}, {
		"query": { default: "" },
		"queryModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["toggle-compact"], ["update:query"]),
	setup(__props, { emit: __emit }) {
		const props = __props;
		/** Texto de búsqueda (v-model:query). */
		const query = useModel(__props, "query");
		const emit = __emit;
		function itemIcon(item) {
			if (item.icon) return item.icon;
			return props.compact ? item.label.charAt(0) : "";
		}
		return (_ctx, _cache) => {
			const _component_NavbarList = resolveComponent("NavbarList", true);
			return openBlock(), createElementBlock("nav", { class: normalizeClass(["cu-navbar", { "cu-navbar--compact": __props.compact }]) }, [
				__props.search || __props.compactable ? (openBlock(), createElementBlock("div", _hoisted_1$1, [__props.search && !__props.compact ? (openBlock(), createBlock(Input_default, {
					key: 0,
					modelValue: query.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => query.value = $event),
					placeholder: __props.searchPlaceholder,
					class: "cu-navbar-search-input"
				}, null, 8, ["modelValue", "placeholder"])) : createCommentVNode("v-if", true), __props.compactable ? (openBlock(), createElementBlock("button", {
					key: 1,
					type: "button",
					class: "cu-navbar-compact-toggle",
					title: __props.compact ? "Expandir" : "Compactar",
					"aria-pressed": __props.compact,
					onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle-compact"))
				}, [createElementVNode("span", _hoisted_3, toDisplayString(__props.compact ? "»" : "«"), 1)], 8, _hoisted_2)) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true),
				(openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
					return openBlock(), createElementBlock(Fragment, { key: item.path || item.label }, [item.children?.length && __props.compact ? (openBlock(), createBlock(Dropdown_default, {
						key: 0,
						trigger: props.trigger,
						position: "right",
						align: "start",
						class: normalizeClass({
							"cu-navbar-item--match": __props.highlightTarget === item,
							"cu-navbar-item--active": __props.activeItem === item
						}),
						"data-navbar-match": __props.highlightTarget === item ? "" : void 0,
						"data-navbar-active": __props.activeItem === item ? "" : void 0
					}, {
						toggle: withCtx(({ toggle: t }) => [createElementVNode("button", {
							type: "button",
							class: "cu-navbar-compact-trigger",
							title: item.label,
							onClick: t
						}, [createElementVNode("span", {
							class: "cu-navbar-icon",
							innerHTML: itemIcon(item)
						}, null, 8, _hoisted_5), createVNode(LucideChevronRight_default, {
							width: 14,
							height: 14,
							class: "cu-navbar-compact-chevron"
						})], 8, _hoisted_4)]),
						default: withCtx(() => [createVNode(NavbarMenu_default, {
							items: item.children,
							trigger: props.trigger
						}, null, 8, ["items", "trigger"])]),
						_: 2
					}, 1032, [
						"trigger",
						"class",
						"data-navbar-match",
						"data-navbar-active"
					])) : item.children?.length ? (openBlock(), createBlock(Collapse_default, {
						key: 1,
						label: item.label,
						icon: itemIcon(item),
						defaultOpen: !__props.collapsed,
						class: normalizeClass({
							"cu-navbar-item--match": __props.highlightTarget === item,
							"cu-navbar-item--active": __props.activeItem === item
						}),
						"data-navbar-match": __props.highlightTarget === item ? "" : void 0,
						"data-navbar-active": __props.activeItem === item ? "" : void 0
					}, {
						default: withCtx(() => [createVNode(_component_NavbarList, {
							items: item.children,
							search: false,
							"search-mode": props.searchMode,
							"search-fields": props.searchFields,
							compact: __props.compact,
							collapsed: __props.collapsed,
							"active-path": props.activePath,
							"highlight-target": __props.highlightTarget,
							"active-item": __props.activeItem
						}, null, 8, [
							"items",
							"search-mode",
							"search-fields",
							"compact",
							"collapsed",
							"active-path",
							"highlight-target",
							"active-item"
						])]),
						_: 2
					}, 1032, [
						"label",
						"icon",
						"defaultOpen",
						"class",
						"data-navbar-match",
						"data-navbar-active"
					])) : (openBlock(), createBlock(Button_default, {
						key: 2,
						to: item.path,
						color: __props.activeItem === item ? "primary" : void 0,
						variant: __props.activeItem === item ? "soft" : void 0,
						title: __props.compact && !item.icon ? item.label : void 0,
						class: normalizeClass({
							"cu-navbar-item--match": __props.highlightTarget === item,
							"cu-navbar-item--active": __props.activeItem === item
						}),
						"data-navbar-match": __props.highlightTarget === item ? "" : void 0,
						"data-navbar-active": __props.activeItem === item ? "" : void 0
					}, {
						default: withCtx(() => [itemIcon(item) ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-navbar-icon",
							innerHTML: itemIcon(item)
						}, null, 8, _hoisted_6)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7, toDisplayString(item.label), 1)]),
						_: 2
					}, 1032, [
						"to",
						"color",
						"variant",
						"title",
						"class",
						"data-navbar-match",
						"data-navbar-active"
					]))], 64);
				}), 128)),
				__props.search && __props.searchMode === "filter" && query.value && __props.items.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, " Sin resultados ")) : createCommentVNode("v-if", true)
			], 2);
		};
	}
}), [["styles", ["\n.cu-navbar[data-v-e607ecd8] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  padding: var(--cu-space-2xs);\n}\n.cu-navbar[data-v-e607ecd8] .cu-button {\n  justify-content: flex-start;\n  text-align: left;\n  width: 100%;\n  padding: var(--cu-space-sm) var(--cu-space-md);\n}\n\n/* La row completa del item es hovereable: el trigger del Collapse y los items\n   ocupan todo el ancho del contenedor (no solo el texto). */\n.cu-navbar[data-v-e607ecd8] .cu-collapse-trigger {\n  width: 100%;\n}\n.cu-navbar[data-v-e607ecd8] .cu-dropdown {\n  width: 100%;\n}\n.cu-navbar-header[data-v-e607ecd8] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  margin-bottom: var(--cu-space-xs);\n}\n.cu-navbar-search-input[data-v-e607ecd8] {\n  flex: 1;\n  min-width: 0;\n}\n.cu-navbar-compact-toggle[data-v-e607ecd8] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  width: 2rem;\n  height: 2rem;\n  background: transparent;\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  cursor: pointer;\n  font-size: var(--cu-font-size-sm);\n  line-height: 1;\n  color: var(--cu-color-neutral);\n}\n.cu-navbar-compact-toggle[data-v-e607ecd8]:hover {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-navbar[data-v-e607ecd8] .cu-collapse-content {\n  margin-top: var(--cu-space-xs);\n}\n.cu-navbar-icon[data-v-e607ecd8] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  width: 1.25rem;\n  font-size: var(--cu-font-size-sm);\n  line-height: 1;\n}\n.cu-navbar-label[data-v-e607ecd8] {\n  min-width: 0;\n}\n\n/* Highlight del modo scroll (clase duplicada → 0,3,0 para pisar el ghost) */\n.cu-navbar[data-v-e607ecd8] .cu-navbar-item--match.cu-navbar-item--match {\n  background-color: var(--cu-color-primary-soft);\n}\n.cu-navbar[data-v-e607ecd8] .cu-collapse.cu-navbar-item--match.cu-navbar-item--match > .cu-collapse-trigger {\n  background-color: var(--cu-color-primary-soft);\n}\n.cu-navbar-empty[data-v-e607ecd8] {\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-subtle, 0.6);\n}\n\n/* Compact: solo iconos (o la inicial), sin labels */\n.cu-navbar--compact[data-v-e607ecd8] {\n  width: fit-content;\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-button {\n  justify-content: center;\n  padding: var(--cu-space-sm);\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-collapse-trigger {\n  justify-content: center;\n  padding: var(--cu-space-sm);\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-navbar-label {\n  display: none;\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-collapse-label {\n  display: none;\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-collapse-content {\n  padding-left: var(--cu-space-sm);\n}\n.cu-navbar--compact[data-v-e607ecd8] .cu-navbar-icon {\n  width: auto;\n}\n\n/* Trigger de submenú en modo compact: icono centrado + chevron a la derecha\n   que abre un flyout (Dropdown) con NavbarMenu adentro */\n.cu-navbar-compact-trigger[data-v-e607ecd8] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  padding: var(--cu-space-sm);\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral);\n  border-radius: var(--cu-radius-sm);\n  transition: background-color 150ms ease;\n}\n.cu-navbar-compact-trigger[data-v-e607ecd8]:hover {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-navbar-compact-chevron[data-v-e607ecd8] {\n  position: absolute;\n  right: var(--cu-space-2xs);\n  flex-shrink: 0;\n  opacity: 0.65;\n}\n"]], ["__scopeId", "data-v-e607ecd8"]]);
//#endregion
//#region src/utils/search.ts
var ACCENT_RE = /[\u0300-\u0302\u0304-\u036f]/g;
function normalizeText(s, caseSensitive = false) {
	const normalized = s.normalize("NFD").replace(ACCENT_RE, "");
	return caseSensitive ? normalized : normalized.toLowerCase();
}
function matchesQuery(text, q, opts = {}) {
	const { mode = "includes", trim = false, caseSensitive = false } = opts;
	if (text == null) return false;
	const query = trim ? q.trim() : q;
	if (!query) return false;
	const value = normalizeText(String(text), caseSensitive);
	const needle = normalizeText(query, caseSensitive);
	return mode === "startsWith" ? value.startsWith(needle) : value.includes(needle);
}
function matchesFields(item, q, opts = {}) {
	const { fields, excludeKeys = [], getValue, ...match } = opts;
	if (typeof item !== "object" || item === null) return false;
	return (fields?.length ? fields : Object.keys(item).filter((k) => !excludeKeys.includes(k))).some((key) => matchesQuery(getValue ? getValue(item, key) : item[key], q, match));
}
//#endregion
//#region src/composables/useNavbar.ts
/**
* Lógica compartida entre las navs vertical (Collapse) y horizontal (Dropdown):
* búsqueda (filter/scroll), item activo por ruta, resaltado y scroll automático.
*/
function useNavbar(options) {
	let route = null;
	try {
		route = useRoute();
	} catch {
		route = null;
	}
	const query = ref("");
	const navRef = ref(null);
	watch(query, (value) => options.onSearch?.(value));
	const normalizedQuery = computed(() => normalizeText(query.value.trim()));
	const searchActive = computed(() => options.search() && normalizedQuery.value.length > 0);
	function itemMatches(item, q) {
		return matchesFields(item, q, { fields: options.searchFields().length ? options.searchFields() : Object.keys(item).filter((k) => {
			if (k === "children") return false;
			return typeof item[k] !== "function";
		}) });
	}
	function filterTree(items, q) {
		const out = [];
		for (const item of items) if (itemMatches(item, q)) out.push(item);
		else if (item.children?.length) {
			const kids = filterTree(item.children, q);
			if (kids.length) out.push({
				...item,
				children: kids
			});
		}
		return out;
	}
	const displayItems = computed(() => {
		if (!searchActive.value || options.searchMode() !== "filter") return options.items();
		return filterTree(options.items(), normalizedQuery.value);
	});
	const firstMatch = computed(() => {
		if (!options.search() || options.searchMode() !== "scroll") return null;
		const q = normalizedQuery.value;
		if (!q) return null;
		const dfs = (items) => {
			for (const item of items) {
				if (itemMatches(item, q)) return item;
				if (item.children?.length) {
					const found = dfs(item.children);
					if (found) return found;
				}
			}
			return null;
		};
		return dfs(options.items());
	});
	const highlightTarget = computed(() => options.highlightItem?.() ?? firstMatch.value);
	const activeItem = computed(() => {
		const currentPath = options.activePath?.() ?? route?.path;
		if (currentPath == null) return null;
		const findActive = (items) => {
			for (const item of items) {
				if (item.path === currentPath) return item;
				if (item.children?.length) {
					const found = findActive(item.children);
					if (found) return found;
				}
			}
			return null;
		};
		return findActive(options.items());
	});
	function scrollToActive() {
		nextTick(() => {
			const el = document.querySelector("[data-navbar-active]");
			if (!el) return;
			let parent = el.parentElement;
			let scrollContainer = null;
			while (parent) {
				const overflow = getComputedStyle(parent).overflow;
				if (overflow === "auto" || overflow === "scroll") {
					scrollContainer = parent;
					break;
				}
				parent = parent.parentElement;
			}
			if (!scrollContainer) {
				el.scrollIntoView({
					block: "center",
					inline: "center",
					behavior: "smooth"
				});
				return;
			}
			const containerRect = scrollContainer.getBoundingClientRect();
			const elRect = el.getBoundingClientRect();
			const centerOffset = elRect.top - containerRect.top + scrollContainer.scrollTop - containerRect.height / 2 + elRect.height / 2;
			scrollContainer.scrollTo({
				top: centerOffset,
				behavior: "smooth"
			});
		});
	}
	watch(activeItem, (item) => {
		if (item) scrollToActive();
	});
	watch(firstMatch, async (item) => {
		if (!item) return;
		await nextTick();
		document.querySelector("[data-navbar-match]")?.scrollIntoView({ block: "nearest" });
	});
	onMounted(() => {
		if (activeItem.value) scrollToActive();
	});
	return {
		query,
		navRef,
		displayItems,
		highlightTarget,
		activeItem
	};
}
//#endregion
//#region src/components/navigation/Navbar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-expanded"];
//#endregion
//#region src/components/navigation/Navbar.vue
var Navbar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Navbar",
	props: {
		items: {
			type: Array,
			required: true
		},
		search: {
			type: Boolean,
			required: false,
			default: false
		},
		searchPlaceholder: {
			type: String,
			required: false,
			default: "Buscar..."
		},
		searchMode: {
			type: String,
			required: false,
			default: "filter",
			validator: isNavbarSearchMode
		},
		searchFields: {
			type: Array,
			required: false,
			default: () => []
		},
		compact: {
			type: Boolean,
			required: false,
			default: false
		},
		compactable: {
			type: Boolean,
			required: false,
			default: false
		},
		collapsed: {
			type: Boolean,
			required: false,
			default: false
		},
		trigger: {
			type: String,
			required: false,
			default: "click"
		},
		responsive: {
			type: Boolean,
			required: false,
			default: false
		},
		responsiveMode: {
			type: String,
			required: false,
			default: "auto",
			validator: isNavbarResponsiveMode
		},
		sideOverPosition: {
			type: String,
			required: false,
			default: "left",
			validator: isPosition
		},
		activePath: {
			type: String,
			required: false,
			default: ""
		},
		highlightItem: {
			type: Object,
			required: false,
			default: null
		}
	},
	emits: ["search"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { query, displayItems, highlightTarget, activeItem } = useNavbar({
			items: () => props.items,
			search: () => props.search,
			searchMode: () => props.searchMode,
			searchFields: () => props.searchFields,
			activePath: () => props.activePath || void 0,
			highlightItem: () => props.highlightItem,
			onSearch: (q) => emit("search", q)
		});
		const localCompact = ref(props.compact);
		function toggleCompact() {
			localCompact.value = !localCompact.value;
		}
		const effectiveCompact = computed(() => props.compactable ? localCompact.value : props.compact);
		const open = ref(false);
		const isTiny = ref(false);
		let mqTiny = null;
		function onChangeTiny(e) {
			isTiny.value = e.matches;
		}
		onMounted(() => {
			if (!props.responsive) return;
			mqTiny = window.matchMedia("(max-width: 480px)");
			isTiny.value = mqTiny.matches;
			mqTiny.addEventListener("change", onChangeTiny);
		});
		onUnmounted(() => {
			mqTiny?.removeEventListener("change", onChangeTiny);
		});
		const sideOverFullscreen = computed(() => props.responsiveMode === "fullscreen" || props.responsiveMode === "auto" && isTiny.value);
		let route = null;
		try {
			route = useRoute();
		} catch {
			route = null;
		}
		watch(() => route?.path, () => {
			open.value = false;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(["cu-navbar-responsive", { "is-responsive": __props.responsive }]) }, [
				__props.responsive ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					class: "cu-navbar-responsive-toggle",
					"aria-expanded": open.value,
					"aria-label": "Abrir menú",
					onClick: _cache[0] || (_cache[0] = ($event) => open.value = true)
				}, " ☰ ", 8, _hoisted_1)) : createCommentVNode("v-if", true),
				__props.responsive ? (openBlock(), createBlock(SideOver_default, {
					key: 1,
					"model-value": open.value,
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => open.value = $event),
					position: props.sideOverPosition,
					size: "264px",
					fullscreen: sideOverFullscreen.value
				}, {
					default: withCtx(() => [createVNode(NavbarList_default, {
						items: unref(displayItems),
						search: props.search,
						"search-placeholder": props.searchPlaceholder,
						"search-mode": props.searchMode,
						"search-fields": props.searchFields,
						compact: effectiveCompact.value,
						compactable: props.compactable,
						collapsed: props.collapsed,
						trigger: props.trigger,
						"active-path": props.activePath,
						"highlight-target": unref(highlightTarget),
						"active-item": unref(activeItem),
						query: unref(query),
						"onUpdate:query": _cache[1] || (_cache[1] = ($event) => isRef(query) ? query.value = $event : null),
						onToggleCompact: toggleCompact
					}, null, 8, [
						"items",
						"search",
						"search-placeholder",
						"search-mode",
						"search-fields",
						"compact",
						"compactable",
						"collapsed",
						"trigger",
						"active-path",
						"highlight-target",
						"active-item",
						"query"
					])]),
					_: 1
				}, 8, [
					"model-value",
					"position",
					"fullscreen"
				])) : createCommentVNode("v-if", true),
				!__props.responsive ? (openBlock(), createBlock(NavbarList_default, {
					key: 2,
					items: unref(displayItems),
					search: props.search,
					"search-placeholder": props.searchPlaceholder,
					"search-mode": props.searchMode,
					"search-fields": props.searchFields,
					compact: effectiveCompact.value,
					compactable: props.compactable,
					collapsed: props.collapsed,
					trigger: props.trigger,
					"active-path": props.activePath,
					"highlight-target": unref(highlightTarget),
					"active-item": unref(activeItem),
					query: unref(query),
					"onUpdate:query": _cache[3] || (_cache[3] = ($event) => isRef(query) ? query.value = $event : null),
					onToggleCompact: toggleCompact
				}, null, 8, [
					"items",
					"search",
					"search-placeholder",
					"search-mode",
					"search-fields",
					"compact",
					"compactable",
					"collapsed",
					"trigger",
					"active-path",
					"highlight-target",
					"active-item",
					"query"
				])) : createCommentVNode("v-if", true)
			], 2);
		};
	}
}), [["styles", ["\n.cu-navbar-responsive[data-v-fd188859] {\n  display: contents;\n}\n.cu-navbar-responsive.is-responsive[data-v-fd188859] {\n  display: block;\n  position: relative;\n}\n.cu-navbar-responsive-toggle[data-v-fd188859] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 2.25rem;\n  height: 2.25rem;\n  margin-bottom: var(--cu-space-xs);\n  background: transparent;\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  cursor: pointer;\n  font-size: 1.1rem;\n  line-height: 1;\n  color: var(--cu-color-neutral);\n}\n.cu-navbar-responsive-toggle[data-v-fd188859]:hover {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n"]], ["__scopeId", "data-v-fd188859"]]);
//#endregion
//#region src/lib/navigation/navbar.ts
var CuNavbar = defineComegenElement("cu-navbar", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Navbar.ce",
	props: {
		/** Estructura de navegación. **Se asigna como propiedad JS** */
		items: {
			type: Array,
			required: true
		},
		/** Muestra el input de búsqueda */
		search: {
			type: Boolean,
			default: false
		},
		/** Placeholder del input de búsqueda */
		searchPlaceholder: {
			type: String,
			default: "Buscar..."
		},
		/** `filter` (oculta los que no matchean) o `scroll` (resalta y hace scroll al primero que matchea) */
		searchMode: {
			type: String,
			default: "filter"
		},
		/** Campos del item a buscar. **Se asigna como propiedad JS.** Vacío = busca en todos los campos string */
		searchFields: {
			type: Array,
			default: () => []
		},
		/** Modo compacto: muestra solo iconos (o la inicial del label) */
		compact: {
			type: Boolean,
			default: false
		},
		/** Agrega un botón nativo que alterna el modo compacto */
		compactable: {
			type: Boolean,
			default: false
		},
		/** Los submenús arrancan colapsados en lugar de expandidos */
		collapsed: {
			type: Boolean,
			default: false
		},
		/** Cómo abren los submenús en modo compact (flyout): `click` o `hover` */
		trigger: {
			type: String,
			default: "click"
		},
		/** En lugar de la nav inline, muestra una hamburguesa que abre el menú en un panel lateral */
		responsive: {
			type: Boolean,
			default: false
		},
		/** `auto` (fullscreen en pantallas muy chicas, lateral en el resto), `side` (siempre lateral) o `fullscreen` (siempre pantalla completa) */
		responsiveMode: {
			type: String,
			default: "auto"
		},
		/** Borde desde donde desliza el panel del responsive: `left`, `right`, `top`, `bottom` */
		sideOverPosition: {
			type: String,
			default: "left"
		},
		/** Path activo manual. Si se omite, se toma de la ruta (cuando hay router) */
		activePath: {
			type: String,
			default: ""
		}
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
			return openBlock(), createBlock(Navbar_default, {
				items: props.items,
				search: props.search,
				"search-placeholder": props.searchPlaceholder,
				"search-mode": props.searchMode,
				"search-fields": props.searchFields,
				compact: props.compact,
				compactable: props.compactable,
				collapsed: props.collapsed,
				trigger: props.trigger,
				responsive: props.responsive,
				"responsive-mode": props.responsiveMode,
				"side-over-position": props.sideOverPosition,
				"active-path": props.activePath,
				onSearch: _cache[0] || (_cache[0] = ($event) => ceEmit("search", $event))
			}, null, 8, [
				"items",
				"search",
				"search-placeholder",
				"search-mode",
				"search-fields",
				"compact",
				"compactable",
				"collapsed",
				"trigger",
				"responsive",
				"responsive-mode",
				"side-over-position",
				"active-path"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuNavbar as default };
