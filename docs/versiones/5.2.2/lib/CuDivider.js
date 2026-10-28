/*! comegenui v5.2.2 · CuDivider (cu-divider) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, renderSlot, toDisplayString, useSlots, withCtx } from "vue";
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
oneOf(LABEL_POSITIONS);
oneOf(TARGETS);
oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
var isOrientation = oneOf(ORIENTATIONS);
var isDividerVariant = oneOf(DIVIDER_VARIANTS);
oneOf(SKELETON_SHAPES);
oneOf(SKELETON_ANIMATIONS);
oneOf(SKELETON_RADII);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/information/Divider.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-orientation"];
var _hoisted_2 = {
	key: 0,
	class: "cu-divider-label"
};
var _hoisted_3 = {
	key: 1,
	class: "cu-divider-line",
	"aria-hidden": "true"
};
var Divider_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Divider",
	props: {
		/** `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) */
		orientation: {
			type: String,
			required: false,
			default: "horizontal",
			validator: isOrientation
		},
		/** Texto centrado sobre la línea; la línea se corta a los costados */
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** `solid`, `dashed`, `dotted` */
		variant: {
			type: String,
			required: false,
			default: "solid",
			validator: isDividerVariant
		},
		/** Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		}
	},
	setup(__props) {
		const props = __props;
		const slots = useSlots();
		/**
		* Presencia de contenido. No es un `computed`: `slots` no es reactivo (Vue sólo
		* re-renderiza al hijo cuando cambian los slots), así que se evalúa en cada
		* render para ver el slot nuevo. El wrapper del custom element recién pasa el
		* slot cuando el host tiene hijos reales.
		*/
		function hasContent() {
			return Boolean(props.label) || Boolean(slots.default);
		}
		function isVertical() {
			return props.orientation === "vertical";
		}
		/**
		* Sin label ni slot, una línea lisa es un `<hr>` (un separador semántico, sin rol
		* declarado). Con contenido hace falta un contenedor para cortar la línea.
		*/
		function isPlain() {
			return !isVertical() && !hasContent();
		}
		const dividerStyles = computed(() => ({ "--divider-color": `var(--cu-color-${props.color}-subtle-border)` }));
		return (_ctx, _cache) => {
			return isPlain() ? (openBlock(), createElementBlock("hr", {
				key: 0,
				class: normalizeClass([
					"cu-divider",
					"cu-divider--horizontal",
					`cu-divider--${props.variant}`
				]),
				style: normalizeStyle(dividerStyles.value)
			}, null, 6)) : (openBlock(), createElementBlock("div", {
				key: 1,
				class: normalizeClass([
					"cu-divider",
					`cu-divider--${props.orientation}`,
					`cu-divider--${props.variant}`
				]),
				role: "separator",
				"aria-orientation": isVertical() ? "vertical" : void 0,
				style: normalizeStyle(dividerStyles.value)
			}, [
				createCommentVNode(" Trazo decorativo: el texto del medio es el contenido semántico "),
				_cache[0] || (_cache[0] = createElementVNode("span", {
					class: "cu-divider-line",
					"aria-hidden": "true"
				}, null, -1)),
				hasContent() ? (openBlock(), createElementBlock("span", _hoisted_2, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(props.label), 1)], true)])) : createCommentVNode("v-if", true),
				hasContent() ? (openBlock(), createElementBlock("span", _hoisted_3)) : createCommentVNode("v-if", true)
			], 14, _hoisted_1));
		};
	}
});
//#endregion
//#region src/components/information/Divider.vue?vue&type=style&index=0&inline&scoped=eeafd016&lang.css
var Divider_vue_vue_type_style_index_0_inline_scoped_eeafd016_lang_default = "\n.cu-divider[data-v-eeafd016] {\n  box-sizing: border-box;\n  /* dashed/dotted/solid del trazo, por variante */\n  --divider-style: solid;\n}\n.cu-divider--solid[data-v-eeafd016] {\n  --divider-style: solid;\n}\n.cu-divider--dashed[data-v-eeafd016] {\n  --divider-style: dashed;\n}\n.cu-divider--dotted[data-v-eeafd016] {\n  --divider-style: dotted;\n}\n\n/* ── Horizontal ───────────────────────────────────────────────────────────── */\nhr.cu-divider[data-v-eeafd016] {\n  width: 100%;\n  height: 0;\n  margin: 0;\n  border: 0;\n  border-top: var(--cu-border-thin) var(--divider-style) var(--divider-color);\n}\ndiv.cu-divider--horizontal[data-v-eeafd016] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  width: 100%;\n  margin: 0;\n  border: 0;\n}\n.cu-divider--horizontal .cu-divider-line[data-v-eeafd016] {\n  flex: 1 1 0;\n  min-width: 0;\n  border-top: var(--cu-border-thin) var(--divider-style) var(--divider-color);\n}\n.cu-divider-label[data-v-eeafd016] {\n  color: var(--cu-color-neutral);\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  line-height: var(--cu-line-height-tight);\n  text-align: center;\n  overflow-wrap: anywhere;\n}\n\n/* ── Vertical ─────────────────────────────────────────────────────────────── */\ndiv.cu-divider--vertical[data-v-eeafd016] {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  /* Toma el alto del contenedor: en una fila flex se estira, y si no, usa el 100% */\n  align-self: stretch;\n  height: 100%;\n  min-height: var(--cu-space-lg);\n  margin: 0;\n  border: 0;\n}\n.cu-divider--vertical .cu-divider-line[data-v-eeafd016] {\n  flex: 1 1 0;\n  min-height: var(--cu-space-sm);\n  border-left: var(--cu-border-thin) var(--divider-style) var(--divider-color);\n}\n.cu-divider--vertical .cu-divider-label[data-v-eeafd016] {\n  padding: var(--cu-space-xs) 0;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Divider.vue
var Divider_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Divider_vue_vue_type_script_setup_true_lang_default, [["styles", [Divider_vue_vue_type_style_index_0_inline_scoped_eeafd016_lang_default]], ["__scopeId", "data-v-eeafd016"]]);
//#endregion
//#region src/lib/information/divider.ts
var CuDivider = defineComegenElement("cu-divider", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Divider.ce",
	props: {
		/** `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) */
		orientation: {
			type: String,
			default: "horizontal",
			validator: isOrientation
		},
		/** Texto centrado sobre la línea; la línea se corta a los costados */
		label: {
			type: String,
			default: ""
		},
		/** `solid`, `dashed`, `dotted` */
		variant: {
			type: String,
			default: "solid",
			validator: isDividerVariant
		},
		/** Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral",
			validator: isColor
		}
	},
	setup(__props) {
		const props = __props;
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
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Divider_default, {
				orientation: props.orientation,
				label: props.label,
				variant: props.variant,
				color: props.color
			}, createSlots({ _: 2 }, [hasHostContent.value ? {
				name: "default",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				key: "0"
			} : void 0]), 1032, [
				"orientation",
				"label",
				"variant",
				"color"
			]);
		};
	}
}), [["styles", ["\n:host {\n  display: block;\n}\n/* En una fila flex el divisores vertical toma el alto del contenedor. */\n:host([orientation=\"vertical\"]) {\n  align-self: stretch;\n}\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.block{display:block;}\n.flex{display:flex;}\n"]]]));
//#endregion
export { CuDivider as default };
