/*! comegenui v5.2.3 · CuAlert (cu-alert) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, ref, renderSlot, toDisplayString, vShow, watch, withCtx, withDirectives } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.3",
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
/** `aria-describedby` → `ariaDescribedby` (mismo algoritmo que Vue). */
function camelize(name) {
	return name.replace(/-(\w)/g, (_, char) => char ? char.toUpperCase() : "");
}
/** Props declaradas por el componente, en camelCase (cacheado por definición). */
var PROP_KEYS = /* @__PURE__ */ new WeakMap();
function declaredProps(def) {
	const cached = PROP_KEYS.get(def);
	if (cached) return cached;
	const props = def.props;
	const keys = !props ? [] : Array.isArray(props) ? props : Object.keys(props);
	const set = new Set(keys.map((key) => camelize(String(key))));
	PROP_KEYS.set(def, set);
	return set;
}
/** `tabindex` del host se reenvía al control real; en el host queda `-1`. */
var FOCUS_ATTR = "tabindex";
/**
* ARIA que referencia elementos por id y el atributo textual con el que se
* reemplaza cuando el id vive fuera del shadow tree. Los IDREF de ARIA se
* resuelven por árbol: un `aria-labelledby` dentro del shadow que apunta al
* documento queda inválido en Chrome (el nombre/descripción no llega al
* control). El atributo original se copia igual, exacto, y además se sintetiza
* el texto accesible desde los nodos referenciados.
*/
var IDREF_FALLBACK = {
	"aria-labelledby": "aria-label",
	"aria-describedby": "aria-description"
};
/** Busca un id en un árbol (documento o shadow root), sin cruzar de árbol. */
function byId(tree, id) {
	const lookup = tree;
	if (typeof lookup.getElementById === "function") return lookup.getElementById(id);
	if (tree instanceof Document || tree instanceof ShadowRoot) return tree.querySelector(`[id="${id.replace(/["\\]/g, "\\$&")}"]`);
	return null;
}
/**
* Constructor del custom element. Subclasea el que genera Vue para corregir el
* único punto donde pierde información: `_setAttr`.
*
* Vue cameliza *todo* atributo del host antes de pasarlo como prop
* (`aria-describedby` → `ariaDescribedby`). Como los atributos que no son props
* caen al nodo raíz por fallthrough, el nodo interno terminaba con
* `ariadescribedby`, `datatestid`, `foobar`… y el nombre accesible no resolvía.
* Acá los atributos desconocidos se guardan con su nombre original exacto: Vue
* los aplica tal cual al nodo raíz. Las props declaradas siguen yendo por su
* nombre camelCase normal.
*/
function makeElement(component, meta) {
	const Base = defineCustomElement(component);
	class ComegenCustomElement extends Base {
		/**
		* Reflejos de `tabindex` que hicimos nosotros (host → `-1`). Se cuentan
		* porque el MutationObserver de Vue puede entregar varias mutaciones en un
		* mismo lote y no hay que confundir nuestra escritura con la del usuario.
		* Empieza con `_` para que el contrato runtime no lo exponga como prop.
		*/
		_reflectedTabindex = 0;
		/** Texto accesible sintetizado que escribimos en el nodo raíz (para no pisar al autor). */
		_ariaFallbackValues = {};
		_ariaObserver = null;
		_setAttr(key) {
			if (key.startsWith("data-v-")) return;
			const self = this;
			const camelKey = camelize(key);
			const isProp = declaredProps(self._def).has(camelKey);
			if (!isProp && key === "id") return;
			if (!isProp && key === FOCUS_ATTR) {
				const current = this.getAttribute(FOCUS_ATTR);
				if (current === "-1" && this._reflectedTabindex > 0) {
					this._reflectedTabindex -= 1;
					return;
				}
				if (current !== null && current !== "-1") {
					this._applyProp(key, current, camelKey);
					this._reflectedTabindex += 1;
					this.setAttribute(FOCUS_ATTR, "-1");
					return;
				}
			}
			this._applyProp(isProp ? camelKey : key, this.getAttribute(key), camelKey);
		}
		/** Aplica el atributo del host al vnode prop (o lo quita si ya no está). */
		_applyProp(propKey, value, camelKey) {
			const self = this;
			if (value !== null) {
				let parsed = value;
				if (self._numberProps?.[camelKey]) {
					const n = parseFloat(value);
					if (!Number.isNaN(n)) parsed = n;
				}
				self._setProp(propKey, parsed, false, true);
				return;
			}
			if (!Object.prototype.hasOwnProperty.call(self._props, propKey)) return;
			delete self._props[propKey];
			self._dirty = true;
			if (self._instance) self._update();
		}
		_mountComponent(def) {
			super._mountComponent(def);
			this._syncAriaFallback();
		}
		_update() {
			super._update();
			this._syncAriaFallback();
		}
		disconnectedCallback() {
			super.disconnectedCallback();
			this._ariaObserver?.disconnect();
		}
		/**
		* Resuelve `aria-labelledby`/`aria-describedby` del host contra el nodo
		* raíz. Cuando el id referenciado está fuera del shadow tree, el IDREF no
		* puede resolver desde adentro: se sintetiza `aria-label`/`aria-description`
		* con el texto de los elementos referenciados. El autor manda: si puso
		* `aria-label`/`aria-description` explícito no se toca.
		*/
		_syncAriaFallback() {
			const root = this._instance?.subTree?.el;
			const entries = Object.entries(IDREF_FALLBACK);
			const hasRefs = entries.some(([attr]) => this.hasAttribute(attr));
			if (!(root instanceof HTMLElement) || !hasRefs && !Object.keys(this._ariaFallbackValues).length) {
				this._ariaObserver?.disconnect();
				return;
			}
			const rootTree = root.getRootNode();
			const hostTree = this.getRootNode();
			const observer = this._ensureAriaObserver();
			observer?.disconnect();
			let observing = 0;
			for (const [attr, fallback] of entries) {
				const authorSet = this.hasAttribute(fallback);
				const written = this._ariaFallbackValues[fallback];
				const value = this.getAttribute(attr);
				let text;
				if (value && !authorSet) {
					const ids = value.split(/\s+/).filter(Boolean);
					if (ids.some((id) => !byId(rootTree, id) && byId(hostTree, id))) {
						const parts = ids.map((id) => byId(rootTree, id) ?? byId(hostTree, id)).map((el) => el?.textContent?.trim() ?? "").filter(Boolean);
						if (parts.length) {
							text = parts.join(" ");
							for (const id of ids) {
								const el = byId(hostTree, id);
								if (!el || byId(rootTree, id)) continue;
								observer?.observe(el, {
									subtree: true,
									childList: true,
									characterData: true
								});
								observing += 1;
							}
						}
					}
				}
				if (text === void 0) {
					if (written !== void 0) {
						if (!authorSet && root.getAttribute(fallback) === written) root.removeAttribute(fallback);
						delete this._ariaFallbackValues[fallback];
					}
					continue;
				}
				if (!authorSet && root.getAttribute(fallback) !== text) root.setAttribute(fallback, text);
				this._ariaFallbackValues[fallback] = text;
			}
			if (!observing) observer?.disconnect();
		}
		_ensureAriaObserver() {
			if (typeof MutationObserver === "undefined") return null;
			if (!this._ariaObserver) this._ariaObserver = new MutationObserver(() => this._syncAriaFallback());
			return this._ariaObserver;
		}
	}
	return attachMeta(ComegenCustomElement, meta);
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
			"--alert-solid": `var(--cu-color-${props.color}-solid)`,
			"--alert-solid-hover": `var(--cu-color-${props.color}-solid-hover)`,
			"--alert-solid-active": `var(--cu-color-${props.color}-solid-active)`,
			"--alert-solid-text": `var(--cu-color-surface)`,
			"--alert-border": `var(--cu-color-${props.color}-border)`,
			"--alert-text": `var(--cu-color-${props.color}-text)`,
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
//#region src/components/information/Alert.vue?vue&type=style&index=0&inline&scoped=5c95ed82&lang.css
var Alert_vue_vue_type_style_index_0_inline_scoped_5c95ed82_lang_default = "\n.cu-alert-icon-detect[data-v-5c95ed82] {\n  display: none;\n}\n.cu-alert[data-v-5c95ed82] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  box-sizing: border-box;\n  position: relative;\n}\n\n/* solid */\n.cu-alert.cu-alert--solid[data-v-5c95ed82] {\n  background-color: var(--alert-solid);\n  color: var(--alert-solid-text);\n}\n.cu-alert.cu-alert--solid .cu-alert-title-text[data-v-5c95ed82] {\n  color: var(--alert-solid-text);\n}\n\n/* ghost */\n.cu-alert.cu-alert--ghost[data-v-5c95ed82] {\n  background-color: transparent;\n  color: var(--alert-text);\n}\n\n/* soft */\n.cu-alert.cu-alert--soft[data-v-5c95ed82] {\n  background-color: var(--alert-soft);\n  color: var(--alert-text);\n}\n\n/* subtle */\n.cu-alert.cu-alert--subtle[data-v-5c95ed82] {\n  background-color: var(--alert-subtle);\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-subtle-border);\n}\n\n/* outlined */\n.cu-alert.cu-alert--outlined[data-v-5c95ed82] {\n  background-color: transparent;\n  color: var(--alert-text);\n  border: var(--cu-border-thin) solid var(--alert-border);\n}\n.cu-alert-header[data-v-5c95ed82] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.cu-alert-title[data-v-5c95ed82] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-alert-title-text[data-v-5c95ed82] {\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: inherit;\n}\n.cu-alert-close[data-v-5c95ed82] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: inherit;\n  padding: var(--cu-space-2xs);\n  border-radius: var(--cu-radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 150ms ease;\n}\n.cu-alert-close[data-v-5c95ed82]:hover {\n  background-color: var(--alert-ghost-hover);\n}\n.cu-alert-close[data-v-5c95ed82]:active {\n  background-color: var(--alert-ghost-active);\n}\n\n/* Sin título ni ícono: el close acompaña a la primera fila del cuerpo en vez\n   de ocupar una cabecera propia. */\n.cu-alert-close--floating[data-v-5c95ed82] {\n  position: absolute;\n  top: var(--cu-space-md);\n  right: var(--cu-space-lg);\n}\n.cu-alert--floating-close .cu-alert-content[data-v-5c95ed82] {\n  padding-right: var(--cu-space-xl);\n}\n.cu-alert-content[data-v-5c95ed82] {\n  color: inherit;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Alert.vue
var Alert_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Alert_vue_vue_type_script_setup_true_lang_default, [["styles", [Alert_vue_vue_type_style_index_0_inline_scoped_5c95ed82_lang_default]], ["__scopeId", "data-v-5c95ed82"]]);
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
