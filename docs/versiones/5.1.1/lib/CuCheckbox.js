/*! comegenui v5.1.1 · CuCheckbox (cu-checkbox) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, normalizeClass, normalizeStyle, openBlock, ref, toDisplayString, useModel, watch } from "vue";
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
oneOf(TARGETS);
oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/form/Checkbox.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["checked", "disabled"];
var _hoisted_2 = {
	key: 0,
	xmlns: "http://www.w3.org/2000/svg",
	width: "14",
	height: "14",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "3",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "cu-checkbox-icon"
};
var _hoisted_3 = {
	key: 0,
	class: "cu-checkbox-label"
};
var Checkbox_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Checkbox",
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
			required: false
		}
	}, {
		"modelValue": {
			type: Boolean,
			default: false
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const checked = useModel(__props, "modelValue");
		const props = __props;
		const emit = __emit;
		const inputRef = ref(null);
		const checkboxStyles = computed(() => ({
			"--cb-bg": `var(--cu-color-${props.color})`,
			"--cb-soft": `var(--cu-color-${props.color}-soft)`,
			"--cb-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--cb-text": `var(--cu-color-${props.color}-text)`
		}));
		__expose({
			/** Devuelve si el checkbox está marcado. */
			get: () => checked.value,
			/** Setea el estado marcado y emite change. */
			set: (value) => {
				checked.value = value;
				emit("change", { target: { checked: value } });
			},
			/** Desmarca el checkbox y emite change. */
			reset: () => {
				checked.value = false;
				emit("change", { target: { checked: false } });
			},
			/** Enfoca el input nativo. */
			focus: () => inputRef.value?.focus()
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass(["cu-checkbox", [`cu-checkbox--${props.size}`, { "cu-checkbox--disabled": props.disabled }]]) }, [
				createElementVNode("input", {
					ref_key: "inputRef",
					ref: inputRef,
					type: "checkbox",
					checked: checked.value,
					onChange: _cache[0] || (_cache[0] = (e) => {
						checked.value = e.target.checked;
						emit("change", e);
					}),
					disabled: props.disabled,
					tabindex: "-1",
					class: "cu-checkbox-input"
				}, null, 40, _hoisted_1),
				createElementVNode("div", {
					class: normalizeClass(["cu-checkbox-box", { "cu-checkbox-box--checked": checked.value }]),
					style: normalizeStyle(checkboxStyles.value)
				}, [checked.value ? (openBlock(), createElementBlock("svg", _hoisted_2, [..._cache[1] || (_cache[1] = [createElementVNode("path", { d: "M20 6L9 17l-5-5" }, null, -1)])])) : createCommentVNode("v-if", true)], 6),
				props.label ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true)
			], 2);
		};
	}
});
//#endregion
//#region src/components/form/Checkbox.vue?vue&type=style&index=0&inline&scoped=c884e20d&lang.css
var Checkbox_vue_vue_type_style_index_0_inline_scoped_c884e20d_lang_default = "\n.cu-checkbox[data-v-c884e20d] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  cursor: pointer;\n  box-sizing: border-box;\n  width: fit-content;\n}\n.cu-checkbox--md[data-v-c884e20d] {\n  gap: var(--cu-space-sm);\n}\n.cu-checkbox--sm[data-v-c884e20d] {\n  gap: var(--cu-space-xs);\n}\n.cu-checkbox--disabled[data-v-c884e20d] {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.cu-checkbox-input[data-v-c884e20d] {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n  box-sizing: border-box;\n}\n.cu-checkbox-box[data-v-c884e20d] {\n  position: relative;\n  border-radius: var(--cu-radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 200ms ease;\n  border: var(--cu-border-medium) solid var(--cu-border-color);\n  background-color: transparent;\n  box-sizing: border-box;\n  flex-shrink: 0;\n}\n.cu-checkbox--md .cu-checkbox-box[data-v-c884e20d] {\n  width: var(--cu-space-lg);\n  height: var(--cu-space-lg);\n}\n.cu-checkbox--sm .cu-checkbox-box[data-v-c884e20d] {\n  width: var(--cu-space-md);\n  height: var(--cu-space-md);\n}\n.cu-checkbox-box--checked[data-v-c884e20d] {\n  background-color: var(--cb-bg);\n  border-color: var(--cb-bg);\n}\n.cu-checkbox:not(.cu-checkbox--disabled) .cu-checkbox-box[data-v-c884e20d]:hover {\n  border-color: var(--cb-bg);\n  background-color: var(--cb-ghost-hover);\n}\n.cu-checkbox:not(.cu-checkbox--disabled) .cu-checkbox-box--checked[data-v-c884e20d]:hover {\n  background-color: var(--cb-bg);\n}\n.cu-checkbox-icon[data-v-c884e20d] {\n  color: var(--cu-color-surface);\n}\n.cu-checkbox-label[data-v-c884e20d] {\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-checkbox--md .cu-checkbox-label[data-v-c884e20d] {\n  font-size: var(--cu-font-size-sm);\n}\n.cu-checkbox--sm .cu-checkbox-label[data-v-c884e20d] {\n  font-size: var(--cu-font-size-xs);\n}\n.cu-checkbox--disabled .cu-checkbox-label[data-v-c884e20d] {\n  opacity: 0.7;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/form/Checkbox.vue
var Checkbox_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Checkbox_vue_vue_type_script_setup_true_lang_default, [["styles", [Checkbox_vue_vue_type_style_index_0_inline_scoped_c884e20d_lang_default]], ["__scopeId", "data-v-c884e20d"]]);
//#endregion
//#region src/lib/form/checkbox.ts
var CuCheckbox = defineComegenElement("cu-checkbox", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Checkbox.ce",
	props: {
		/** Estado del checkbox. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
		modelValue: {
			type: Boolean,
			default: false
		},
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** Tamaño del checkbox: `sm`, `md` */
		size: {
			type: String,
			default: "md"
		},
		/** Estado deshabilitado */
		disabled: Boolean,
		/** Texto visible junto al checkbox */
		label: String
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const checkboxRef = ref(null);
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
		/** Devuelve el estado actual (`boolean`) */
		function get() {
			return checkboxRef.value?.get() ?? false;
		}
		/** Asigna el estado (programáticamente) */
		function set(val) {
			checkboxRef.value?.set(val);
		}
		/** Pone el estado en `false` */
		function reset() {
			checkboxRef.value?.reset();
		}
		/** Enfoca el checkbox */
		function focus() {
			checkboxRef.value?.focus();
		}
		__expose({
			get,
			set,
			reset,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Checkbox_default, {
				ref_key: "checkboxRef",
				ref: checkboxRef,
				"model-value": localModel.value,
				color: props.color,
				size: props.size,
				disabled: props.disabled,
				label: props.label,
				"onUpdate:modelValue": onUpdate,
				onChange: _cache[0] || (_cache[0] = ($event) => ceEmit("change", $event))
			}, null, 8, [
				"model-value",
				"color",
				"size",
				"disabled",
				"label"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.visible{visibility:visible;};\n"]]]));
//#endregion
export { CuCheckbox as default };
