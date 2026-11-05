/*! comegenui v5.2.4 · CuCard (cu-card) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, defineCustomElement, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, ref, renderSlot, toDisplayString, vShow, withCtx, withDirectives } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.4",
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
/** `Boolean`, `{ type: Boolean }` o `{ type: [String, Boolean] }` → tipos efectivos. */
function typesOf(option) {
	let raw = option;
	if (typeof option === "object" && option !== null && !Array.isArray(option) && "type" in option) raw = option.type;
	const list = Array.isArray(raw) ? raw : [raw];
	return {
		boolean: list.includes(Boolean),
		number: list.includes(Number),
		string: list.includes(String)
	};
}
/** Tipos declarados por prop, en camelCase (cacheado por definición). */
var PROP_TYPES = /* @__PURE__ */ new WeakMap();
function propTypes(def) {
	const cached = PROP_TYPES.get(def);
	if (cached) return cached;
	const map = /* @__PURE__ */ new Map();
	const props = def.props;
	if (props && !Array.isArray(props)) for (const [key, option] of Object.entries(props)) map.set(camelize(key), typesOf(option));
	PROP_TYPES.set(def, map);
	return map;
}
/**
* Atributo del host → valor de la prop. Un atributo llega siempre como string:
* `_setProp` con el string crudo dejaba `disabled="false"` deshabilitado (el
* string es truthy) y `model-value="false"` marcado. Se castea con la misma
* regla que HTML/Vue: un atributo Boolean presente es `true`, salvo el texto
* explícito `"false"` (y `""`/`"true"` → `true`); Number se parsea. Sin tipos
* declarados (`props: ['value']`) no se adivina: el valor queda string.
*/
function castPropValue(value, types) {
	if (!types) return value;
	if (types.boolean) return value.trim().toLowerCase() !== "false";
	if (types.number && !types.string) {
		const parsed = parseFloat(value);
		if (!Number.isNaN(parsed)) return parsed;
	}
	return value;
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
				self._setProp(propKey, castPropValue(value, propTypes(self._def).get(camelKey)), false, true);
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
var isCardLayout = oneOf(CARD_LAYOUTS);
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
//#region src/components/information/Card.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["src"];
var _hoisted_2 = { class: "cu-card-body" };
var _hoisted_3 = {
	key: 0,
	class: "cu-card-title"
};
var _hoisted_4 = {
	key: 1,
	class: "cu-card-subtitle"
};
var _hoisted_5 = { class: "cu-card-content" };
var Card_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Card",
	props: {
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariant
		},
		layout: {
			type: String,
			required: false,
			default: "vertical",
			validator: isCardLayout
		},
		/** Título visible del header (alias preferido de `title`). Si vienen ambos, gana `heading`. */
		heading: {
			type: String,
			required: false
		},
		/**
		* Título visible del header. Se mantiene por compatibilidad: en el custom element el
		* atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda
		* la tarjeta. Usá `heading` para evitarlo.
		*/
		title: {
			type: String,
			required: false
		},
		subtitle: {
			type: String,
			required: false
		},
		image: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		/** Título del header: `heading` es el alias preferido y pisa a `title`. */
		const visibleTitle = computed(() => props.heading ?? props.title);
		/** Un color fuera del set no tiene tokens: la variante solid quedaría sin fondo
		*  y con el texto del tema encima (invisible). Cae al color seguro. */
		const safeColor = computed(() => isColor(props.color) ? props.color : "neutral");
		const colorStyles = computed(() => ({
			"--card-solid": `var(--cu-color-${safeColor.value}-solid)`,
			"--card-solid-text": `var(--cu-color-${safeColor.value}-solid-text)`,
			"--card-border": `var(--cu-color-${safeColor.value}-border)`,
			"--card-text": `var(--cu-color-${safeColor.value}-text)`,
			"--card-text-soft": `var(--cu-color-${safeColor.value}-text-on-soft)`,
			"--card-text-subtle": `var(--cu-color-${safeColor.value}-text-on-subtle)`,
			"--card-soft": `var(--cu-color-${safeColor.value}-soft)`,
			"--card-subtle": `var(--cu-color-${safeColor.value}-subtle)`,
			"--card-subtle-border": `var(--cu-color-${safeColor.value}-subtle-border)`,
			"--card-text-muted": props.variant === "ghost" ? "var(--cu-color-neutral-text-muted)" : `var(--cu-color-${safeColor.value}-text-muted)`
		}));
		const mediaWrap = ref(null);
		const headerWrap = ref(null);
		const footerWrap = ref(null);
		const hasMedia = ref(false);
		const hasMediaSlot = ref(false);
		const hasHeader = ref(false);
		const hasHeaderSlot = ref(false);
		const hasFooter = ref(false);
		function nodeHasContent(node) {
			if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			const el = node;
			if (el.classList.contains("cu-card-image") || el.classList.contains("cu-card-title") || el.classList.contains("cu-card-subtitle")) return false;
			if (el.tagName === "SLOT") return el.assignedNodes().some((assigned) => assigned.nodeType === Node.ELEMENT_NODE || assigned.nodeType === Node.TEXT_NODE && !!assigned.textContent?.trim());
			return true;
		}
		function wrapHasContent(el) {
			return !!el && Array.from(el.childNodes).some(nodeHasContent);
		}
		function detectSlots() {
			hasMediaSlot.value = wrapHasContent(mediaWrap.value);
			hasMedia.value = hasMediaSlot.value || !!props.image;
			hasHeaderSlot.value = wrapHasContent(headerWrap.value);
			hasHeader.value = hasHeaderSlot.value || !!visibleTitle.value || !!props.subtitle;
			hasFooter.value = wrapHasContent(footerWrap.value);
		}
		let slotEls = [];
		onMounted(() => {
			detectSlots();
			slotEls = [
				mediaWrap.value,
				headerWrap.value,
				footerWrap.value
			].flatMap((wrap) => Array.from(wrap?.querySelectorAll("slot") ?? []));
			slotEls.forEach((slot) => slot.addEventListener("slotchange", detectSlots));
		});
		onUpdated(detectSlots);
		onBeforeUnmount(() => {
			slotEls.forEach((slot) => slot.removeEventListener("slotchange", detectSlots));
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("article", {
				class: normalizeClass([
					"cu-card",
					`cu-card--${props.variant}`,
					`cu-card--${props.layout}`
				]),
				style: normalizeStyle(colorStyles.value)
			}, [withDirectives(createElementVNode("div", {
				ref_key: "mediaWrap",
				ref: mediaWrap,
				class: "cu-card-media"
			}, [renderSlot(_ctx.$slots, "media", {}, void 0, true), props.image && !hasMediaSlot.value ? (openBlock(), createElementBlock("img", {
				key: 0,
				src: props.image,
				alt: "",
				class: "cu-card-image"
			}, null, 8, _hoisted_1)) : createCommentVNode("v-if", true)], 512), [[vShow, hasMedia.value]]), createElementVNode("div", _hoisted_2, [
				withDirectives(createElementVNode("header", {
					ref_key: "headerWrap",
					ref: headerWrap,
					class: "cu-card-header"
				}, [
					renderSlot(_ctx.$slots, "header", {}, void 0, true),
					visibleTitle.value && !hasHeaderSlot.value ? (openBlock(), createElementBlock("h3", _hoisted_3, toDisplayString(visibleTitle.value), 1)) : createCommentVNode("v-if", true),
					props.subtitle && !hasHeaderSlot.value ? (openBlock(), createElementBlock("p", _hoisted_4, toDisplayString(props.subtitle), 1)) : createCommentVNode("v-if", true)
				], 512), [[vShow, hasHeader.value]]),
				createElementVNode("div", _hoisted_5, [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				withDirectives(createElementVNode("footer", {
					ref_key: "footerWrap",
					ref: footerWrap,
					class: "cu-card-footer"
				}, [renderSlot(_ctx.$slots, "footer", {}, void 0, true)], 512), [[vShow, hasFooter.value]])
			])], 6);
		};
	}
});
//#endregion
//#region src/components/information/Card.vue?vue&type=style&index=0&inline&scoped=dd50ec8e&lang.css
var Card_vue_vue_type_style_index_0_inline_scoped_dd50ec8e_lang_default = "\n.cu-card[data-v-dd50ec8e] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  border-radius: var(--cu-radius-lg);\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  /* La tarjeta nunca crece más que su contenedor (flex/grid): el contenido se ajusta. */\n  max-width: 100%;\n  /* Se hereda al contenido y al que llega por slot: las palabras largas se cortan\n     en lugar de desbordar y arrastrar el ancho mínimo del layout. */\n  overflow-wrap: anywhere;\n  background-color: var(--cu-color-surface);\n  color: var(--cu-color-neutral);\n  border: var(--cu-border-thin) solid transparent;\n}\n\n/* ghost */\n.cu-card.cu-card--ghost[data-v-dd50ec8e] {\n  background-color: var(--cu-color-surface);\n  color: var(--cu-color-neutral);\n  border-color: var(--cu-border-color);\n  box-shadow: var(--cu-shadow-md);\n}\n\n/* solid: el borde (`-border`, ≥3:1 contra la superficie) delimita la tarjeta\n   cuando el relleno por sí solo no alcanza ese piso. */\n.cu-card.cu-card--solid[data-v-dd50ec8e] {\n  background-color: var(--card-solid);\n  color: var(--card-solid-text);\n  border-color: var(--card-border);\n}\n.cu-card.cu-card--solid .cu-card-title[data-v-dd50ec8e] {\n  color: var(--card-solid-text);\n}\n\n/* soft */\n.cu-card.cu-card--soft[data-v-dd50ec8e] {\n  background-color: var(--card-soft);\n  color: var(--card-text-soft);\n}\n\n/* subtle */\n.cu-card.cu-card--subtle[data-v-dd50ec8e] {\n  background-color: var(--card-subtle);\n  color: var(--card-text-subtle);\n  border-color: var(--card-subtle-border);\n}\n\n/* outlined */\n.cu-card.cu-card--outlined[data-v-dd50ec8e] {\n  background-color: transparent;\n  color: var(--card-text);\n  border-color: var(--card-border);\n}\n.cu-card-media[data-v-dd50ec8e] {\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n  overflow: hidden;\n}\n.cu-card-image[data-v-dd50ec8e] {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n  object-fit: cover;\n}\n\n/* horizontal: media al costado, contenido a la derecha */\n.cu-card--horizontal[data-v-dd50ec8e] {\n  flex-direction: row;\n}\n.cu-card--horizontal .cu-card-media[data-v-dd50ec8e] {\n  flex: 0 0 40%;\n  max-width: 40%;\n}\n.cu-card--horizontal .cu-card-image[data-v-dd50ec8e] {\n  height: 100%;\n  min-height: 100%;\n  object-fit: cover;\n}\n.cu-card--horizontal .cu-card-body[data-v-dd50ec8e] {\n  flex: 1;\n  min-width: 0;\n}\n.cu-card-body[data-v-dd50ec8e] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-md);\n  padding: var(--cu-space-lg);\n  box-sizing: border-box;\n  /* Sin esto el cuerpo no baja de su ancho mínimo y empuja la tarjeta en horizontal. */\n  min-width: 0;\n}\n.cu-card-header[data-v-dd50ec8e] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  min-width: 0;\n}\n.cu-card-title[data-v-dd50ec8e] {\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: inherit;\n}\n.cu-card-subtitle[data-v-dd50ec8e] {\n  font-size: var(--cu-font-size-sm);\n  margin: 0;\n  color: var(--card-text-muted);\n}\n/* Sobre solid no hay token atenuado: el texto del tema ya contrasta (≥4.5:1). */\n.cu-card.cu-card--solid .cu-card-subtitle[data-v-dd50ec8e] {\n  color: var(--card-solid-text);\n}\n.cu-card-content[data-v-dd50ec8e] {\n  color: inherit;\n  line-height: var(--cu-line-height-relaxed);\n  min-width: 0;\n}\n.cu-card-footer[data-v-dd50ec8e] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--cu-space-sm);\n  min-width: 0;\n  padding-top: var(--cu-space-md);\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Card.vue
var Card_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Card_vue_vue_type_script_setup_true_lang_default, [["styles", [Card_vue_vue_type_style_index_0_inline_scoped_dd50ec8e_lang_default]], ["__scopeId", "data-v-dd50ec8e"]]);
//#endregion
//#region src/lib/information/card.ts
var CuCard = defineComegenElement("cu-card", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Card.ce",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** `ghost` (default), `outlined`, `soft`, `subtle`, `solid` */
		variant: {
			type: String,
			default: "ghost"
		},
		/** `vertical` (media arriba) o `horizontal` (media al costado) */
		layout: {
			type: String,
			default: "vertical"
		},
		/** Título del header (alias preferido de `title`). Si vienen ambos, gana `heading`. */
		heading: String,
		/**
		* Título del header. Se mantiene por compatibilidad: el atributo `title` queda en el
		* host y el navegador muestra su tooltip nativo sobre toda la tarjeta. Usá `heading`
		* para evitar el tooltip.
		*/
		title: String,
		/** Subtítulo bajo el título */
		subtitle: String,
		/** URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) */
		image: String
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Card_default, {
				color: props.color,
				variant: props.variant,
				layout: props.layout,
				heading: props.heading,
				title: props.title,
				subtitle: props.subtitle,
				image: props.image
			}, {
				media: withCtx(() => [createCommentVNode(" Contenido de la parte superior (si no se usa el prop `image`). Reemplaza la imagen "), renderSlot(_ctx.$slots, "media")]),
				header: withCtx(() => [createCommentVNode(" Reemplaza el título/subtítulo por defecto "), renderSlot(_ctx.$slots, "header")]),
				footer: withCtx(() => [createCommentVNode(" Contenido al pie de la tarjeta (se separa con una línea) "), renderSlot(_ctx.$slots, "footer")]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"color",
				"variant",
				"layout",
				"heading",
				"title",
				"subtitle",
				"image"
			]);
		};
	}
}), [["styles", ["\n/* El `:host` va antes del placeholder a propósito: UnoCSS inserta su CSS donde está el\n   marcador y, si el marcador termina en `;`, el parser del browser descarta la regla siguiente. */\n:host {\n  display: block;\n  /* La tarjeta nunca crece más que su contenedor (flex/grid): el contenido se ajusta\n     adentro en lugar de empujar el ancho del host y desbordar la página. */\n  max-width: 100%;\n}\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.block{display:block;}\n.pie{padding-inline-end:1rem;}\n"]]]));
//#endregion
export { CuCard as default };
