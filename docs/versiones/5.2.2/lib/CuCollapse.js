/*! comegenui v5.2.2 · CuCollapse (cu-collapse) · esm-shared · Vue externo (bare import) */
import { Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, openBlock, ref, renderSlot, toDisplayString, vShow, watch, withCtx, withDirectives } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.2",
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
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$2);
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
oneOf(VARIANTS);
var isVariantFull = oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
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
oneOf(DATE_MODES);
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
var _hoisted_1$1 = ["href", "target"];
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
			], 14, _hoisted_2$1)], 10, _hoisted_1$1)) : (openBlock(), createElementBlock("button", {
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
//#region src/components/overlay/Collapse.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "cu-collapse" };
var _hoisted_2 = ["innerHTML"];
var _hoisted_3 = { class: "cu-collapse-text" };
var _hoisted_4 = { class: "cu-collapse-label" };
var _hoisted_5 = {
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
			return openBlock(), createElementBlock("div", _hoisted_1, [createVNode(Button_default, {
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
					}, null, 8, _hoisted_2)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3, [createElementVNode("span", _hoisted_4, toDisplayString(props.label), 1), props.description ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString(props.description), 1)) : createCommentVNode("v-if", true)])
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
//#region src/lib/overlay/collapse.ts
var CuCollapse = defineComegenElement("cu-collapse", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Collapse.ce",
	props: {
		/** Texto del trigger */
		label: {
			type: String,
			required: true
		},
		/** Ícono del trigger (SVG/HTML) */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		/** Texto secundario que se muestra bajo el label en el trigger */
		description: {
			type: String,
			required: false,
			default: ""
		},
		defaultOpen: {
			type: Boolean,
			default: false
		},
		/** Deshabilita el trigger: no responde al click del usuario */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Color semántico del trigger: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const collapseRef = ref(null);
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
		/** Abre el collapse */
		function open() {
			collapseRef.value?.open();
		}
		/** Cierra el collapse */
		function close() {
			collapseRef.value?.close();
		}
		/** Alterna el estado */
		function toggle() {
			collapseRef.value?.toggle();
		}
		/** Devuelve el estado actual (`boolean`) */
		function isOpen() {
			return collapseRef.value?.isOpen() ?? false;
		}
		__expose({
			open,
			close,
			toggle,
			isOpen
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Collapse_default, {
				ref_key: "collapseRef",
				ref: collapseRef,
				label: props.label,
				icon: props.icon,
				description: props.description,
				"default-open": props.defaultOpen,
				disabled: props.disabled,
				color: props.color,
				onToggle: _cache[0] || (_cache[0] = ($event) => ceEmit("toggle", $event))
			}, {
				default: withCtx(() => [createCommentVNode(" Contenido colapsable "), renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"label",
				"icon",
				"description",
				"default-open",
				"disabled",
				"color"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuCollapse as default };
