/*! comegenui v5.1.1 · CuSideOver (cu-side-over) · esm-shared · Vue externo (bare import) */
import { Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderSlot, toDisplayString, watch, withCtx } from "vue";
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
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
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
//#region src/components/overlay/SideOver.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["data-size"];
var _hoisted_2 = {
	key: 0,
	class: "cu-sideover-header"
};
var _hoisted_3 = {
	key: 0,
	class: "cu-sideover-title"
};
var _hoisted_4 = { class: "cu-sideover-body" };
var SideOver_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "SideOver",
	props: {
		modelValue: {
			type: Boolean,
			required: false,
			default: false
		},
		title: {
			type: String,
			required: false,
			default: ""
		},
		position: {
			type: String,
			required: false,
			default: "right",
			validator: isPosition
		},
		size: {
			type: String,
			required: false,
			default: "300px"
		},
		fullscreen: {
			type: Boolean,
			required: false,
			default: false
		},
		persistent: {
			type: Boolean,
			required: false,
			default: false
		},
		zIndex: {
			type: Number,
			required: false,
			default: 1100
		}
	},
	emits: ["update:modelValue", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		function close() {
			if (props.persistent) return;
			emit("update:modelValue", false);
			emit("close");
		}
		function onKeydown(e) {
			if (e.key === "Escape" && props.modelValue) close();
		}
		let prevOverflow = "";
		watch(() => props.modelValue, (open) => {
			if (open) {
				prevOverflow = document.body.style.overflow;
				document.body.style.overflow = "hidden";
			} else document.body.style.overflow = prevOverflow;
		});
		onMounted(() => {
			document.addEventListener("keydown", onKeydown);
		});
		onUnmounted(() => {
			document.removeEventListener("keydown", onKeydown);
			document.body.style.overflow = prevOverflow;
		});
		const PRESET_SIZES = [
			"sm",
			"md",
			"lg",
			"xl",
			"full"
		];
		const isPresetSize = computed(() => PRESET_SIZES.includes(props.size));
		const panelStyle = computed(() => {
			if (props.fullscreen) return {};
			if (isPresetSize.value) return {};
			if (props.position === "left" || props.position === "right") return { width: props.size };
			return { height: props.size };
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, { to: "body" }, [createVNode(Transition, { name: "cu-sideover" }, {
				default: withCtx(() => [__props.modelValue ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "cu-sideover",
					style: normalizeStyle({ zIndex: props.zIndex }),
					role: "dialog",
					"aria-modal": "true"
				}, [createElementVNode("div", {
					class: "cu-sideover-backdrop",
					onClick: close
				}), createElementVNode("div", {
					class: normalizeClass(["cu-sideover-panel", [`cu-sideover-panel--${props.position}`, { "cu-sideover-panel--fullscreen": props.fullscreen }]]),
					"data-size": isPresetSize.value ? props.size : void 0,
					style: normalizeStyle(panelStyle.value)
				}, [props.title || !props.persistent ? (openBlock(), createElementBlock("header", _hoisted_2, [props.title ? (openBlock(), createElementBlock("h2", _hoisted_3, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true), !props.persistent ? (openBlock(), createElementBlock("button", {
					key: 1,
					type: "button",
					class: "cu-sideover-close",
					"aria-label": "Cerrar panel",
					onClick: close
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
				}, [createElementVNode("path", { d: "M18 6 6 18" }), createElementVNode("path", { d: "m6 6 12 12" })], -1)])])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "default", {}, void 0, true)])], 14, _hoisted_1)], 4)) : createCommentVNode("v-if", true)]),
				_: 3
			})]);
		};
	}
});
//#endregion
//#region src/components/overlay/SideOver.vue?vue&type=style&index=0&inline&scoped=90caa8ce&lang.css
var SideOver_vue_vue_type_style_index_0_inline_scoped_90caa8ce_lang_default = "\n.cu-sideover[data-v-90caa8ce] {\n  position: fixed;\n  inset: 0;\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-backdrop[data-v-90caa8ce] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.4);\n}\n.cu-sideover-panel[data-v-90caa8ce] {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--cu-color-surface);\n  box-shadow: var(--cu-shadow-xl);\n  overflow: hidden;\n}\n.cu-sideover-panel--left[data-v-90caa8ce] { top: 0; left: 0; bottom: 0;\n}\n.cu-sideover-panel--right[data-v-90caa8ce] { top: 0; right: 0; bottom: 0;\n}\n.cu-sideover-panel--top[data-v-90caa8ce] { top: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--bottom[data-v-90caa8ce] { bottom: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--fullscreen[data-v-90caa8ce] { inset: 0; width: 100vw !important; height: 100dvh !important;\n}\n\n/* Presets de tamaño: se resuelven via CSS vars (override con\n   --cu-sideover-size-{sm|md|lg|xl|full} en el host) */\n.cu-sideover-panel[data-size='sm'][data-v-90caa8ce] { --cu-sideover-dimension: var(--cu-sideover-size-sm, 320px);\n}\n.cu-sideover-panel[data-size='md'][data-v-90caa8ce] { --cu-sideover-dimension: var(--cu-sideover-size-md, 400px);\n}\n.cu-sideover-panel[data-size='lg'][data-v-90caa8ce] { --cu-sideover-dimension: var(--cu-sideover-size-lg, 512px);\n}\n.cu-sideover-panel[data-size='xl'][data-v-90caa8ce] { --cu-sideover-dimension: var(--cu-sideover-size-xl, 640px);\n}\n.cu-sideover-panel[data-size='full'][data-v-90caa8ce] { --cu-sideover-dimension: var(--cu-sideover-size-full, 100%);\n}\n.cu-sideover-panel--left[data-size][data-v-90caa8ce],\n.cu-sideover-panel--right[data-size][data-v-90caa8ce] { width: var(--cu-sideover-dimension);\n}\n.cu-sideover-panel--top[data-size][data-v-90caa8ce],\n.cu-sideover-panel--bottom[data-size][data-v-90caa8ce] { height: var(--cu-sideover-dimension);\n}\n.cu-sideover-header[data-v-90caa8ce] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  flex-shrink: 0;\n}\n.cu-sideover-title[data-v-90caa8ce] {\n  margin: 0;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-close[data-v-90caa8ce] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  padding: var(--cu-space-2xs);\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: var(--cu-color-neutral);\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.cu-sideover-close[data-v-90caa8ce]:hover { background-color: var(--cu-color-neutral-subtle-hover);\n}\n.cu-sideover-close[data-v-90caa8ce]:focus-visible {\n  outline: 2px solid var(--cu-color-primary);\n  outline-offset: 2px;\n}\n.cu-sideover-body[data-v-90caa8ce] {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: var(--cu-space-lg);\n}\n\n/* Transición: scrim con fade + panel deslizando desde su borde */\n.cu-sideover-enter-active[data-v-90caa8ce],\n.cu-sideover-leave-active[data-v-90caa8ce] {\n  transition: opacity 0.25s ease;\n}\n.cu-sideover-enter-active .cu-sideover-panel[data-v-90caa8ce],\n.cu-sideover-leave-active .cu-sideover-panel[data-v-90caa8ce] {\n  transition: transform 0.25s ease;\n}\n.cu-sideover-enter-from[data-v-90caa8ce],\n.cu-sideover-leave-to[data-v-90caa8ce] {\n  opacity: 0;\n}\n.cu-sideover-enter-from .cu-sideover-panel--left[data-v-90caa8ce],\n.cu-sideover-leave-to .cu-sideover-panel--left[data-v-90caa8ce] { transform: translateX(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--right[data-v-90caa8ce],\n.cu-sideover-leave-to .cu-sideover-panel--right[data-v-90caa8ce] { transform: translateX(100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--top[data-v-90caa8ce],\n.cu-sideover-leave-to .cu-sideover-panel--top[data-v-90caa8ce] { transform: translateY(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--bottom[data-v-90caa8ce],\n.cu-sideover-leave-to .cu-sideover-panel--bottom[data-v-90caa8ce] { transform: translateY(100%);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/overlay/SideOver.vue
var SideOver_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SideOver_vue_vue_type_script_setup_true_lang_default, [["styles", [SideOver_vue_vue_type_style_index_0_inline_scoped_90caa8ce_lang_default]], ["__scopeId", "data-v-90caa8ce"]]);
//#endregion
//#region src/lib/overlay/side-over.ts
var CuSideOver = defineComegenElement("cu-side-over", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "SideOver.ce",
	props: {
		/** Estado de visibilidad (v-model). Ver nota de atributo abajo */
		open: {
			type: Boolean,
			default: false
		},
		/** Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) */
		title: {
			type: String,
			default: ""
		},
		/** Borde desde donde desliza: `left`, `right`, `top`, `bottom` */
		position: {
			type: String,
			default: "right"
		},
		/** Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` */
		size: {
			type: String,
			default: "300px"
		},
		/** Ocupa toda la pantalla */
		fullscreen: {
			type: Boolean,
			default: false
		},
		/** Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar */
		persistent: {
			type: Boolean,
			default: false
		},
		/** Z-index del overlay (en HTML se usa como `z-index`) */
		zIndex: {
			type: Number,
			default: 1100
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		/** Devuelve el estado actual (`boolean`) */
		const isOpen = ref(props.open);
		watch(() => props.open, (value) => {
			isOpen.value = value;
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
		function onUpdate(value) {
			isOpen.value = value;
			ceEmit("update:open", value);
		}
		/** Abre el panel */
		function open() {
			isOpen.value = true;
		}
		/** Cierra el panel */
		function close() {
			isOpen.value = false;
		}
		/** Alterna visibilidad */
		function toggle() {
			isOpen.value = !isOpen.value;
		}
		function isOpenValue() {
			return isOpen.value;
		}
		__expose({
			open,
			close,
			toggle,
			isOpen: isOpenValue
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(SideOver_default, {
				"model-value": isOpen.value,
				title: props.title,
				position: props.position,
				size: props.size,
				fullscreen: props.fullscreen,
				persistent: props.persistent,
				"z-index": props.zIndex,
				"onUpdate:modelValue": onUpdate,
				onClose: _cache[0] || (_cache[0] = ($event) => ceEmit("close", $event))
			}, {
				default: withCtx(() => [createCommentVNode(" Contenido del cuerpo del panel "), renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"model-value",
				"title",
				"position",
				"size",
				"fullscreen",
				"persistent",
				"z-index"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuSideOver as default };
