/*! comegenui v5.2.3 · CuDatePicker (cu-date-picker) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, toDisplayString, unref, useModel, useTemplateRef, watch, withCtx, withKeys, withModifiers } from "vue";
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
var isAlign = oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
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
var _hoisted_1$10 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$10);
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
var _hoisted_1$9 = [
	"href",
	"target",
	"rel",
	"role",
	"aria-disabled",
	"aria-busy",
	"tabindex"
];
var _hoisted_2$4 = [
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
			], 14, _hoisted_1$9)) : (openBlock(), createElementBlock("button", {
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
			], 14, _hoisted_2$4));
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
var _hoisted_1$8 = [
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
			}, 8, ["color", "variant"])) : createCommentVNode("v-if", true)], 46, _hoisted_1$8);
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
var _hoisted_1$7 = ["aria-label"];
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
			], 14, _hoisted_1$7);
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
var _hoisted_1$6 = ["aria-label"];
var _hoisted_2$3 = { class: "cu-calendar-header" };
var _hoisted_3$2 = {
	class: "cu-calendar-weekdays",
	role: "row"
};
var _hoisted_4$2 = ["aria-label"];
var _hoisted_5$1 = [
	"data-date",
	"disabled",
	"aria-label",
	"aria-selected",
	"aria-disabled",
	"aria-current",
	"tabindex",
	"onClick"
];
var _hoisted_6$1 = {
	key: 0,
	class: "cu-calendar-dots"
};
var _hoisted_7$1 = {
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
				createElementVNode("div", _hoisted_2$3, [createVNode(MonthSlider_default, {
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
				createElementVNode("div", _hoisted_3$2, [(openBlock(true), createElementBlock(Fragment, null, renderList(weekdayLabels.value, (label, i) => {
					return openBlock(), createElementBlock("span", {
						key: i,
						class: "cu-calendar-weekday",
						role: "columnheader",
						"aria-label": label.long
					}, toDisplayString(label.short), 9, _hoisted_4$2);
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
						}, [createTextVNode(toDisplayString(cell.date.getDate()) + " ", 1), getEventsForDay(cell.date).length ? (openBlock(), createElementBlock("span", _hoisted_6$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(getEventsForDay(cell.date), (ev, ei) => {
							return openBlock(), createElementBlock("span", {
								key: ei,
								class: "cu-calendar-dot",
								style: normalizeStyle(ev.color ? { "--dot-color": String(ev.color).startsWith("var(") ? ev.color : `var(--cu-color-${ev.color})` } : void 0)
							}, null, 4);
						}), 128))])) : createCommentVNode("v-if", true)], 10, _hoisted_5$1)) : (openBlock(), createElementBlock("span", _hoisted_7$1))], 64);
					}), 128))]);
				}), 128))], 544)
			], 14, _hoisted_1$6);
		};
	}
}), [["styles", ["\n.cu-calendar[data-v-a5b1f966] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  width: 100%;\n  min-width: 240px;\n  font-family: var(--cu-font-sans);\n  box-sizing: border-box;\n}\n\n/* Con navegación de año (4 botones del MonthSlider + label min 150px) el header\n   necesita más ancho que la grilla: forzamos min-width para evitar overflow. */\n.cu-calendar--year-nav[data-v-a5b1f966] {\n  min-width: 330px;\n}\n.cu-calendar.is-disabled[data-v-a5b1f966] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-calendar-header[data-v-a5b1f966] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-2xs);\n}\n\n/* 7 columnas: cada una ocupa 1/7 del ancho que mida el contenedor */\n.cu-calendar-weekdays[data-v-a5b1f966],\n.cu-calendar-week[data-v-a5b1f966] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: var(--cu-space-2xs);\n}\n.cu-calendar-weekday[data-v-a5b1f966] {\n  text-align: center;\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--cu-color-neutral-text-subtle);\n  padding: var(--cu-space-2xs) 0;\n}\n.cu-calendar-day[data-v-a5b1f966] {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: inherit;\n  font-family: inherit;\n  font-size: var(--cu-font-size-sm);\n  cursor: pointer;\n  transition: background-color 150ms ease, color 150ms ease;\n  box-sizing: border-box;\n}\n\n/* Foco de teclado de la grilla (roving tabindex). Usa el accent de texto\n   (`-text`), que está garantizado contra la superficie en todos los temas. */\n.cu-calendar-day[data-v-a5b1f966]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--cal-accent-text);\n  outline-offset: calc(var(--cu-space-2xs) * -1);\n  position: relative;\n  z-index: 1;\n}\n\n/* Doble clase (convención del repo): ganarle en cascada a reglas globales\n   del consumidor (reset CSS, `.playground button`, etc.) */\n.cu-calendar-day.cu-calendar-day[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-ghost-hover);\n}\n\n/* Día no seleccionable: `<button disabled>` (no enfocable; el teclado lo\n   saltea) + `aria-disabled` para la grilla. */\n.cu-calendar-day.cu-calendar-day[data-v-a5b1f966]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n/* Hoy: transparente + número en color accent (look ghost). Sin fondo para no\n   confundirse con el día seleccionado — se distingue solo por el color. */\n.cu-calendar-day.cu-calendar-day--today[data-v-a5b1f966] {\n  background: transparent;\n  color: var(--cal-accent-text);\n  font-weight: var(--cu-font-weight-semibold);\n}\n\n/* Variantes del día seleccionado */\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  /* Solid mantiene el texto del tema sobre la variante de fondo ajustada. */\n  color: var(--cal-solid-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-solid-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--outlined[data-v-a5b1f966] {\n  outline: 1.5px solid var(--cal-accent-border);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-a5b1f966] {\n  background: var(--cal-soft);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-a5b1f966]:hover:not(:disabled) {\n  background: var(--cal-soft-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--subtle[data-v-a5b1f966] {\n  background: var(--cal-subtle);\n  color: var(--cal-accent-text);\n  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--cal-subtle-border);\n}\n.cu-calendar-day--empty[data-v-a5b1f966] {\n  aspect-ratio: 1;\n}\n\n/* ── Grid interno: líneas separadoras entre días ── */\n.cu-calendar--grid .cu-calendar-weekdays[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-week[data-v-a5b1f966] {\n  gap: 0;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-day--empty[data-v-a5b1f966] {\n  border-right: var(--cu-border-thin) solid var(--cu-border-color);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: 0;\n}\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day[data-v-a5b1f966],\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day--empty[data-v-a5b1f966] {\n  border-bottom: none;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-a5b1f966]:nth-child(7n),\n.cu-calendar--grid .cu-calendar-day--empty[data-v-a5b1f966]:nth-child(7n) {\n  border-right: none;\n}\n\n/* ── Borde exterior: marco alrededor de la cuadrícula de días ── */\n.cu-calendar--border .cu-calendar-grid[data-v-a5b1f966] {\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  overflow: hidden;\n}\n\n/* ── Rango ── */\n.cu-calendar-day.cu-calendar-day--range[data-v-a5b1f966] {\n  background: var(--cal-soft);\n  border-radius: 0;\n}\n.cu-calendar-day.cu-calendar-day--range-start[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: var(--cu-radius-sm) 0 0 var(--cu-radius-sm);\n}\n.cu-calendar-day.cu-calendar-day--range-end[data-v-a5b1f966] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: 0 var(--cu-radius-sm) var(--cu-radius-sm) 0;\n}\n.cu-calendar-day--range-start.cu-calendar-day--range-end[data-v-a5b1f966] {\n  border-radius: var(--cu-radius-sm);\n}\n\n/* ── Puntos de eventos ── */\n.cu-calendar-day[data-v-a5b1f966] {\n  position: relative;\n}\n.cu-calendar-dots[data-v-a5b1f966] {\n  position: absolute;\n  bottom: var(--cu-space-2xs);\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: var(--cu-space-2xs);\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.cu-calendar-dot[data-v-a5b1f966] {\n  width: var(--cu-space-xs);\n  height: var(--cu-space-xs);\n  border-radius: 50%;\n  background: var(--dot-color, var(--cal-accent));\n  display: block;\n}\n"]], ["__scopeId", "data-v-a5b1f966"]]);
//#endregion
//#region src/components/controls/DualCalendar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "cu-dual-calendar" };
//#endregion
//#region src/components/controls/DualCalendar.vue
var DualCalendar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "DualCalendar",
	props: {
		startDate: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		endDate: {
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
			default: "neutral"
		},
		variant: {
			type: String,
			default: "soft"
		},
		disabled: {
			type: Boolean,
			default: false
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
		disabledWeekdays: {
			type: [Array, String],
			default: ""
		},
		disabledDates: {
			type: [Array, String],
			default: ""
		},
		events: {
			type: Array,
			default: () => []
		},
		grid: {
			type: Boolean,
			default: false
		},
		border: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		"update:startDate",
		"update:endDate",
		"change",
		"select"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const rangeStart = ref(parseDate(props.startDate));
		const rangeEnd = ref(parseDate(props.endDate));
		function onRangeStart(value) {
			rangeStart.value = value;
			emit("update:startDate", value);
		}
		function onRangeEnd(value) {
			rangeEnd.value = value;
			emit("update:endDate", value);
		}
		function onRangeChange(value) {
			if (value instanceof Date) return;
			rangeStart.value = value.start;
			rangeEnd.value = value.end;
			emit("change", value);
		}
		function onRangeSelect(value) {
			if (value instanceof Date) return;
			rangeStart.value = value.start;
			rangeEnd.value = value.end;
			emit("select", value);
		}
		function clampToLimits(month) {
			const target = new Date(month.getFullYear(), month.getMonth(), 1);
			const min = parseDate(props.min);
			const max = parseDate(props.max);
			const minMonth = min ? new Date(min.getFullYear(), min.getMonth(), 1) : null;
			const maxMonth = max ? new Date(max.getFullYear(), max.getMonth(), 1) : null;
			if (minMonth && target < minMonth) return minMonth;
			if (maxMonth && target > maxMonth) return maxMonth;
			return target;
		}
		function initialMonth() {
			const base = parseDate(props.startDate) ?? /* @__PURE__ */ new Date();
			return clampToLimits(new Date(base.getFullYear(), base.getMonth(), 1));
		}
		const firstMonth = ref(initialMonth());
		const secondMonth = ref(clampToLimits(addMonths(firstMonth.value, 1)));
		watch([() => props.min, () => props.max], () => {
			firstMonth.value = clampToLimits(firstMonth.value);
			secondMonth.value = clampToLimits(secondMonth.value);
		});
		/** Devuelve la fecha de inicio del rango. */
		function getStartDate() {
			return rangeStart.value;
		}
		/** Devuelve la fecha de fin del rango. */
		function getEndDate() {
			return rangeEnd.value;
		}
		/** Setea el rango completo y emite los cambios. */
		function setRange(start, end) {
			rangeStart.value = parseDate(start);
			rangeEnd.value = parseDate(end);
			emit("update:startDate", rangeStart.value);
			emit("update:endDate", rangeEnd.value);
			emit("change", {
				start: rangeStart.value,
				end: rangeEnd.value
			});
		}
		/** Limpia el rango. */
		function clear() {
			rangeStart.value = null;
			rangeEnd.value = null;
			emit("update:startDate", null);
			emit("update:endDate", null);
			emit("change", {
				start: null,
				end: null
			});
		}
		__expose({
			getStartDate,
			getEndDate,
			setRange,
			clear
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$5, [createVNode(Calendar_default, {
				mode: "range",
				"view-month": firstMonth.value,
				"range-start": rangeStart.value,
				"range-end": rangeEnd.value,
				min: props.min,
				max: props.max,
				color: props.color,
				variant: props.variant,
				locale: props.locale,
				"week-start": props.weekStart,
				"year-navigation": props.yearNavigation,
				"month-format": props.monthFormat,
				"year-format": props.yearFormat,
				disabled: props.disabled,
				"disabled-weekdays": props.disabledWeekdays,
				"disabled-dates": props.disabledDates,
				events: props.events,
				grid: props.grid,
				border: props.border,
				"onUpdate:viewMonth": _cache[0] || (_cache[0] = ($event) => firstMonth.value = $event),
				"onUpdate:rangeStart": onRangeStart,
				"onUpdate:rangeEnd": onRangeEnd,
				onChange: onRangeChange,
				onSelect: onRangeSelect
			}, null, 8, [
				"view-month",
				"range-start",
				"range-end",
				"min",
				"max",
				"color",
				"variant",
				"locale",
				"week-start",
				"year-navigation",
				"month-format",
				"year-format",
				"disabled",
				"disabled-weekdays",
				"disabled-dates",
				"events",
				"grid",
				"border"
			]), createVNode(Calendar_default, {
				mode: "range",
				"view-month": secondMonth.value,
				"range-start": rangeStart.value,
				"range-end": rangeEnd.value,
				min: props.min,
				max: props.max,
				color: props.color,
				variant: props.variant,
				locale: props.locale,
				"week-start": props.weekStart,
				"year-navigation": props.yearNavigation,
				"month-format": props.monthFormat,
				"year-format": props.yearFormat,
				disabled: props.disabled,
				"disabled-weekdays": props.disabledWeekdays,
				"disabled-dates": props.disabledDates,
				events: props.events,
				grid: props.grid,
				border: props.border,
				"onUpdate:viewMonth": _cache[1] || (_cache[1] = ($event) => secondMonth.value = $event),
				"onUpdate:rangeStart": onRangeStart,
				"onUpdate:rangeEnd": onRangeEnd,
				onChange: onRangeChange,
				onSelect: onRangeSelect
			}, null, 8, [
				"view-month",
				"range-start",
				"range-end",
				"min",
				"max",
				"color",
				"variant",
				"locale",
				"week-start",
				"year-navigation",
				"month-format",
				"year-format",
				"disabled",
				"disabled-weekdays",
				"disabled-dates",
				"events",
				"grid",
				"border"
			])]);
		};
	}
}), [["styles", ["\n.cu-dual-calendar[data-v-0464c27f] {\n  display: flex;\n  flex-direction: row;\n  gap: var(--cu-space-md);\n}\n.cu-dual-calendar[data-v-0464c27f] .cu-calendar {\n  flex: 1;\n  min-width: 0;\n}\n"]], ["__scopeId", "data-v-0464c27f"]]);
//#endregion
//#region src/components/information/Loader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = { class: "cu-loader" };
//#endregion
//#region src/components/information/Loader.vue
var Loader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Loader",
	props: {
		color: {
			type: String,
			required: false,
			default: "primary"
		},
		animation: {
			type: String,
			required: false,
			default: "loading"
		},
		delay: {
			type: Number,
			required: false,
			default: 2e3
		}
	},
	setup(__props) {
		const props = __props;
		const loaderStyles = computed(() => ({
			"--cu-loader-color": `var(--cu-color-${props.color})`,
			"--cu-loader-delay": `${props.delay}ms`
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$4, [createElementVNode("div", {
				class: normalizeClass(["cu-loader-bar", `cu-loader-bar--${props.animation}`]),
				style: normalizeStyle(loaderStyles.value)
			}, null, 6)]);
		};
	}
}), [["styles", ["\n.cu-loader[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  overflow: hidden;\n  height: 3px;\n}\n.cu-loader-bar[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  background: var(--cu-loader-color);\n}\n.cu-loader-bar--loading[data-v-045244b1] {\n  width: 60%;\n  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);\n  animation: cu-loader-slide-045244b1 1.5s ease-in-out infinite;\n}\n.cu-loader-bar--cooldown[data-v-045244b1] {\n  left: 0;\n  width: 100%;\n  animation: cu-loader-cooldown-045244b1 var(--cu-loader-delay) linear forwards;\n}\n@keyframes cu-loader-slide-045244b1 {\n0% { left: -100%;\n}\n50% { left: 0%;\n}\n100% { left: 100%;\n}\n}\n@keyframes cu-loader-cooldown-045244b1 {\nfrom { width: 100%;\n}\nto { width: 0%;\n}\n}\n"]], ["__scopeId", "data-v-045244b1"]]);
//#endregion
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = ["id", "role"];
var HOVER_REGISTRY_KEY = "__cu_hover_registry__";
//#endregion
//#region src/components/overlay/Popover.vue
var Popover_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Popover",
	props: {
		position: {
			type: String,
			required: false,
			default: "bottom",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "start",
			validator: isAlign
		},
		offset: {
			type: Number,
			required: false,
			default: 4
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		panelWidth: {
			type: String,
			required: false,
			default: ""
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		hover: {
			type: Boolean,
			required: false,
			default: false
		},
		hoverDelay: {
			type: Number,
			required: false,
			default: 200
		},
		role: {
			type: String,
			required: false,
			default: ""
		},
		/** `id` del panel: el trigger lo referencia con `aria-controls` (patrón combobox/listbox). */
		panelId: {
			type: String,
			required: false,
			default: ""
		},
		panelClass: {
			type: [
				String,
				Array,
				Object
			],
			required: false,
			default: ""
		}
	},
	emits: ["open", "close"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const effectivePosition = computed(() => props.position);
		const effectiveAlign = computed(() => props.align);
		const panelPos = ref({
			top: "0px",
			left: "0px"
		});
		const autoFixed = ref(false);
		const fixedMode = computed(() => props.fixed || autoFixed.value);
		const panelStyle = computed(() => {
			const base = {
				backgroundColor: "var(--cu-popover-bg, var(--cu-color-surface))",
				minWidth: "var(--cu-popover-min-width, 200px)",
				maxWidth: "var(--cu-popover-max-width, 80vw)"
			};
			if (fixedMode.value) return {
				...base,
				position: "fixed",
				...panelPos.value,
				zIndex: "10000",
				...props.panelWidth ? { width: props.panelWidth } : {}
			};
			base.position = "absolute";
			base.zIndex = "1000";
			base.width = props.panelWidth || "var(--cu-popover-width, 100%)";
			const pos = effectivePosition.value;
			if (pos === "bottom") {
				base.top = "100%";
				base.marginTop = `${props.offset}px`;
			} else if (pos === "top") {
				base.bottom = "100%";
				base.marginBottom = `${props.offset}px`;
			} else if (pos === "right") {
				base.left = "100%";
				base.marginLeft = `${props.offset}px`;
			} else if (pos === "left") {
				base.right = "100%";
				base.marginRight = `${props.offset}px`;
			}
			if (pos === "left" || pos === "right") {
				if (effectiveAlign.value === "start") base.top = "0";
				else if (effectiveAlign.value === "end") base.bottom = "0";
				else {
					base.top = "50%";
					base.transform = "translateY(-50%)";
				}
			} else if (effectiveAlign.value === "start") base.left = "0";
			else if (effectiveAlign.value === "end") base.right = "0";
			else {
				base.left = "50%";
				base.transform = "translateX(-50%)";
			}
			return base;
		});
		const isOpen = ref(false);
		const popoverRef = ref(null);
		const panelEl = ref(null);
		let focusBeforeOpen = null;
		/**
		* Elemento enfocado dentro del mismo árbol (shadow root o documento).
		*
		* Dentro de un shadow root `activeElement` es `null` cuando el foco está afuera: eso
		* **no** significa "foco perdido" (puede estar en otro control del documento), así que
		* se cae a `document.activeElement` y se descarta el host, que es un destino inútil.
		*/
		function activeInTree() {
			const root = popoverRef.value?.getRootNode();
			const inRoot = root?.activeElement ?? null;
			if (inRoot) return inRoot;
			if (!root || !(root instanceof ShadowRoot)) return null;
			const host = root.host;
			const docActive = document.activeElement;
			if (docActive && docActive !== document.body && docActive !== host) return docActive;
			return null;
		}
		/** Primer elemento enfocable del trigger (slot `#toggle`). */
		function triggerElement() {
			const root = popoverRef.value;
			if (!root) return null;
			const focusables = root.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
			for (const el of focusables) if (!panelEl.value?.contains(el)) return el;
			return null;
		}
		function rememberFocus() {
			const active = activeInTree();
			focusBeforeOpen = active && active !== document.body && !panelEl.value?.contains(active) ? active : null;
		}
		function restoreFocus() {
			if (props.hover) return;
			const panel = panelEl.value;
			const active = activeInTree();
			const insidePanel = !!panel && !!active && panel.contains(active);
			const lost = !active || active === document.body;
			const target = insidePanel ? focusBeforeOpen ?? triggerElement() : lost ? focusBeforeOpen : null;
			focusBeforeOpen = null;
			if (!target || !target.isConnected) return;
			target.focus();
		}
		let closedByOutsideClick = false;
		function onDocumentClick(e) {
			if (!isOpen.value || !popoverRef.value) return;
			if (!(e instanceof MouseEvent)) return;
			if (!e.composedPath().includes(popoverRef.value)) {
				closedByOutsideClick = true;
				isOpen.value = false;
				emit("close");
				restoreFocus();
				setTimeout(() => {
					closedByOutsideClick = false;
				}, 0);
			}
		}
		function onKeyDown(e) {
			if (e.key === "Escape" && isOpen.value) {
				isOpen.value = false;
				emit("close");
				restoreFocus();
			}
		}
		const SCROLL_OPTS = {
			capture: true,
			passive: true
		};
		onMounted(() => {
			document.addEventListener("click", onDocumentClick, true);
			document.addEventListener("keydown", onKeyDown);
			window.addEventListener("resize", onViewportChange);
			document.addEventListener("scroll", onViewportChange, SCROLL_OPTS);
		});
		onUnmounted(() => {
			unregisterHover();
			document.removeEventListener("click", onDocumentClick, true);
			document.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("resize", onViewportChange);
			document.removeEventListener("scroll", onViewportChange, SCROLL_OPTS);
			document.removeEventListener("mousemove", onPointerMove, true);
			pointerListening = false;
		});
		function positionPanel() {
			if (!fixedMode.value || !popoverRef.value) return;
			const r = popoverRef.value.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const pos = effectivePosition.value;
			const align = effectiveAlign.value;
			const style = {};
			if (pos === "bottom") {
				style.top = `${r.bottom + props.offset}px`;
				if (align === "start") style.left = `${r.left}px`;
				else if (align === "end") style.right = `${vw - r.right}px`;
				else {
					style.left = `${r.left + r.width / 2}px`;
					style.transform = "translateX(-50%)";
				}
			} else if (pos === "top") {
				style.bottom = `${vh - r.top + props.offset}px`;
				if (align === "start") style.left = `${r.left}px`;
				else if (align === "end") style.right = `${vw - r.right}px`;
				else {
					style.left = `${r.left + r.width / 2}px`;
					style.transform = "translateX(-50%)";
				}
			} else if (pos === "right") {
				style.left = `${r.right + props.offset}px`;
				if (align === "start") style.top = `${r.top}px`;
				else if (align === "end") style.bottom = `${vh - r.bottom}px`;
				else {
					style.top = `${r.top + r.height / 2}px`;
					style.transform = "translateY(-50%)";
				}
			} else {
				style.right = `${vw - r.left + props.offset}px`;
				if (align === "start") style.top = `${r.top}px`;
				else if (align === "end") style.bottom = `${vh - r.bottom}px`;
				else {
					style.top = `${r.top + r.height / 2}px`;
					style.transform = "translateY(-50%)";
				}
			}
			if (autoFixed.value && !props.panelWidth) style.width = `${r.width}px`;
			panelPos.value = style;
		}
		function onViewportChange() {
			if (isOpen.value && fixedMode.value) positionPanel();
		}
		function anchorsFixedDescendants(cs) {
			const notNone = (v) => !!v && v !== "none";
			return notNone(cs.transform) || notNone(cs.filter) || notNone(cs.perspective) || notNone(cs.backdropFilter) || !!cs.contain && /paint|layout|strict|content/.test(cs.contain) || !!cs.willChange && /transform|filter|perspective/.test(cs.willChange);
		}
		function clipsDescendants(cs) {
			return !!cs.overflow && cs.overflow !== "visible";
		}
		function isClippedByAncestor(panel, anchor) {
			const pr = panel.getBoundingClientRect();
			if (!pr.width && !pr.height) return false;
			let el = flatParent(anchor);
			while (el) {
				const cs = getComputedStyle(el);
				if (anchorsFixedDescendants(cs)) return false;
				if (clipsDescendants(cs)) {
					const r = el.getBoundingClientRect();
					if (pr.top < r.top || pr.left < r.left || pr.bottom > r.bottom || pr.right > r.right) return true;
				}
				el = flatParent(el);
			}
			return false;
		}
		function flatParent(el) {
			const slotted = el.assignedSlot;
			if (slotted) return slotted;
			if (el.parentElement) return el.parentElement;
			return el.getRootNode().host ?? null;
		}
		async function autoFixIfClipped() {
			await nextTick();
			const panel = panelEl.value;
			const anchor = popoverRef.value;
			if (!panel || !anchor || !isOpen.value || props.fixed) return;
			if (!isClippedByAncestor(panel, anchor)) return;
			autoFixed.value = true;
			positionPanel();
		}
		let hoverTimer = null;
		let hoverCloseTimer = null;
		function hoverRegistry() {
			const g = globalThis;
			return g[HOVER_REGISTRY_KEY] ??= [];
		}
		function registerHoverOpen() {
			const el = popoverRef.value;
			if (!el) return;
			const reg = hoverRegistry();
			const toClose = reg.filter((entry) => entry.el !== el && !entry.el.contains(el));
			reg.push({
				el,
				close
			});
			for (const entry of toClose) entry.close();
		}
		function unregisterHover() {
			const el = popoverRef.value;
			if (!el) return;
			const reg = hoverRegistry();
			const idx = reg.findIndex((entry) => entry.el === el);
			if (idx !== -1) reg.splice(idx, 1);
		}
		let lastPointer = {
			x: -1,
			y: -1
		};
		let pointerListening = false;
		function ensurePointerListener() {
			if (pointerListening) return;
			pointerListening = true;
			document.addEventListener("mousemove", onPointerMove, true);
		}
		function onPointerMove(e) {
			lastPointer = {
				x: e.clientX,
				y: e.clientY
			};
		}
		function isPointerInside() {
			const el = popoverRef.value;
			if (!el) return false;
			const panel = el.querySelector(".cu-popover-panel");
			const rects = [el.getBoundingClientRect()];
			if (panel) rects.push(panel.getBoundingClientRect());
			return rects.some((r) => lastPointer.x >= r.left && lastPointer.x <= r.right && lastPointer.y >= r.top && lastPointer.y <= r.bottom);
		}
		function onMouseEnter() {
			if (!props.hover || props.disabled) return;
			if (hoverTimer) clearTimeout(hoverTimer);
			if (hoverCloseTimer) {
				clearTimeout(hoverCloseTimer);
				hoverCloseTimer = null;
			}
			if (props.hoverDelay === 0) open();
			else hoverTimer = setTimeout(() => open(), props.hoverDelay);
		}
		function onMouseLeave() {
			if (!props.hover) return;
			if (hoverTimer) clearTimeout(hoverTimer);
			ensurePointerListener();
			if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
			hoverCloseTimer = setTimeout(() => {
				if (isPointerInside()) return;
				close();
			}, 120);
		}
		function open() {
			if (props.disabled) return;
			autoFixed.value = false;
			rememberFocus();
			positionPanel();
			isOpen.value = true;
			emit("open");
			if (props.hover) registerHoverOpen();
			if (!props.fixed) autoFixIfClipped();
		}
		function close() {
			if (!isOpen.value) return;
			isOpen.value = false;
			autoFixed.value = false;
			emit("close");
			unregisterHover();
			restoreFocus();
		}
		function toggle() {
			if (props.disabled) return;
			if (closedByOutsideClick) {
				closedByOutsideClick = false;
				return;
			}
			if (isOpen.value) close();
			else open();
		}
		__expose({
			open,
			close,
			toggle,
			isOpen: () => isOpen.value
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "popoverRef",
				ref: popoverRef,
				class: "cu-popover",
				onMouseenter: onMouseEnter,
				onMouseleave: onMouseLeave
			}, [renderSlot(_ctx.$slots, "toggle", {
				toggle,
				isOpen: isOpen.value
			}, void 0, true), isOpen.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				ref_key: "panelEl",
				ref: panelEl,
				id: props.panelId || void 0,
				style: normalizeStyle(panelStyle.value),
				class: normalizeClass(["cu-popover-panel", __props.panelClass]),
				role: __props.role || void 0
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1$3)) : createCommentVNode("v-if", true)], 544);
		};
	}
}), [["styles", ["\n.cu-popover[data-v-7e62c527] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.cu-popover-panel[data-v-7e62c527] {\n  padding: var(--cu-space-sm);\n  border-radius: var(--cu-radius-md);\n  font-family: var(--cu-font-sans);\n  box-shadow: var(--cu-shadow-xl);\n}\n"]], ["__scopeId", "data-v-7e62c527"]]);
//#endregion
//#region node_modules/.pnpm/dompurify@3.4.14/node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.14 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.14/LICENSE */
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
var entries = Object.entries;
var setPrototypeOf = Object.setPrototypeOf;
var isFrozen = Object.isFrozen;
var getPrototypeOf = Object.getPrototypeOf;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var freeze = Object.freeze;
var seal = Object.seal;
var create = Object.create;
var _ref = typeof Reflect !== "undefined" && Reflect;
var apply = _ref.apply;
var construct = _ref.construct;
if (!freeze) freeze = function freeze(x) {
	return x;
};
if (!seal) seal = function seal(x) {
	return x;
};
if (!apply) apply = function apply(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var arrayIsArray = Array.isArray;
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var numberToString = unapply(Number.prototype.toString);
var booleanToString = unapply(Boolean.prototype.toString);
var bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
var symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var objectToString = unapply(Object.prototype.toString);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) {
			if (arrayIsArray(value)) newObject[property] = cleanArray(value);
			else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
			else newObject[property] = value;
		}
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
var html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
var svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
var svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
var svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
var mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
var mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
var text = freeze(["#text"]);
var html = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
var svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"pointer-events",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"vector-effect",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
var mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
var xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
var MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
var ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
var TMPLIT_EXPR = seal(/\${[\w\W]*/g);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
var COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
var FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
var SELF_CLOSING_TAG = seal(/\/>/i);
var NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
var LITERAL_TEXT_ELEMENT_NAMES = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
];
var LITERAL_TEXT_ELEMENTS = freeze(addToSet({}, LITERAL_TEXT_ELEMENT_NAMES));
var LITERAL_TEXT_CLOSE = function() {
	const map = {};
	arrayForEach(LITERAL_TEXT_ELEMENT_NAMES, (name) => {
		map[name] = seal(new RegExp("</" + name + "(?=[\\t\\n\\f\\r />])", "i"));
	});
	return freeze(map);
}();
var getGlobal = function getGlobal() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html) {
				return html;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
var _createHooksMap = function _createHooksMap() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
/**
* Resolve a set-valued configuration option: a fresh set built from
* cfg[key] when it is an own array property (seeded with a clone of
* options.base when given, case-normalized via options.transform),
* the fallback set otherwise.
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param fallback the set to use when the option is absent or not an array
* @param options transform and optional base set to merge into
* @returns the resolved set
*/
var _resolveSetOption = function _resolveSetOption(cfg, key, fallback, options) {
	return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
/**
* Resolve an object-valued configuration option: a prototype-free clone
* of cfg[key] when it is an own, truthy object property, else a fresh
* fallback built by makeFallback (fresh on every parse, so a previous
* parse can never leak state into the next one).
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param makeFallback builds the fallback value when the option is absent
* @returns the resolved object
*/
var _resolveObjectOption = function _resolveObjectOption(cfg, key, makeFallback) {
	const value = objectHasOwnProperty(cfg, key) ? cfg[key] : void 0;
	return value && typeof value === "object" ? clone(value) : makeFallback();
};
function createDOMPurify() {
	let window = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.14";
	DOMPurify.removed = [];
	if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document = window.document;
	const originalDocument = document;
	const currentScript = originalDocument.currentScript;
	window.DocumentFragment;
	const HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, Element = window.Element, NodeFilter = window.NodeFilter;
	window.NamedNodeMap === void 0 && (window.NamedNodeMap || window.MozNamedAttrMap);
	window.HTMLFormElement;
	const DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
	const _readNodeType = function _readNodeType(node) {
		return getNodeType ? getNodeType(node) : node.nodeType;
	};
	const _readNodeName = function _readNodeName(node) {
		return getNodeName ? getNodeName(node) : node.nodeName;
	};
	if (typeof HTMLTemplateElement === "function") {
		const template = document.createElement("template");
		if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	let defaultTrustedTypesPolicy;
	let defaultTrustedTypesPolicyResolved = false;
	let IN_TRUSTED_TYPES_POLICY = 0;
	const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy() {
		if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	};
	const _createTrustedHTML = function _createTrustedHTML(html) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createHTML(html);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _createTrustedScriptURL = function _createTrustedScriptURL(scriptUrl) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createScriptURL(scriptUrl);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy() {
		if (!defaultTrustedTypesPolicyResolved) {
			defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			defaultTrustedTypesPolicyResolved = true;
		}
		return defaultTrustedTypesPolicy;
	};
	const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let SET_CONFIG_ALLOWED_TAGS = null;
	let SET_CONFIG_ALLOWED_ATTR = null;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
	const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
	let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
		ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
		ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
		URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
			transform: transformCaseFunc,
			base: DEFAULT_URI_SAFE_ATTRIBUTES
		});
		DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
			transform: transformCaseFunc,
			base: DEFAULT_DATA_URI_TAGS
		});
		FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
		FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
		FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = _resolveObjectOption(cfg, "MATHML_TEXT_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS));
		HTML_INTEGRATION_POINTS = _resolveObjectOption(cfg, "HTML_INTEGRATION_POINTS", () => addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS));
		const customElementHandling = _resolveObjectOption(cfg, "CUSTOM_ELEMENT_HANDLING", () => create(null));
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		seal(CUSTOM_ELEMENT_HANDLING);
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const previousTrustedTypesPolicy = trustedTypesPolicy;
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			try {
				emptyHTML = _createTrustedHTML("");
			} catch (error) {
				trustedTypesPolicy = previousTrustedTypesPolicy;
				throw error;
			}
		} else if (cfg.TRUSTED_TYPES_POLICY === null) {
			trustedTypesPolicy = void 0;
			emptyHTML = "";
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
			if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
		}
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* Namespace rules for an element in the SVG namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkSvgNamespace = function _checkSvgNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
		if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
		return Boolean(ALL_SVG_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the MathML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkMathMlNamespace = function _checkMathMlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
		if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
		return Boolean(ALL_MATHML_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the HTML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkHtmlNamespace = function _checkHtmlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
		if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
		return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	};
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
			if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	};
	/**
	* _stripAttributeNode
	*
	* Remove a single Attr node case/namespace-exactly on an attribute-teardown
	* path. Name-based removeAttribute() ASCII-lowercases its lookup key for an
	* HTML element in an HTML document and so silently misses a case-preserved
	* handler (e.g. `ONERROR` off an XML/XHTML import) - the same defect
	* _removeAttribute() was fixed for, which a name-based call would reintroduce
	* on these IN_PLACE teardown paths. Unlike _removeAttribute this does not
	* record into DOMPurify.removed: the neutralize passes intentionally do not
	* book-keep. A clobbered/detached node falls back to best-effort name-based
	* removal.
	*
	* @param element the element to strip the attribute from
	* @param attribute the Attr node to remove
	* @param name the attribute's name, for the fallback path
	*/
	const _stripAttributeNode = function _stripAttributeNode(element, attribute, name) {
		try {
			element.removeAttributeNode(attribute);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _neutralizeRoot
	*
	* Fail-closed teardown of an in-place root after the sanitize walk aborts
	* (campaign-3 F2). An internal throw mid-walk — e.g. a page-registered
	* custom element's reaction detaches a node so `_forceRemove`'s deliberate
	* parentless guard throws, or any other re-entrant engine mutation — would
	* otherwise leave the caller's *live* tree half-sanitized, with everything
	* after the abort point still carrying its handlers. There is no safe way
	* to resume the walk (the tree mutated under us), so we strip the root bare:
	* remove every child and every attribute, then let the caller's catch see
	* the original error. Clobber-safe (cached `remove`/`childNodes`/`attributes`
	* getters; the root was already clobber-pre-flighted at the IN_PLACE entry).
	*
	* @param root the in-place root to empty
	*/
	const _neutralizeRoot = function _neutralizeRoot(root) {
		_neutralizeSubtree(root);
		const childNodes = getChildNodes(root);
		if (childNodes) {
			const snapshot = [];
			arrayForEach(childNodes, (child) => {
				arrayPush(snapshot, child);
			});
			arrayForEach(snapshot, (child) => {
				try {
					remove(child);
				} catch (_) {}
			});
		}
		const attributes = getAttributes(root);
		if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name === "string") _stripAttributeNode(root, attribute, name);
		}
	};
	/**
	* _removeAttribute
	*
	* Name-based getAttributeNode()/removeAttribute() ASCII-lowercase their
	* lookup key for HTML elements in an HTML document, so they silently miss an
	* attribute whose stored qualified name still contains uppercase ASCII
	* letters. That happens when the node came from a case-preserving source
	* (an XML/XHTML document imported via importNode(), or createAttributeNS()),
	* where e.g. `ONERROR` survives the walk: the policy check lowercases to
	* `onerror` and rejects it, but `removeAttribute('ONERROR')` looks up
	* `onerror` and finds nothing. Remove the exact Attr node instead, which is
	* case- and namespace-exact, and fall back to name-based removal only when
	* the caller could not supply the node.
	*
	* @param name an Attribute name
	* @param element a DOM node
	* @param attr the exact Attr node to remove, when the caller has it
	*/
	const _removeAttribute = function _removeAttribute(name, element, attr) {
		if (!attr) try {
			attr = element.getAttributeNode(name);
		} catch (_) {
			attr = null;
		}
		arrayPush(DOMPurify.removed, {
			attribute: attr || null,
			from: element
		});
		try {
			if (attr) element.removeAttributeNode(attr);
			else element.removeAttribute(name);
		} catch (_) {
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
		if (name === "is") {
			if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
				_forceRemove(element);
			} catch (_) {}
			else try {
				element.setAttribute(name, "");
			} catch (_) {}
		}
	};
	/**
	* _stripDisallowedAttributes
	*
	* Removes every attribute the active configuration does not allow from a
	* single element, using the same allowlist as the main attribute pass (so
	* `on*` handlers go, but no `/^on/` blocklist is introduced). Used only to
	* neutralise nodes that are being discarded from an in-place tree.
	*
	* @param element the element to strip
	*/
	const _stripDisallowedAttributes = function _stripDisallowedAttributes(element) {
		const attributes = getAttributes(element);
		if (!attributes) return;
		for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
			_stripAttributeNode(element, attribute, name);
		}
	};
	/**
	* _neutralizeSubtree
	*
	* Completes the audit-5 F1 fix across every removal path. The KEEP_CONTENT
	* move-hoist neutralises only disallowed-tag removals; clobber, mXSS-canary,
	* namespace, comment, processing-instruction and KEEP_CONTENT:false removals
	* all drop their subtree wholesale via `_forceRemove`. On the IN_PLACE path
	* those dropped nodes are detached from the caller's LIVE tree but a
	* handler-bearing original among them (an `<img onerror>`/`<video>` that was
	* loading) keeps its queued resource event, which fires in page scope after
	* sanitize returns. This walks a removed subtree and strips every attribute
	* the active configuration does not allow — so `on*` handlers are cancelled
	* through the SAME allowlist that governs kept nodes, not a separate `/^on/`
	* blocklist. Run synchronously before sanitize returns, i.e. before any
	* queued event can fire. Hook-free by design: these nodes leave the output,
	* so firing attribute hooks for them would be surprising. Clobber-safe reads;
	* a doomed clobbered node may shadow `removeAttribute` (its own attributes are
	* irrelevant — it is discarded — while its non-clobbered descendants, e.g.
	* the `<img>`, are reached and scrubbed).
	*
	* @param root the root of a removed subtree to neutralise
	*/
	const _neutralizeSubtree = function _neutralizeSubtree(root) {
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			if (_readNodeType(node) === NODE_TYPE.element) _stripDisallowedAttributes(node);
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _neutralizePatchLinkage
	*
	* IN_PLACE entry pre-pass (declarative-partial-updates / streaming
	* hardening, https://github.com/WICG/declarative-partial-updates).
	*
	* The main walk strips patch linkage (`for`/`patchsrc`) and removes range
	* markers (PIs / markup comments) node-by-node, in document order, AS it
	* reaches each node. On a live in-place root that leaves a window: from the
	* moment the root is connected until the walk arrives at a given node, that
	* node's linkage is live. A patch applied on connection/stream can fire as
	* a microtask during the walk and inject or teleport an unsanitized DOM
	* range into a region the iterator has already passed and will not revisit,
	* so the post-return "tree is sanitized" contract is violated. Sweep the
	* whole tree once up front and sever every linkage before the walk begins,
	* closing that window.
	*
	* This CANNOT undo a patch that already fired before sanitize ran — that is
	* the irreducible "do not IN_PLACE a live-connected attacker tree" caveat —
	* but it closes everything from sanitize-start onward. Gated on SAFE_FOR_XML
	* to group with the rest of the declarative-partial-updates handling and
	* stay overridable, consistent with the codebase.
	*
	* Clobber-safe traversal (cached childNodes getter); per-node try/catch so a
	* clobbered root cannot defeat the sweep of its non-clobbered descendants.
	*
	* NOTE (pending real-Chrome confirmation, see test/declarative-patch-probe
	* .html Q1): this mirrors the existing policy of keeping `for` on
	* <label>/<output>. If the shipping feature can drive a patch through a
	* surviving `for`-on-label/output + `id` pair, this pre-pass and the
	* attribute check at _isBasicCustomElement's caller must additionally drop
	* that pair on the IN_PLACE path. Left as-is until the taxonomy is verified.
	*
	* @param root the in-place root to sweep
	*/
	/**
	* Central policy for declarative-partial-updates patch-linkage attributes,
	* shared by the _neutralizePatchLinkage pre-pass and _isValidAttribute so
	* the two sites cannot drift: `patchsrc` always links, `for` links
	* everywhere except on <label>/<output>, and the whole policy is gated on
	* SAFE_FOR_XML (see the rationale block in _isValidAttribute).
	*
	* @param lcName the transformCaseFunc'd attribute name
	* @param lcTag the transformCaseFunc'd tag name of the carrying element
	* @return true if the attribute is patch linkage and must be dropped
	*/
	const _isPatchLinkageAttribute = function _isPatchLinkageAttribute(lcName, lcTag) {
		if (!SAFE_FOR_XML) return false;
		if (lcName === "patchsrc") return true;
		return lcName === "for" && lcTag !== "label" && lcTag !== "output";
	};
	const _neutralizePatchLinkage = function _neutralizePatchLinkage(root) {
		if (!SAFE_FOR_XML) return;
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			const nodeType = _readNodeType(node);
			if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
				try {
					remove(node);
				} catch (_) {}
				continue;
			}
			if (nodeType === NODE_TYPE.element) {
				const element = node;
				const lcTag = transformCaseFunc(_readNodeName(node));
				try {
					if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
					if (element.hasAttribute && element.hasAttribute("for") && _isPatchLinkageAttribute("for", lcTag)) element.removeAttribute("for");
				} catch (_) {}
			}
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator(root) {
		const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
		return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Replace template expression syntax (mustache, ERB, template
	* literal) with a space; shared by all SAFE_FOR_TEMPLATES scrub
	* sites. Order matters: mustache, then ERB, then template literal.
	*
	* @param value the string to scrub
	* @returns the scrubbed string
	*/
	const _stripTemplateExpressions = function _stripTemplateExpressions(value) {
		value = stringReplace(value, MUSTACHE_EXPR$1, " ");
		value = stringReplace(value, ERB_EXPR$1, " ");
		value = stringReplace(value, TMPLIT_EXPR$1, " ");
		return value;
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
		var _node$querySelectorAl;
		node.normalize();
		const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
		const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			currentNode.data = _stripTemplateExpressions(currentNode.data);
			currentNode = walker.nextNode();
		}
		const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
		if (templates) arrayForEach(templates, (tmpl) => {
			if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
		});
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks, currentNode, data) {
		if (hooks.length === 0) return;
		arrayForEach(hooks, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* Structural-threat checks that condemn a node regardless of the
	* allowlists: mXSS via namespace confusion, risky CSS construction,
	* processing instructions, markup-bearing comments. Pure predicate;
	* the caller removes. Check order is load-bearing.
	*
	* @param currentNode the node to inspect
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node must be removed
	*/
	const _isUnsafeNode = function _isUnsafeNode(currentNode, tagName) {
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && LITERAL_TEXT_ELEMENTS[tagName] && (_isNode(currentNode.firstElementChild) || typeof currentNode.textContent === "string" && regExpTest(LITERAL_TEXT_CLOSE[tagName], currentNode.textContent))) return true;
		if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
		return false;
	};
	/**
	* Evaluate a CUSTOM_ELEMENT_HANDLING check (a RegExp or a predicate
	* function, per the validation in _parseConfig) against a name.
	* Additional arguments are forwarded to predicate functions - the
	* attributeNameCheck predicate receives the tag name as its second
	* argument. A null/absent check never matches.
	*
	* @param check the configured tagNameCheck / attributeNameCheck value
	* @param name the name to test
	* @param args extra arguments forwarded to a predicate function
	* @return true if the check matches the name
	*/
	const _matchesNameCheck = function _matchesNameCheck(check, name) {
		if (check instanceof RegExp) return regExpTest(check, name);
		if (check instanceof Function) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
			return Boolean(check(name, ...args));
		}
		return false;
	};
	/**
	* Handle a node whose tag is forbidden or not allowlisted: keep
	* allowed custom elements (false return exits _sanitizeElements
	* early - the namespace and fallback-tag removal checks are
	* intentionally skipped for kept custom elements), else hoist
	* content per KEEP_CONTENT and remove.
	*
	* A kept custom element is the ONLY case in which this function
	* returns false, so the caller uses that return value to run the
	* afterSanitizeElements hook on the kept element and keep the
	* element-hook lifecycle consistent with normal allowlisted
	* elements (GHSA-c2j3-45gr-mqc4).
	*
	* @param currentNode the disallowed node
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node was removed, false if kept
	*/
	const _sanitizeDisallowedNode = function _sanitizeDisallowedNode(currentNode, tagName, root) {
		if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
		if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
			const parentNode = getParentNode(currentNode);
			const childNodes = getChildNodes(currentNode);
			if (childNodes && parentNode) {
				const childCount = childNodes.length;
				for (let i = childCount - 1; i >= 0; --i) {
					const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
					parentNode.insertBefore(hoisted, getNextSibling(currentNode));
				}
			}
		}
		_forceRemove(currentNode);
		return true;
	};
	/**
	* Fork a hook-mutable allowlist off its shared binding the first time a
	* (possibly lazily-installed) uponSanitize* hook is about to see it, so the
	* hook cannot widen the per-instance default or the setConfig binding by
	* reference and leak past the call. Returns the set unchanged once it is
	* already call-local, so repeated calls across elements are idempotent.
	*
	* @param hookList the uponSanitize* hook array for this event
	* @param set the current ALLOWED_TAGS / ALLOWED_ATTR binding
	* @param defaultSet the per-instance DEFAULT_ALLOWED_* constant
	* @param setConfigSet the captured setConfig() binding, or null
	* @return a call-local clone if a hook is present and set is still shared,
	*   else set unchanged
	*/
	const _forkSharedAllowlist = function _forkSharedAllowlist(hookList, set, defaultSet, setConfigSet) {
		if (hookList.length === 0) return set;
		return set === defaultSet || set === setConfigSet ? clone(set) : set;
	};
	/**
	* Shared guard for a node that a hook has detached from the walk tree,
	* used after each element-hook site in _sanitizeElements. Detaching is a
	* long-standing user pattern (issue #469; draw.io-style foreignObject
	* filtering). Per the cached, unclobberable parentNode getter the node is
	* genuinely out of the tree, so it can reach neither the serialized
	* output nor an IN_PLACE live tree; treat it as removed and stop
	* processing it. Without this guard, the unsafe-node / namespace checks
	* would call _forceRemove on a parentless node and hit the REPORT-3
	* fail-closed throw — which exists for nodes DOMPurify wants gone but
	* *cannot* detach (clobbered / parentless roots), the opposite of a node
	* that is already safely gone. The walk root is exempt: a detached
	* IN_PLACE root is legitimate input and must still be fully sanitized,
	* and a kill-decision on it must keep hitting the REPORT-3 throw.
	*
	* Nodes detached by hooks stay the hook's responsibility for placement:
	* they are not recorded in DOMPurify.removed, so the post-walk IN_PLACE
	* pass (which iterates DOMPurify.removed) does not reach them. But a
	* hook-detached subtree can still hold a queued resource-event handler -
	* e.g. an <img onload> that began loading when the caller built the live
	* tree - which fires in page scope after sanitize returns even though the
	* handler never reached the returned tree. That is the audit-5 F1 hazard,
	* and the documented node.remove() hook pattern walks straight into it.
	* So on the IN_PLACE path we neutralize the detached subtree inline,
	* stripping its non-allow-listed attributes before returning, exactly as
	* the post-walk pass does for _forceRemove'd subtrees.
	*
	* @param currentNode the node a hook may have detached
	* @param root the current walk root
	* @return true if the node is detached and now handled, false otherwise
	*/
	const _handleHookDetachedNode = function _handleHookDetachedNode(currentNode, root) {
		if (currentNode === root || getParentNode(currentNode) !== null) return false;
		if (IN_PLACE) _neutralizeSubtree(currentNode);
		return true;
	};
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(_readNodeName(currentNode));
		ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (_handleHookDetachedNode(currentNode, root)) return true;
		if (_isUnsafeNode(currentNode, tagName)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
			if (removed === false) _executeHooks(hooks.afterSanitizeElements, currentNode, null);
			return removed;
		}
		if (_readNodeType(currentNode) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			const content = _stripTemplateExpressions(currentNode.textContent);
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return false;
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (_isPatchLinkageAttribute(lcName, lcTag)) return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName)) return true;
		if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) return true;
		if (!nameIsPermitted) return _isBasicCustomElement(lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName, lcTag) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && _matchesNameCheck(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value);
		if (URI_SAFE_ATTRIBUTES[lcName]) return true;
		if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) return true;
		if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ""))) return true;
		return !value;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* Wrap an attribute value in the matching Trusted Types object when
	* the active policy requires it. Namespaced attributes pass through
	* unchanged (no TT support yet, see
	* https://bugs.chromium.org/p/chromium/issues/detail?id=1305293).
	*
	* @param lcTag lowercase tag name of the containing element
	* @param lcName lowercase attribute name
	* @param namespaceURI the attribute's namespace, if any
	* @param value the attribute value to wrap
	* @return the value, wrapped when Trusted Types demand it
	*/
	const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value) {
		if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
			case "TrustedHTML": return _createTrustedHTML(value);
			case "TrustedScriptURL": return _createTrustedScriptURL(value);
		}
		return value;
	};
	/**
	* Write a modified attribute value back onto the element. On
	* success, re-probe for clobbering introduced by the new value and
	* remove the element when found; otherwise pop the removal entry
	* recorded by the earlier _removeAttribute (long-standing pairing
	* with the SANITIZE_NAMED_PROPS path - do not "fix" casually). On
	* failure, remove the attribute instead.
	*
	* @param currentNode the element carrying the attribute
	* @param name the attribute name as present on the element
	* @param namespaceURI the attribute's namespace, if any
	* @param value the new attribute value
	*/
	const _setAttributeValue = function _setAttributeValue(currentNode, name, namespaceURI, value) {
		try {
			if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
			else currentNode.setAttribute(name, value);
			if (_isClobbered(currentNode)) _forceRemove(currentNode);
			else arrayPop(DOMPurify.removed);
		} catch (_) {
			_removeAttribute(name, currentNode);
		}
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	*/
	const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		const lcTag = transformCaseFunc(currentNode.nodeName);
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode, attr);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode, attr);
				continue;
			}
			value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
			if (value !== initValue) _setAttributeValue(currentNode, name, namespaceURI, value);
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode, fragment);
			_sanitizeAttributes(shadowNode);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if (_readNodeType(shadowNode) === NODE_TYPE.element) {
				const innerSr = getShadowRoot(shadowNode);
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots(root) {
		const stack = [{
			node: root,
			shadow: null
		}];
		while (stack.length > 0) {
			const item = stack.pop();
			if (item.shadow) {
				_sanitizeShadowDOM2(item.shadow);
				continue;
			}
			const node = item.node;
			const isElement = _readNodeType(node) === NODE_TYPE.element;
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
				node: childNodes[i],
				shadow: null
			});
			if (isElement) {
				const rootName = getNodeName ? getNodeName(node) : null;
				if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
					const content = node.content;
					if (_isDocumentFragment(content)) stack.push({
						node: content,
						shadow: null
					});
				}
			}
			if (isElement) {
				const sr = getShadowRoot(node);
				if (_isDocumentFragment(sr)) stack.push({
					node: null,
					shadow: sr
				}, {
					node: sr,
					shadow: null
				});
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (SET_CONFIG) {
			ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
			ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
		} else _parseConfig(cfg);
		if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		DOMPurify.removed = [];
		const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
		if (inPlace) {
			_neutralizePatchLinkage(dirty);
			const nn = _readNodeName(dirty);
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					_neutralizeRoot(dirty);
					throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
				}
			}
			if (_isClobbered(dirty)) {
				_neutralizeRoot(dirty);
				throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			}
			try {
				_sanitizeAttachedShadowRoots(dirty);
			} catch (error) {
				_neutralizeRoot(dirty);
				throw error;
			}
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots(importedNode);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const walkRoot = inPlace ? dirty : body;
		try {
			const nodeIterator = _createNodeIterator(walkRoot);
			while (currentNode = nodeIterator.nextNode()) {
				_sanitizeElements(currentNode, walkRoot);
				_sanitizeAttributes(currentNode);
				if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
			}
		} catch (error) {
			if (inPlace) {
				_neutralizeRoot(dirty);
				arrayForEach(DOMPurify.removed, (entry) => {
					if (entry.element) _neutralizeSubtree(entry.element);
				});
			}
			throw error;
		}
		if (inPlace) {
			arrayForEach(DOMPurify.removed, (entry) => {
				if (entry.element) _neutralizeSubtree(entry.element);
			});
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		_parseConfig(cfg);
		SET_CONFIG = true;
		SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
		SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
		SET_CONFIG_ALLOWED_TAGS = null;
		SET_CONFIG_ALLOWED_ATTR = null;
		trustedTypesPolicy = defaultTrustedTypesPolicy;
		emptyHTML = "";
	};
	DOMPurify.isValidAttribute = function(tag, attr, value) {
		if (!CONFIG) _parseConfig({});
		const lcTag = transformCaseFunc(tag);
		const lcName = transformCaseFunc(attr);
		return _isValidAttribute(lcTag, lcName, value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify = createDOMPurify();
//#endregion
//#region src/components/overlay/Dropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = ["onClick"];
var _hoisted_2$2 = ["innerHTML"];
var _hoisted_3$1 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_4$1 = {
	key: 0,
	class: "cu-dropdown-menu-divider"
};
var _hoisted_5 = ["href", "onClick"];
var _hoisted_6 = ["innerHTML"];
var _hoisted_7 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_8 = ["disabled", "onClick"];
var _hoisted_9 = ["innerHTML"];
var _hoisted_10 = { class: "cu-dropdown-menu-item-label" };
//#endregion
//#region src/components/overlay/Dropdown.vue
var Dropdown_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Dropdown",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		variant: {
			type: String,
			required: false,
			default: "ghost",
			validator: isVariantFull
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** Ícono del trigger (SVG/HTML). */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		trigger: {
			type: String,
			required: false,
			default: "click"
		},
		position: {
			type: String,
			required: false,
			default: "bottom",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "start",
			validator: isAlign
		},
		offset: {
			type: Number,
			required: false,
			default: 4
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		panelWidth: {
			type: String,
			required: false,
			default: ""
		},
		/** Rol ARIA del panel: `menu` (default, listas de acciones), `dialog` (paneles con contenido propio, como el date-picker), `listbox`… */
		panelRole: {
			type: String,
			required: false,
			default: "menu"
		},
		/** `id` del panel: el trigger lo referencia con `aria-controls` (patrón combobox/listbox). */
		panelId: {
			type: String,
			required: false,
			default: ""
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldown: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldownKey: {
			type: Number,
			required: false,
			default: 0
		},
		/**
		* Estilo de la barra de cooldown: `ghost`/`ghost-hover` (color suave, default) o
		* `solid` (color lleno). Se resuelve con los tokens del color activo.
		*/
		cooldownVariant: {
			type: String,
			required: false,
			default: "ghost-hover"
		},
		delay: {
			type: Number,
			required: false,
			default: 2e3
		},
		items: {
			type: Array,
			required: false,
			default: () => []
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["open", "close"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const sanitizeIcon = (html) => html ? purify.sanitize(html) : void 0;
		const props = __props;
		/** Valor seleccionado (v-model). */
		const selectedValue = useModel(__props, "modelValue");
		const emit = __emit;
		const popoverRef = ref(null);
		const isNested = ref(false);
		function detectNested() {
			const el = popoverRef.value?.$el;
			if (!el) return;
			let parent = el.parentElement;
			while (parent) {
				if (parent.classList.contains("cu-dropdown")) {
					isNested.value = true;
					return;
				}
				parent = parent.parentElement;
			}
		}
		onMounted(() => {
			detectNested();
		});
		const instance = getCurrentInstance();
		const positionExplicit = computed(() => instance?.vnode?.props?.position !== void 0);
		const effectivePosition = computed(() => isNested.value && !positionExplicit.value ? "right" : props.position);
		const effectiveAlign = computed(() => props.align);
		const panelClass = computed(() => ({
			"cu-dropdown-panel": true,
			"cu-dropdown-panel--loading": props.loading
		}));
		/**
		* Color de la barra de cooldown. `Loader` pinta `var(--cu-color-{color})`, así que la
		* variante se resuelve pasando el **sufijo** del token: `ghost`/`ghost-hover` usan el
		* tono suave del color (`-ghost-hover`) y `solid` el tono lleno (base). Antes la prop
		* llegaba hasta acá como atributo suelto y no tenía ningún efecto.
		*/
		const cooldownColor = computed(() => props.cooldownVariant === "solid" ? props.color : `${props.color}-ghost-hover`);
		function onItemClick(item) {
			if (item.disabled || item.divider) return;
			if (item.onClick) item.onClick();
			popoverRef.value?.close();
		}
		/** Devuelve el valor seleccionado. */
		function get() {
			return selectedValue.value;
		}
		/** Setea el valor seleccionado. */
		function set(val) {
			selectedValue.value = val;
		}
		/** Limpia el valor seleccionado. */
		function reset() {
			selectedValue.value = "";
		}
		__expose({
			/** Abre el panel. */
			open: () => popoverRef.value?.open(),
			/** Cierra el panel. */
			close: () => popoverRef.value?.close(),
			/** Alterna la visibilidad del panel. */
			toggle: () => popoverRef.value?.toggle(),
			get,
			set,
			reset,
			/** Devuelve true si el panel está abierto. */
			isOpen: () => popoverRef.value?.isOpen() ?? false
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Popover_default, {
				ref_key: "popoverRef",
				ref: popoverRef,
				position: effectivePosition.value,
				align: effectiveAlign.value,
				offset: __props.offset,
				fixed: __props.fixed,
				"panel-width": __props.panelWidth,
				disabled: __props.disabled,
				hover: __props.trigger === "hover",
				"hover-delay": 0,
				role: __props.panelRole,
				"panel-id": __props.panelId,
				"panel-class": panelClass.value,
				class: normalizeClass(["cu-dropdown", { "cu-dropdown--nested": isNested.value }]),
				onOpen: _cache[0] || (_cache[0] = ($event) => emit("open")),
				onClose: _cache[1] || (_cache[1] = ($event) => emit("close"))
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [renderSlot(_ctx.$slots, "toggle", {
					toggle,
					isOpen
				}, () => [isNested.value ? (openBlock(), createElementBlock("button", {
					key: 0,
					type: "button",
					class: "cu-dropdown-menu-item",
					onClick: toggle
				}, [
					__props.icon ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: "cu-dropdown-menu-item-icon",
						innerHTML: sanitizeIcon(__props.icon)
					}, null, 8, _hoisted_2$2)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$1, toDisplayString(__props.label || "Submenú"), 1),
					createVNode(LucideChevronRight_default, {
						width: 14,
						height: 14,
						class: "cu-dropdown-menu-item-chevron"
					})
				], 8, _hoisted_1$2)) : (openBlock(), createBlock(Button_default, {
					key: 1,
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					onClick: toggle
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.label || "Dropdown"), 1)]),
					_: 1
				}, 8, [
					"color",
					"variant",
					"disabled",
					"onClick"
				]))], true)]),
				default: withCtx(() => [
					__props.loading ? (openBlock(), createBlock(Loader_default, {
						key: 0,
						color: __props.color,
						animation: "loading"
					}, null, 8, ["color"])) : createCommentVNode("v-if", true),
					__props.cooldown && !__props.loading ? (openBlock(), createBlock(Loader_default, {
						key: __props.cooldownKey,
						color: cooldownColor.value,
						animation: "cooldown",
						delay: __props.delay
					}, null, 8, ["color", "delay"])) : createCommentVNode("v-if", true),
					!__props.loading ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.items, (item, i) => {
						return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_4$1)) : item.to || item.href ? (openBlock(), createElementBlock("a", {
							key: 1,
							href: item.to || item.href,
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: sanitizeIcon(item.icon)
						}, null, 8, _hoisted_6)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7, toDisplayString(item.label), 1)], 10, _hoisted_5)) : (openBlock(), createElementBlock("button", {
							key: 2,
							type: "button",
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							disabled: item.disabled,
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: sanitizeIcon(item.icon)
						}, null, 8, _hoisted_9)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_10, toDisplayString(item.label), 1)], 10, _hoisted_8))], 64);
					}), 128)), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 64)) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 8, [
				"position",
				"align",
				"offset",
				"fixed",
				"panel-width",
				"disabled",
				"hover",
				"role",
				"panel-id",
				"panel-class",
				"class"
			]);
		};
	}
}), [["styles", ["\n/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo\n   ajustes específicos del dropdown sobre el panel del Popover. */\n.cu-dropdown[data-v-620d7284] .cu-dropdown-panel--loading {\n  pointer-events: none;\n}\n\n/* Dropdown anidado: ocupa el ancho de la fila del menú padre y el panel en\n   cascada es más angosto (auto) */\n.cu-dropdown.cu-dropdown--nested[data-v-620d7284] {\n  display: block;\n  width: 100%;\n  --cu-popover-width: auto;\n  --cu-popover-min-width: 160px;\n}\n.cu-dropdown-panel--nested[data-v-620d7284] {\n  padding: var(--cu-space-2xs);\n}\n\n/* Item de menú nativo (hojas + trigger de submenú anidado) */\n.cu-dropdown-menu-item[data-v-620d7284] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  width: 100%;\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral);\n  text-decoration: none;\n  border-radius: var(--cu-radius-sm);\n  transition: background-color 150ms ease;\n}\n.cu-dropdown-menu-item[data-v-620d7284]:hover:not(.cu-dropdown-menu-item--disabled) {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-dropdown-menu-item--disabled[data-v-620d7284] {\n  color: var(--cu-color-neutral-text-muted);\n  cursor: not-allowed;\n}\n.cu-dropdown-menu-item-label[data-v-620d7284] {\n  text-align: left;\n  white-space: nowrap;\n}\n.cu-dropdown-menu-item-chevron[data-v-620d7284] {\n  flex-shrink: 0;\n  color: var(--cu-color-neutral-text-muted);\n}\n.cu-dropdown-menu-item-icon[data-v-620d7284] {\n  flex-shrink: 0;\n  color: var(--cu-color-neutral-text-subtle);\n}\n.cu-dropdown-menu-divider[data-v-620d7284] {\n  margin: var(--cu-space-2xs) 0;\n  border: 0;\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n"]], ["__scopeId", "data-v-620d7284"]]);
//#endregion
//#region src/components/form/Label.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["for"];
var _hoisted_2$1 = {
	key: 0,
	class: "cu-label-text"
};
var FOCUSABLE = "input:not([type=\"hidden\"]), select, textarea, button, [tabindex]:not([tabindex=\"-1\"])";
//#endregion
//#region src/components/form/Label.vue
var Label_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
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
			}, [props.label ? (openBlock(), createElementBlock("span", _hoisted_2$1, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 12, _hoisted_1$1);
		};
	}
}), [["styles", ["\n.cu-label[data-v-5a2501c1] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-label-text[data-v-5a2501c1] {\n  width: fit-content;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n}\n\n/* Clases duplicadas a propósito: le ganan a las reglas globales del\n   consumidor que fuerzan color en label/span (p. ej. el playground:\n   `.playground :is(..., span, label)` → (0,2,1)). Scoped compila a (0,3,0). */\n.cu-label.cu-label[data-v-5a2501c1],\n.cu-label-text.cu-label-text[data-v-5a2501c1] {\n  color: var(--label-fg);\n}\n"]], ["__scopeId", "data-v-5a2501c1"]]);
//#endregion
//#region src/components/form/DatePicker.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "cu-date-picker" };
var _hoisted_2 = { class: "cu-date-picker-label" };
var _hoisted_3 = { class: "cu-date-picker-panel" };
var _hoisted_4 = {
	key: 3,
	class: "cu-date-picker-footer"
};
//#endregion
//#region src/components/form/DatePicker.vue
var DatePicker_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "DatePicker",
	props: {
		/** Tipo de calendario: `single` (una fecha, `Calendar`) o `range` (inicio + fin, `Calendar` en modo rango). Con `dualCalendar` el tipo es dual (range, 2 meses) */
		mode: {
			type: String,
			default: "single",
			validator: isDateMode
		},
		/** Fecha seleccionada (calendario `single`) */
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Inicio del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora */
		startDate: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fin del rango. Solo con calendario de rango (`mode="range"` o `dualCalendar`); en `single` se ignora */
		endDate: {
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
			required: false,
			default: "neutral"
		},
		variant: {
			type: String,
			required: false,
			default: "soft"
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		placeholder: {
			type: String,
			required: false,
			default: ""
		},
		locale: {
			type: String,
			required: false,
			default: "es"
		},
		weekStart: {
			type: Number,
			required: false,
			default: 1,
			validator: (value) => value >= 0 && value <= 6
		},
		format: {
			type: String,
			required: false,
			default: "dd/MM/yyyy"
		},
		/**
		* Formato del **valor**: si se setea, el picker emite además los eventos
		* `update:formattedValue` / `update:formattedStartDate` / `update:formattedEndDate`
		* y `change-formatted` / `select-formatted` con el valor como **string** en este
		* formato (mismos tokens que `format`). Vacío = deshabilitado (comportamiento actual).
		*/
		valueFormat: {
			type: String,
			required: false,
			default: ""
		},
		yearNavigation: {
			type: [Boolean, String],
			required: false,
			default: false
		},
		/** Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
		monthFormat: {
			type: String,
			required: false,
			default: "MMMM",
			validator: isMonthFormat
		},
		/** Formato del año (badge cuando el mes no es del año actual): `yyyy` (2026) o `yy` (26). Un valor no soportado cae a `yyyy` */
		yearFormat: {
			type: String,
			required: false,
			default: "yyyy",
			validator: isYearFormat
		},
		disabledWeekdays: {
			type: [Array, String],
			required: false,
			default: ""
		},
		disabledDates: {
			type: [Array, String],
			required: false,
			default: ""
		},
		events: {
			type: Array,
			default: () => []
		},
		grid: {
			type: Boolean,
			required: false,
			default: false
		},
		border: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango */
		dualCalendar: {
			type: Boolean,
			required: false,
			default: false
		},
		position: {
			type: String,
			required: false,
			default: "bottom",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "start",
			validator: isAlign
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		clearable: {
			type: Boolean,
			required: false,
			default: true
		},
		todayButton: {
			type: Boolean,
			required: false,
			default: void 0
		},
		label: {
			type: String,
			required: false,
			default: ""
		}
	},
	emits: [
		"update:modelValue",
		"update:startDate",
		"update:endDate",
		"change",
		"select",
		"open",
		"close",
		"update:formattedValue",
		"update:formattedStartDate",
		"update:formattedEndDate",
		"change-formatted",
		"select-formatted"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		/** Formatea una fecha con `value-format`; `null` si no hay fecha o el formato está vacío. */
		function fmt(date) {
			if (!date || !props.valueFormat) return null;
			return formatDate(date, props.valueFormat, props.locale);
		}
		const dropdownRef = ref(null);
		const triggerRef = ref(null);
		/** Misma regla que el calendario interno: qué días no se pueden elegir. */
		function isDisabledDate(day) {
			return isDateDisabled(day, {
				disabled: props.disabled,
				min: props.min,
				max: props.max,
				disabledWeekdays: props.disabledWeekdays,
				disabledDates: props.disabledDates
			});
		}
		/** "Hoy" fuera de `min`/`max` (o deshabilitado): el botón no selecciona nada. */
		const todayDisabled = computed(() => isDisabledDate(normalizeDate(/* @__PURE__ */ new Date())));
		const isRange = computed(() => props.mode === "range" || props.dualCalendar);
		const selectedValue = ref(parseDate(props.modelValue));
		watch(() => props.modelValue, (value) => {
			selectedValue.value = parseDate(value);
		});
		const rangeStart = ref(parseDate(props.startDate));
		const rangeEnd = ref(parseDate(props.endDate));
		watch(() => props.startDate, (value) => {
			rangeStart.value = parseDate(value);
		});
		watch(() => props.endDate, (value) => {
			rangeEnd.value = parseDate(value);
		});
		function onRangeStart(value) {
			rangeStart.value = value;
			emit("update:startDate", value);
			if (props.valueFormat) emit("update:formattedStartDate", fmt(value));
		}
		function onRangeEnd(value) {
			rangeEnd.value = value;
			emit("update:endDate", value);
			if (props.valueFormat) emit("update:formattedEndDate", fmt(value));
		}
		function onRangeChange(value) {
			if (value instanceof Date) return;
			rangeStart.value = value.start;
			rangeEnd.value = value.end;
			emit("change", value);
			if (props.valueFormat) emit("change-formatted", {
				start: fmt(value.start),
				end: fmt(value.end)
			});
		}
		function onRangeSelect(value) {
			if (value instanceof Date) return;
			rangeStart.value = value.start;
			rangeEnd.value = value.end;
			emit("select", value);
			if (props.valueFormat) emit("select-formatted", {
				start: fmt(value.start),
				end: fmt(value.end)
			});
		}
		/** Setea el rango completo y emite los cambios (solo con calendario de rango). */
		function setRange(start, end) {
			if (!isRange.value) return;
			rangeStart.value = parseDate(start);
			rangeEnd.value = parseDate(end);
			emit("update:startDate", rangeStart.value);
			emit("update:endDate", rangeEnd.value);
			emit("change", {
				start: rangeStart.value,
				end: rangeEnd.value
			});
			if (props.valueFormat) {
				emit("update:formattedStartDate", fmt(rangeStart.value));
				emit("update:formattedEndDate", fmt(rangeEnd.value));
				emit("change-formatted", {
					start: fmt(rangeStart.value),
					end: fmt(rangeEnd.value)
				});
			}
		}
		/** Limpia el rango (modo rango). */
		function clearRange() {
			rangeStart.value = null;
			rangeEnd.value = null;
			emit("update:startDate", null);
			emit("update:endDate", null);
			emit("change", {
				start: null,
				end: null
			});
			if (props.valueFormat) {
				emit("update:formattedStartDate", null);
				emit("update:formattedEndDate", null);
				emit("change-formatted", {
					start: null,
					end: null
				});
			}
		}
		const selectedLabel = computed(() => {
			if (!isRange.value) {
				if (selectedValue.value === null) return props.placeholder || "Seleccionar fecha...";
				return formatDate(selectedValue.value, props.format, props.locale);
			}
			const fmt = (date) => formatDate(date, props.format, props.locale);
			if (rangeStart.value && rangeEnd.value) return `${fmt(rangeStart.value)} - ${fmt(rangeEnd.value)}`;
			if (rangeStart.value) return `${fmt(rangeStart.value)} - ...`;
			return props.placeholder || "Seleccionar rango...";
		});
		const calendarVariant = computed(() => props.variant === "ghost" ? "soft" : props.variant);
		const showToday = computed(() => props.todayButton ?? !isRange.value);
		const panelWidth = computed(() => {
			if (isRange.value && props.dualCalendar) return props.yearNavigation ? "700px" : "580px";
			return props.yearNavigation ? "330px" : "280px";
		});
		function onSelectSingle(value) {
			if (!(value instanceof Date)) return;
			selectedValue.value = value;
			emit("update:modelValue", value);
			emit("change", value);
			emit("select", value);
			if (props.valueFormat) {
				const formatted = fmt(value);
				emit("update:formattedValue", formatted);
				emit("change-formatted", formatted);
				emit("select-formatted", formatted);
			}
			dropdownRef.value?.close();
		}
		function goToday() {
			const now = normalizeDate(/* @__PURE__ */ new Date());
			if (isDisabledDate(now)) return;
			if (isRange.value) {
				setRange(now, now);
				dropdownRef.value?.close();
				return;
			}
			selectedValue.value = now;
			emit("update:modelValue", now);
			emit("change", now);
			emit("select", now);
			if (props.valueFormat) {
				const formatted = fmt(now);
				emit("update:formattedValue", formatted);
				emit("change-formatted", formatted);
				emit("select-formatted", formatted);
			}
			dropdownRef.value?.close();
		}
		/** Limpia la selección. En modo simple cierra el panel; en rango lo deja abierto. */
		function clear() {
			if (isRange.value) {
				clearRange();
				return;
			}
			selectedValue.value = null;
			emit("update:modelValue", null);
			emit("change", null);
			if (props.valueFormat) {
				emit("update:formattedValue", null);
				emit("change-formatted", null);
			}
			dropdownRef.value?.close();
		}
		function onClose() {
			emit("close");
		}
		/** Devuelve la fecha seleccionada (modo simple). */
		function getValue() {
			return selectedValue.value;
		}
		/** Setea la fecha seleccionada y emite change (modo simple). */
		function setValue(value) {
			if (isRange.value) return;
			const parsed = parseDate(value);
			if (parsed === null) return;
			if (isDisabledDate(parsed)) return;
			selectedValue.value = parsed;
			emit("update:modelValue", parsed);
			emit("change", parsed);
			if (props.valueFormat) {
				emit("update:formattedValue", fmt(parsed));
				emit("change-formatted", fmt(parsed));
			}
		}
		/** Devuelve la fecha de inicio (solo con calendario de rango). */
		function getStartDate() {
			return isRange.value ? rangeStart.value : null;
		}
		/** Devuelve la fecha de fin (solo con calendario de rango). */
		function getEndDate() {
			return isRange.value ? rangeEnd.value : null;
		}
		/** Devuelve la fecha seleccionada formateada con `value-format` (modo simple); `null` sin `value-format` o sin fecha. */
		function getFormattedValue() {
			return isRange.value ? null : fmt(selectedValue.value);
		}
		/** Devuelve el inicio del rango formateado con `value-format` (modo rango). */
		function getFormattedStartDate() {
			return isRange.value ? fmt(rangeStart.value) : null;
		}
		/** Devuelve el fin del rango formateado con `value-format` (modo rango). */
		function getFormattedEndDate() {
			return isRange.value ? fmt(rangeEnd.value) : null;
		}
		/** Click en el label: enfoca el trigger y abre el panel (como un input con label). */
		function onLabelClick() {
			(triggerRef.value?.$el)?.focus();
			open();
		}
		/** Abre el panel. */
		function open() {
			dropdownRef.value?.open();
		}
		/** Cierra el panel. */
		function close() {
			dropdownRef.value?.close();
		}
		/** Alterna el panel. */
		function toggle() {
			dropdownRef.value?.toggle();
		}
		__expose({
			open,
			close,
			toggle,
			getValue,
			setValue,
			clear,
			getStartDate,
			getEndDate,
			setRange,
			getFormattedValue,
			getFormattedStartDate,
			getFormattedEndDate,
			/** Indica si el panel está abierto. */
			isOpen: () => dropdownRef.value?.isOpen() ?? false
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [__props.label ? (openBlock(), createBlock(Label_default, {
				key: 0,
				label: __props.label,
				onClick: onLabelClick
			}, null, 8, ["label"])) : createCommentVNode("v-if", true), createVNode(Dropdown_default, {
				ref_key: "dropdownRef",
				ref: dropdownRef,
				color: __props.color,
				disabled: __props.disabled,
				position: __props.position,
				align: __props.align,
				fixed: __props.fixed,
				offset: 4,
				"panel-width": panelWidth.value,
				"panel-role": "dialog",
				onOpen: _cache[2] || (_cache[2] = ($event) => emit("open")),
				onClose
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [createVNode(Button_default, {
					ref_key: "triggerRef",
					ref: triggerRef,
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					class: "cu-date-picker-toggle",
					"aria-haspopup": "dialog",
					"aria-expanded": isOpen ? "true" : "false",
					"aria-label": __props.label ? `${__props.label}: ${selectedLabel.value}` : void 0,
					onClick: toggle
				}, {
					default: withCtx(() => [
						_cache[3] || (_cache[3] = createElementVNode("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							class: "cu-date-picker-icon"
						}, [
							createElementVNode("path", { d: "M8 2v4" }),
							createElementVNode("path", { d: "M16 2v4" }),
							createElementVNode("rect", {
								width: "18",
								height: "18",
								x: "3",
								y: "4",
								rx: "2"
							}),
							createElementVNode("path", { d: "M3 10h18" })
						], -1)),
						createElementVNode("span", _hoisted_2, toDisplayString(selectedLabel.value), 1),
						_cache[4] || (_cache[4] = createElementVNode("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2",
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							class: "cu-date-picker-chevron"
						}, [createElementVNode("path", { d: "m6 9 6 6 6-6" })], -1))
					]),
					_: 1
				}, 8, [
					"color",
					"variant",
					"disabled",
					"aria-expanded",
					"aria-label",
					"onClick"
				])]),
				default: withCtx(() => [createElementVNode("div", _hoisted_3, [!isRange.value ? (openBlock(), createBlock(Calendar_default, {
					key: 0,
					"model-value": selectedValue.value,
					min: __props.min,
					max: __props.max,
					color: __props.color,
					variant: calendarVariant.value,
					locale: __props.locale,
					"week-start": __props.weekStart,
					"year-navigation": __props.yearNavigation,
					"month-format": __props.monthFormat,
					"year-format": __props.yearFormat,
					disabled: __props.disabled,
					"disabled-weekdays": __props.disabledWeekdays,
					"disabled-dates": __props.disabledDates,
					events: __props.events,
					grid: __props.grid,
					border: __props.border,
					onSelect: onSelectSingle
				}, null, 8, [
					"model-value",
					"min",
					"max",
					"color",
					"variant",
					"locale",
					"week-start",
					"year-navigation",
					"month-format",
					"year-format",
					"disabled",
					"disabled-weekdays",
					"disabled-dates",
					"events",
					"grid",
					"border"
				])) : !__props.dualCalendar ? (openBlock(), createBlock(Calendar_default, {
					key: 1,
					mode: "range",
					"range-start": rangeStart.value,
					"range-end": rangeEnd.value,
					min: __props.min,
					max: __props.max,
					color: __props.color,
					variant: calendarVariant.value,
					locale: __props.locale,
					"week-start": __props.weekStart,
					"year-navigation": __props.yearNavigation,
					"month-format": __props.monthFormat,
					"year-format": __props.yearFormat,
					disabled: __props.disabled,
					"disabled-weekdays": __props.disabledWeekdays,
					"disabled-dates": __props.disabledDates,
					events: __props.events,
					grid: __props.grid,
					border: __props.border,
					"onUpdate:rangeStart": onRangeStart,
					"onUpdate:rangeEnd": onRangeEnd,
					onChange: onRangeChange,
					onSelect: onRangeSelect
				}, null, 8, [
					"range-start",
					"range-end",
					"min",
					"max",
					"color",
					"variant",
					"locale",
					"week-start",
					"year-navigation",
					"month-format",
					"year-format",
					"disabled",
					"disabled-weekdays",
					"disabled-dates",
					"events",
					"grid",
					"border"
				])) : (openBlock(), createBlock(DualCalendar_default, {
					key: 2,
					"start-date": rangeStart.value,
					"end-date": rangeEnd.value,
					min: __props.min,
					max: __props.max,
					color: __props.color,
					variant: calendarVariant.value,
					locale: __props.locale,
					"week-start": __props.weekStart,
					"year-navigation": __props.yearNavigation,
					"month-format": __props.monthFormat,
					"year-format": __props.yearFormat,
					disabled: __props.disabled,
					"disabled-weekdays": __props.disabledWeekdays,
					"disabled-dates": __props.disabledDates,
					events: __props.events,
					grid: __props.grid,
					border: __props.border,
					"onUpdate:startDate": onRangeStart,
					"onUpdate:endDate": onRangeEnd,
					onChange: onRangeChange,
					onSelect: onRangeSelect
				}, null, 8, [
					"start-date",
					"end-date",
					"min",
					"max",
					"color",
					"variant",
					"locale",
					"week-start",
					"year-navigation",
					"month-format",
					"year-format",
					"disabled",
					"disabled-weekdays",
					"disabled-dates",
					"events",
					"grid",
					"border"
				])), showToday.value || __props.clearable ? (openBlock(), createElementBlock("div", _hoisted_4, [showToday.value ? (openBlock(), createBlock(Button_default, {
					key: 0,
					variant: "ghost",
					color: __props.color,
					disabled: todayDisabled.value,
					class: "cu-date-picker-footer-btn",
					onClick: _cache[0] || (_cache[0] = ($event) => goToday())
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Hoy ", -1)])]),
					_: 1
				}, 8, ["color", "disabled"])) : createCommentVNode("v-if", true), __props.clearable ? (openBlock(), createBlock(Button_default, {
					key: 1,
					variant: "ghost",
					color: __props.color,
					class: "cu-date-picker-footer-btn",
					onClick: _cache[1] || (_cache[1] = ($event) => clear())
				}, {
					default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode(" Limpiar ", -1)])]),
					_: 1
				}, 8, ["color"])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true)])]),
				_: 1
			}, 8, [
				"color",
				"disabled",
				"position",
				"align",
				"fixed",
				"panel-width"
			])]);
		};
	}
}), [["styles", ["\n.cu-date-picker[data-v-48f559d9] {\n  width: 100%;\n  outline: none;\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n}\n.cu-date-picker[data-v-48f559d9] .cu-dropdown {\n  width: 100%;\n}\n.cu-date-picker-toggle[data-v-48f559d9] {\n  width: 100%;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n.cu-date-picker-icon[data-v-48f559d9] {\n  flex-shrink: 0;\n}\n.cu-date-picker-label[data-v-48f559d9] {\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  text-align: left;\n}\n.cu-date-picker-chevron[data-v-48f559d9] {\n  transition: transform 200ms ease;\n  flex-shrink: 0;\n}\n.cu-date-picker-panel[data-v-48f559d9] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n}\n.cu-date-picker-footer[data-v-48f559d9] {\n  display: flex;\n  justify-content: space-between;\n  gap: var(--cu-space-sm);\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n  padding-top: var(--cu-space-sm);\n}\n.cu-date-picker-footer-btn[data-v-48f559d9] {\n  font-size: var(--cu-font-size-xs);\n}\n"]], ["__scopeId", "data-v-48f559d9"]]);
//#endregion
//#region src/lib/form/date-picker.ts
var CuDatePicker = defineComegenElement("cu-date-picker", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "DatePicker.ce",
	props: {
		/** Tipo de calendario: `single` (una fecha) o `range` (inicio + fin). Con `dual-calendar` el tipo es dual (range, 2 meses) */
		mode: {
			type: String,
			default: "single"
		},
		/** Fecha seleccionada (calendario `single`) */
		modelValue: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Inicio del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `start-date="2026-08-01"` */
		startDate: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fin del rango. Solo con calendario de rango (`mode="range"` o `dual-calendar`); en `single` se ignora. En HTML: `end-date="2026-08-31"` */
		endDate: {
			type: [
				String,
				Number,
				Date
			],
			default: null
		},
		/** Fecha mínima seleccionable */
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
		/** Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) */
		color: {
			type: String,
			default: "neutral"
		},
		/** Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) */
		variant: {
			type: String,
			default: "soft"
		},
		/** Deshabilita el picker completo */
		disabled: {
			type: Boolean,
			default: false
		},
		/** Texto cuando no hay fecha (default: `"Seleccionar fecha..."`, rango: `"Seleccionar rango..."`) */
		placeholder: {
			type: String,
			default: ""
		},
		/** Locale del calendario y nombres de mes */
		locale: {
			type: String,
			default: "es"
		},
		/** Primer día de la semana (`0` domingo, `1` lunes) */
		weekStart: {
			type: Number,
			default: 1
		},
		/** Formato de la fecha en el trigger (ver «Formato») */
		format: {
			type: String,
			default: "dd/MM/yyyy"
		},
		/** Formato del **valor**: si se setea, además de los eventos con `Date` emite `update:formattedValue`/`update:formattedStartDate`/`update:formattedEndDate` y `change-formatted`/`select-formatted` con el valor como string (mismos tokens que `format`). Vacío = deshabilitado */
		valueFormat: {
			type: String,
			default: ""
		},
		/** Controles de mes del calendario interno: botones `«`/`»` de año */
		yearNavigation: {
			type: [Boolean, String],
			default: false
		},
		/** Formato del mes en el header del calendario interno: `MMMM` (septiembre), `MMM` (sept), `MM` (09) o `M` (9). Un valor no soportado cae a `MMMM` */
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
		/** Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML: `disabled-weekdays="0,6"` */
		disabledWeekdays: {
			type: [Array, String],
			default: ""
		},
		/** Fechas puntuales no seleccionables. En HTML: `disabled-dates="2026-08-15,2026-08-16"` */
		disabledDates: {
			type: [Array, String],
			default: ""
		},
		/** Eventos a señalar con puntos bajo la fecha en el calendario interno (ver [Eventos](cu-calendar.md#eventos-puntos)). Se asigna como propiedad JS */
		events: {
			type: Array,
			default: () => []
		},
		/** Líneas **interiores** (cuadrícula) entre los días del calendario interno */
		grid: {
			type: Boolean,
			default: false
		},
		/** **Marco exterior** alrededor de la cuadrícula de días del calendario interno */
		border: {
			type: Boolean,
			default: false
		},
		/** Activa el rango a dos meses (dual). **Implica `range`**: aunque `mode` sea `single`, el picker selecciona un rango */
		dualCalendar: {
			type: Boolean,
			default: false
		},
		/** Lado donde aparece el panel: `bottom`, `top`, `left`, `right` */
		position: {
			type: String,
			default: "bottom"
		},
		/** Alineación respecto al trigger: `start`, `center`, `end` */
		align: {
			type: String,
			default: "start"
		},
		/** Panel en `position: fixed` (útil en contenedores con overflow) */
		fixed: {
			type: Boolean,
			default: false
		},
		/** Muestra el botón "Limpiar" en el footer del panel */
		clearable: {
			type: Boolean,
			default: true
		},
		/** Muestra el botón "Hoy" en el footer del panel (default: `true` en `single`, `false` en `range`) */
		todayButton: {
			type: Boolean,
			default: void 0
		},
		/** Texto del label sobre el picker */
		label: {
			type: String,
			default: ""
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const pickerRef = ref(null);
		const innerValue = ref(props.modelValue);
		watch(() => props.modelValue, (val) => {
			innerValue.value = val;
		});
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
		/** Abre, cierra o alterna el panel */
		function open() {
			pickerRef.value?.open();
		}
		function close() {
			pickerRef.value?.close();
		}
		function toggle() {
			pickerRef.value?.toggle();
		}
		/** Devuelve la fecha seleccionada (modo `single`) */
		function getValue() {
			return pickerRef.value?.getValue() ?? null;
		}
		/** Selecciona una fecha (string/number/Date) (modo `single`) */
		function setValue(value) {
			pickerRef.value?.setValue(value);
		}
		/** Devuelve la fecha de inicio (modo `range`) */
		function getStartDate() {
			return pickerRef.value?.getStartDate() ?? null;
		}
		/** Devuelve la fecha de fin (modo `range`) */
		function getEndDate() {
			return pickerRef.value?.getEndDate() ?? null;
		}
		/** Devuelve la fecha seleccionada formateada con `value-format` (modo `single`) */
		function getFormattedValue() {
			return pickerRef.value?.getFormattedValue() ?? null;
		}
		/** Devuelve el inicio del rango formateado con `value-format` (modo `range`) */
		function getFormattedStartDate() {
			return pickerRef.value?.getFormattedStartDate() ?? null;
		}
		/** Devuelve el fin del rango formateado con `value-format` (modo `range`) */
		function getFormattedEndDate() {
			return pickerRef.value?.getFormattedEndDate() ?? null;
		}
		/** Setea el rango (string/number/Date) (modo `range`) */
		function setRange(start, end) {
			pickerRef.value?.setRange(start, end);
		}
		/** Limpia la selección (emite `null`) */
		function clear() {
			pickerRef.value?.clear();
		}
		__expose({
			open,
			close,
			toggle,
			getValue,
			setValue,
			getStartDate,
			getEndDate,
			getFormattedValue,
			getFormattedStartDate,
			getFormattedEndDate,
			setRange,
			clear,
			isOpen: () => pickerRef.value?.isOpen() ?? false
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(DatePicker_default, {
				ref_key: "pickerRef",
				ref: pickerRef,
				mode: props.mode,
				"model-value": innerValue.value,
				"start-date": props.startDate,
				"end-date": props.endDate,
				min: props.min,
				max: props.max,
				color: props.color,
				variant: props.variant,
				disabled: props.disabled,
				placeholder: props.placeholder,
				locale: props.locale,
				"week-start": props.weekStart,
				format: props.format,
				"value-format": props.valueFormat,
				"year-navigation": props.yearNavigation,
				"month-format": props.monthFormat,
				"year-format": props.yearFormat,
				"disabled-weekdays": props.disabledWeekdays,
				"disabled-dates": props.disabledDates,
				events: props.events,
				grid: props.grid,
				border: props.border,
				"dual-calendar": props.dualCalendar,
				position: props.position,
				align: props.align,
				fixed: props.fixed,
				clearable: props.clearable,
				"today-button": props.todayButton,
				label: props.label,
				onSelect: _cache[0] || (_cache[0] = ($event) => ceEmit("select", $event)),
				onChange: _cache[1] || (_cache[1] = ($event) => ceEmit("change", $event)),
				onOpen: _cache[2] || (_cache[2] = ($event) => ceEmit("open", $event)),
				onClose: _cache[3] || (_cache[3] = ($event) => ceEmit("close", $event)),
				"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => ceEmit("update:modelValue", $event)),
				"onUpdate:startDate": _cache[5] || (_cache[5] = ($event) => ceEmit("update:startDate", $event)),
				"onUpdate:endDate": _cache[6] || (_cache[6] = ($event) => ceEmit("update:endDate", $event)),
				onChangeFormatted: _cache[7] || (_cache[7] = ($event) => ceEmit("change-formatted", $event)),
				onSelectFormatted: _cache[8] || (_cache[8] = ($event) => ceEmit("select-formatted", $event)),
				"onUpdate:formattedValue": _cache[9] || (_cache[9] = ($event) => ceEmit("update:formattedValue", $event)),
				"onUpdate:formattedStartDate": _cache[10] || (_cache[10] = ($event) => ceEmit("update:formattedStartDate", $event)),
				"onUpdate:formattedEndDate": _cache[11] || (_cache[11] = ($event) => ceEmit("update:formattedEndDate", $event))
			}, null, 8, [
				"mode",
				"model-value",
				"start-date",
				"end-date",
				"min",
				"max",
				"color",
				"variant",
				"disabled",
				"placeholder",
				"locale",
				"week-start",
				"format",
				"value-format",
				"year-navigation",
				"month-format",
				"year-format",
				"disabled-weekdays",
				"disabled-dates",
				"events",
				"grid",
				"border",
				"dual-calendar",
				"position",
				"align",
				"fixed",
				"clearable",
				"today-button",
				"label"
			]);
		};
	}
}), [["styles", ["\n:host {\n  display: block;\n  width: 100%;\n}\n"]]]));
//#endregion
export { CuDatePicker as default };
