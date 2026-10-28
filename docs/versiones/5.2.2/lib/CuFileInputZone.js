/*! comegenui v5.2.2 · CuFileInputZone (cu-file-input-zone) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, ref, renderList, renderSlot, shallowRef, toDisplayString, toValue, unref, useModel, useTemplateRef, vShow, watch, withCtx, withDirectives, withKeys, withModifiers } from "vue";
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
var _hoisted_2$3 = ["type", "disabled"];
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
			], 14, _hoisted_2$3)], 10, _hoisted_1$3)) : (openBlock(), createElementBlock("button", {
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
//#region src/utils/fileIcons.ts
var ICON_FILE_INNER = `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/>`;
var ICON_IMAGE_INNER = `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><circle cx="10" cy="12" r="2"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/>`;
var ICON_TEXT_INNER = `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`;
var ICON_SPREADSHEET_INNER = `<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>`;
function svgWrap(inner, size) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 opacity-60">${inner}</svg>`;
}
function getFileIconSvg(file, size = 20) {
	const ext = file.name.split(".").pop()?.toLowerCase();
	if ([
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg",
		"bmp",
		"ico",
		"avif"
	].includes(ext)) return svgWrap(ICON_IMAGE_INNER, size);
	if ([
		"pdf",
		"doc",
		"docx",
		"txt",
		"rtf",
		"odt",
		"md"
	].includes(ext)) return svgWrap(ICON_TEXT_INNER, size);
	if ([
		"xls",
		"xlsx",
		"csv",
		"ods",
		"numbers"
	].includes(ext)) return svgWrap(ICON_SPREADSHEET_INNER, size);
	return svgWrap(ICON_FILE_INNER, size);
}
function formatFileSize(bytes) {
	if (bytes === 0) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
//#endregion
//#region src/components/FileList.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = ["onClick"];
var _hoisted_2$2 = ["innerHTML"];
var _hoisted_3$2 = { class: "cu-file-list-name" };
var _hoisted_4$2 = { class: "cu-file-list-size" };
//#endregion
//#region src/components/FileList.vue
var FileList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FileList",
	props: {
		files: {
			type: null,
			required: false,
			default: null
		},
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		maxHeight: {
			type: String,
			required: false,
			default: ""
		}
	},
	emits: ["remove", "select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const listStyles = computed(() => ({
			"--list-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--list-text": `var(--cu-color-${props.color}-text)`
		}));
		const fileList = computed(() => {
			if (!props.files) return [];
			if (props.files instanceof File) return [props.files];
			if (Array.isArray(props.files)) return props.files;
			return [];
		});
		return (_ctx, _cache) => {
			return fileList.value.length > 0 ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: "cu-file-list",
				style: normalizeStyle({
					...listStyles.value,
					maxHeight: props.maxHeight || void 0,
					overflowY: props.maxHeight ? "auto" : "visible"
				})
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(fileList.value, (file, i) => {
				return openBlock(), createElementBlock("div", {
					key: i,
					class: "cu-file-list-item",
					onClick: withModifiers(($event) => emit("select", i), ["stop"])
				}, [
					createElementVNode("span", {
						innerHTML: unref(getFileIconSvg)(file),
						class: "cu-file-list-icon"
					}, null, 8, _hoisted_2$2),
					createElementVNode("span", _hoisted_3$2, toDisplayString(file.name), 1),
					createElementVNode("span", _hoisted_4$2, toDisplayString(unref(formatFileSize)(file.size)), 1),
					!props.disabled ? (openBlock(), createBlock(Button_default, {
						key: 0,
						color: __props.color,
						variant: "ghost",
						class: "cu-file-list-remove",
						onClick: withModifiers(($event) => emit("remove", i), ["stop"])
					}, {
						default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"stroke-linejoin": "round"
						}, [createElementVNode("path", { d: "M18 6 6 18" }), createElementVNode("path", { d: "m6 6 12 12" })], -1)])]),
						_: 1
					}, 8, ["color", "onClick"])) : createCommentVNode("v-if", true)
				], 8, _hoisted_1$2);
			}), 128))], 4)) : createCommentVNode("v-if", true);
		};
	}
}), [["styles", ["\n.cu-file-list {\n  width: 100%;\n}\n.cu-file-list-item {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  padding: var(--cu-space-xs) var(--cu-space-md);\n  font-size: var(--cu-font-size-sm);\n  border-radius: var(--cu-radius);\n  cursor: pointer;\n  transition: background-color 150ms ease;\n}\n.cu-file-list-item:hover {\n  background-color: var(--list-ghost-hover);\n}\n.cu-file-list-icon {\n  flex-shrink: 0;\n}\n.cu-file-list-name {\n  flex: 1;\n  min-width: 0;\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--list-text);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.cu-file-list-size {\n  flex-shrink: 0;\n  opacity: 0.8;\n  font-size: var(--cu-font-size-xs);\n  white-space: nowrap;\n  color: var(--list-text);\n}\n.cu-file-list-remove {\n  padding: var(--cu-space-2xs) !important;\n  min-width: 0 !important;\n  height: auto !important;\n  gap: 0 !important;\n  flex-shrink: 0;\n  opacity: 0.7;\n}\n.cu-file-list-remove:hover {\n  opacity: 1;\n}\n"]]]);
//#endregion
//#region src/components/information/Alert.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = {
	key: 0,
	class: "cu-alert-header"
};
var _hoisted_2$1 = { class: "cu-alert-title" };
var _hoisted_3$1 = {
	key: 0,
	class: "cu-alert-title-text"
};
var _hoisted_4$1 = { class: "cu-alert-content" };
//#endregion
//#region src/components/information/Alert.vue
var Alert_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Alert",
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
			validator: isVariant
		},
		title: {
			type: String,
			required: false
		},
		close: {
			type: Boolean,
			required: false,
			default: false
		},
		show: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: [
		"close",
		"open",
		"update:show"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const iconWrap = ref(null);
		const hasIcon = ref(false);
		function detectIcon() {
			const el = iconWrap.value;
			if (!el) return;
			const hasRealContent = (node) => {
				if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
				if (node.nodeType === Node.ELEMENT_NODE) {
					const slotEl = node;
					if (node.tagName === "SLOT") return slotEl.assignedNodes().length > 0;
					return true;
				}
				return false;
			};
			hasIcon.value = Array.from(el.childNodes).some(hasRealContent);
		}
		onMounted(() => {
			detectIcon();
		});
		watch(hasIcon, () => nextTick(detectIcon));
		const internalShow = ref(props.show);
		watch(() => props.show, (val) => {
			internalShow.value = val;
		});
		watch(internalShow, (val) => {
			emit("update:show", val);
		});
		const colorStyles = computed(() => ({
			"--alert-bg": `var(--cu-color-${props.color})`,
			"--alert-text": `var(--cu-color-${props.color}-text)`,
			"--alert-bg-hover": `var(--cu-color-${props.color}-hover)`,
			"--alert-bg-active": `var(--cu-color-${props.color}-active)`,
			"--alert-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--alert-ghost-active": `var(--cu-color-${props.color}-ghost-active)`,
			"--alert-soft": `var(--cu-color-${props.color}-soft)`,
			"--alert-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--alert-soft-active": `var(--cu-color-${props.color}-soft-active)`,
			"--alert-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--alert-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--alert-subtle-active": `var(--cu-color-${props.color}-subtle-active)`,
			"--alert-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		function open() {
			internalShow.value = true;
			emit("open");
		}
		function close() {
			internalShow.value = false;
			emit("close");
		}
		function toggle() {
			internalShow.value = !internalShow.value;
			emit(internalShow.value ? "open" : "close");
		}
		__expose({
			open,
			close,
			toggle,
			isOpen: () => internalShow.value
		});
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("div", {
				class: normalizeClass([
					"cu-alert",
					`cu-alert--${props.variant}`,
					{ "cu-alert--floating-close": props.close && !props.title && !hasIcon.value }
				]),
				style: normalizeStyle(colorStyles.value),
				role: "alert"
			}, [
				createElementVNode("span", {
					ref_key: "iconWrap",
					ref: iconWrap,
					class: "cu-alert-icon-detect"
				}, [renderSlot(_ctx.$slots, "icon", {}, void 0, true)], 512),
				props.title || hasIcon.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [createElementVNode("div", _hoisted_2$1, [renderSlot(_ctx.$slots, "icon", {}, void 0, true), props.title ? (openBlock(), createElementBlock("span", _hoisted_3$1, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true)]), props.close ? (openBlock(), createElementBlock("button", {
					key: 0,
					onClick: close,
					class: "cu-alert-close",
					"aria-label": "Cerrar alerta"
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
				}, [
					createElementVNode("path", { d: "M18 6 6 18" }),
					createTextVNode(),
					createElementVNode("path", { d: "m6 6 12 12" })
				], -1)])])) : createCommentVNode("v-if", true)])) : props.close ? (openBlock(), createElementBlock("button", {
					key: 1,
					onClick: close,
					class: "cu-alert-close cu-alert-close--floating",
					"aria-label": "Cerrar alerta"
				}, [..._cache[1] || (_cache[1] = [createElementVNode("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					width: "20",
					height: "20",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [
					createElementVNode("path", { d: "M18 6 6 18" }),
					createTextVNode(),
					createElementVNode("path", { d: "m6 6 12 12" })
				], -1)])])) : createCommentVNode("v-if", true),
				createElementVNode("div", _hoisted_4$1, [renderSlot(_ctx.$slots, "default", {}, void 0, true)])
			], 6)), [[vShow, internalShow.value]]);
		};
	}
}), [["styles", ["\n.cu-alert-icon-detect[data-v-bfdcbd99] {\n  display: none;\n}\n.cu-alert[data-v-bfdcbd99] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  box-sizing: border-box;\n  position: relative;\n}\n\n/* solid */\n.cu-alert.cu-alert--solid[data-v-bfdcbd99] {\n  background-color: var(--alert-bg);\n  color: var(--cu-color-surface);\n}\n.cu-alert.cu-alert--solid .cu-alert-title-text[data-v-bfdcbd99] {\n  color: var(--cu-color-surface);\n}\n\n/* ghost */\n.cu-alert.cu-alert--ghost[data-v-bfdcbd99] {\n  background-color: transparent;\n  color: var(--alert-text);\n}\n\n/* soft */\n.cu-alert.cu-alert--soft[data-v-bfdcbd99] {\n  background-color: var(--alert-soft);\n  color: var(--alert-text);\n}\n\n/* subtle */\n.cu-alert.cu-alert--subtle[data-v-bfdcbd99] {\n  background-color: var(--alert-subtle);\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-subtle-border);\n}\n\n/* outlined */\n.cu-alert.cu-alert--outlined[data-v-bfdcbd99] {\n  background-color: transparent;\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-bg);\n}\n\n/* dark theme override */\n[data-theme=\"dark\"] .cu-alert--ghost[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--soft[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--subtle[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--outlined[data-v-bfdcbd99] {\n  color: var(--alert-bg);\n}\n.cu-alert-header[data-v-bfdcbd99] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.cu-alert-title[data-v-bfdcbd99] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-alert-title-text[data-v-bfdcbd99] {\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: inherit;\n}\n.cu-alert-close[data-v-bfdcbd99] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: inherit;\n  padding: var(--cu-space-2xs);\n  border-radius: var(--cu-radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 150ms ease;\n}\n.cu-alert-close[data-v-bfdcbd99]:hover {\n  background-color: var(--alert-ghost-hover);\n}\n.cu-alert-close[data-v-bfdcbd99]:active {\n  background-color: var(--alert-ghost-active);\n}\n\n/* Sin título ni ícono: el close acompaña a la primera fila del cuerpo en vez\n   de ocupar una cabecera propia. */\n.cu-alert-close--floating[data-v-bfdcbd99] {\n  position: absolute;\n  top: var(--cu-space-md);\n  right: var(--cu-space-lg);\n}\n.cu-alert--floating-close .cu-alert-content[data-v-bfdcbd99] {\n  padding-right: var(--cu-space-xl);\n}\n.cu-alert-content[data-v-bfdcbd99] {\n  color: inherit;\n}\n"]], ["__scopeId", "data-v-bfdcbd99"]]);
//#endregion
//#region src/components/form/FileInputZone.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "cu-file-zone-wrap" };
var _hoisted_2 = ["onKeydown", "aria-disabled"];
var _hoisted_3 = [
	"accept",
	"multiple",
	"webkitdirectory"
];
var _hoisted_4 = {
	key: 0,
	xmlns: "http://www.w3.org/2000/svg",
	width: "40",
	height: "40",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "cu-file-zone-icon"
};
var _hoisted_5 = {
	key: 1,
	class: "cu-file-zone-text"
};
var _hoisted_6 = { class: "cu-file-zone-placeholder" };
var _hoisted_7 = {
	key: 0,
	class: "cu-file-zone-formats"
};
//#endregion
//#region src/components/form/FileInputZone.vue
var FileInputZone_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FileInputZone",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		placeholder: {
			type: String,
			required: false,
			default: "Selecciona un archivo o arrastra aquí"
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
		accept: {
			type: String,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false,
			default: false
		},
		maxSize: {
			type: Number,
			required: false
		},
		directory: {
			type: Boolean,
			required: false,
			default: false
		},
		directoryDeep: {
			type: Number,
			required: false,
			default: 0
		},
		maxHeight: {
			type: String,
			required: false,
			default: ""
		}
	}, {
		"modelValue": { default: null },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const value = useModel(__props, "modelValue");
		const props = __props;
		const effectiveMultiple = computed(() => props.multiple || props.directory);
		const isDragOver = ref(false);
		const { focused: dropFocus } = useFocus(useTemplateRef("dropZone"));
		const fileInputRef = useTemplateRef("fileInput");
		const rejectMessages = ref([]);
		const internalSet = ref(false);
		const zoneStyles = computed(() => ({
			"--zone-bg": `var(--cu-color-${props.color})`,
			"--zone-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--zone-text": `var(--cu-color-${props.color}-text)`
		}));
		const fileList = computed(() => {
			if (!value.value) return [];
			if (value.value instanceof File) return [value.value];
			if (Array.isArray(value.value)) return value.value;
			return [];
		});
		function matchesAccept(file) {
			if (!props.accept) return true;
			return props.accept.split(",").map((s) => s.trim()).some((pattern) => {
				if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
				if (pattern.endsWith("/*")) return file.type.startsWith(pattern.slice(0, -1));
				return file.type === pattern;
			});
		}
		function isValidFile(file) {
			if (file.size === 0 && !file.type) return false;
			if (props.maxSize && file.size > props.maxSize) return false;
			if (!matchesAccept(file)) return false;
			return true;
		}
		function rejectReason(file) {
			if (file.size === 0 && !file.type) return `${file.name}: archivo vacío.`;
			if (props.maxSize && file.size > props.maxSize) return `${file.name}: supera el tamaño máximo (${formatFileSize(props.maxSize)}).`;
			if (props.accept && !matchesAccept(file)) return `${file.name}: formato no permitido (se aceptan: ${props.accept}).`;
			return `${file.name}: no se pudo aceptar.`;
		}
		function readDirectory(entry, depth) {
			return new Promise((resolve, reject) => {
				const reader = entry.createReader();
				const allEntries = [];
				function readBatch() {
					reader.readEntries((entries) => {
						if (entries.length === 0) resolve(processEntries(allEntries, depth));
						else {
							allEntries.push(...entries);
							readBatch();
						}
					}, reject);
				}
				readBatch();
			});
		}
		async function processEntries(entries, depth) {
			const files = [];
			for (const entry of entries) if (entry.isFile) {
				const file = await new Promise((resolve) => entry.file(resolve));
				files.push(file);
			} else if (entry.isDirectory) {
				if (depth < 0 || depth > 0) {
					const subFiles = await readDirectory(entry, depth < 0 ? -1 : depth - 1);
					files.push(...subFiles);
				}
			}
			return files;
		}
		function setFiles(files) {
			if (props.disabled || props.readOnly) return;
			const rejected = [];
			let validFiles = files.filter((f) => {
				if (isValidFile(f)) return true;
				rejected.push(rejectReason(f));
				return false;
			});
			if (props.directory && props.directoryDeep >= 0) validFiles = validFiles.filter((f) => {
				if (!f.webkitRelativePath) return true;
				if (f.webkitRelativePath.split("/").length - 2 > props.directoryDeep) {
					rejected.push(`${f.name}: excede la profundidad máxima de subcarpetas.`);
					return false;
				}
				return true;
			});
			rejectMessages.value = rejected;
			if (validFiles.length === 0) return;
			internalSet.value = true;
			if (effectiveMultiple.value) value.value = validFiles;
			else value.value = validFiles[0];
		}
		watch(value, (files) => {
			if (internalSet.value) {
				internalSet.value = false;
				return;
			}
			if (files && (files instanceof File || files.length > 0)) rejectMessages.value = [];
		});
		function handleInputChange(event) {
			const input = event.target;
			if (input.files && input.files.length > 0) setFiles(Array.from(input.files));
		}
		function handleFileClick(index) {
			const file = fileList.value[index];
			if (!file) return;
			const url = URL.createObjectURL(file);
			window.open(url, "_blank");
			setTimeout(() => URL.revokeObjectURL(url), 1e4);
		}
		function onDragOver(e) {
			if (props.disabled || props.readOnly) return;
			e.preventDefault();
			isDragOver.value = true;
		}
		function onDragLeave(e) {
			e.preventDefault();
			isDragOver.value = false;
		}
		async function onDrop(e) {
			e.preventDefault();
			isDragOver.value = false;
			if (props.disabled || props.readOnly) return;
			const items = e.dataTransfer?.items;
			if (items) {
				const allFiles = [];
				const promises = [];
				for (let i = 0; i < items.length; i++) {
					const entry = items[i]?.webkitGetAsEntry?.();
					if (!entry) {
						const file = items[i].getAsFile();
						if (file) allFiles.push(file);
					} else if (entry.isFile) promises.push(new Promise((resolve) => {
						entry.file((f) => {
							allFiles.push(f);
							resolve();
						});
					}));
					else if (entry.isDirectory && props.directory) promises.push(readDirectory(entry, props.directoryDeep).then((files) => {
						allFiles.push(...files);
					}));
				}
				await Promise.all(promises);
				if (allFiles.length > 0) setFiles(allFiles);
			}
		}
		/** Abre el selector de archivos. */
		function trigger() {
			if (props.disabled || props.readOnly) return;
			fileInputRef.value?.click();
		}
		function removeFile(index) {
			if (!value.value) return;
			if (value.value instanceof File) {
				value.value = null;
				rejectMessages.value = [];
				return;
			}
			if (Array.isArray(value.value)) {
				const arr = [...value.value];
				arr.splice(index, 1);
				value.value = arr.length > 0 ? arr : null;
				if (arr.length === 0) rejectMessages.value = [];
			}
		}
		/** Devuelve el archivo o archivos actuales. */
		const get = () => value.value;
		/** Setea el archivo o archivos actuales. */
		const set = (files) => {
			value.value = files;
			rejectMessages.value = [];
		};
		/** Quita los archivos seleccionados. */
		const reset = () => {
			value.value = null;
			rejectMessages.value = [];
			if (fileInputRef.value) fileInputRef.value.value = "";
		};
		/** Enfoca la zona de carga. */
		const focus = () => {
			dropFocus.value = true;
		};
		__expose({
			get,
			set,
			reset,
			focus,
			trigger
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", {
				ref: "dropZone",
				class: normalizeClass(["cu-file-zone", {
					"cu-file-zone--disabled": props.disabled,
					"cu-file-zone--drag-over": isDragOver.value,
					"cu-file-zone--empty": fileList.value.length === 0,
					"cu-file-zone--has-files": fileList.value.length > 0
				}]),
				style: normalizeStyle(zoneStyles.value),
				onDragover: onDragOver,
				onDragleave: onDragLeave,
				onDrop,
				onClick: trigger,
				onKeydown: [withKeys(trigger, ["enter"]), withKeys(withModifiers(trigger, ["prevent"]), ["space"])],
				tabindex: "0",
				role: "button",
				"aria-disabled": props.disabled
			}, [
				createElementVNode("input", {
					ref: "fileInput",
					type: "file",
					accept: props.accept,
					multiple: effectiveMultiple.value,
					webkitdirectory: props.directory || void 0,
					class: "cu-file-zone-hidden",
					onChange: handleInputChange
				}, null, 40, _hoisted_3),
				fileList.value.length === 0 ? (openBlock(), createElementBlock("svg", _hoisted_4, [..._cache[0] || (_cache[0] = [
					createElementVNode("path", { d: "M12 3v12" }, null, -1),
					createElementVNode("path", { d: "m17 8-5-5-5 5" }, null, -1),
					createElementVNode("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }, null, -1)
				])])) : createCommentVNode("v-if", true),
				fileList.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5, [createElementVNode("p", _hoisted_6, toDisplayString(props.placeholder), 1), props.accept ? (openBlock(), createElementBlock("p", _hoisted_7, " Formatos aceptados: " + toDisplayString(props.accept), 1)) : createCommentVNode("v-if", true)])) : (openBlock(), createBlock(FileList_default, {
					key: 2,
					files: value.value,
					color: props.color,
					disabled: props.disabled,
					"max-height": props.maxHeight,
					onRemove: removeFile,
					onSelect: handleFileClick
				}, null, 8, [
					"files",
					"color",
					"disabled",
					"max-height"
				]))
			], 46, _hoisted_2), rejectMessages.value.length > 0 ? (openBlock(), createBlock(Alert_default, {
				key: 0,
				color: "danger",
				variant: "soft",
				class: "cu-file-zone-reject"
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(rejectMessages.value, (msg, i) => {
					return openBlock(), createElementBlock("p", {
						key: i,
						class: "cu-file-zone-reject-item"
					}, toDisplayString(msg), 1);
				}), 128))]),
				_: 1
			})) : createCommentVNode("v-if", true)]);
		};
	}
}), [["styles", ["\n.cu-file-zone {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-md);\n  padding: var(--cu-space-xl) var(--cu-space-2xl);\n  border-radius: var(--cu-radius);\n  border: var(--cu-border-thick) dashed var(--cu-border-color);\n  cursor: pointer;\n  transition: all 200ms ease;\n  min-height: 160px;\n  font-family: var(--cu-font-sans);\n  user-select: none;\n  color: var(--zone-text);\n  box-sizing: border-box;\n}\n.cu-file-zone:focus {\n  outline: none;\n  border-color: var(--zone-bg);\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--zone-bg);\n}\n.cu-file-zone:hover:not(.cu-file-zone--disabled) {\n  border-color: var(--zone-bg);\n  background-color: var(--zone-ghost-hover);\n}\n.cu-file-zone--disabled {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n.cu-file-zone--drag-over {\n  border-color: var(--zone-bg);\n  background-color: var(--zone-ghost-hover);\n}\n.cu-file-zone--empty {\n  align-items: center;\n  justify-content: center;\n}\n.cu-file-zone--has-files {\n  align-items: flex-start;\n  justify-content: flex-start;\n}\n.cu-file-zone-hidden {\n  display: none;\n}\n.cu-file-zone-icon {\n  color: var(--zone-text);\n  opacity: var(--cu-alpha-subtle, 0.6);\n  flex-shrink: 0;\n}\n.cu-file-zone-text {\n  text-align: center;\n}\n.cu-file-zone-placeholder {\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--zone-text);\n  margin: 0;\n}\n.cu-file-zone-formats {\n  font-size: var(--cu-font-size-xs);\n  margin-top: var(--cu-space-2xs);\n  color: var(--zone-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-file-zone-wrap {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n}\n.cu-file-zone-reject {\n  margin-top: var(--cu-space-2xs);\n}\n.cu-file-zone-reject-item {\n  margin: 0;\n  font-size: var(--cu-font-size-sm);\n}\n"]]]);
//#endregion
//#region src/lib/form/file-input-zone.ts
var CuFileInputZone = defineComegenElement("cu-file-input-zone", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "FileInputZone.ce",
	props: {
		/** Archivo/s seleccionados */
		modelValue: {
			type: Object,
			default: null
		},
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** Texto cuando no hay archivos */
		placeholder: {
			type: String,
			default: "Selecciona un archivo o arrastra aquí"
		},
		/** Deshabilita interacción */
		disabled: Boolean,
		/** Modo solo lectura */
		readOnly: Boolean,
		/** Tipos aceptados (ej: `"image/*"`) */
		accept: String,
		/** Permite múltiples archivos */
		multiple: Boolean,
		/** Tamaño máximo en bytes */
		maxSize: Number,
		/** Activa modo carpeta (incluye `multiple` implícitamente) */
		directory: Boolean,
		/** Niveles de recursión en carpetas: `0` = solo raíz, `1` = +1 subnivel, `-1` = sin límite */
		directoryDeep: {
			type: Number,
			default: 0
		},
		/** Altura máxima del listado (ej: `"200px"`). Sin scroll si se omite. */
		maxHeight: {
			type: String,
			default: ""
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const zoneRef = ref(null);
		const localModel = ref(props.modelValue);
		watch(() => props.modelValue, (val) => {
			localModel.value = val;
		});
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
		function onUpdate(val) {
			localModel.value = val;
			ceEmit("update:modelValue", val);
		}
		/** Devuelve el/los archivo/s actual/es */
		function get() {
			return zoneRef.value?.get() ?? null;
		}
		/** Asigna archivos programáticamente */
		function set(val) {
			zoneRef.value?.set(val);
		}
		/** Limpia la selección */
		function reset() {
			zoneRef.value?.reset();
		}
		/** Enfoca la zona */
		function focus() {
			zoneRef.value?.focus();
		}
		/** Abre el diálogo nativo */
		function trigger() {
			zoneRef.value?.trigger();
		}
		__expose({
			get,
			set,
			reset,
			focus,
			trigger
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(FileInputZone_default, {
				ref_key: "zoneRef",
				ref: zoneRef,
				"model-value": localModel.value,
				color: props.color,
				placeholder: props.placeholder,
				disabled: props.disabled,
				"read-only": props.readOnly,
				accept: props.accept,
				multiple: props.multiple,
				"max-size": props.maxSize,
				directory: props.directory,
				"directory-deep": props.directoryDeep,
				"max-height": props.maxHeight,
				"onUpdate:modelValue": onUpdate
			}, null, 8, [
				"model-value",
				"color",
				"placeholder",
				"disabled",
				"read-only",
				"accept",
				"multiple",
				"max-size",
				"directory",
				"directory-deep",
				"max-height"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuFileInputZone as default };
