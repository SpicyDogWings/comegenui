/*! comegenui v5.1.1 · CuTabs (cu-tabs) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, normalizeClass, normalizeStyle, openBlock, ref, renderList, renderSlot, toDisplayString, useModel, vShow, watch, withCtx, withDirectives } from "vue";
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
var isTabsVariant = oneOf(VARIANTS_TABS);
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
oneOf(TARGETS);
oneOf(DATE_MODES);
oneOf(CARD_LAYOUTS);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/Tabs.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = [
	"aria-selected",
	"aria-controls",
	"id",
	"disabled",
	"tabindex",
	"onClick"
];
var _hoisted_2 = ["innerHTML"];
var _hoisted_3 = ["id", "aria-labelledby"];
var Tabs_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Tabs",
	props: /*@__PURE__*/ mergeModels({
		tabs: {
			type: Array,
			required: true
		},
		color: {
			type: String,
			required: false,
			default: "primary"
		},
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isTabsVariant
		},
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		/** Clave del tab activo (v-model). */
		const active = useModel(__props, "modelValue");
		const activeKey = computed(() => {
			if (active.value && props.tabs.some((t) => t.key === active.value)) return active.value;
			return props.tabs.find((t) => !t.disabled)?.key ?? "";
		});
		const tabRefs = ref({});
		const tabStyles = computed(() => ({
			"--tabs-color": `var(--cu-color-${props.color})`,
			"--tabs-soft": `var(--cu-color-${props.color}-soft)`,
			"--tabs-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--tabs-soft-active": `var(--cu-color-${props.color}-soft-active)`,
			"--tabs-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		const isTabDisabled = (tab) => props.disabled || !!tab.disabled;
		const select = (key) => {
			if (props.disabled) return;
			const tab = props.tabs.find((t) => t.key === key);
			if (!tab || tab.disabled) return;
			if (key === activeKey.value) return;
			active.value = key;
			emit("change", key);
		};
		function focusTab(key) {
			tabRefs.value[key]?.focus();
		}
		const move = (dir) => {
			if (props.disabled || props.tabs.length === 0) return;
			const idx = props.tabs.findIndex((t) => t.key === activeKey.value);
			const length = props.tabs.length;
			for (let i = 1; i <= length; i++) {
				const nextIdx = (idx + dir * i + length) % length;
				const tab = props.tabs[nextIdx];
				if (tab && !tab.disabled) {
					select(tab.key);
					focusTab(tab.key);
					return;
				}
			}
		};
		function onKeydown(e) {
			if (props.disabled) return;
			if (e.key === "ArrowRight") {
				e.preventDefault();
				move(1);
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				move(-1);
			} else if (e.key === "Home") {
				e.preventDefault();
				const first = props.tabs.find((t) => !t.disabled);
				if (first) {
					select(first.key);
					focusTab(first.key);
				}
			} else if (e.key === "End") {
				e.preventDefault();
				const last = [...props.tabs].reverse().find((t) => !t.disabled);
				if (last) {
					select(last.key);
					focusTab(last.key);
				}
			}
		}
		/** Devuelve la clave del tab activo. */
		function getActive() {
			return activeKey.value;
		}
		/** Activa el tab con la clave indicada. */
		function setActive(key) {
			select(key);
		}
		/** Avanza al siguiente tab habilitado. */
		function next() {
			move(1);
		}
		/** Retrocede al tab habilitado anterior. */
		function prev() {
			move(-1);
		}
		__expose({
			getActive,
			setActive,
			next,
			prev
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-tabs", [
					`cu-tabs--${props.variant}`,
					`cu-tabs--${props.size}`,
					{ "cu-tabs--disabled": props.disabled }
				]]),
				style: normalizeStyle(tabStyles.value)
			}, [
				createElementVNode("div", {
					class: "cu-tabs-header",
					role: "tablist",
					"aria-orientation": "horizontal",
					onKeydown
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.tabs, (tab) => {
					return openBlock(), createElementBlock("button", {
						key: tab.key,
						ref_for: true,
						ref: (el) => {
							tabRefs.value[tab.key] = el;
						},
						type: "button",
						class: normalizeClass(["cu-tabs-tab", { "cu-tabs-tab--active": tab.key === activeKey.value }]),
						role: "tab",
						"aria-selected": tab.key === activeKey.value,
						"aria-controls": `cu-tabs-panel-${tab.key}`,
						id: `cu-tabs-tab-${tab.key}`,
						disabled: isTabDisabled(tab),
						tabindex: tab.key === activeKey.value ? 0 : -1,
						onClick: ($event) => select(tab.key)
					}, [tab.icon ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: "cu-tabs-tab-icon",
						innerHTML: tab.icon
					}, null, 8, _hoisted_2)) : renderSlot(_ctx.$slots, `tab-icon-${tab.key}`, {}, void 0, true, 1), createTextVNode(" " + toDisplayString(tab.label), 1)], 10, _hoisted_1);
				}), 128))], 32),
				createCommentVNode(" Panels: los keepAlive se montan siempre y se ocultan con v-show (estado\n         persistente); los normales se montan solo cuando están activos (v-if). "),
				(openBlock(true), createElementBlock(Fragment, null, renderList(props.tabs, (tab) => {
					return openBlock(), createElementBlock(Fragment, { key: tab.key }, [tab.keepAlive || tab.key === activeKey.value ? withDirectives((openBlock(), createElementBlock("div", {
						key: 0,
						id: `cu-tabs-panel-${tab.key}`,
						class: "cu-tabs-panel",
						role: "tabpanel",
						"aria-labelledby": `cu-tabs-tab-${tab.key}`
					}, [renderSlot(_ctx.$slots, tab.key, {}, void 0, true)], 8, _hoisted_3)), [[vShow, tab.key === activeKey.value]]) : createCommentVNode("v-if", true)], 64);
				}), 128))
			], 6);
		};
	}
});
//#endregion
//#region src/components/Tabs.vue?vue&type=style&index=0&inline&scoped=8b21170d&lang.css
var Tabs_vue_vue_type_style_index_0_inline_scoped_8b21170d_lang_default = "\n.cu-tabs[data-v-8b21170d] {\n  box-sizing: border-box;\n  font-family: var(--cu-font-sans);\n}\n.cu-tabs-header[data-v-8b21170d] {\n  display: flex;\n  gap: var(--cu-space-2xs);\n  box-sizing: border-box;\n}\n.cu-tabs-tab[data-v-8b21170d] {\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-family: inherit;\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--cu-color-neutral);\n  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;\n  box-sizing: border-box;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n}\n.cu-tabs-tab[data-v-8b21170d]:hover:not(:disabled) {\n  color: var(--tabs-color);\n}\n\n/* El icono hereda el color del tab (default/hover/active). Se encadena\n   .cu-tabs-tab para ganar especificidad frente a reglas del huésped tipo\n   `.playground :is(span)` (0,2,1): scoped esto compila a 0,3,0. */\n.cu-tabs-tab .cu-tabs-tab-icon[data-v-8b21170d] {\n  color: inherit;\n  display: inline-flex;\n  align-items: center;\n}\n\n/* :deep() para alcanzar el svg inyectado via v-html (no lleva data-v scoped) */\n.cu-tabs-tab-icon[data-v-8b21170d] svg {\n  color: inherit;\n  width: 1em;\n  height: 1em;\n}\n.cu-tabs-tab[data-v-8b21170d]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--cu-border-color-focus);\n  outline-offset: var(--cu-space-2xs);\n}\n.cu-tabs-tab[data-v-8b21170d]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n/* Sizes */\n.cu-tabs--sm .cu-tabs-tab[data-v-8b21170d] {\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n  font-size: var(--cu-font-size-xs);\n}\n.cu-tabs--md .cu-tabs-tab[data-v-8b21170d] {\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  font-size: var(--cu-font-size-sm);\n}\n.cu-tabs--lg .cu-tabs-tab[data-v-8b21170d] {\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  font-size: var(--cu-font-size-md);\n}\n\n/* Variant: ghost (underline) */\n.cu-tabs--ghost .cu-tabs-header[data-v-8b21170d] {\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n}\n.cu-tabs--ghost .cu-tabs-tab[data-v-8b21170d] {\n  border-bottom: var(--cu-border-thin) solid transparent;\n  border-radius: var(--cu-radius-sm) var(--cu-radius-sm) 0 0;\n  margin-bottom: calc(var(--cu-border-thin) * -1);\n}\n.cu-tabs--ghost .cu-tabs-tab--active[data-v-8b21170d] {\n  color: var(--tabs-color);\n  border-bottom-color: var(--tabs-color);\n}\n\n/* Variant: solid */\n.cu-tabs--solid .cu-tabs-header[data-v-8b21170d] {\n  padding-bottom: var(--cu-space-xs);\n}\n.cu-tabs--solid .cu-tabs-tab[data-v-8b21170d] {\n  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));\n}\n.cu-tabs--solid .cu-tabs-tab[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-soft-hover);\n}\n.cu-tabs--solid .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d] {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n.cu-tabs--solid .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n\n/* Variant: boxed */\n.cu-tabs--boxed .cu-tabs-header[data-v-8b21170d] {\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-md);\n  background-color: var(--cu-color-surface);\n  padding: var(--cu-space-2xs);\n}\n.cu-tabs--boxed .cu-tabs-tab[data-v-8b21170d] {\n  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));\n}\n.cu-tabs--boxed .cu-tabs-tab[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-soft-hover);\n}\n.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d] {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n\n/* Variant: soft (soft container box + solid active) */\n.cu-tabs--soft .cu-tabs-header[data-v-8b21170d] {\n  border: none;\n  border-radius: var(--cu-radius-md);\n  background-color: var(--tabs-soft);\n  padding: var(--cu-space-xs);\n}\n.cu-tabs--soft .cu-tabs-tab[data-v-8b21170d] {\n  border-radius: calc(var(--cu-radius-md) - var(--cu-space-2xs));\n}\n.cu-tabs--soft .cu-tabs-tab[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-soft-hover);\n}\n.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d] {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active[data-v-8b21170d]:hover:not(:disabled) {\n  background-color: var(--tabs-color);\n  color: var(--cu-color-surface);\n}\n.cu-tabs-panel[data-v-8b21170d] {\n  padding-top: var(--cu-space-md);\n  font-size: var(--cu-font-size-md);\n}\n.cu-tabs--disabled[data-v-8b21170d] {\n  opacity: 0.7;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/Tabs.vue
var Tabs_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Tabs_vue_vue_type_script_setup_true_lang_default, [["styles", [Tabs_vue_vue_type_style_index_0_inline_scoped_8b21170d_lang_default]], ["__scopeId", "data-v-8b21170d"]]);
//#endregion
//#region src/lib/tabs.ts
var CuTabs = defineComegenElement("cu-tabs", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Tabs.ce",
	props: {
		/** Definición de las pestañas */
		tabs: {
			type: Array,
			default: () => []
		},
		/** Key del tab activo (controlado) */
		modelValue: {
			type: String,
			default: ""
		},
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "primary"
		},
		/** `ghost`, `solid`, `boxed`, `soft` */
		variant: {
			type: String,
			default: "ghost"
		},
		/** `sm`, `md`, `lg` */
		size: {
			type: String,
			default: "md"
		},
		/** Deshabilita todas las pestañas */
		disabled: Boolean
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const tabsRef = ref(null);
		const instance = getCurrentInstance();
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const root = el?.getRootNode();
			const host = root && "host" in root ? root.host : el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		const localModel = ref(props.modelValue);
		watch(() => props.modelValue, (v) => {
			localModel.value = v;
		});
		function onUpdate(val) {
			localModel.value = val;
			ceEmit("update:modelValue", val);
		}
		/** Devuelve la key del tab activo */
		function getActive() {
			return tabsRef.value?.getActive() ?? "";
		}
		/** Activa el tab con esa key */
		function setActive(key) {
			tabsRef.value?.setActive(key);
		}
		/** Activa el próximo tab habilitado */
		function next() {
			tabsRef.value?.next();
		}
		/** Activa el tab anterior habilitado */
		function prev() {
			tabsRef.value?.prev();
		}
		__expose({
			getActive,
			setActive,
			next,
			prev
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Tabs_default, {
				ref_key: "tabsRef",
				ref: tabsRef,
				tabs: props.tabs,
				modelValue: localModel.value,
				color: props.color,
				variant: props.variant,
				size: props.size,
				disabled: props.disabled,
				"onUpdate:modelValue": onUpdate,
				onChange: _cache[0] || (_cache[0] = ($event) => ceEmit("change", $event))
			}, createSlots({ _: 2 }, [renderList(props.tabs, (tab) => {
				return {
					name: tab.key,
					fn: withCtx(() => [renderSlot(_ctx.$slots, tab.key)])
				};
			}), renderList(props.tabs, (tab) => {
				return {
					name: `tab-icon-${tab.key}`,
					fn: withCtx(() => [renderSlot(_ctx.$slots, `tab-icon-${tab.key}`)])
				};
			})]), 1032, [
				"tabs",
				"modelValue",
				"color",
				"variant",
				"size",
				"disabled"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.tab{-moz-tab-size:4;-o-tab-size:4;tab-size:4;};\n"]]]));
//#endregion
export { CuTabs as default };
