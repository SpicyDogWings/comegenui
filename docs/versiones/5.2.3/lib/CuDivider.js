/*! comegenui v5.2.3 · CuDivider (cu-divider) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, defineComponent, defineCustomElement, getCurrentInstance, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, openBlock, ref, renderSlot, toDisplayString, useSlots, withCtx } from "vue";
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
