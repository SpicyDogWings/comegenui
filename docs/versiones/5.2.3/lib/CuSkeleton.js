/*! comegenui v5.2.3 · CuSkeleton (cu-skeleton) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createElementBlock, defineComponent, defineCustomElement, normalizeClass, normalizeStyle, openBlock, renderList } from "vue";
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
oneOf(ORIENTATIONS);
oneOf(DIVIDER_VARIANTS);
var isSkeletonShape = oneOf(SKELETON_SHAPES);
var isSkeletonAnimation = oneOf(SKELETON_ANIMATIONS);
var isSkeletonRadius = oneOf(SKELETON_RADII);
oneOf(NAVBAR_RESPONSIVE_MODES);
oneOf(NAVBAR_SEARCH_MODES);
oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/information/Skeleton.vue?vue&type=script&setup=true&lang.ts
var Skeleton_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Skeleton",
	props: {
		/** `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) */
		shape: {
			type: String,
			required: false,
			default: "rect",
			validator: isSkeletonShape
		},
		/** Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` */
		width: {
			type: String,
			required: false,
			default: ""
		},
		/** Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) */
		height: {
			type: String,
			required: false,
			default: ""
		},
		/** Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) */
		lines: {
			type: Number,
			required: false,
			default: 1
		},
		/** `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima */
		animation: {
			type: String,
			required: false,
			default: "pulse",
			validator: isSkeletonAnimation
		},
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		/** Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) */
		radius: {
			type: String,
			required: false,
			default: "",
			validator: isSkeletonRadius
		}
	},
	setup(__props) {
		const SHAPE_DEFAULTS = {
			rect: {
				width: "100%",
				height: "1rem",
				radius: "md"
			},
			circle: {
				width: "40px",
				height: "40px",
				radius: "full"
			},
			text: {
				width: "100%",
				height: "0.875em",
				radius: "sm"
			}
		};
		const props = __props;
		const shapeDefaults = computed(() => SHAPE_DEFAULTS[props.shape]);
		const resolvedRadius = computed(() => props.radius || shapeDefaults.value.radius);
		const barCount = computed(() => props.shape === "text" ? Math.max(1, Math.floor(props.lines) || 1) : 1);
		const skeletonStyles = computed(() => ({
			"--cu-skeleton-width": props.width || shapeDefaults.value.width,
			"--cu-skeleton-height": props.height || shapeDefaults.value.height,
			"--cu-skeleton-radius": `var(--cu-radius-${resolvedRadius.value})`,
			"--cu-skeleton-bg": `var(--cu-color-${props.color}-soft)`,
			"--cu-skeleton-highlight": `var(--cu-color-${props.color}-subtle)`
		}));
		/** La última línea de un párrafo es más corta (60 %), como el final de un texto. */
		function isShortLine(index) {
			return props.shape === "text" && barCount.value > 1 && index === barCount.value;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass([
					"cu-skeleton",
					`cu-skeleton--${props.shape}`,
					`cu-skeleton--${props.animation}`,
					`cu-skeleton--radius-${resolvedRadius.value}`
				]),
				style: normalizeStyle(skeletonStyles.value),
				"aria-hidden": "true"
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(barCount.value, (line) => {
				return openBlock(), createElementBlock("span", {
					key: line,
					class: normalizeClass(["cu-skeleton-bar", { "cu-skeleton-bar--short": isShortLine(line) }])
				}, null, 2);
			}), 128))], 6);
		};
	}
});
//#endregion
//#region src/components/information/Skeleton.vue?vue&type=style&index=0&inline&scoped=388550cd&lang.css
var Skeleton_vue_vue_type_style_index_0_inline_scoped_388550cd_lang_default = "\n.cu-skeleton[data-v-388550cd] {\n  box-sizing: border-box;\n  width: var(--cu-skeleton-width);\n  border-radius: var(--cu-skeleton-radius);\n}\n.cu-skeleton--rect[data-v-388550cd],\n.cu-skeleton--circle[data-v-388550cd] {\n  height: var(--cu-skeleton-height);\n}\n.cu-skeleton--circle[data-v-388550cd] {\n  flex-shrink: 0;\n}\n\n/* En `text` el contenedor apila las barras: el alto es de cada línea. */\n.cu-skeleton--text[data-v-388550cd] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-xs);\n  height: auto;\n}\n.cu-skeleton-bar[data-v-388550cd] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: var(--cu-skeleton-bg);\n  border-radius: var(--cu-skeleton-radius);\n}\n.cu-skeleton--text .cu-skeleton-bar[data-v-388550cd] {\n  height: var(--cu-skeleton-height);\n}\n.cu-skeleton-bar--short[data-v-388550cd] {\n  width: 60%;\n}\n\n/* ── Animaciones ──────────────────────────────────────────────────────────── */\n.cu-skeleton--pulse .cu-skeleton-bar[data-v-388550cd] {\n  animation: cu-skeleton-pulse-388550cd 1.5s ease-in-out infinite;\n}\n.cu-skeleton--wave .cu-skeleton-bar[data-v-388550cd] {\n  background-image: linear-gradient(\n    90deg,\n    transparent 0%,\n    var(--cu-skeleton-highlight) 50%,\n    transparent 100%\n  );\n  background-repeat: no-repeat;\n  background-size: 200% 100%;\n  animation: cu-skeleton-wave-388550cd 1.6s ease-in-out infinite;\n}\n.cu-skeleton--none .cu-skeleton-bar[data-v-388550cd] {\n  animation: none;\n}\n@keyframes cu-skeleton-pulse-388550cd {\n0%,\n  100% {\n    opacity: 1;\n}\n50% {\n    opacity: 0.45;\n}\n}\n@keyframes cu-skeleton-wave-388550cd {\nfrom {\n    background-position: -100% 0;\n}\nto {\n    background-position: 200% 0;\n}\n}\n\n/* Accesibilidad: sin animación si el sistema lo pide. */\n@media (prefers-reduced-motion: reduce) {\n.cu-skeleton--pulse .cu-skeleton-bar[data-v-388550cd],\n  .cu-skeleton--wave .cu-skeleton-bar[data-v-388550cd] {\n    animation: none;\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Skeleton.vue
var Skeleton_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Skeleton_vue_vue_type_script_setup_true_lang_default, [["styles", [Skeleton_vue_vue_type_style_index_0_inline_scoped_388550cd_lang_default]], ["__scopeId", "data-v-388550cd"]]);
//#endregion
//#region src/lib/information/skeleton.ts
var CuSkeleton = defineComegenElement("cu-skeleton", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Skeleton.ce",
	props: {
		/** `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) */
		shape: {
			type: String,
			default: "rect",
			validator: isSkeletonShape
		},
		/** Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` */
		width: {
			type: String,
			default: ""
		},
		/** Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) */
		height: {
			type: String,
			default: ""
		},
		/** Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) */
		lines: {
			type: Number,
			default: 1
		},
		/** `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima */
		animation: {
			type: String,
			default: "pulse",
			validator: isSkeletonAnimation
		},
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral",
			validator: isColor
		},
		/** Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) */
		radius: {
			type: String,
			default: "",
			validator: isSkeletonRadius
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Skeleton_default, {
				shape: props.shape,
				width: props.width,
				height: props.height,
				lines: props.lines,
				animation: props.animation,
				color: props.color,
				radius: props.radius
			}, null, 8, [
				"shape",
				"width",
				"height",
				"lines",
				"animation",
				"color",
				"radius"
			]);
		};
	}
}), [["styles", ["\n:host {\n  display: block;\n}\n\n/* Un círculo ocupa sólo su tamaño: puede ir dentro de una fila de texto. */\n:host([shape=\"circle\"]) {\n  display: inline-block;\n}\n\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}\n/* layer: default */\n.block{display:block;}\n.inline-block{display:inline-block;}\n"]]]));
//#endregion
export { CuSkeleton as default };
