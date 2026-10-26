/*! comegenui v5.2.1 · CuLabel (cu-label) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, defineCustomElement, normalizeStyle, openBlock, renderSlot, toDisplayString, useTemplateRef, withCtx } from "vue";
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
//#region src/components/form/Label.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["for"];
var _hoisted_2 = {
	key: 0,
	class: "cu-label-text"
};
var FOCUSABLE = "input:not([type=\"hidden\"]), select, textarea, button, [tabindex]:not([tabindex=\"-1\"])";
/** Control real a enfocar/activar: el del shadow root, el propio elemento o uno interno. */
var Label_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Label",
	props: {
		for: {
			type: String,
			required: false,
			default: ""
		},
		label: {
			type: String,
			required: false,
			default: ""
		},
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		hightContrast: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const colorStyles = computed(() => ({ "--label-fg": `var(--cu-color-${props.color})` }));
		const emit = __emit;
		const labelRef = useTemplateRef("label");
		/**
		* Primer control del slot. En el custom element los hijos viven en el light DOM
		* del host (el `<label>` está en el shadow root), así que se mira el host; en
		* Vue, el `<label>` es el dueño real de los hijos.
		*/
		function slotControl() {
			const label = labelRef.value;
			if (!label) return null;
			const scope = label.getRootNode().host ?? label;
			return Array.from(scope.children).find((el) => el instanceof HTMLElement && !el.classList.contains("cu-label-text")) ?? null;
		}
		/**
		* Enfoca el control. Si es un custom element (`<cu-input>`, `<cu-checkbox>`, …)
		* el host no es focuseable: se enfoca el control de su shadow root. En Vue el
		* slot es el componente (un `<div>`/`<label>` con el campo adentro), así que se
		* busca el control focuseable dentro del elemento.
		*/
		function controlTarget(el) {
			if (!el) return null;
			return el.shadowRoot?.querySelector(FOCUSABLE) ?? (el.matches(FOCUSABLE) ? el : el.querySelector(FOCUSABLE)) ?? el;
		}
		const handleClick = (event) => {
			const control = props.for ? document.getElementById(props.for) : slotControl();
			const path = event.composedPath?.() ?? [];
			if (!(!!control && (event.target === control || path.includes(control)))) {
				event.preventDefault();
				const target = controlTarget(control);
				if (target) {
					target.focus();
					if (target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio")) target.click();
				}
			}
			emit("click");
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", {
				ref: "label",
				for: props.for || void 0,
				style: normalizeStyle(colorStyles.value),
				class: "cu-label",
				onClick: handleClick
			}, [props.label ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 12, _hoisted_1);
		};
	}
});
//#endregion
//#region src/components/form/Label.vue?vue&type=style&index=0&inline&scoped=5a2501c1&lang.css
var Label_vue_vue_type_style_index_0_inline_scoped_5a2501c1_lang_default = "\n.cu-label[data-v-5a2501c1] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-label-text[data-v-5a2501c1] {\n  width: fit-content;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n}\n\n/* Clases duplicadas a propósito: le ganan a las reglas globales del\n   consumidor que fuerzan color en label/span (p. ej. el playground:\n   `.playground :is(..., span, label)` → (0,2,1)). Scoped compila a (0,3,0). */\n.cu-label.cu-label[data-v-5a2501c1],\n.cu-label-text.cu-label-text[data-v-5a2501c1] {\n  color: var(--label-fg);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/form/Label.vue
var Label_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Label_vue_vue_type_script_setup_true_lang_default, [["styles", [Label_vue_vue_type_style_index_0_inline_scoped_5a2501c1_lang_default]], ["__scopeId", "data-v-5a2501c1"]]);
//#endregion
//#region src/lib/form/label.ts
var CuLabel = defineComegenElement("cu-label", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Label.ce",
	props: {
		/** ID del elemento a enfocar al hacer clic (atributo HTML `for`) */
		for: {
			type: String,
			required: false,
			default: ""
		},
		/** Texto del label (modo declarativo) */
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** Color semántico del texto; se resuelve vía el token `--cu-color-{color}` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** Modo de alto contraste para el texto */
		hightContrast: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Label_default, {
				for: props.for,
				label: props.label,
				color: props.color,
				"hight-contrast": props.hightContrast
			}, {
				default: withCtx(() => [createCommentVNode(" Contenido asociado (input, checkbox, etc.) "), renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"for",
				"label",
				"color",
				"hight-contrast"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuLabel as default };
