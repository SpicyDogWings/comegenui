/*! comegenui v5.2.1 · CuPagination (cu-pagination) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, toDisplayString, useModel, watch, withCtx } from "vue";
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
var isColor = oneOf(COLORS);
oneOf(COLORS_BASE);
oneOf(VARIANTS);
var isVariantFull = oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
var isFieldVariant = oneOf(VARIANTS_FIELD);
var isFieldVariantNone = oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
var isAlign = oneOf(ALIGNS);
var isTextAlign = oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
oneOf(LABEL_POSITIONS);
var isTarget = oneOf(TARGETS);
oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
oneOf(ORIENTATIONS);
oneOf(DIVIDER_VARIANTS);
oneOf(SKELETON_SHAPES);
oneOf(SKELETON_ANIMATIONS);
oneOf(SKELETON_RADII);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
var isSelectSearchMode = oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$7);
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
var _hoisted_1$6 = ["href", "target"];
var _hoisted_2$4 = ["type", "disabled"];
var _hoisted_3$3 = ["type", "disabled"];
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
			], 14, _hoisted_2$4)], 10, _hoisted_1$6)) : (openBlock(), createElementBlock("button", {
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
			], 14, _hoisted_3$3));
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
//#region src/utils/textAlign.ts
/** `text-align` → `justify-content` del bloque de contenido (ícono + label). */
var TEXT_ALIGN_JUSTIFY = {
	left: "flex-start",
	center: "center",
	right: "flex-end"
};
/**
* Estilo para un item flex alineable: `justify-content` ubica el bloque de contenido
* (con ícono incluido, sin descentrarlo) y `text-align` alinea el texto cuando el label
* ocupa más de una línea.
*/
function textAlignStyle(textAlign) {
	return {
		justifyContent: TEXT_ALIGN_JUSTIFY[textAlign],
		textAlign
	};
}
//#endregion
//#region src/components/information/Loader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "cu-loader" };
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
			return openBlock(), createElementBlock("div", _hoisted_1$5, [createElementVNode("div", {
				class: normalizeClass(["cu-loader-bar", `cu-loader-bar--${props.animation}`]),
				style: normalizeStyle(loaderStyles.value)
			}, null, 6)]);
		};
	}
}), [["styles", ["\n.cu-loader[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  overflow: hidden;\n  height: 3px;\n}\n.cu-loader-bar[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  background: var(--cu-loader-color);\n}\n.cu-loader-bar--loading[data-v-045244b1] {\n  width: 60%;\n  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);\n  animation: cu-loader-slide-045244b1 1.5s ease-in-out infinite;\n}\n.cu-loader-bar--cooldown[data-v-045244b1] {\n  left: 0;\n  width: 100%;\n  animation: cu-loader-cooldown-045244b1 var(--cu-loader-delay) linear forwards;\n}\n@keyframes cu-loader-slide-045244b1 {\n0% { left: -100%;\n}\n50% { left: 0%;\n}\n100% { left: 100%;\n}\n}\n@keyframes cu-loader-cooldown-045244b1 {\nfrom { width: 100%;\n}\nto { width: 0%;\n}\n}\n"]], ["__scopeId", "data-v-045244b1"]]);
//#endregion
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = ["role"];
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
		const autoFixed = ref(false);
		const fixedMode = computed(() => props.fixed || autoFixed.value);
		const panelStyle = computed(() => {
			const base = {
				backgroundColor: "var(--cu-popover-bg, var(--cu-color-surface))",
				minWidth: "var(--cu-popover-min-width, 200px)",
				maxWidth: "var(--cu-popover-max-width, 80vw)"
			};
			if (fixedMode.value) return {
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
		const panelEl = ref(null);
		let closedByOutsideClick = false;
		function onDocumentClick(e) {
			if (!isOpen.value || !popoverRef.value) return;
			if (!(e instanceof MouseEvent)) return;
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
			if (!fixedMode.value || !popoverRef.value) return;
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
			if (autoFixed.value && !props.panelWidth) style.width = `${r.width}px`;
			panelPos.value = style;
		}
		function onViewportChange() {
			if (isOpen.value && fixedMode.value) positionPanel();
		}
		function anchorsFixedDescendants(cs) {
			const notNone = (v) => !!v && v !== "none";
			return notNone(cs.transform) || notNone(cs.filter) || notNone(cs.perspective) || notNone(cs.backdropFilter) || !!cs.contain && /paint|layout|strict|content/.test(cs.contain) || !!cs.willChange && /transform|filter|perspective/.test(cs.willChange);
		}
		function clipsDescendants(cs) {
			return !!cs.overflow && cs.overflow !== "visible";
		}
		function isClippedByAncestor(panel, anchor) {
			const pr = panel.getBoundingClientRect();
			if (!pr.width && !pr.height) return false;
			let el = flatParent(anchor);
			while (el) {
				const cs = getComputedStyle(el);
				if (anchorsFixedDescendants(cs)) return false;
				if (clipsDescendants(cs)) {
					const r = el.getBoundingClientRect();
					if (pr.top < r.top || pr.left < r.left || pr.bottom > r.bottom || pr.right > r.right) return true;
				}
				el = flatParent(el);
			}
			return false;
		}
		function flatParent(el) {
			const slotted = el.assignedSlot;
			if (slotted) return slotted;
			if (el.parentElement) return el.parentElement;
			return el.getRootNode().host ?? null;
		}
		async function autoFixIfClipped() {
			await nextTick();
			const panel = panelEl.value;
			const anchor = popoverRef.value;
			if (!panel || !anchor || !isOpen.value || props.fixed) return;
			if (!isClippedByAncestor(panel, anchor)) return;
			autoFixed.value = true;
			positionPanel();
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
			autoFixed.value = false;
			positionPanel();
			isOpen.value = true;
			emit("open");
			if (props.hover) registerHoverOpen();
			if (!props.fixed) autoFixIfClipped();
		}
		function close() {
			if (!isOpen.value) return;
			isOpen.value = false;
			autoFixed.value = false;
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
				ref_key: "panelEl",
				ref: panelEl,
				style: normalizeStyle(panelStyle.value),
				class: normalizeClass(["cu-popover-panel", __props.panelClass]),
				role: __props.role || void 0
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1$4)) : createCommentVNode("v-if", true)], 544);
		};
	}
}), [["styles", ["\n.cu-popover[data-v-50458841] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.cu-popover-panel[data-v-50458841] {\n  padding: var(--cu-space-sm);\n  border-radius: var(--cu-radius-md);\n  font-family: var(--cu-font-sans);\n  box-shadow: var(--cu-shadow-xl);\n}\n"]], ["__scopeId", "data-v-50458841"]]);
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
//#region src/components/overlay/Dropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = ["onClick"];
var _hoisted_2$3 = ["innerHTML"];
var _hoisted_3$2 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_4$1 = {
	key: 0,
	class: "cu-dropdown-menu-divider"
};
var _hoisted_5$1 = ["href", "onClick"];
var _hoisted_6$1 = ["innerHTML"];
var _hoisted_7 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_8 = ["disabled", "onClick"];
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
					}, null, 8, _hoisted_2$3)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$2, toDisplayString(__props.label || "Submenú"), 1),
					createVNode(LucideChevronRight_default, {
						width: 14,
						height: 14,
						class: "cu-dropdown-menu-item-chevron"
					})
				], 8, _hoisted_1$3)) : (openBlock(), createBlock(Button_default, {
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
						return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_4$1)) : item.to || item.href ? (openBlock(), createElementBlock("a", {
							key: 1,
							href: item.to || item.href,
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_6$1)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7, toDisplayString(item.label), 1)], 10, _hoisted_5$1)) : (openBlock(), createElementBlock("button", {
							key: 2,
							type: "button",
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							disabled: item.disabled,
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_9)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_10, toDisplayString(item.label), 1)], 10, _hoisted_8))], 64);
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
//#region src/components/icons/LucideCheck.vue
var LucideCheck_default = /* @__PURE__ */ defineComponent({
	__name: "LucideCheck",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("g", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2"
				}, [createElementVNode("path", { d: "M20 6 9 17l-5-5" })], -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/controls/MenuOption.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = { class: "cu-menu-option-main" };
var _hoisted_2$2 = ["innerHTML"];
var _hoisted_3$1 = { key: 1 };
//#endregion
//#region src/components/controls/MenuOption.vue
var MenuOption_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MenuOption",
	props: {
		/** Texto visible de la fila */
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** SVG completo inline (`<svg>...</svg>`) */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		/** Clase del ícono; cada lista conserva la suya (`cu-autocomplete-icon`, …) */
		iconClass: {
			type: String,
			required: false,
			default: "cu-menu-option-icon"
		},
		/** Color semántico del item */
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariantFull
		},
		/** Item deshabilitado (no clickeable, atenuado) */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Si se especifica, la fila se renderiza como link (`<a>`) */
		href: {
			type: String,
			required: false,
			default: ""
		},
		/** Target del link cuando hay `href`: `_self`, `_blank`, `_parent`, `_top` */
		target: {
			type: String,
			required: false,
			default: "_self",
			validator: isTarget
		},
		/** Muestra el check de lucide al final de la fila */
		selected: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Button_default, {
				color: props.color,
				variant: props.variant,
				to: props.href || void 0,
				target: props.target,
				disabled: props.disabled
			}, {
				default: withCtx(() => [createElementVNode("span", _hoisted_1$2, [props.icon ? (openBlock(), createElementBlock("span", {
					key: 0,
					innerHTML: props.icon,
					class: normalizeClass(props.iconClass)
				}, null, 10, _hoisted_2$2)) : createCommentVNode("v-if", true), props.label ? (openBlock(), createElementBlock("span", _hoisted_3$1, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true)]), props.selected ? (openBlock(), createBlock(LucideCheck_default, {
					key: 0,
					class: "cu-menu-option-check",
					"aria-hidden": "true"
				})) : createCommentVNode("v-if", true)]),
				_: 1
			}, 8, [
				"color",
				"variant",
				"to",
				"target",
				"disabled"
			]);
		};
	}
}), [["styles", ["\n/* El bloque ícono + label ocupa el espacio libre de la fila, así el check queda pegado\n   al borde derecho sin importar `textAlign`; `justify-content` sigue alineando el bloque\n   dentro de ese espacio (hereda el del `Button`, que pone `textAlignStyle`). */\n.cu-menu-option-main[data-v-2382681b] {\n  display: flex;\n  align-items: center;\n  justify-content: inherit;\n  gap: inherit;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.cu-menu-option-check[data-v-2382681b] {\n  flex-shrink: 0;\n}\n"]], ["__scopeId", "data-v-2382681b"]]);
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
//#endregion
//#region src/components/form/Select.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = {
	key: 1,
	class: "cu-select-options"
};
var _hoisted_2$1 = {
	key: 2,
	class: "cu-select-empty"
};
//#endregion
//#region src/components/form/Select.vue
var Select_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Select",
	props: {
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
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** No abre el dropdown ni cambia la selección; el control sigue enfocable. */
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		placeholder: {
			type: String,
			required: false,
			default: ""
		},
		placeholderWrap: {
			type: Boolean,
			required: false,
			default: false
		},
		position: {
			type: String,
			required: false,
			default: "bottom"
		},
		align: {
			type: String,
			required: false,
			default: "start"
		},
		/**
		* Alineación del texto: el label del trigger (placeholder o selección) y las opciones del
		* panel. `left` (default), `center`, `right`.
		*/
		textAlign: {
			type: String,
			required: false,
			default: "left",
			validator: isTextAlign
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		modelValue: {
			type: String,
			required: false,
			default: ""
		},
		options: {
			type: Array,
			required: false,
			default: () => []
		},
		searchEnabled: {
			type: Boolean,
			required: false,
			default: false
		},
		searchMode: {
			type: String,
			required: false,
			default: "startsWith",
			validator: isSelectSearchMode
		},
		searchResetDelay: {
			type: Number,
			required: false,
			default: 1e3
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldownVariant: {
			type: String,
			required: false,
			default: "ghost-hover"
		}
	},
	emits: [
		"update:modelValue",
		"select",
		"change",
		"close",
		"blur"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const selectedValue = ref(props.modelValue);
		const dropdownRef = ref(null);
		const selectRoot = ref(null);
		const nativeInputRef = ref(null);
		const searchText = ref("");
		const cooldownActive = ref(false);
		const cooldownKey = ref(0);
		let resetTimeout = null;
		const matchIndex = computed(() => {
			const q = searchText.value;
			if (!q) return -1;
			return props.options.findIndex((o) => !o.disabled && matchesQuery(o.label, q, { mode: props.searchMode }));
		});
		function scheduleReset() {
			if (resetTimeout) clearTimeout(resetTimeout);
			cooldownActive.value = true;
			resetTimeout = setTimeout(() => {
				searchText.value = "";
				cooldownActive.value = false;
			}, props.searchResetDelay);
		}
		function onKeyDown(e) {
			if (props.readOnly || !props.searchEnabled) return;
			if (e.key === "Escape" || e.key === "Tab") return;
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				searchText.value += e.key;
				cooldownKey.value++;
				scheduleReset();
				if (matchIndex.value >= 0) nextTick(() => scrollToMatch(matchIndex.value));
			} else if (e.key === "Backspace") {
				e.preventDefault();
				searchText.value = searchText.value.slice(0, -1);
				cooldownKey.value++;
				scheduleReset();
			}
		}
		function scrollToMatch(index) {
			const optionsEl = selectRoot.value?.querySelector(".cu-select-options");
			if (!optionsEl) return;
			const optionEl = optionsEl.children[index];
			if (optionEl) optionEl.scrollIntoView({ block: "nearest" });
		}
		function onDropdownOpen() {
			if (props.searchEnabled) {
				searchText.value = "";
				nextTick(() => {
					const input = nativeInputRef.value;
					if (input) {
						input.addEventListener("keydown", onKeyDown);
						input.focus();
					}
				});
			}
		}
		function onDropdownClose() {
			if (props.searchEnabled) {
				const input = nativeInputRef.value;
				if (input) input.removeEventListener("keydown", onKeyDown);
			}
		}
		watch(() => dropdownRef.value?.isOpen(), (open) => {
			if (open) onDropdownOpen();
			else onDropdownClose();
		});
		watch(() => props.readOnly, (value) => {
			if (value) dropdownRef.value?.close();
		});
		const selectedLabel = computed(() => {
			const opt = props.options.find((o) => o.value === selectedValue.value);
			return opt ? opt.label : props.placeholder || "Seleccionar...";
		});
		watch(() => props.modelValue, (val) => {
			selectedValue.value = val;
		}, { immediate: true });
		function onSelect(option) {
			if (props.readOnly || option.disabled) return;
			selectedValue.value = option.value;
			emit("update:modelValue", option.value);
			emit("select", option);
			emit("change", option.value);
			dropdownRef.value?.close();
		}
		const optionStyle = computed(() => textAlignStyle(props.textAlign));
		/** El label del trigger alinea su texto dentro del espacio que deja el chevron. */
		const labelStyle = computed(() => ({ textAlign: props.textAlign }));
		/** Devuelve el valor seleccionado. */
		function get() {
			return selectedValue.value;
		}
		/** Setea el valor seleccionado y emite `change`. */
		function set(value) {
			selectedValue.value = value;
			emit("change", value);
		}
		/** Limpia la selección y emite `change`. */
		function reset() {
			selectedValue.value = "";
			emit("change", "");
		}
		/** Enfoca el trigger del select. */
		function focus() {
			selectRoot.value?.querySelector(".cu-select-toggle")?.focus();
		}
		function onFocusOut(e) {
			if (!selectRoot.value?.contains(e.relatedTarget)) emit("blur");
		}
		__expose({
			get,
			set,
			reset,
			focus,
			/** Indica si el panel está abierto. */
			isOpen: () => dropdownRef.value?.isOpen() ?? false,
			/** Devuelve la opción seleccionada o null. */
			selectedItem: () => props.options.find((o) => o.value === selectedValue.value) || null
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "selectRoot",
				ref: selectRoot,
				class: normalizeClass(["cu-select", { "cu-select--readonly": __props.readOnly }]),
				tabindex: "-1",
				onFocusout: onFocusOut
			}, [createVNode(Dropdown_default, {
				ref_key: "dropdownRef",
				ref: dropdownRef,
				color: __props.color,
				disabled: __props.disabled || __props.readOnly,
				position: __props.position,
				align: __props.align,
				fixed: __props.fixed,
				offset: 4,
				loading: __props.loading,
				cooldown: cooldownActive.value,
				"cooldown-key": cooldownKey.value,
				"cooldown-variant": __props.cooldownVariant,
				delay: __props.searchResetDelay,
				onClose: _cache[0] || (_cache[0] = ($event) => emit("close"))
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [createVNode(Button_default, {
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					"aria-readonly": __props.readOnly ? "true" : void 0,
					class: "cu-select-toggle",
					onClick: toggle
				}, {
					default: withCtx(() => [createElementVNode("span", {
						class: normalizeClass(["cu-select-label", { "cu-select-label--wrap": __props.placeholderWrap }]),
						style: normalizeStyle(labelStyle.value)
					}, toDisplayString(selectedLabel.value), 7), (openBlock(), createElementBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						class: normalizeClass(["cu-select-chevron", { "cu-select-chevron--open": isOpen }])
					}, [..._cache[1] || (_cache[1] = [createElementVNode("path", { d: "m6 9 6 6 6-6" }, null, -1)])], 2))]),
					_: 2
				}, 1032, [
					"color",
					"variant",
					"disabled",
					"aria-readonly",
					"onClick"
				])]),
				default: withCtx(() => [__props.searchEnabled ? (openBlock(), createElementBlock("input", {
					key: 0,
					ref_key: "nativeInputRef",
					ref: nativeInputRef,
					type: "text",
					class: "cu-select-hidden-input cu-input cu-input--ghost",
					tabindex: "-1",
					autocomplete: "off"
				}, null, 512)) : createCommentVNode("v-if", true), __props.options.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (opt, i) => {
					return openBlock(), createBlock(MenuOption_default, {
						key: i,
						label: opt.label,
						color: opt.color || __props.color,
						variant: opt.variant || (opt.value === selectedValue.value ? "soft" : "ghost"),
						disabled: opt.disabled,
						selected: opt.value === selectedValue.value,
						class: normalizeClass(["cu-select-option", { "cu-select-option--disabled": opt.disabled }]),
						style: normalizeStyle(optionStyle.value),
						onClick: ($event) => onSelect(opt)
					}, null, 8, [
						"label",
						"color",
						"variant",
						"disabled",
						"selected",
						"class",
						"style",
						"onClick"
					]);
				}), 128))])) : (openBlock(), createElementBlock("div", _hoisted_2$1, " Sin opciones "))]),
				_: 1
			}, 8, [
				"color",
				"disabled",
				"position",
				"align",
				"fixed",
				"loading",
				"cooldown",
				"cooldown-key",
				"cooldown-variant",
				"delay"
			])], 34);
		};
	}
}), [["styles", ["\n.cu-select[data-v-9642187d] {\n  width: 100%;\n  outline: none;\n}\n.cu-select[data-v-9642187d] .cu-dropdown {\n  width: 100%;\n}\n.cu-select-toggle[data-v-9642187d] {\n  width: 100%;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n\n/* Anillo de focus del trigger (como .cu-input:focus) — focus() enfoca el botón\n   de verdad: visible para el usuario y para teclado */\n.cu-select-toggle[data-v-9642187d]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n.cu-select--readonly .cu-select-toggle[data-v-9642187d] {\n  cursor: default;\n}\n.cu-select-label[data-v-9642187d] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  /* Ocupa el espacio que deja el chevron: sin esto el `text-align` del label no tiene\n     ancho propio y la alineación no se ve. */\n  flex: 1 1 auto;\n}\n.cu-select-label--wrap[data-v-9642187d] {\n  white-space: normal;\n}\n.cu-select-chevron[data-v-9642187d] {\n  transition: transform 200ms ease;\n  flex-shrink: 0;\n}\n.cu-select-chevron--open[data-v-9642187d] {\n  transform: rotate(180deg);\n}\n.cu-select-options[data-v-9642187d] {\n  max-height: 240px;\n  overflow-y: auto;\n}\n.cu-select-option[data-v-9642187d] {\n  width: 100%;\n  /* La alineación la pone `textAlign` inline (`justify-content`): dentro de un `Button`\n     flex el `text-align` solo no mueve nada. Default: `flex-start`. */\n}\n.cu-select-option--disabled[data-v-9642187d] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-select-hidden-input[data-v-9642187d] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n  opacity: 0;\n}\n.cu-select-empty[data-v-9642187d]{\n  padding: var(--cu-space-md);\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  opacity: var(--cu-alpha-subtle, 0.6);\n  text-align: center;\n}\n"]], ["__scopeId", "data-v-9642187d"]]);
//#endregion
//#region src/components/controls/Pagination.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "cu-pagination"
};
var _hoisted_2 = { class: "cu-pagination-info" };
var _hoisted_3 = { class: "cu-pagination-controls" };
var _hoisted_4 = {
	key: 0,
	class: "cu-pagination-page-size"
};
var _hoisted_5 = { class: "cu-pagination-pages" };
var _hoisted_6 = {
	key: 0,
	class: "cu-pagination-ellipsis"
};
//#endregion
//#region src/components/controls/Pagination.vue
var Pagination_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Pagination",
	props: {
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isFieldVariantNone
		},
		currentPage: {
			type: Number,
			required: false,
			default: 1
		},
		totalPages: {
			type: Number,
			required: false,
			default: 1
		},
		totalItems: {
			type: Number,
			required: false,
			default: 0
		},
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		showPageSize: {
			type: Boolean,
			required: false,
			default: false
		},
		pageSizeOptions: {
			type: Array,
			required: false,
			default: () => [
				5,
				10,
				20,
				50
			]
		},
		showFirstAndLast: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["update:currentPage", "update:itemsPerPage"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const pageSizeValue = ref(String(props.itemsPerPage));
		watch(() => props.itemsPerPage, (val) => {
			pageSizeValue.value = String(val);
		});
		const pageSizeOptionsFormatted = computed(() => props.pageSizeOptions.map((opt) => ({
			value: String(opt),
			label: String(opt)
		})));
		const handlePageChange = (page) => {
			if (page >= 1 && page <= props.totalPages) emit("update:currentPage", page);
		};
		const handlePageSizeChange = (val) => {
			pageSizeValue.value = val;
			emit("update:itemsPerPage", Number(val));
			emit("update:currentPage", 1);
		};
		const startItem = computed(() => {
			return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
		});
		const endItem = computed(() => {
			return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
		});
		const visiblePages = computed(() => {
			const pages = [];
			const total = props.totalPages;
			let current = props.currentPage;
			if (total <= 7) for (let i = 1; i <= total; i++) pages.push(i);
			else {
				if (props.showFirstAndLast) {
					pages.push(1);
					if (current > 3) pages.push("...");
				}
				let midStart = current - 1;
				let midEnd = current + 1;
				if (props.showFirstAndLast) {
					midStart = Math.max(2, midStart);
					midEnd = Math.min(total - 1, midEnd);
				} else {
					midStart = Math.max(1, midStart);
					midEnd = Math.min(total, midEnd);
				}
				if (midEnd - midStart < 2) {
					if (midStart === (props.showFirstAndLast ? 2 : 1)) midEnd = midStart + 2;
					else midStart = midEnd - 2;
				}
				for (let i = midStart; i <= midEnd; i++) pages.push(i);
				if (props.showFirstAndLast) {
					if (current < total - 2) pages.push("...");
					pages.push(total);
				}
			}
			return pages;
		});
		return (_ctx, _cache) => {
			return __props.totalPages > 1 || __props.showPageSize ? (openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("span", _hoisted_2, " Mostrando " + toDisplayString(startItem.value) + " - " + toDisplayString(endItem.value) + " de " + toDisplayString(__props.totalItems), 1), createElementVNode("div", _hoisted_3, [__props.showPageSize ? (openBlock(), createElementBlock("div", _hoisted_4, [_cache[3] || (_cache[3] = createElementVNode("span", { class: "cu-pagination-label" }, "Por página:", -1)), createVNode(Select_default, {
				"model-value": pageSizeValue.value,
				options: pageSizeOptionsFormatted.value,
				color: props.color,
				style: { "width": "calc(var(--cu-space-3xl) * 2)" },
				onSelect: _cache[0] || (_cache[0] = (opt) => handlePageSizeChange(opt.value))
			}, null, 8, [
				"model-value",
				"options",
				"color"
			])])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_5, [
				createVNode(Button_default, {
					onClick: _cache[1] || (_cache[1] = ($event) => handlePageChange(__props.currentPage - 1)),
					disabled: __props.currentPage === 1,
					color: props.color,
					variant: props.variant
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode(" Anterior ", -1)])]),
					_: 1
				}, 8, [
					"disabled",
					"color",
					"variant"
				]),
				(openBlock(true), createElementBlock(Fragment, null, renderList(visiblePages.value, (page, idx) => {
					return openBlock(), createElementBlock(Fragment, { key: idx }, [page === "..." ? (openBlock(), createElementBlock("span", _hoisted_6, "...")) : (openBlock(), createBlock(Button_default, {
						key: 1,
						onClick: ($event) => handlePageChange(Number(page)),
						color: props.color,
						variant: __props.currentPage === page ? "solid" : props.variant
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(page), 1)]),
						_: 2
					}, 1032, [
						"onClick",
						"color",
						"variant"
					]))], 64);
				}), 128)),
				createVNode(Button_default, {
					onClick: _cache[2] || (_cache[2] = ($event) => handlePageChange(__props.currentPage + 1)),
					disabled: __props.currentPage === __props.totalPages,
					color: props.color,
					variant: props.variant
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Siguiente ", -1)])]),
					_: 1
				}, 8, [
					"disabled",
					"color",
					"variant"
				])
			])])])) : createCommentVNode("v-if", true);
		};
	}
}), [["styles", ["\n.cu-pagination[data-v-09434202] {\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--cu-space-md);\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n.cu-pagination-info[data-v-09434202] {\n  display: none;\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral-text);\n  font-family: var(--cu-font-sans);\n}\n@media (min-width: 768px) {\n.cu-pagination-info[data-v-09434202] {\n    display: inline;\n}\n}\n.cu-pagination-controls[data-v-09434202] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-sm);\n}\n.cu-pagination-page-size[data-v-09434202] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-pagination-label[data-v-09434202] {\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral-text);\n  font-family: var(--cu-font-sans);\n}\n.cu-pagination-pages[data-v-09434202] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n}\n.cu-pagination-ellipsis[data-v-09434202] {\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n  font-size: var(--cu-font-size-sm);\n  font-family: var(--cu-font-sans);\n}\n"]], ["__scopeId", "data-v-09434202"]]);
//#endregion
//#region src/lib/controls/pagination.ts
var CuPagination = defineComegenElement("cu-pagination", /* @__PURE__ */ defineComponent({
	__name: "Pagination.ce",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `outlined`, `soft`, `ghost`, `subtle`, `none` */
		variant: {
			type: String,
			required: false,
			default: "soft"
		},
		/** Página actual (atributo HTML: `current-page`) */
		currentPage: {
			type: Number,
			required: false,
			default: 1
		},
		/** Total de páginas (atributo HTML: `total-pages`) */
		totalPages: {
			type: Number,
			required: false,
			default: 1
		},
		/** Total de items, útil para mostrar "X–Y de Z" (atributo HTML: `total-items`) */
		totalItems: {
			type: Number,
			required: false,
			default: 0
		},
		/** Items por página (atributo HTML: `items-per-page`) */
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		/** Muestra el selector de tamaño de página (atributo HTML: `show-page-size`) */
		showPageSize: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Opciones del selector (atributo HTML: `page-size-options`) */
		pageSizeOptions: {
			type: Array,
			required: false,
			default: () => [
				5,
				10,
				20,
				50
			]
		},
		/** Muestra botones "primera" y "última" página (atributo HTML: `show-first-and-last`) */
		showFirstAndLast: {
			type: Boolean,
			required: false,
			default: false
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
			return openBlock(), createBlock(Pagination_default, {
				color: props.color,
				variant: props.variant,
				"current-page": props.currentPage,
				"total-pages": props.totalPages,
				"total-items": props.totalItems,
				"items-per-page": props.itemsPerPage,
				"show-page-size": props.showPageSize,
				"page-size-options": props.pageSizeOptions,
				"show-first-and-last": props.showFirstAndLast,
				"onUpdate:currentPage": _cache[0] || (_cache[0] = ($event) => ceEmit("update:currentPage", $event)),
				"onUpdate:itemsPerPage": _cache[1] || (_cache[1] = ($event) => ceEmit("update:itemsPerPage", $event))
			}, null, 8, [
				"color",
				"variant",
				"current-page",
				"total-pages",
				"total-items",
				"items-per-page",
				"show-page-size",
				"page-size-options",
				"show-first-and-last"
			]);
		};
	}
}));
//#endregion
export { CuPagination as default };
