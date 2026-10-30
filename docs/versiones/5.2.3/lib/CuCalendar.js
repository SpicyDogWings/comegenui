/*! comegenui v5.2.3 · CuCalendar (cu-calendar) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, nextTick, normalizeClass, normalizeStyle, openBlock, ref, renderList, renderSlot, toDisplayString, unref, watch, withCtx, withKeys, withModifiers } from "vue";
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
var isVariant = oneOf(VARIANTS);
var isVariantFull = oneOf(VARIANTS_FULL);
var isVariantNoGhost = oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
var isButtonType = oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
oneOf(LABEL_POSITIONS);
var isTarget = oneOf(TARGETS);
var isDateMode = oneOf(DATE_MODES);
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
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = ["width", "height"];
//#endregion
//#region src/components/icons/IconBase.vue
var IconBase_default = /* @__PURE__ */ defineComponent({
	__name: "IconBase",
	props: {
		width: {
			default: "1em",
			type: [Number, String]
		},
		height: {
			default: "1em",
			type: [Number, String]
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: __props.width,
				height: __props.height,
				viewBox: "0 0 24 24"
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$4);
		};
	}
});
//#endregion
//#region src/components/icons/LucideLoader.vue
var LucideLoader_default = /* @__PURE__ */ defineComponent({
	__name: "LucideLoader",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("g", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2"
				}, [
					createElementVNode("path", { d: "M12 2v4" }),
					createElementVNode("path", { d: "m16.2 7.8 2.9-2.9" }),
					createElementVNode("path", { d: "M18 12h4" }),
					createElementVNode("path", { d: "m16.2 16.2 2.9 2.9" }),
					createElementVNode("path", { d: "M12 18v4" }),
					createElementVNode("path", { d: "m4.9 19.1 2.9-2.9" }),
					createElementVNode("path", { d: "M2 12h4" }),
					createElementVNode("path", { d: "m4.9 4.9 2.9 2.9" })
				], -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/buttons/Button.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = [
	"href",
	"target",
	"rel",
	"role",
	"aria-disabled",
	"aria-busy",
	"tabindex"
];
var _hoisted_2$1 = [
	"type",
	"disabled",
	"aria-busy"
];
var Button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Button",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariantFull
		},
		/** Tamaño: `sm`, `md`, `lg` */
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		},
		/** Si se especifica, el botón se renderiza como `<a>` */
		to: {
			type: String,
			required: false
		},
		/** Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` */
		target: {
			type: String,
			required: false,
			default: "_self",
			validator: isTarget
		},
		/** Tipo del `<button>`: `button`, `submit`, `reset` */
		type: {
			type: String,
			required: false,
			default: "button",
			validator: isButtonType
		},
		/** Estado deshabilitado */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Antepone un spinner al contenido. Deshabilita el botón mientras está activo */
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Padding cuadrado para un botón de solo icono. El contenido necesita nombre accesible (`aria-label` o texto) */
		iconOnly: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["loading-change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const isDisabled = computed(() => props.disabled || props.loading);
		const safeColor = computed(() => isColor(props.color) ? props.color : "neutral");
		const buttonType = computed(() => isButtonType(props.type) ? props.type : "button");
		const safeTo = computed(() => {
			const value = props.to?.trim();
			if (!value) return void 0;
			const compact = value.replace(/[\u0000-\u0020]+/g, "");
			if (/^(?:javascript|vbscript|data):/i.test(compact)) return void 0;
			return props.to;
		});
		function onLinkClick(event) {
			if (!isDisabled.value) return;
			event.preventDefault();
			event.stopPropagation();
		}
		function onButtonClick(event) {
			if (buttonType.value !== "submit" && buttonType.value !== "reset") return;
			const button = event.currentTarget;
			const root = button?.getRootNode();
			if (!button || !(root instanceof ShadowRoot)) return;
			const host = root.host;
			const formId = host?.getAttribute("form");
			const form = formId ? document.getElementById(formId) : host?.closest("form");
			if (!form) return;
			event.preventDefault();
			if (buttonType.value === "reset") {
				form.reset();
				return;
			}
			if (typeof form.requestSubmit !== "function") {
				form.submit();
				return;
			}
			if (button.formNoValidate) {
				const previous = form.noValidate;
				form.noValidate = true;
				try {
					form.requestSubmit();
				} finally {
					form.noValidate = previous;
				}
				return;
			}
			form.requestSubmit();
		}
		const emit = __emit;
		watch(() => props.loading, (value) => emit("loading-change", value));
		const colorStyles = computed(() => ({
			"--btn-ghost-hover": `var(--cu-color-${safeColor.value}-ghost-hover)`,
			"--btn-ghost-active": `var(--cu-color-${safeColor.value}-ghost-active)`,
			"--btn-soft": `var(--cu-color-${safeColor.value}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${safeColor.value}-soft-hover)`,
			"--btn-soft-active": `var(--cu-color-${safeColor.value}-soft-active)`,
			"--btn-subtle": `var(--cu-color-${safeColor.value}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${safeColor.value}-subtle-hover)`,
			"--btn-subtle-active": `var(--cu-color-${safeColor.value}-subtle-active)`,
			"--btn-subtle-border": `var(--cu-color-${safeColor.value}-subtle-border)`,
			"--btn-solid": `var(--cu-color-${safeColor.value}-solid)`,
			"--btn-solid-hover": `var(--cu-color-${safeColor.value}-solid-hover)`,
			"--btn-solid-active": `var(--cu-color-${safeColor.value}-solid-active)`,
			"--btn-solid-text": `var(--cu-color-surface)`,
			"--btn-text": `var(--cu-color-${safeColor.value}-text)`,
			"--btn-border": `var(--cu-color-${safeColor.value}-border)`
		}));
		const rootClasses = computed(() => [
			"cu-button",
			`cu-button--${props.variant}`,
			`cu-button--${props.size}`,
			{
				"cu-button--disabled": isDisabled.value,
				"cu-button--icon-only": props.iconOnly,
				"cu-button-link": !!safeTo.value
			}
		]);
		return (_ctx, _cache) => {
			return safeTo.value ? (openBlock(), createElementBlock("a", {
				key: 0,
				href: isDisabled.value ? void 0 : safeTo.value,
				target: isDisabled.value ? void 0 : props.target,
				rel: props.target === "_blank" && !isDisabled.value ? "noopener noreferrer" : void 0,
				role: isDisabled.value ? "link" : void 0,
				"aria-disabled": isDisabled.value ? "true" : void 0,
				"aria-busy": props.loading ? "true" : void 0,
				tabindex: isDisabled.value ? -1 : void 0,
				class: normalizeClass(rootClasses.value),
				style: normalizeStyle(colorStyles.value),
				onClick: onLinkClick
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner",
					"aria-hidden": "true",
					focusable: "false"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_1$3)) : (openBlock(), createElementBlock("button", {
				key: 1,
				type: buttonType.value,
				class: normalizeClass(rootClasses.value),
				style: normalizeStyle(colorStyles.value),
				disabled: isDisabled.value,
				"aria-busy": props.loading ? "true" : void 0,
				onClick: onButtonClick
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner",
					"aria-hidden": "true",
					focusable: "false"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_2$1));
		};
	}
});
//#endregion
//#region src/components/buttons/Button.vue?vue&type=style&index=0&inline&scoped=cb9decf8&lang.css
var Button_vue_vue_type_style_index_0_inline_scoped_cb9decf8_lang_default = "\n.cu-button[data-v-cb9decf8] {\n  font-family: var(--cu-font-sans);\n  text-decoration: none;\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  box-sizing: border-box;\n  transition: all 150ms ease;\n}\n.cu-button[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  transform: scale(0.97);\n}\n.cu-button--disabled[data-v-cb9decf8] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* sizes (md = base; link mantiene su padding 0) */\n.cu-button--sm[data-v-cb9decf8]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-xs);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-button--lg[data-v-cb9decf8]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-lg);\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n}\n\n/* solid */\n.cu-button.cu-button--solid[data-v-cb9decf8] {\n  background-color: var(--btn-solid);\n  color: var(--btn-solid-text);\n}\n.cu-button.cu-button--solid[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-hover);\n}\n.cu-button.cu-button--solid[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-active);\n}\n\n/* ghost */\n.cu-button.cu-button--ghost[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n}\n.cu-button.cu-button--ghost[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--ghost[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* soft */\n.cu-button.cu-button--soft[data-v-cb9decf8] {\n  background-color: var(--btn-soft);\n  color: var(--btn-text);\n}\n.cu-button.cu-button--soft[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n.cu-button.cu-button--soft[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-active);\n}\n\n/* subtle */\n.cu-button.cu-button--subtle[data-v-cb9decf8] {\n  background-color: var(--btn-subtle);\n  color: var(--btn-text);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-button.cu-button--subtle[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n.cu-button.cu-button--subtle[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-active);\n}\n\n/* outlined */\n.cu-button.cu-button--outlined[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n  border: var(--cu-border-thin) solid var(--btn-border);\n}\n.cu-button.cu-button--outlined[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--outlined[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* link */\n.cu-button.cu-button--link[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n  padding: 0;\n  box-shadow: none;\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button.cu-button--link[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  text-decoration-thickness: 2px;\n}\n\n/* none */\n.cu-button.cu-button--none[data-v-cb9decf8] {\n  background-color: var(--btn-solid);\n  color: var(--btn-solid-text);\n}\n.cu-button.cu-button--none[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-hover);\n}\n.cu-button.cu-button--none[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-active);\n}\n\n/* link wrapper */\n.cu-button-link[data-v-cb9decf8] {\n  text-decoration: none;\n}\n.cu-button-link[data-v-cb9decf8]:hover {\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button-link.cu-button--disabled[data-v-cb9decf8] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* icon-only */\n.cu-button--icon-only[data-v-cb9decf8] {\n  padding: var(--cu-space-sm);\n}\n\n/* loading spinner */\n.cu-button-spinner[data-v-cb9decf8] {\n  animation: cu-spin-cb9decf8 0.8s linear infinite;\n}\n@keyframes cu-spin-cb9decf8 {\nfrom { transform: rotate(0deg);\n}\nto { transform: rotate(360deg);\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.cu-button[data-v-cb9decf8] {\n    transition: none;\n}\n.cu-button[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n    transform: none;\n}\n.cu-button-spinner[data-v-cb9decf8] {\n    animation: none;\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/buttons/Button.vue
var Button_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Button_vue_vue_type_script_setup_true_lang_default, [["styles", [Button_vue_vue_type_style_index_0_inline_scoped_cb9decf8_lang_default]], ["__scopeId", "data-v-cb9decf8"]]);
//#endregion
//#region src/components/icons/LucideChevronLeft.vue
var LucideChevronLeft_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronLeft",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m15 18l-6-6l6-6"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronRight.vue
var LucideChevronRight_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronRight",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m9 18l6-6l-6-6"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronsLeft.vue
var LucideChevronsLeft_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronsLeft",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m11 17l-5-5l5-5"
				}, null, -1), createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m18 17l-5-5l5-5"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/icons/LucideChevronsRight.vue
var LucideChevronsRight_default = /* @__PURE__ */ defineComponent({
	__name: "LucideChevronsRight",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m6 17l5-5l-5-5"
				}, null, -1), createElementVNode("path", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2",
					d: "m13 17l5-5l-5-5"
				}, null, -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/information/Badge.vue
var Badge_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Badge",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `solid`, `outlined`, `soft`, `ghost`, `subtle` */
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isVariant
		}
	},
	setup(__props) {
		const props = __props;
		const badgeStyles = computed(() => ({
			"--badge-solid": `var(--cu-color-${props.color}-solid)`,
			"--badge-border": `var(--cu-color-${props.color}-border)`,
			"--badge-solid-text": `var(--cu-color-surface)`,
			"--badge-text": `var(--cu-color-${props.color}-text)`,
			"--badge-soft": `var(--cu-color-${props.color}-soft)`,
			"--badge-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--badge-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--badge-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--badge-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: normalizeClass(["cu-badge", `cu-badge--${props.variant}`]),
				style: normalizeStyle(badgeStyles.value)
			}, [createCommentVNode(" Contenido textual o ícono del badge "), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 6);
		};
	}
}), [["styles", ["\n.cu-badge[data-v-72234801] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-xs);\n  padding: var(--cu-space-2xs) var(--cu-space-sm);\n  border-radius: var(--cu-radius);\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  line-height: var(--cu-line-height-tight);\n  white-space: nowrap;\n  box-sizing: border-box;\n  border: var(--cu-border-thin) solid transparent;\n}\n\n/* solid */\n.cu-badge.cu-badge--solid[data-v-72234801] {\n  background-color: var(--badge-solid);\n  color: var(--badge-solid-text);\n}\n\n/* soft */\n.cu-badge.cu-badge--soft[data-v-72234801] {\n  background-color: var(--badge-soft);\n  color: var(--badge-text);\n}\n\n/* ghost */\n.cu-badge.cu-badge--ghost[data-v-72234801] {\n  background-color: transparent;\n  color: var(--badge-text);\n}\n\n/* subtle */\n.cu-badge.cu-badge--subtle[data-v-72234801] {\n  background-color: var(--badge-subtle);\n  color: var(--badge-text);\n  border-color: var(--badge-subtle-border);\n}\n\n/* outlined */\n.cu-badge.cu-badge--outlined[data-v-72234801] {\n  background-color: transparent;\n  color: var(--badge-text);\n  border-color: var(--badge-border);\n}\n"]], ["__scopeId", "data-v-72234801"]]);
//#endregion
//#region src/components/controls/month-slider/MonthSliderLabel.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = [
	"role",
	"tabindex",
	"aria-label"
];
//#endregion
//#region src/components/controls/month-slider/MonthSliderLabel.vue
var MonthSliderLabel_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MonthSliderLabel",
	props: {
		/** Texto principal del label (mes o año). */
		label: {
			type: String,
			required: true
		},
		/** Texto del año mostrado como badge al lado del label. */
		year: {
			type: String,
			default: ""
		},
		/** Deshabilita la interacción del label. */
		disabled: {
			type: Boolean,
			default: false
		},
		draggable: {
			type: Boolean,
			default: true
		},
		/** Color semántico del label. */
		color: {
			type: String,
			default: "primary"
		},
		/** Variante visual del label. */
		variant: {
			type: String,
			default: "soft"
		},
		threshold: {
			type: Number,
			default: 96
		},
		steps: {
			type: Number,
			default: 1
		},
		canNavigatePrev: {
			type: Boolean,
			default: true
		},
		/** Indica si se puede navegar al paso siguiente. */
		canNavigateNext: {
			type: Boolean,
			default: true
		}
	},
	emits: ["navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const yearBadgeVariant = computed(() => props.variant === "solid" ? "subtle" : "solid");
		const root = ref(null);
		const dragging = ref(false);
		const offsetX = ref(0);
		const fired = ref(false);
		let pointerId = 0;
		let lastX = 0;
		let accX = 0;
		function onPointerDown(event) {
			if (props.disabled || !props.draggable) return;
			dragging.value = true;
			pointerId = event.pointerId;
			lastX = event.clientX;
			accX = 0;
			fired.value = false;
			root.value?.setPointerCapture(pointerId);
		}
		function onPointerMove(event) {
			if (!dragging.value || event.pointerId !== pointerId || fired.value) return;
			const dx = event.clientX - lastX;
			lastX = event.clientX;
			accX += dx;
			const dir = accX < 0 ? 1 : -1;
			if (dir === 1 ? !props.canNavigateNext : !props.canNavigatePrev) {
				accX = dir === 1 ? -props.threshold : props.threshold;
				offsetX.value = accX;
				return;
			}
			offsetX.value = Math.max(-props.threshold, Math.min(props.threshold, accX));
			if (Math.abs(accX) >= props.threshold) {
				emit("navigate", dir * props.steps);
				fired.value = true;
				offsetX.value = 0;
			}
		}
		function endDrag() {
			if (!dragging.value) return;
			dragging.value = false;
			fired.value = false;
			accX = 0;
			offsetX.value = 0;
			try {
				root.value?.releasePointerCapture(pointerId);
			} catch {}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "root",
				ref: root,
				class: normalizeClass(["cu-month-slider-label", [`cu-month-slider-label--${props.variant}`, {
					"is-draggable": props.draggable,
					"is-dragging": dragging.value,
					"is-fired": fired.value,
					"is-disabled": props.disabled
				}]]),
				style: normalizeStyle({ "--drag-offset": `${offsetX.value}px` }),
				role: props.draggable ? "button" : "group",
				tabindex: props.draggable ? 0 : -1,
				"aria-label": props.year ? `${props.label} ${props.year}` : props.label,
				onPointerdown: onPointerDown,
				onPointermove: onPointerMove,
				onPointerup: endDrag,
				onPointercancel: endDrag,
				onKeydown: [_cache[0] || (_cache[0] = withKeys(withModifiers(($event) => props.draggable && props.canNavigatePrev && emit("navigate", -1 * props.steps), ["prevent"]), ["left"])), _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => props.draggable && props.canNavigateNext && emit("navigate", props.steps), ["prevent"]), ["right"]))]
			}, [(openBlock(), createElementBlock("span", {
				key: props.label,
				class: "cu-month-slider-label-month"
			}, toDisplayString(props.label), 1)), props.year ? (openBlock(), createBlock(Badge_default, {
				key: props.year,
				class: "cu-month-slider-label-year",
				color: props.color,
				variant: yearBadgeVariant.value
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(props.year), 1)]),
				_: 1
			}, 8, ["color", "variant"])) : createCommentVNode("v-if", true)], 46, _hoisted_1$2);
		};
	}
}), [["styles", ["\n.cu-month-slider-label[data-v-eb1de7ed] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  min-width: 150px;\n  justify-content: center;\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: var(--cu-border-none) solid transparent;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-md);\n  font-weight: var(--cu-font-weight-semibold);\n  cursor: default;\n  user-select: none;\n  touch-action: pan-y;\n  transform: translateX(var(--drag-offset, 0px));\n  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease, color 0.25s ease;\n  will-change: transform;\n}\n\n/* solid: doble clase para ganarle a reglas globales del consumidor (convención del repo).\n   Fondo `-solid` (la variante ajustada del generador) y texto `surface`: el par que\n   los tokens garantizan ≥4.5:1 en los 15 temas. */\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-eb1de7ed] {\n  background-color: var(--ms-solid);\n  color: var(--ms-surface);\n}\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-eb1de7ed]:hover {\n  background-color: var(--ms-solid-hover);\n}\n\n/* outlined */\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-eb1de7ed] {\n  background-color: transparent;\n  color: var(--ms-accent-text);\n  border: var(--cu-border-thin) solid var(--ms-accent-border);\n}\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-eb1de7ed]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* soft (default). El texto va con `-text` (contraste AA sobre el tinte); con el\n   color base (`--ms-accent`) quedaba en 1.57–4.25:1 según el tema. */\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-eb1de7ed] {\n  background-color: var(--ms-soft);\n  color: var(--ms-accent-text);\n}\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-eb1de7ed]:hover {\n  background-color: var(--ms-soft-hover);\n}\n\n/* ghost */\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-eb1de7ed] {\n  background-color: transparent;\n  color: var(--ms-accent-text);\n}\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-eb1de7ed]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* subtle */\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-eb1de7ed] {\n  background-color: var(--ms-subtle);\n  color: var(--ms-accent-text);\n  border: var(--cu-border-thin) solid var(--ms-subtle-border);\n}\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-eb1de7ed]:hover {\n  background-color: var(--ms-subtle-hover);\n}\n\n/* El texto del mes lleva color explícito (inherit del root) con especificidad\n   suficiente para ganarle a reglas globales del consumidor tipo\n   `.playground :is(h1, ..., span, ...) { color: ... }` que pegan en spans internos.\n   La clase scoped [data-v] sube la regla a (0,3,0). */\n.cu-month-slider-label .cu-month-slider-label-month[data-v-eb1de7ed] {\n  color: inherit;\n}\n\n/* Sobre label solid, el badge del año (variante subtle) se pierde: el tinte\n   translúcido sobre el fondo solid oscuro no aporta contraste y el texto\n   (`--cu-color-{name}-text` = color oscurecido) queda casi negro e imperceptible.\n   Se invierte el badge: fondo = surface (color del texto del label) + texto con el\n   tono de texto del color (`-text`, ≥4.5:1 sobre surface en los 15 temas).\n   Specificity (0,4,0) > `.cu-badge.cu-badge--subtle` (0,3,0). */\n.cu-month-slider-label.cu-month-slider-label--solid .cu-month-slider-label-year[data-v-eb1de7ed] {\n  background-color: var(--ms-surface);\n  color: var(--ms-accent-text);\n}\n.cu-month-slider-label.is-draggable[data-v-eb1de7ed] {\n  cursor: grab;\n}\n.cu-month-slider-label.is-dragging[data-v-eb1de7ed] {\n  cursor: grabbing;\n  transition: none;\n}\n\n/* Al consumir la deslizada, el label vuelve con un rebote suave */\n.cu-month-slider-label.is-fired[data-v-eb1de7ed] {\n  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.cu-month-slider-label.is-disabled[data-v-eb1de7ed] {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.cu-month-slider-label[data-v-eb1de7ed]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--ms-accent-text);\n  outline-offset: var(--cu-space-2xs);\n}\n\n/* Entrada suave del texto al cambiar el mes (key en el span lo re-monta) */\n.cu-month-slider-label-month[data-v-eb1de7ed],\n.cu-month-slider-label-year[data-v-eb1de7ed] {\n  animation: cu-month-slide-in-eb1de7ed 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@keyframes cu-month-slide-in-eb1de7ed {\nfrom {\n    opacity: 0;\n    transform: translateY(5px);\n}\nto {\n    opacity: 1;\n    transform: translateY(0);\n}\n}\n"]], ["__scopeId", "data-v-eb1de7ed"]]);
//#endregion
//#region src/utils/date.ts
var DATE_RE = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
/** Normaliza cualquier `Date` a medianoche local. */
function normalizeDate(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
/** Primer día del mes local de una fecha. */
function normalizeMonth(date) {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}
/** Primer día del mes actual. */
function startOfCurrentMonth(now = /* @__PURE__ */ new Date()) {
	return new Date(now.getFullYear(), now.getMonth(), 1);
}
/**
* Convierte `Date`, timestamp o `"YYYY-MM-DD"` a medianoche local.
* `''`, `null`, `undefined` y valores inválidos devuelven `null`.
*/
function parseDate(value) {
	if (value === null || value === void 0 || value === "") return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : normalizeDate(value);
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return null;
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : normalizeDate(d);
	}
	const m = value.trim().match(DATE_RE);
	const parsed = m ? new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, m[3] ? Number(m[3]) : 1) : new Date(value);
	if (Number.isNaN(parsed.getTime())) return null;
	return normalizeDate(parsed);
}
/** Igual que `parseDate` pero normalizado al primer día del mes. */
function parseMonth(value) {
	const d = parseDate(value);
	return d === null ? null : normalizeMonth(d);
}
/** Mismo día (año/mes/día) en hora local. */
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
/** Mismo mes (año/mes) en hora local. */
function sameMonth(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
/** Suma (o resta) meses, fijando el día al 1 para evitar overflow. */
function addMonths(date, delta) {
	return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
/** Suma (o resta) días en hora local. */
function addDays(date, delta) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}
/**
* Suma (o resta) meses **conservando el día** y recortándolo al último del mes
* destino (31 de enero + 1 mes → 28/29 de febrero).
*/
function shiftMonth(date, delta) {
	const lastDay = new Date(date.getFullYear(), date.getMonth() + delta + 1, 0).getDate();
	return new Date(date.getFullYear(), date.getMonth() + delta, Math.min(date.getDate(), lastDay));
}
/** Primer día de la semana de `date` según `weekStart` (0 = domingo). */
function startOfWeek(date, weekStart = 1) {
	return addDays(date, -((date.getDay() - weekStart + 7) % 7));
}
/** Fecha local como `"YYYY-MM-DD"` (sin pasar por UTC). */
function toISODate(date) {
	const pad = (n) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
/** Normaliza `disabledWeekdays` (`"0,6"` en CE o `[0,6]` en Vue) a números. */
function toDisabledWeekdays(value) {
	if (Array.isArray(value)) return value.filter((n) => typeof n === "number" && !Number.isNaN(n));
	if (typeof value === "string" && value.trim()) return value.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
	return [];
}
/** Normaliza `disabledDates` (`"2026-08-15,2026-08-16"` en CE o array) a fechas. */
function toDisabledDates(value) {
	return (Array.isArray(value) ? value : typeof value === "string" && value.trim() ? value.split(",") : []).map((d) => parseDate(d)).filter((d) => d !== null);
}
/**
* ¿El día se puede seleccionar? Regla única de `Calendar` (click, teclado y
* `setValue`) y de `DatePicker` (botón "Hoy" y `setValue`).
*/
function isDateDisabled(day, rules = {}) {
	if (rules.disabled) return true;
	const min = parseDate(rules.min ?? null);
	if (min && day < min) return true;
	const max = parseDate(rules.max ?? null);
	if (max && day > max) return true;
	if (toDisabledWeekdays(rules.disabledWeekdays).includes(day.getDay())) return true;
	return toDisabledDates(rules.disabledDates).some((d) => sameDay(day, d));
}
/** Tokens de mes soportados por el header del calendario/slider. */
var MONTH_FORMATS = [
	"MMMM",
	"MMM",
	"MM",
	"M"
];
/** Tokens de año soportados por el badge del slider. */
var YEAR_FORMATS = ["yyyy", "yy"];
var DEFAULT_MONTH_FORMAT = "MMMM";
var DEFAULT_YEAR_FORMAT = "yyyy";
/** ¿`value` es un formato de mes soportado? */
function isMonthFormat(value) {
	return typeof value === "string" && MONTH_FORMATS.includes(value);
}
/** ¿`value` es un formato de año soportado? */
function isYearFormat(value) {
	return typeof value === "string" && YEAR_FORMATS.includes(value);
}
/** Formato de mes válido o el default si no se soporta (enforcement runtime). */
function sanitizeMonthFormat(value) {
	return isMonthFormat(value) ? value : DEFAULT_MONTH_FORMAT;
}
/** Formato de año válido o el default si no se soporta (enforcement runtime). */
function sanitizeYearFormat(value) {
	return isYearFormat(value) ? value : DEFAULT_YEAR_FORMAT;
}
var FORMAT_TOKENS = [
	"yyyy",
	"MMMM",
	"MMM",
	"MM",
	"yy",
	"dd",
	"M"
];
/**
* Formatea una fecha con tokens `yyyy yy MMMM MMM MM M dd`.
* `capitalizeMonths: false` deja el mes tal cual lo da `Intl` (para MonthSlider).
*/
function formatDate(date, format, locale = "es", options = {}) {
	const { capitalizeMonths = true } = options;
	const pad = (n) => String(n).padStart(2, "0");
	const monthName = (long) => {
		const label = new Intl.DateTimeFormat(locale, { month: long ? "long" : "short" }).format(date);
		return capitalizeMonths ? label.charAt(0).toUpperCase() + label.slice(1) : label;
	};
	const values = {
		yyyy: () => String(date.getFullYear()),
		yy: () => String(date.getFullYear()).slice(-2),
		MMMM: () => monthName(true),
		MMM: () => monthName(false),
		MM: () => pad(date.getMonth() + 1),
		M: () => String(date.getMonth() + 1),
		dd: () => pad(date.getDate())
	};
	let out = "";
	let i = 0;
	while (i < format.length) {
		let matched = false;
		for (const token of FORMAT_TOKENS) if (format.startsWith(token, i)) {
			out += values[token]?.() ?? token;
			i += token.length;
			matched = true;
			break;
		}
		if (!matched) {
			out += format[i];
			i += 1;
		}
	}
	return out;
}
//#endregion
//#region src/components/controls/MonthSlider.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["aria-label"];
var ariaYearPrev = "Ir al año anterior";
var ariaMonthPrev = "Ir al mes anterior";
var ariaMonthNext = "Ir al mes siguiente";
var ariaYearNext = "Ir al año siguiente";
//#endregion
//#region src/components/controls/MonthSlider.vue
var MonthSlider_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MonthSlider",
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Formato del mes: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		locale: {
			type: String,
			default: "es"
		},
		yearNavigation: {
			type: [Boolean, String],
			default: true
		},
		variant: {
			type: String,
			default: "soft",
			validator: isVariant
		},
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		color: {
			type: String,
			default: "primary"
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update:modelValue", "change"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const minDate = computed(() => parseMonth(props.min));
		const maxDate = computed(() => parseMonth(props.max));
		function clampDate(date) {
			if (minDate.value && date < minDate.value) return minDate.value;
			if (maxDate.value && date > maxDate.value) return maxDate.value;
			return date;
		}
		const month = ref(clampDate(parseMonth(props.modelValue) ?? startOfCurrentMonth()));
		watch(() => props.modelValue, (value) => {
			if (value === null || value === void 0 || value === "") return;
			const parsed = clampDate(parseMonth(value) ?? startOfCurrentMonth());
			if (!sameMonth(parsed, month.value)) month.value = parsed;
		});
		watch([minDate, maxDate], () => {
			const next = clampDate(month.value);
			if (!sameMonth(next, month.value)) month.value = next;
		});
		const monthFormatValue = computed(() => sanitizeMonthFormat(props.monthFormat));
		const yearFormatValue = computed(() => sanitizeYearFormat(props.yearFormat));
		const formatMonth = (date, format) => formatDate(date, format, props.locale, { capitalizeMonths: false });
		const showYearNavigation = computed(() => props.yearNavigation !== false && props.yearNavigation !== "false" && props.yearNavigation !== "0");
		const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
		const showAutoYear = computed(() => month.value.getFullYear() !== currentYear.value);
		const monthLabel = computed(() => formatMonth(month.value, monthFormatValue.value));
		const yearLabel = computed(() => formatMonth(month.value, yearFormatValue.value));
		function setMonth(next) {
			if (props.disabled) return;
			const clamped = clampDate(next);
			if (sameMonth(clamped, month.value)) return;
			month.value = clamped;
			emit("update:modelValue", clamped);
			emit("change", clamped);
		}
		/** Avanza un mes (respetando max). */
		function nextMonth() {
			setMonth(addMonths(month.value, 1));
		}
		/** Retrocede un mes (respetando min). */
		function prevMonth() {
			setMonth(addMonths(month.value, -1));
		}
		/** Avanza un año manteniendo el mes. */
		function nextYear() {
			setMonth(new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1));
		}
		/** Retrocede un año manteniendo el mes. */
		function prevYear() {
			setMonth(new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1));
		}
		/** Navega al mes de la fecha indicada. */
		function goToMonth(value) {
			setMonth(parseMonth(value) ?? startOfCurrentMonth());
		}
		/** Devuelve el mes visible. */
		function getValue() {
			return new Date(month.value);
		}
		/** Establece el mes desde una fecha, timestamp o string. */
		function setValue(value) {
			if (value === null || value === void 0 || value === "") return;
			setMonth(parseMonth(value) ?? startOfCurrentMonth());
		}
		__expose({
			nextMonth,
			prevMonth,
			nextYear,
			prevYear,
			goToMonth,
			getValue,
			setValue
		});
		const canPrevMonth = computed(() => !minDate.value || month.value > minDate.value);
		const canNextMonth = computed(() => !maxDate.value || month.value < maxDate.value);
		const canPrevYear = computed(() => !minDate.value || new Date(month.value.getFullYear() - 1, month.value.getMonth(), 1) >= minDate.value);
		const canNextYear = computed(() => !maxDate.value || new Date(month.value.getFullYear() + 1, month.value.getMonth(), 1) <= maxDate.value);
		const colorStyles = computed(() => ({
			"--ms-accent-text": `var(--cu-color-${props.color}-text)`,
			"--ms-accent-border": `var(--cu-color-${props.color}-border)`,
			"--ms-solid": `var(--cu-color-${props.color}-solid)`,
			"--ms-solid-hover": `var(--cu-color-${props.color}-solid-hover)`,
			"--ms-soft": `var(--cu-color-${props.color}-soft)`,
			"--ms-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--ms-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--ms-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--ms-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
			"--ms-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--ms-surface": `var(--cu-color-surface)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-month-slider", { "is-disabled": props.disabled }]),
				style: normalizeStyle(colorStyles.value),
				role: "group",
				"aria-label": `Selector de mes: ${showAutoYear.value ? monthLabel.value + " " + yearLabel.value : monthLabel.value}`
			}, [
				showYearNavigation.value ? (openBlock(), createBlock(Button_default, {
					key: 0,
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canPrevYear.value,
					"aria-label": ariaYearPrev,
					onClick: _cache[0] || (_cache[0] = ($event) => prevYear())
				}, {
					default: withCtx(() => [createVNode(LucideChevronsLeft_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"])) : createCommentVNode("v-if", true),
				createVNode(Button_default, {
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canPrevMonth.value,
					"aria-label": ariaMonthPrev,
					onClick: _cache[1] || (_cache[1] = ($event) => prevMonth())
				}, {
					default: withCtx(() => [createVNode(LucideChevronLeft_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"]),
				createVNode(MonthSliderLabel_default, {
					label: monthLabel.value,
					year: showAutoYear.value ? yearLabel.value : "",
					disabled: props.disabled,
					color: props.color,
					variant: props.variant,
					"can-navigate-prev": canPrevMonth.value,
					"can-navigate-next": canNextMonth.value,
					onNavigate: _cache[2] || (_cache[2] = (dir) => setMonth(unref(addMonths)(month.value, dir)))
				}, null, 8, [
					"label",
					"year",
					"disabled",
					"color",
					"variant",
					"can-navigate-prev",
					"can-navigate-next"
				]),
				createVNode(Button_default, {
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canNextMonth.value,
					"aria-label": ariaMonthNext,
					onClick: _cache[3] || (_cache[3] = ($event) => nextMonth())
				}, {
					default: withCtx(() => [createVNode(LucideChevronRight_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"]),
				showYearNavigation.value ? (openBlock(), createBlock(Button_default, {
					key: 1,
					class: "cu-button--icon-only",
					variant: "ghost",
					color: props.color,
					disabled: props.disabled || !canNextYear.value,
					"aria-label": ariaYearNext,
					onClick: _cache[4] || (_cache[4] = ($event) => nextYear())
				}, {
					default: withCtx(() => [createVNode(LucideChevronsRight_default, {
						width: 16,
						height: 16
					})]),
					_: 1
				}, 8, ["color", "disabled"])) : createCommentVNode("v-if", true)
			], 14, _hoisted_1$1);
		};
	}
}), [["styles", ["\n.cu-month-slider[data-v-069a11c0] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-2xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-month-slider.is-disabled[data-v-069a11c0] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-069a11c0"]]);
//#endregion
//#region src/composables/useDateRange.ts
function useDateRange(options = {}) {
	const startValue = ref(parseDate(options.start?.() ?? null));
	const endValue = ref(parseDate(options.end?.() ?? null));
	const pickingEnd = computed(() => startValue.value !== null && endValue.value === null);
	watch(() => options.start?.(), (value) => {
		startValue.value = parseDate(value);
	});
	watch(() => options.end?.(), (value) => {
		endValue.value = parseDate(value);
	});
	function select(day) {
		if (!pickingEnd.value) {
			const hadEnd = endValue.value !== null;
			startValue.value = day;
			endValue.value = null;
			options.onStartChange?.(day);
			if (hadEnd) options.onEndChange?.(null);
			return;
		}
		if (day.getTime() < startValue.value.getTime()) {
			endValue.value = startValue.value;
			startValue.value = day;
			options.onStartChange?.(day);
			options.onEndChange?.(endValue.value);
		} else {
			endValue.value = day;
			options.onEndChange?.(day);
		}
		const range = {
			start: startValue.value,
			end: endValue.value
		};
		options.onSelect?.(range);
		options.onChange?.(range);
	}
	function clear() {
		startValue.value = null;
		endValue.value = null;
		options.onStartChange?.(null);
		options.onEndChange?.(null);
		options.onChange?.({
			start: null,
			end: null
		});
	}
	function setRange(start, end) {
		startValue.value = parseDate(start);
		endValue.value = parseDate(end);
		options.onStartChange?.(startValue.value);
		options.onEndChange?.(endValue.value);
		options.onChange?.({
			start: startValue.value,
			end: endValue.value
		});
	}
	return {
		startValue,
		endValue,
		pickingEnd,
		select,
		clear,
		setRange
	};
}
//#endregion
//#region src/components/controls/Calendar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-label"];
var _hoisted_2 = { class: "cu-calendar-header" };
var _hoisted_3 = {
	class: "cu-calendar-weekdays",
	role: "row"
};
var _hoisted_4 = ["aria-label"];
var _hoisted_5 = [
	"data-date",
	"disabled",
	"aria-label",
	"aria-selected",
	"aria-disabled",
	"aria-current",
	"tabindex",
	"onClick"
];
var _hoisted_6 = {
	key: 0,
	class: "cu-calendar-dots"
};
var _hoisted_7 = {
	key: 1,
	class: "cu-calendar-day--empty",
	role: "gridcell",
	"aria-disabled": "true"
};
var WEEK_LENGTH = 7;
//#endregion
//#region src/components/controls/Calendar.vue
var Calendar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Calendar",
	props: {
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		color: {
			type: String,
			default: "primary"
		},
		variant: {
			type: String,
			default: "soft",
			validator: isVariantNoGhost
		},
		disabled: {
			type: Boolean,
			default: false
		},
		disabledWeekdays: {
			type: [Array, String],
			default: () => []
		},
		disabledDates: {
			type: [Array, String],
			default: () => []
		},
		locale: {
			type: String,
			default: "es"
		},
		weekStart: {
			type: Number,
			default: 1,
			validator: (value) => value >= 0 && value <= 6
		},
		yearNavigation: {
			type: [Boolean, String],
			default: false
		},
		/** Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		events: {
			type: Array,
			default: () => []
		},
		rangeStart: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		rangeEnd: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		grid: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		},
		viewMonth: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Modo de selección: `single` (una fecha) o `range` (inicio + fin). */
		mode: {
			type: String,
			default: "single",
			validator: isDateMode
		}
	},
	emits: [
		"update:modelValue",
		"update:viewMonth",
		"update:rangeStart",
		"update:rangeEnd",
		"change",
		"select"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const minDate = computed(() => parseDate(props.min));
		const maxDate = computed(() => parseDate(props.max));
		const disabledWeekdayList = computed(() => toDisabledWeekdays(props.disabledWeekdays));
		const disabledDateList = computed(() => toDisabledDates(props.disabledDates));
		function clampMonth(date) {
			if (minDate.value) {
				const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1);
				if (date < limit) return limit;
			}
			if (maxDate.value) {
				const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1);
				if (date > limit) return limit;
			}
			return date;
		}
		const today = /* @__PURE__ */ new Date();
		function initialViewMonth() {
			const base = parseDate(props.modelValue) ?? parseDate(props.rangeStart) ?? parseDate(props.rangeEnd) ?? startOfCurrentMonth();
			return clampMonth(new Date(base.getFullYear(), base.getMonth(), 1));
		}
		const internalViewMonth = ref(initialViewMonth());
		const viewMonthProp = computed(() => parseDate(props.viewMonth));
		const viewMonth = computed(() => clampMonth(viewMonthProp.value ?? internalViewMonth.value));
		const isViewMonthControlled = computed(() => viewMonthProp.value !== null);
		/** Cambia el mes visible (respeta el consumidor si `viewMonth` está controlado). */
		function setViewMonth(next) {
			const target = clampMonth(new Date(next.getFullYear(), next.getMonth(), 1));
			if (isViewMonthControlled.value) emit("update:viewMonth", target);
			else internalViewMonth.value = target;
		}
		const selectedValue = ref(parseDate(props.modelValue));
		watch(() => props.modelValue, (value) => {
			const parsed = parseDate(value);
			selectedValue.value = parsed;
			if (parsed !== null) focusDay.value = parsed;
			if (parsed === null || isViewMonthControlled.value) return;
			internalViewMonth.value = clampMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
		});
		watch([minDate, maxDate], () => {
			if (isViewMonthControlled.value) return;
			internalViewMonth.value = clampMonth(internalViewMonth.value);
		});
		const isRange = computed(() => props.mode === "range");
		const { startValue: rangeValueStart, endValue: rangeValueEnd, select: selectRange, clear: clearRange, setRange: setRangeValue } = useDateRange({
			start: () => props.rangeStart,
			end: () => props.rangeEnd,
			onStartChange: (value) => emit("update:rangeStart", value),
			onEndChange: (value) => emit("update:rangeEnd", value),
			onChange: (value) => emit("change", value),
			onSelect: (value) => emit("select", value)
		});
		watch(rangeValueStart, (value) => {
			if (value) focusDay.value = value;
		});
		const canPrevMonth = computed(() => {
			if (!minDate.value) return true;
			const limit = new Date(minDate.value.getFullYear(), minDate.value.getMonth(), 1);
			return viewMonth.value > limit;
		});
		const canNextMonth = computed(() => {
			if (!maxDate.value) return true;
			const limit = new Date(maxDate.value.getFullYear(), maxDate.value.getMonth(), 1);
			return viewMonth.value < limit;
		});
		/** Avanza al mes siguiente (respetando max). */
		function nextMonth() {
			if (props.disabled || !canNextMonth.value) return;
			setViewMonth(addMonths(viewMonth.value, 1));
		}
		/** Retrocede al mes anterior (respetando min). */
		function prevMonth() {
			if (props.disabled || !canPrevMonth.value) return;
			setViewMonth(addMonths(viewMonth.value, -1));
		}
		/** Navega al mes de la fecha indicada. */
		function goToMonth(value) {
			const parsed = parseDate(value);
			if (parsed === null) return;
			setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
		}
		function onMonthChange(date) {
			setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
		}
		const weekdayLabels = computed(() => {
			const base = new Date(2026, 7, 2);
			const labels = [];
			for (let i = 0; i < WEEK_LENGTH; i++) {
				const day = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
				const short = new Intl.DateTimeFormat(props.locale, { weekday: "short" }).format(day);
				const long = new Intl.DateTimeFormat(props.locale, { weekday: "long" }).format(day);
				labels.push({
					short: short.charAt(0).toUpperCase() + short.slice(1),
					long: long.charAt(0).toUpperCase() + long.slice(1)
				});
			}
			return [...labels.slice(props.weekStart), ...labels.slice(0, props.weekStart)];
		});
		const weeks = computed(() => {
			const year = viewMonth.value.getFullYear();
			const month = viewMonth.value.getMonth();
			const offset = (new Date(year, month, 1).getDay() - props.weekStart + WEEK_LENGTH) % WEEK_LENGTH;
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const cells = [];
			for (let i = 0; i < offset; i++) cells.push({ date: null });
			for (let day = 1; day <= daysInMonth; day++) cells.push({ date: new Date(year, month, day) });
			const rows = [];
			for (let i = 0; i < cells.length; i += WEEK_LENGTH) rows.push(cells.slice(i, i + WEEK_LENGTH));
			return rows;
		});
		const monthLabel = computed(() => {
			const label = new Intl.DateTimeFormat(props.locale, {
				month: "long",
				year: "numeric"
			}).format(viewMonth.value);
			return label.charAt(0).toUpperCase() + label.slice(1);
		});
		function getEventsForDay(day) {
			return props.events.filter((ev) => {
				const date = parseDate(ev?.date ?? null);
				return date !== null && sameDay(date, day);
			});
		}
		function isDisabledDay(day) {
			return isDateDisabled(day, {
				disabled: props.disabled,
				min: minDate.value,
				max: maxDate.value,
				disabledWeekdays: disabledWeekdayList.value,
				disabledDates: disabledDateList.value
			});
		}
		/** Fuera de `min`/`max`: el teclado no navega más allá (los deshabilitados por
		*  weekday/fecha puntual sí se pueden enfocar, como pide el patrón de grid). */
		function isOutOfLimits(day) {
			if (minDate.value && day < minDate.value) return true;
			return !!(maxDate.value && day > maxDate.value);
		}
		function selectDay(day) {
			if (isDisabledDay(day)) return;
			focusDay.value = day;
			if (isRange.value) {
				selectRange(day);
				return;
			}
			selectedValue.value = day;
			emit("update:modelValue", day);
			emit("change", day);
			emit("select", day);
		}
		function dayClasses(day) {
			const selected = !isRange.value && selectedValue.value !== null && sameDay(day, selectedValue.value);
			const inRange = isInRange(day);
			return {
				"cu-calendar-day--selected": selected,
				"cu-calendar-day--today": sameDay(day, today) && !selected,
				"cu-calendar-day--range": inRange,
				"cu-calendar-day--range-start": rangeStartVal.value !== null && sameDay(day, rangeStartVal.value),
				"cu-calendar-day--range-end": rangeEndVal.value !== null && sameDay(day, rangeEndVal.value),
				[`cu-calendar-day--${props.variant}`]: selected
			};
		}
		/** Día que tiene el foco del teclado (roving). `null` = todavía no se movió. */
		const focusDay = ref(parseDate(props.modelValue) ?? parseDate(props.rangeStart));
		const gridRef = ref(null);
		const dayAriaFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		}));
		function dayAriaLabel(day) {
			const label = dayAriaFormatter.value.format(day);
			return label.charAt(0).toUpperCase() + label.slice(1);
		}
		/** ¿El día es el tab-stop de la grilla? Nunca un día deshabilitado (no es
		*  enfocable): si el enfocado no está en el mes visible, cae al seleccionado y
		*  si no al primer día habilitado del mes. */
		const tabStopDay = computed(() => {
			const focused = focusDay.value;
			if (focused && sameMonth(focused, viewMonth.value) && !isDisabledDay(focused)) return focused;
			const selected = selectedValue.value;
			if (selected && sameMonth(selected, viewMonth.value) && !isDisabledDay(selected)) return selected;
			const year = viewMonth.value.getFullYear();
			const month = viewMonth.value.getMonth();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			for (let day = 1; day <= daysInMonth; day++) {
				const candidate = new Date(year, month, day);
				if (!isDisabledDay(candidate)) return candidate;
			}
			return null;
		});
		function isTabStop(day) {
			if (props.disabled) return false;
			const stop = tabStopDay.value;
			return stop !== null && sameDay(day, stop);
		}
		function isDaySelected(day) {
			if (isRange.value) return rangeStartVal.value !== null && sameDay(day, rangeStartVal.value) || rangeEndVal.value !== null && sameDay(day, rangeEndVal.value);
			return selectedValue.value !== null && sameDay(day, selectedValue.value);
		}
		/** Mueve el foco del teclado a `day` (cambiando de mes si hace falta). */
		async function moveFocus(day) {
			if (isOutOfLimits(day)) return;
			focusDay.value = day;
			if (!sameMonth(day, viewMonth.value)) setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
			await nextTick();
			gridRef.value?.querySelector(`[data-date="${toISODate(day)}"]`)?.focus();
		}
		/** Primer día habilitado avanzando `step` días desde `from` (sin incluirlo).
		*  Se detiene al salir de `min`/`max` o tras una vuelta completa. */
		function findEnabledDay(from, step) {
			let candidate = addDays(from, step);
			for (let i = 0; i < 370; i++) {
				if (isOutOfLimits(candidate)) return null;
				if (!isDisabledDay(candidate)) return candidate;
				candidate = addDays(candidate, step);
			}
			return null;
		}
		/** Borde habilitado de la semana de `day` (`start`/`end`), salteando los
		*  deshabilitados hacia adentro de la semana. */
		function enabledWeekEdge(day, edge) {
			const weekStart = startOfWeek(day, props.weekStart);
			const step = edge === "start" ? 1 : -1;
			let candidate = edge === "start" ? weekStart : addDays(weekStart, 6);
			for (let i = 0; i < 7; i++) {
				if (!isOutOfLimits(candidate) && !isDisabledDay(candidate)) return candidate;
				candidate = addDays(candidate, step);
			}
			return null;
		}
		/** Día habilitado más cercano al mismo día-del-mes en el mes de `target`
		*  (para PageUp/PageDown cuando ese día está deshabilitado). */
		function nearestEnabledInMonth(target) {
			const year = target.getFullYear();
			const month = target.getMonth();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const dayOfMonth = target.getDate();
			for (let delta = 0; delta < daysInMonth; delta++) for (const day of delta === 0 ? [dayOfMonth] : [dayOfMonth + delta, dayOfMonth - delta]) {
				if (day < 1 || day > daysInMonth) continue;
				const candidate = new Date(year, month, day);
				if (!isOutOfLimits(candidate) && !isDisabledDay(candidate)) return candidate;
			}
			return null;
		}
		function onGridKeydown(event) {
			if (props.disabled) return;
			const button = event.target?.closest?.(".cu-calendar-day");
			const current = button instanceof HTMLElement ? parseDate(button.dataset.date ?? null) : null;
			if (current === null) return;
			let next = null;
			switch (event.key) {
				case "ArrowLeft":
					next = findEnabledDay(current, -1);
					break;
				case "ArrowRight":
					next = findEnabledDay(current, 1);
					break;
				case "ArrowUp":
					next = findEnabledDay(current, -7);
					break;
				case "ArrowDown":
					next = findEnabledDay(current, 7);
					break;
				case "Home":
					next = enabledWeekEdge(current, "start");
					break;
				case "End":
					next = enabledWeekEdge(current, "end");
					break;
				case "PageUp":
					next = nearestEnabledInMonth(shiftMonth(current, -1));
					break;
				case "PageDown":
					next = nearestEnabledInMonth(shiftMonth(current, 1));
					break;
				default: return;
			}
			event.preventDefault();
			if (next) moveFocus(next);
		}
		const rangeStartVal = computed(() => isRange.value ? rangeValueStart.value : null);
		const rangeEndVal = computed(() => isRange.value ? rangeValueEnd.value : null);
		function isInRange(day) {
			if (!isRange.value) return false;
			const start = rangeStartVal.value;
			const end = rangeEndVal.value;
			if (!start || !end) return false;
			const s = start.getTime();
			const e = end.getTime();
			const d = day.getTime();
			return d >= Math.min(s, e) && d <= Math.max(s, e);
		}
		/** Devuelve la fecha seleccionada (modo `single`). */
		function getValue() {
			return selectedValue.value;
		}
		/** Establece la fecha seleccionada y emite los eventos de cambio (modo `single`). */
		function setValue(value) {
			const parsed = parseDate(value);
			if (parsed === null) return;
			if (isDisabledDay(parsed)) return;
			selectedValue.value = parsed;
			focusDay.value = parsed;
			setViewMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
			emit("update:modelValue", parsed);
			emit("change", parsed);
		}
		/** Devuelve el rango seleccionado (modo `range`). */
		function getRange() {
			return {
				start: rangeValueStart.value,
				end: rangeValueEnd.value
			};
		}
		/** Setea el rango y emite los eventos de cambio (modo `range`). */
		function setRange(start, end) {
			setRangeValue(start, end);
		}
		/** Limpia el rango seleccionado (modo `range`). */
		function clear() {
			if (!isRange.value) return;
			clearRange();
		}
		__expose({
			nextMonth,
			prevMonth,
			goToMonth,
			getValue,
			setValue,
			getRange,
			setRange,
			clear
		});
		const colorStyles = computed(() => ({
			"--cal-accent": `var(--cu-color-${props.color})`,
			"--cal-solid": `var(--cu-color-${props.color}-solid)`,
			"--cal-solid-hover": `var(--cu-color-${props.color}-solid-hover)`,
			"--cal-solid-text": `var(--cu-color-surface)`,
			"--cal-accent-text": `var(--cu-color-${props.color}-text)`,
			"--cal-accent-border": `var(--cu-color-${props.color}-border)`,
			"--cal-soft": `var(--cu-color-${props.color}-soft)`,
			"--cal-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--cal-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--cal-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--cal-subtle-border": `var(--cu-color-${props.color}-subtle-border)`,
			"--cal-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-calendar", {
					"is-disabled": props.disabled,
					"cu-calendar--year-nav": __props.yearNavigation,
					"cu-calendar--grid": props.grid,
					"cu-calendar--border": props.border
				}]),
				style: normalizeStyle(colorStyles.value),
				role: "grid",
				"aria-label": monthLabel.value
			}, [
				createCommentVNode(" Header: MonthSlider del repo (chevrons + label con drag + navegación de año) "),
				createElementVNode("div", _hoisted_2, [createVNode(MonthSlider_default, {
					"model-value": viewMonth.value,
					min: __props.min,
					max: __props.max,
					color: __props.color,
					variant: __props.variant,
					locale: __props.locale,
					"year-navigation": __props.yearNavigation,
					"month-format": __props.monthFormat,
					"year-format": __props.yearFormat,
					disabled: __props.disabled,
					onChange: onMonthChange
				}, null, 8, [
					"model-value",
					"min",
					"max",
					"color",
					"variant",
					"locale",
					"year-navigation",
					"month-format",
					"year-format",
					"disabled"
				])]),
				createCommentVNode(" Días de la semana "),
				createElementVNode("div", _hoisted_3, [(openBlock(true), createElementBlock(Fragment, null, renderList(weekdayLabels.value, (label, i) => {
					return openBlock(), createElementBlock("span", {
						key: i,
						class: "cu-calendar-weekday",
						role: "columnheader",
						"aria-label": label.long
					}, toDisplayString(label.short), 9, _hoisted_4);
				}), 128))]),
				createCommentVNode(" Grilla de días: 7 columnas que se reparten el ancho del contenedor "),
				createElementVNode("div", {
					ref_key: "gridRef",
					ref: gridRef,
					class: "cu-calendar-grid",
					onKeydown: onGridKeydown
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(weeks.value, (week, wi) => {
					return openBlock(), createElementBlock("div", {
						key: wi,
						class: "cu-calendar-week",
						role: "row"
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(week, (cell, ci) => {
						return openBlock(), createElementBlock(Fragment, { key: ci }, [cell.date ? (openBlock(), createElementBlock("button", {
							key: 0,
							type: "button",
							class: normalizeClass(["cu-calendar-day", dayClasses(cell.date)]),
							"data-date": unref(toISODate)(cell.date),
							disabled: isDisabledDay(cell.date),
							"aria-label": dayAriaLabel(cell.date),
							"aria-selected": isDaySelected(cell.date) ? "true" : "false",
							"aria-disabled": isDisabledDay(cell.date) ? "true" : void 0,
							"aria-current": unref(sameDay)(cell.date, unref(today)) ? "date" : void 0,
							tabindex: isTabStop(cell.date) ? 0 : -1,
							role: "gridcell",
							onClick: ($event) => selectDay(cell.date)
						}, [createTextVNode(toDisplayString(cell.date.getDate()) + " ", 1), getEventsForDay(cell.date).length ? (openBlock(), createElementBlock("span", _hoisted_6, [(openBlock(true), createElementBlock(Fragment, null, renderList(getEventsForDay(cell.date), (ev, ei) => {
							return openBlock(), createElementBlock("span", {
								key: ei,
								class: "cu-calendar-dot",
								style: normalizeStyle(ev.color ? { "--dot-color": String(ev.color).startsWith("var(") ? ev.color : `var(--cu-color-${ev.color})` } : void 0)
							}, null, 4);
						}), 128))])) : createCommentVNode("v-if", true)], 10, _hoisted_5)) : (openBlock(), createElementBlock("span", _hoisted_7))], 64);
					}), 128))]);
				}), 128))], 544)
			], 14, _hoisted_1);
		};
	}
}), [["styles", ["\n.cu-calendar[data-v-a5b1f966] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  width: 100%;\n  min-width: 240px;\n  font-family: var(--cu-font-sans);\n  box-sizing: border-box;\n}\n\n/* Con navegación de año (4 botones del MonthSlider + label min 150px) el header\n   necesita más ancho que la grilla: forzamos min-width para evitar overflow. */\n.cu-calendar--year-nav[data-v-a5b1f966] {\n  min-width: 330px;\n}\n.cu-calendar.is-disabled[data-v-a5b1f966] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-calendar-header[data-v-a5b1f966] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-2xs);\n}\n\n/* 7 columnas: cada una ocupa 1/7 del ancho que mida el contenedor */\n.cu-calendar-weekdays[data-v-a5b1f966],\n.cu-calendar-week[data-v-a5b1f966] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: var(--cu-space-2xs);\n}\n.cu-calendar-weekday[data-v-a5b1f966] {\n  text-align: center;\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--cu-color-neutral-text-subtle);\n  padding: var(--cu-space-2xs) 0;\n}\n.cu-calendar-day[data-v-a5b1f966] {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: inherit;\n  font-family: inherit;\n  font-size: var(--cu-font-size-sm);\n  cursor: pointer;\n  transition: background-color 150ms ease, color 150ms ease;\n  box-sizing: border-box;\n}\n\n/* Foco de teclado de la grilla (roving tabindex). Usa el accent de texto\n   (`-text`), que está garantizado contra la superficie en todos los temas. */\n.cu-calendar-day[data-v-a5b1f966]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--cal-accent-text);\n  outline-offset: calc(var(--cu-space-2xs) * -1);\n  position: relative;\n  z-index: 1;\n}\n\n/* Doble clase (convención del repo): ganarle en cascada a reglas globales\n   del consumidor (reset CSS, `.playground button`, etc.) */\n.cu-calendar-day.cu-calendar-day[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-ghost-hover);\n}\n\n/* Día no seleccionable: `<button disabled>` (no enfocable; el teclado lo\n   saltea) + `aria-disabled` para la grilla. */\n.cu-calendar-day.cu-calendar-day[data-v-a5b1f966]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n/* Hoy: transparente + número en color accent (look ghost). Sin fondo para no\n   confundirse con el día seleccionado — se distingue solo por el color. */\n.cu-calendar-day.cu-calendar-day--today[data-v-a5b1f966] {\n  background: transparent;\n  color: var(--cal-accent-text);\n  font-weight: var(--cu-font-weight-semibold);\n}\n\n/* Variantes del día seleccionado */\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  /* Solid mantiene el texto del tema sobre la variante de fondo ajustada. */\n  color: var(--cal-solid-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-solid-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--outlined[data-v-a5b1f966] {\n  outline: 1.5px solid var(--cal-accent-border);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-a5b1f966] {\n  background: var(--cal-soft);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-soft-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--subtle[data-v-a5b1f966] {\n  background: var(--cal-subtle);\n  color: var(--cal-accent-text);\n  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--cal-subtle-border);\n}\n.cu-calendar-day--empty[data-v-a5b1f966] {\n  aspect-ratio: 1;\n}\n\n/* ── Grid interno: líneas separadoras entre días ── */\n.cu-calendar--grid .cu-calendar-weekdays[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-week[data-v-a5b1f966] {\n  gap: 0;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-day--empty[data-v-a5b1f966] {\n  border-right: var(--cu-border-thin) solid var(--cu-border-color);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: 0;\n}\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day--empty[data-v-a5b1f966] {\n  border-bottom: none;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-a5b1f966]:nth-child(7n),\n.cu-calendar--grid .cu-calendar-day--empty[data-v-a5b1f966]:nth-child(7n) {\n  border-right: none;\n}\n\n/* ── Borde exterior: marco alrededor de la cuadrícula de días ── */\n.cu-calendar--border .cu-calendar-grid[data-v-a5b1f966] {\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  overflow: hidden;\n}\n\n/* ── Rango ── */\n.cu-calendar-day.cu-calendar-day--range[data-v-a5b1f966] {\n  background: var(--cal-soft);\n  border-radius: 0;\n}\n.cu-calendar-day.cu-calendar-day--range-start[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: var(--cu-radius-sm) 0 0 var(--cu-radius-sm);\n}\n.cu-calendar-day.cu-calendar-day--range-end[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: 0 var(--cu-radius-sm) var(--cu-radius-sm) 0;\n}\n.cu-calendar-day--range-start.cu-calendar-day--range-end[data-v-a5b1f966] {\n  border-radius: var(--cu-radius-sm);\n}\n\n/* ── Puntos de eventos ── */\n.cu-calendar-day[data-v-a5b1f966] {\n  position: relative;\n}\n.cu-calendar-dots[data-v-a5b1f966] {\n  position: absolute;\n  bottom: var(--cu-space-2xs);\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: var(--cu-space-2xs);\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.cu-calendar-dot[data-v-a5b1f966] {\n  width: var(--cu-space-xs);\n  height: var(--cu-space-xs);\n  border-radius: 50%;\n  background: var(--dot-color, var(--cal-accent));\n  display: block;\n}\n"]], ["__scopeId", "data-v-a5b1f966"]]);
//#endregion
//#region src/lib/controls/calendar.ts
var CuCalendar = defineComegenElement("cu-calendar", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Calendar.ce",
	props: {
		/** Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver «Formato de fechas») */
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fecha mínima seleccionable (días anteriores quedan deshabilitados) */
		min: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fecha máxima seleccionable */
		max: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "primary"
		},
		/** Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) */
		variant: {
			type: String,
			default: "soft"
		},
		/** Deshabilita todo el calendario */
		disabled: {
			type: Boolean,
			default: false
		},
		/** Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` */
		disabledWeekdays: {
			type: [Array, String],
			default: ""
		},
		/** Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` */
		disabledDates: {
			type: [Array, String],
			default: ""
		},
		/** Locale para nombres de mes y días de la semana */
		locale: {
			type: String,
			default: "es"
		},
		/** Día en que arranca la semana: `0` = domingo, `1` = lunes */
		weekStart: {
			type: Number,
			default: 1
		},
		/** Muestra botones `«`/`»` para saltar de año en el header */
		yearNavigation: {
			type: [Boolean, String],
			default: false
		},
		/** Formato del mes en el header: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			default: "yyyy",
			validator: isYearFormat
		},
		/** Eventos a señalar con puntos bajo la fecha (ver «Eventos (puntos)»). Se asigna como propiedad JS */
		events: {
			type: Array,
			default: () => []
		},
		/** Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS */
		rangeStart: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fin del rango. Se asigna como propiedad JS */
		rangeEnd: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` */
		grid: {
			type: Boolean,
			default: false
		},
		/** Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` */
		border: {
			type: Boolean,
			default: false
		},
		/** Mes visible (primer día) controlado desde afuera. Navegar emite `update:viewMonth`. Se asigna como propiedad JS */
		viewMonth: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Modo de selección: `single` (una fecha) o `range` (inicio + fin) */
		mode: {
			type: String,
			default: "single"
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const calendarRef = ref(null);
		const instance = getCurrentInstance();
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const host = (el?.getRootNode())?.host || el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		/** Va al mes siguiente (respeta `max`) */
		function nextMonth() {
			calendarRef.value?.nextMonth();
		}
		/** Va al mes anterior (respeta `min`) */
		function prevMonth() {
			calendarRef.value?.prevMonth();
		}
		/** Navega al mes de la fecha dada */
		function goToMonth(value) {
			calendarRef.value?.goToMonth(value);
		}
		/** Devuelve la fecha seleccionada (modo `single`) */
		function getValue() {
			return calendarRef.value?.getValue() ?? null;
		}
		/** Selecciona una fecha (acepta string/number/Date) */
		function setValue(value) {
			calendarRef.value?.setValue(value);
		}
		/** Devuelve el rango seleccionado (modo `range`) */
		function getRange() {
			return calendarRef.value?.getRange() ?? {
				start: null,
				end: null
			};
		}
		/** Setea el rango (acepta string/number/Date) (modo `range`) */
		function setRange(start, end) {
			calendarRef.value?.setRange(start, end);
		}
		/** Limpia el rango seleccionado (modo `range`) */
		function clear() {
			calendarRef.value?.clear();
		}
		__expose({
			nextMonth,
			prevMonth,
			goToMonth,
			getValue,
			setValue,
			getRange,
			setRange,
			clear
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Calendar_default, {
				ref_key: "calendarRef",
				ref: calendarRef,
				"model-value": props.modelValue,
				min: props.min,
				max: props.max,
				color: props.color,
				variant: props.variant,
				disabled: props.disabled,
				locale: props.locale,
				"week-start": props.weekStart,
				"year-navigation": props.yearNavigation,
				"month-format": props.monthFormat,
				"year-format": props.yearFormat,
				"disabled-weekdays": props.disabledWeekdays,
				"disabled-dates": props.disabledDates,
				events: props.events,
				"range-start": props.rangeStart,
				"range-end": props.rangeEnd,
				grid: props.grid,
				border: props.border,
				"view-month": props.viewMonth,
				mode: props.mode,
				onSelect: _cache[0] || (_cache[0] = ($event) => ceEmit("select", $event)),
				onChange: _cache[1] || (_cache[1] = ($event) => ceEmit("change", $event)),
				"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => ceEmit("update:modelValue", $event)),
				"onUpdate:viewMonth": _cache[3] || (_cache[3] = ($event) => ceEmit("update:viewMonth", $event)),
				"onUpdate:rangeStart": _cache[4] || (_cache[4] = ($event) => ceEmit("update:rangeStart", $event)),
				"onUpdate:rangeEnd": _cache[5] || (_cache[5] = ($event) => ceEmit("update:rangeEnd", $event))
			}, null, 8, [
				"model-value",
				"min",
				"max",
				"color",
				"variant",
				"disabled",
				"locale",
				"week-start",
				"year-navigation",
				"month-format",
				"year-format",
				"disabled-weekdays",
				"disabled-dates",
				"events",
				"range-start",
				"range-end",
				"grid",
				"border",
				"view-month",
				"mode"
			]);
		};
	}
}), [["styles", ["\n:host {\n  display: inline-block;\n}\n"]]]));
//#endregion
export { CuCalendar as default };
