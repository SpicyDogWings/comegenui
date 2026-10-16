/*! comegenui v5.1.1 · CuAlert (cu-alert) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, ref, renderSlot, toDisplayString, vShow, watch, withCtx, withDirectives } from "vue";
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
oneOf(CARD_LAYOUTS);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/information/Alert.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "cu-alert-header"
};
var _hoisted_2 = { class: "cu-alert-title" };
var _hoisted_3 = {
	key: 0,
	class: "cu-alert-title-text"
};
var _hoisted_4 = { class: "cu-alert-content" };
var Alert_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
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
				props.title || hasIcon.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [renderSlot(_ctx.$slots, "icon", {}, void 0, true), props.title ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true)]), props.close ? (openBlock(), createElementBlock("button", {
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
				createElementVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "default", {}, void 0, true)])
			], 6)), [[vShow, internalShow.value]]);
		};
	}
});
//#endregion
//#region src/components/information/Alert.vue?vue&type=style&index=0&inline&scoped=bfdcbd99&lang.css
var Alert_vue_vue_type_style_index_0_inline_scoped_bfdcbd99_lang_default = "\n.cu-alert-icon-detect[data-v-bfdcbd99] {\n  display: none;\n}\n.cu-alert[data-v-bfdcbd99] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  box-sizing: border-box;\n  position: relative;\n}\n\n/* solid */\n.cu-alert.cu-alert--solid[data-v-bfdcbd99] {\n  background-color: var(--alert-bg);\n  color: var(--cu-color-surface);\n}\n.cu-alert.cu-alert--solid .cu-alert-title-text[data-v-bfdcbd99] {\n  color: var(--cu-color-surface);\n}\n\n/* ghost */\n.cu-alert.cu-alert--ghost[data-v-bfdcbd99] {\n  background-color: transparent;\n  color: var(--alert-text);\n}\n\n/* soft */\n.cu-alert.cu-alert--soft[data-v-bfdcbd99] {\n  background-color: var(--alert-soft);\n  color: var(--alert-text);\n}\n\n/* subtle */\n.cu-alert.cu-alert--subtle[data-v-bfdcbd99] {\n  background-color: var(--alert-subtle);\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-subtle-border);\n}\n\n/* outlined */\n.cu-alert.cu-alert--outlined[data-v-bfdcbd99] {\n  background-color: transparent;\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-bg);\n}\n\n/* dark theme override */\n[data-theme=\"dark\"] .cu-alert--ghost[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--soft[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--subtle[data-v-bfdcbd99],\n[data-theme=\"dark\"] .cu-alert--outlined[data-v-bfdcbd99] {\n  color: var(--alert-bg);\n}\n.cu-alert-header[data-v-bfdcbd99] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.cu-alert-title[data-v-bfdcbd99] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-alert-title-text[data-v-bfdcbd99] {\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: inherit;\n}\n.cu-alert-close[data-v-bfdcbd99] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: inherit;\n  padding: var(--cu-space-2xs);\n  border-radius: var(--cu-radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 150ms ease;\n}\n.cu-alert-close[data-v-bfdcbd99]:hover {\n  background-color: var(--alert-ghost-hover);\n}\n.cu-alert-close[data-v-bfdcbd99]:active {\n  background-color: var(--alert-ghost-active);\n}\n\n/* Sin título ni ícono: el close acompaña a la primera fila del cuerpo en vez\n   de ocupar una cabecera propia. */\n.cu-alert-close--floating[data-v-bfdcbd99] {\n  position: absolute;\n  top: var(--cu-space-md);\n  right: var(--cu-space-lg);\n}\n.cu-alert--floating-close .cu-alert-content[data-v-bfdcbd99] {\n  padding-right: var(--cu-space-xl);\n}\n.cu-alert-content[data-v-bfdcbd99] {\n  color: inherit;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Alert.vue
var Alert_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Alert_vue_vue_type_script_setup_true_lang_default, [["styles", [Alert_vue_vue_type_style_index_0_inline_scoped_bfdcbd99_lang_default]], ["__scopeId", "data-v-bfdcbd99"]]);
//#endregion
//#region src/lib/information/alert.ts
var CuAlert = defineComegenElement("cu-alert", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Alert.ce",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
		variant: {
			type: String,
			default: "soft"
		},
		/** Título visible en la cabecera */
		title: String,
		/** Muestra el botón de cerrar (X) */
		close: Boolean,
		/** Controla visibilidad. Cambiar este atributo emite `update:show` */
		show: {
			type: Boolean,
			default: true
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const alertRef = ref(null);
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
		/** Muestra la alerta */
		function open() {
			alertRef.value?.open();
		}
		/** Oculta la alerta */
		function close() {
			alertRef.value?.close();
		}
		/** Alterna visibilidad */
		function toggle() {
			alertRef.value?.toggle();
		}
		/** Devuelve `true`/`false` según la visibilidad actual */
		function isOpen() {
			return alertRef.value?.isOpen() ?? false;
		}
		__expose({
			open,
			close,
			toggle,
			isOpen
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Alert_default, {
				ref_key: "alertRef",
				ref: alertRef,
				color: props.color,
				variant: props.variant,
				title: props.title,
				close: props.close,
				show: props.show,
				onClose: _cache[0] || (_cache[0] = ($event) => ceEmit("close", $event)),
				onOpen: _cache[1] || (_cache[1] = ($event) => ceEmit("open", $event)),
				"onUpdate:show": _cache[2] || (_cache[2] = ($event) => ceEmit("update:show", $event))
			}, {
				icon: withCtx(() => [createCommentVNode(" Ícono junto al título (slot HTML nativo) "), renderSlot(_ctx.$slots, "icon")]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"color",
				"variant",
				"title",
				"close",
				"show"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.visible{visibility:visible;};\n"]]]));
//#endregion
export { CuAlert as default };
