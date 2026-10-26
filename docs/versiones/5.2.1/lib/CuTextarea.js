/*! comegenui v5.2.1 · CuTextarea (cu-textarea) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createElementBlock, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, normalizeClass, normalizeStyle, openBlock, ref, useModel, useTemplateRef, watch } from "vue";
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
oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
var isFieldVariant = oneOf(VARIANTS_FIELD);
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
oneOf(LABEL_POSITIONS);
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
//#region src/components/form/Textarea.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = [
	"placeholder",
	"value",
	"disabled",
	"readonly",
	"rows"
];
/** Valor actual del textarea (v-model). */
var Textarea_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Textarea",
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
		rows: {
			type: Number,
			required: false,
			default: 3
		},
		noResize: {
			type: Boolean,
			required: false,
			default: false
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const value = useModel(__props, "modelValue");
		const props = __props;
		const textareaRef = useTemplateRef("textarea");
		const textareaStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		/** Devuelve el valor actual del textarea. */
		const get = () => value.value;
		/** Setea el valor del textarea. */
		const set = (newValue) => {
			value.value = String(newValue);
		};
		/** Limpia el textarea. */
		const reset = () => {
			value.value = "";
		};
		/** Enfoca el textarea. */
		const focus = () => {
			textareaRef.value?.focus();
		};
		__expose({
			get,
			set,
			reset,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("textarea", {
				ref: "textarea",
				placeholder: props.placeholder,
				value: value.value,
				onInput: _cache[0] || (_cache[0] = ($event) => value.value = $event.target.value),
				class: normalizeClass(["cu-textarea", [`cu-textarea--${props.variant}`, {
					"cu-textarea--disabled": props.disabled,
					"cu-textarea--no-resize": props.noResize
				}]]),
				style: normalizeStyle(textareaStyles.value),
				disabled: props.disabled,
				readonly: props.readOnly,
				rows: props.rows
			}, null, 46, _hoisted_1);
		};
	}
});
//#endregion
//#region src/components/form/Textarea.vue?vue&type=style&index=0&inline&scoped=be9976ee&lang.css
var Textarea_vue_vue_type_style_index_0_inline_scoped_be9976ee_lang_default = "\n.cu-textarea[data-v-be9976ee] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius-md);\n  border: none;\n  outline: none;\n  width: 100%;\n  box-sizing: border-box;\n  background-color: var(--btn-bg);\n  color: var(--cu-color-neutral-text);\n  transition: all 150ms ease;\n  resize: vertical;\n}\n.cu-textarea[data-v-be9976ee]::placeholder {\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-textarea[data-v-be9976ee]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n.cu-textarea--no-resize[data-v-be9976ee] {\n  resize: none;\n}\n\n/* subtle */\n.cu-textarea--subtle[data-v-be9976ee] {\n  background-color: var(--btn-subtle);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-textarea--subtle[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n\n/* soft */\n.cu-textarea--soft[data-v-be9976ee] {\n  background-color: var(--btn-soft);\n}\n.cu-textarea--soft[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n\n/* ghost */\n.cu-textarea--ghost[data-v-be9976ee] {\n  background-color: transparent;\n}\n.cu-textarea--ghost[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* outlined */\n.cu-textarea--outlined[data-v-be9976ee] {\n  background-color: transparent;\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-textarea--outlined[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* disabled */\n.cu-textarea--disabled[data-v-be9976ee] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/form/Textarea.vue
var Textarea_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Textarea_vue_vue_type_script_setup_true_lang_default, [["styles", [Textarea_vue_vue_type_style_index_0_inline_scoped_be9976ee_lang_default]], ["__scopeId", "data-v-be9976ee"]]);
//#endregion
//#region src/lib/form/textarea.ts
var CuTextarea = defineComegenElement("cu-textarea", /* @__PURE__ */ defineComponent({
	__name: "Textarea.ce",
	props: {
		/** Valor actual del textarea. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
		modelValue: {
			type: String,
			required: false,
			default: ""
		},
		/** Valor inicial usado por `.reset()` */
		startValue: {
			type: String,
			required: false
		},
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `outlined`, `soft`, `ghost`, `subtle` */
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isFieldVariant
		},
		/** Placeholder del textarea */
		placeholder: {
			type: String,
			required: false
		},
		/** Estado deshabilitado */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Solo lectura (en HTML: `read-only`) */
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Cantidad de filas visibles */
		rows: {
			type: Number,
			required: false,
			default: 3
		},
		/** Desactiva el redimensionado manual (atributo HTML: `no-resize`) */
		noResize: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const textareaRef = ref(null);
		const instance = getCurrentInstance();
		const localModel = ref(props.modelValue);
		watch(() => props.modelValue, (val) => {
			localModel.value = val;
		});
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
		/** Devuelve el valor actual del textarea. */
		const get = () => textareaRef.value?.get();
		/** Setea el valor (acepta `string | number`). */
		const set = (value) => textareaRef.value?.set(value);
		/** Limpia el campo. */
		const reset = () => textareaRef.value?.reset();
		/** Enfoca el textarea. */
		const focus = () => textareaRef.value?.focus();
		__expose({
			get,
			set,
			reset,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Textarea_default, {
				ref_key: "textareaRef",
				ref: textareaRef,
				color: props.color,
				variant: props.variant,
				placeholder: props.placeholder,
				disabled: props.disabled,
				"read-only": props.readOnly,
				rows: props.rows,
				"no-resize": props.noResize,
				"start-value": props.startValue,
				"model-value": localModel.value,
				"onUpdate:modelValue": onUpdate
			}, null, 8, [
				"color",
				"variant",
				"placeholder",
				"disabled",
				"read-only",
				"rows",
				"no-resize",
				"start-value",
				"model-value"
			]);
		};
	}
}));
//#endregion
export { CuTextarea as default };
