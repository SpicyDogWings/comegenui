/*! comegenui v5.2.1 · CuSwitch (cu-switch) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, renderSlot, shallowRef, toDisplayString, toValue, unref, useModel, useTemplateRef, watch, withCtx } from "vue";
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
oneOf(VARIANTS);
oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
oneOf(SIZES);
var isSizeSm = oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
var isLabelPosition = oneOf(LABEL_POSITIONS);
oneOf(TARGETS);
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
//#region src/components/form/Switch.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-checked"];
var _hoisted_2 = ["checked", "disabled"];
var _hoisted_3 = {
	key: 0,
	class: "cu-switch-label"
};
var Switch_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Switch",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSizeSm
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
		/** Lado del track en el que se muestra la etiqueta: `end` (derecha, default) o `start` (izquierda). */
		labelPosition: {
			type: String,
			required: false,
			default: "end",
			validator: isLabelPosition
		}
	}, {
		"modelValue": {
			type: Boolean,
			default: false
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit, slots: $slots }) {
		const checked = useModel(__props, "modelValue");
		const props = __props;
		const emit = __emit;
		const { focused: inputFocus } = useFocus(useTemplateRef("input"));
		const switchStyles = computed(() => ({
			"--switch-bg": `var(--cu-color-${props.color})`,
			"--switch-hover": `var(--cu-color-${props.color}-hover)`,
			"--switch-active": `var(--cu-color-${props.color}-active)`
		}));
		const toggle = (next) => {
			if (props.disabled) return;
			const value = next ?? !checked.value;
			if (value === checked.value) return;
			checked.value = value;
			emit("change", value);
		};
		const onInput = (e) => {
			toggle(e.target.checked);
		};
		/** Devuelve el estado actual del switch. */
		const get = () => checked.value;
		/** Setea el estado del switch y emite change. */
		const set = (value) => {
			checked.value = value;
			emit("change", value);
		};
		/** Apaga el switch y emite change. */
		const reset = () => {
			checked.value = false;
			emit("change", false);
		};
		__expose({
			get,
			set,
			reset,
			/** Enfoca el input nativo. */
			focus: () => inputFocus.value = true
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass(["cu-switch", [
				`cu-switch--${props.size}`,
				`cu-switch--label-${props.labelPosition}`,
				{ "cu-switch--disabled": props.disabled }
			]]) }, [createElementVNode("span", {
				class: normalizeClass(["cu-switch-track", { "cu-switch--checked": checked.value }]),
				style: normalizeStyle(switchStyles.value),
				role: "switch",
				"aria-checked": checked.value
			}, [_cache[0] || (_cache[0] = createElementVNode("span", { class: "cu-switch-thumb" }, null, -1)), createElementVNode("input", {
				ref: "input",
				type: "checkbox",
				checked: checked.value,
				disabled: props.disabled,
				tabindex: "-1",
				class: "cu-switch-input",
				onChange: onInput
			}, null, 40, _hoisted_2)], 14, _hoisted_1), props.label || $slots.default ? (openBlock(), createElementBlock("span", _hoisted_3, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(props.label), 1)])])) : createCommentVNode("v-if", true)], 2);
		};
	}
});
//#endregion
//#region src/components/form/Switch.vue?vue&type=style&index=0&inline&lang.css
var Switch_vue_vue_type_style_index_0_inline_lang_default = "\n/* label nativo (misma implementación que Checkbox): el click en el label\n   activa el input anidado y su change alterna */\n.cu-switch {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  vertical-align: middle;\n  cursor: pointer;\n}\n\n/* `labelPosition`: el track va primero en el DOM y el label después. Con\n   `row-reverse` el label queda a la izquierda sin cambiar el markup: el <label>\n   nativo sigue envolviendo a los dos y el click en la etiqueta alterna igual.\n   El `gap` se mantiene entre ambos y el label conserva su ancho intrínseco. */\n.cu-switch--label-end {\n  flex-direction: row;\n}\n.cu-switch--label-start {\n  flex-direction: row-reverse;\n}\n.cu-switch-track {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  border-radius: var(--cu-radius-full);\n  transition: all 150ms ease;\n  box-sizing: border-box;\n}\n.cu-switch--md .cu-switch-track {\n  width: var(--cu-space-3xl);\n  height: var(--cu-space-2xl);\n}\n.cu-switch--sm .cu-switch-track {\n  width: var(--cu-space-2xl);\n  height: var(--cu-space-xl);\n}\n.cu-switch-track.cu-switch--checked {\n  background-color: var(--switch-bg);\n}\n.cu-switch-track:not(.cu-switch--checked) {\n  background-color: var(--cu-color-neutral-soft);\n}\n\n/* Encendido: el track es sólido, así que el hover/active son las variantes sólidas\n   del color (un poco más oscuro / claro), no las `ghost` translúcidas. */\n.cu-switch-track.cu-switch--checked:hover {\n  background-color: var(--switch-hover);\n}\n.cu-switch-track.cu-switch--checked:active {\n  background-color: var(--switch-active);\n}\n.cu-switch-track:not(.cu-switch--checked):hover {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-switch--disabled {\n  cursor: not-allowed;\n}\n.cu-switch--disabled .cu-switch-track {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  pointer-events: none;\n}\n.cu-switch--disabled .cu-switch-label {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-switch-thumb {\n  position: absolute;\n  border-radius: var(--cu-radius-full);\n  background-color: var(--cu-color-surface);\n  box-shadow: var(--cu-shadow-sm);\n  transition: all 150ms ease;\n}\n.cu-switch--md .cu-switch-thumb {\n  width: var(--cu-space-xl);\n  height: var(--cu-space-xl);\n  top: var(--cu-space-xs);\n  left: var(--cu-space-xs);\n}\n.cu-switch--sm .cu-switch-thumb {\n  width: var(--cu-space-lg);\n  height: var(--cu-space-lg);\n  top: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);\n  left: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);\n}\n.cu-switch--md .cu-switch-track.cu-switch--checked .cu-switch-thumb {\n  transform: translateX(16px);\n}\n.cu-switch--sm .cu-switch-track.cu-switch--checked .cu-switch-thumb {\n  transform: translateX(8px);\n}\n.cu-switch-input {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.cu-switch-label {\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-switch--md .cu-switch-label {\n  font-size: var(--cu-font-size-sm);\n}\n.cu-switch--sm .cu-switch-label {\n  font-size: var(--cu-font-size-xs);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/form/Switch.vue
var Switch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Switch_vue_vue_type_script_setup_true_lang_default, [["styles", [Switch_vue_vue_type_style_index_0_inline_lang_default]]]);
//#endregion
//#region src/lib/form/switch.ts
var CuSwitch = defineComegenElement("cu-switch", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Switch.ce",
	props: {
		/** Estado del toggle. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
		modelValue: {
			type: Boolean,
			default: false
		},
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** Tamaño del switch: `sm`, `md` */
		size: {
			type: String,
			default: "md"
		},
		/** Estado deshabilitado */
		disabled: Boolean,
		label: {
			type: String,
			default: ""
		},
		/** Posición de la etiqueta: `end` (derecha, default) o `start` (izquierda) */
		labelPosition: {
			type: String,
			default: "end"
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const switchRef = ref(null);
		const localModel = ref(props.modelValue);
		watch(() => props.modelValue, (val) => {
			localModel.value = val;
		});
		const instance = getCurrentInstance();
		const hasHostContent = ref(false);
		let hostObserver = null;
		function nodeCountsAsContent(node) {
			if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
			if (node.nodeType === Node.COMMENT_NODE) return false;
			return true;
		}
		onMounted(() => {
			const host = ((instance?.vnode.el)?.getRootNode())?.host;
			if (!host) return;
			const update = () => {
				hasHostContent.value = Array.from(host.childNodes).some(nodeCountsAsContent);
			};
			update();
			hostObserver = new MutationObserver(update);
			hostObserver.observe(host, {
				childList: true,
				subtree: true,
				characterData: true
			});
		});
		onBeforeUnmount(() => hostObserver?.disconnect());
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
		/** Devuelve el estado actual (`boolean`) */
		function get() {
			return switchRef.value?.get() ?? false;
		}
		/** Asigna el estado */
		function set(val) {
			switchRef.value?.set(val);
		}
		/** Pone el estado en `false` */
		function reset() {
			switchRef.value?.reset();
		}
		/** Enfoca el switch */
		function focus() {
			switchRef.value?.focus();
		}
		__expose({
			get,
			set,
			reset,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Switch_default, {
				ref_key: "switchRef",
				ref: switchRef,
				"model-value": localModel.value,
				color: props.color,
				size: props.size,
				disabled: props.disabled,
				label: props.label,
				"label-position": props.labelPosition,
				"onUpdate:modelValue": onUpdate,
				onChange: _cache[0] || (_cache[0] = ($event) => ceEmit("change", $event))
			}, createSlots({ _: 2 }, [hasHostContent.value ? {
				name: "default",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				key: "0"
			} : void 0]), 1032, [
				"model-value",
				"color",
				"size",
				"disabled",
				"label",
				"label-position"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuSwitch as default };
