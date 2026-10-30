/*! comegenui v5.2.3 · CuAutocomplete (cu-autocomplete) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, mergeModels, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, shallowRef, toDisplayString, toRaw, toValue, unref, useModel, useTemplateRef, watch, withCtx } from "vue";
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
function camelize$1(name) {
	return name.replace(/-(\w)/g, (_, char) => char ? char.toUpperCase() : "");
}
/** Props declaradas por el componente, en camelCase (cacheado por definición). */
var PROP_KEYS = /* @__PURE__ */ new WeakMap();
function declaredProps(def) {
	const cached = PROP_KEYS.get(def);
	if (cached) return cached;
	const props = def.props;
	const keys = !props ? [] : Array.isArray(props) ? props : Object.keys(props);
	const set = new Set(keys.map((key) => camelize$1(String(key))));
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
			const camelKey = camelize$1(key);
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
var isVariantFull = oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
var isFieldVariant = oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
var isAlign = oneOf(ALIGNS);
var isTextAlign = oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
var isButtonType = oneOf(BUTTON_TYPES);
var isInputType = oneOf(INPUT_TYPES);
oneOf(LABEL_POSITIONS);
var isTarget = oneOf(TARGETS);
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
//#region src/utils/textAlign.ts
/** `text-align` → `justify-content` del bloque de contenido (ícono + label). */
var TEXT_ALIGN_JUSTIFY = {
	left: "flex-start",
	center: "center",
	right: "flex-end"
};
/**
* Estilo para un item flex alineable: `justify-content` ubica el bloque de contenido
* (con ícono incluido, sin descentrarlo) y `text-align` alinea el texto cuando el label
* ocupa más de una línea.
*/
function textAlignStyle(textAlign) {
	return {
		justifyContent: TEXT_ALIGN_JUSTIFY[textAlign],
		textAlign
	};
}
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$7);
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
var _hoisted_1$6 = [
	"href",
	"target",
	"rel",
	"role",
	"aria-disabled",
	"aria-busy",
	"tabindex"
];
var _hoisted_2$2 = [
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
			], 14, _hoisted_1$6)) : (openBlock(), createElementBlock("button", {
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
			], 14, _hoisted_2$2));
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
//#region src/components/information/Loader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "cu-loader" };
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
			return openBlock(), createElementBlock("div", _hoisted_1$5, [createElementVNode("div", {
				class: normalizeClass(["cu-loader-bar", `cu-loader-bar--${props.animation}`]),
				style: normalizeStyle(loaderStyles.value)
			}, null, 6)]);
		};
	}
}), [["styles", ["\n.cu-loader[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  overflow: hidden;\n  height: 3px;\n}\n.cu-loader-bar[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  background: var(--cu-loader-color);\n}\n.cu-loader-bar--loading[data-v-045244b1] {\n  width: 60%;\n  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);\n  animation: cu-loader-slide-045244b1 1.5s ease-in-out infinite;\n}\n.cu-loader-bar--cooldown[data-v-045244b1] {\n  left: 0;\n  width: 100%;\n  animation: cu-loader-cooldown-045244b1 var(--cu-loader-delay) linear forwards;\n}\n@keyframes cu-loader-slide-045244b1 {\n0% { left: -100%;\n}\n50% { left: 0%;\n}\n100% { left: 100%;\n}\n}\n@keyframes cu-loader-cooldown-045244b1 {\nfrom { width: 100%;\n}\nto { width: 0%;\n}\n}\n"]], ["__scopeId", "data-v-045244b1"]]);
//#endregion
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = ["role"];
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
		let closedByOutsideClick = false;
		function onDocumentClick(e) {
			if (!isOpen.value || !popoverRef.value) return;
			if (!(e instanceof MouseEvent)) return;
			if (!e.composedPath().includes(popoverRef.value)) {
				closedByOutsideClick = true;
				isOpen.value = false;
				emit("close");
				setTimeout(() => {
					closedByOutsideClick = false;
				}, 0);
			}
		}
		function onKeyDown(e) {
			if (e.key === "Escape" && isOpen.value) {
				isOpen.value = false;
				emit("close");
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
				style: normalizeStyle(panelStyle.value),
				class: normalizeClass(["cu-popover-panel", __props.panelClass]),
				role: __props.role || void 0
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1$4)) : createCommentVNode("v-if", true)], 544);
		};
	}
}), [["styles", ["\n.cu-popover[data-v-50458841] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.cu-popover-panel[data-v-50458841] {\n  padding: var(--cu-space-sm);\n  border-radius: var(--cu-radius-md);\n  font-family: var(--cu-font-sans);\n  box-shadow: var(--cu-shadow-xl);\n}\n"]], ["__scopeId", "data-v-50458841"]]);
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
//#region src/components/overlay/Dropdown.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = ["onClick"];
var _hoisted_2$1 = ["innerHTML"];
var _hoisted_3$1 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_4 = {
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
				role: "menu",
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
						innerHTML: __props.icon
					}, null, 8, _hoisted_2$1)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$1, toDisplayString(__props.label || "Submenú"), 1),
					createVNode(LucideChevronRight_default, {
						width: 14,
						height: 14,
						class: "cu-dropdown-menu-item-chevron"
					})
				], 8, _hoisted_1$3)) : (openBlock(), createBlock(Button_default, {
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
						color: __props.color,
						animation: "cooldown",
						delay: __props.delay
					}, null, 8, ["color", "delay"])) : createCommentVNode("v-if", true),
					!__props.loading ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.items, (item, i) => {
						return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_4)) : item.to || item.href ? (openBlock(), createElementBlock("a", {
							key: 1,
							href: item.to || item.href,
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_6)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7, toDisplayString(item.label), 1)], 10, _hoisted_5)) : (openBlock(), createElementBlock("button", {
							key: 2,
							type: "button",
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							disabled: item.disabled,
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
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
				"panel-class",
				"class"
			]);
		};
	}
}), [["styles", ["\n/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo\n   ajustes específicos del dropdown sobre el panel del Popover. */\n.cu-dropdown[data-v-f001459f] .cu-dropdown-panel--loading {\n  pointer-events: none;\n}\n\n/* Dropdown anidado: ocupa el ancho de la fila del menú padre y el panel en\n   cascada es más angosto (auto) */\n.cu-dropdown.cu-dropdown--nested[data-v-f001459f] {\n  display: block;\n  width: 100%;\n  --cu-popover-width: auto;\n  --cu-popover-min-width: 160px;\n}\n.cu-dropdown-panel--nested[data-v-f001459f] {\n  padding: var(--cu-space-2xs);\n}\n\n/* Item de menú nativo (hojas + trigger de submenú anidado) */\n.cu-dropdown-menu-item[data-v-f001459f] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  width: 100%;\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral);\n  text-decoration: none;\n  border-radius: var(--cu-radius-sm);\n  transition: background-color 150ms ease;\n}\n.cu-dropdown-menu-item[data-v-f001459f]:hover:not(.cu-dropdown-menu-item--disabled) {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-dropdown-menu-item--disabled[data-v-f001459f] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-dropdown-menu-item-label[data-v-f001459f] {\n  text-align: left;\n  white-space: nowrap;\n}\n.cu-dropdown-menu-item-chevron[data-v-f001459f] {\n  flex-shrink: 0;\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-dropdown-menu-item-icon[data-v-f001459f] {\n  flex-shrink: 0;\n  opacity: var(--cu-alpha-subtle, 0.6);\n}\n.cu-dropdown-menu-divider[data-v-f001459f] {\n  margin: var(--cu-space-2xs) 0;\n  border: 0;\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n"]], ["__scopeId", "data-v-f001459f"]]);
//#endregion
//#region node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.6.0-rc.11_@typescript+typescript6@6.0.2_/node_modules/@vueuse/shared/dist/index.js
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
//#endregion
//#region node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.6.0-rc.11_@typescript+typescript6@6.0.2_/node_modules/@vueuse/core/dist/index.js
var defaultWindow = isClient ? window : void 0;
isClient && window.document;
isClient && window.navigator;
isClient && window.location;
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
/**
* Track or set the focus state of a DOM element.
*
* @see https://vueuse.org/useFocus
* @param target The target element for the focus and blur events.
* @param options
*/
function useFocus(target, options = {}) {
	const { initialValue = false, focusVisible = false, preventScroll = false } = options;
	const innerFocused = shallowRef(false);
	const targetElement = computed(() => unrefElement(target));
	const listenerOptions = { passive: true };
	useEventListener(targetElement, "focus", (event) => {
		var _matches, _ref;
		if (!focusVisible || ((_matches = (_ref = event.target).matches) === null || _matches === void 0 ? void 0 : _matches.call(_ref, ":focus-visible"))) innerFocused.value = true;
	}, listenerOptions);
	useEventListener(targetElement, "blur", () => innerFocused.value = false, listenerOptions);
	const focused = computed({
		get: () => innerFocused.value,
		set(value) {
			var _targetElement$value, _targetElement$value2;
			if (!value && innerFocused.value) (_targetElement$value = targetElement.value) === null || _targetElement$value === void 0 || _targetElement$value.blur();
			else if (value && !innerFocused.value) (_targetElement$value2 = targetElement.value) === null || _targetElement$value2 === void 0 || _targetElement$value2.focus({ preventScroll });
		}
	});
	watch(targetElement, () => {
		focused.value = initialValue;
	}, {
		immediate: true,
		flush: "post"
	});
	return { focused };
}
Number.POSITIVE_INFINITY;
//#endregion
//#region src/components/form/Input.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = [
	"type",
	"placeholder",
	"value",
	"disabled",
	"readonly"
];
//#endregion
//#region src/components/form/Input.vue
var Input_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Input",
	props: /*@__PURE__*/ mergeModels({
		startValue: {
			type: String,
			required: false
		},
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isFieldVariant
		},
		type: {
			type: String,
			required: false,
			default: "text",
			validator: isInputType
		},
		placeholder: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Tamaño del input (sm | md | lg). */
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const value = useModel(__props, "modelValue");
		const props = __props;
		const sizeClass = computed(() => props.size !== "md" ? `cu-input--${props.size}` : "");
		const { focused: inputFocus } = useFocus(useTemplateRef("input"));
		const inputStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-bg-active": `var(--cu-color-${props.color}-ghost-active)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		/** Devuelve el valor actual del input. */
		const get = () => value.value;
		/** Setea el valor del input. */
		const set = (newValue) => {
			value.value = String(newValue);
		};
		/** Limpia el input. */
		const reset = () => {
			value.value = "";
		};
		__expose({
			get,
			set,
			reset,
			/** Enfoca el input. */
			focus: () => inputFocus.value = true
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("input", {
				ref: "input",
				type: props.type,
				placeholder: props.placeholder,
				value: value.value,
				onInput: _cache[0] || (_cache[0] = ($event) => value.value = $event.target.value),
				class: normalizeClass(["cu-input", [
					`cu-input--${props.variant}`,
					sizeClass.value,
					{ "cu-input--disabled": props.disabled }
				]]),
				style: normalizeStyle(inputStyles.value),
				disabled: props.disabled,
				readonly: props.readOnly
			}, null, 46, _hoisted_1$2);
		};
	}
}), [["styles", ["\n.cu-input[data-v-416af2a0] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius-md);\n  border: none;\n  outline: none;\n  width: 100%;\n  box-sizing: border-box;\n  background-color: var(--btn-bg);\n  color: var(--cu-color-neutral-text);\n  transition: all 150ms ease;\n}\n\n/* sizes */\n.cu-input--sm[data-v-416af2a0] {\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  font-size: var(--cu-font-size-xs);\n}\n.cu-input--lg[data-v-416af2a0] {\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n  font-size: var(--cu-font-size-md);\n}\n.cu-input[data-v-416af2a0]::placeholder {\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-input[data-v-416af2a0]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n\n/* subtle */\n.cu-input--subtle[data-v-416af2a0] {\n  background-color: var(--btn-subtle);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--subtle[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n\n/* soft */\n.cu-input--soft[data-v-416af2a0] {\n  background-color: var(--btn-soft);\n}\n.cu-input--soft[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n\n/* ghost */\n.cu-input--ghost[data-v-416af2a0] {\n  background-color: transparent;\n}\n.cu-input--ghost[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* outlined */\n.cu-input--outlined[data-v-416af2a0] {\n  background-color: transparent;\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--outlined[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* disabled */\n.cu-input--disabled[data-v-416af2a0] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-416af2a0"]]);
//#endregion
//#region src/components/icons/LucideCheck.vue
var LucideCheck_default = /* @__PURE__ */ defineComponent({
	__name: "LucideCheck",
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(IconBase_default, null, {
				default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("g", {
					fill: "none",
					stroke: "currentColor",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					"stroke-width": "2"
				}, [createElementVNode("path", { d: "M20 6 9 17l-5-5" })], -1)])]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/components/controls/MenuOption.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = { class: "cu-menu-option-main" };
var _hoisted_2 = ["innerHTML"];
var _hoisted_3 = { key: 1 };
//#endregion
//#region src/components/controls/MenuOption.vue
var MenuOption_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "MenuOption",
	props: {
		/** Texto visible de la fila */
		label: {
			type: String,
			required: false,
			default: ""
		},
		/** SVG completo inline (`<svg>...</svg>`) */
		icon: {
			type: String,
			required: false,
			default: ""
		},
		/** Clase del ícono; cada lista conserva la suya (`cu-autocomplete-icon`, …) */
		iconClass: {
			type: String,
			required: false,
			default: "cu-menu-option-icon"
		},
		/** Color semántico del item */
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
		/** Item deshabilitado (no clickeable, atenuado) */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Si se especifica, la fila se renderiza como link (`<a>`) */
		href: {
			type: String,
			required: false,
			default: ""
		},
		/** Target del link cuando hay `href`: `_self`, `_blank`, `_parent`, `_top` */
		target: {
			type: String,
			required: false,
			default: "_self",
			validator: isTarget
		},
		/** Muestra el check de lucide al final de la fila */
		selected: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Button_default, {
				color: props.color,
				variant: props.variant,
				to: props.href || void 0,
				target: props.target,
				disabled: props.disabled
			}, {
				default: withCtx(() => [createElementVNode("span", _hoisted_1$1, [props.icon ? (openBlock(), createElementBlock("span", {
					key: 0,
					innerHTML: props.icon,
					class: normalizeClass(props.iconClass)
				}, null, 10, _hoisted_2)) : createCommentVNode("v-if", true), props.label ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true)]), props.selected ? (openBlock(), createBlock(LucideCheck_default, {
					key: 0,
					class: "cu-menu-option-check",
					"aria-hidden": "true"
				})) : createCommentVNode("v-if", true)]),
				_: 1
			}, 8, [
				"color",
				"variant",
				"to",
				"target",
				"disabled"
			]);
		};
	}
}), [["styles", ["\n/* El bloque ícono + label ocupa el espacio libre de la fila, así el check queda pegado\n   al borde derecho sin importar `textAlign`; `justify-content` sigue alineando el bloque\n   dentro de ese espacio (hereda el del `Button`, que pone `textAlignStyle`). */\n.cu-menu-option-main[data-v-2382681b] {\n  display: flex;\n  align-items: center;\n  justify-content: inherit;\n  gap: inherit;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.cu-menu-option-check[data-v-2382681b] {\n  flex-shrink: 0;\n}\n"]], ["__scopeId", "data-v-2382681b"]]);
//#endregion
//#region src/utils/search.ts
var ACCENT_RE = /[\u0300-\u0302\u0304-\u036f]/g;
function normalizeText(s, caseSensitive = false) {
	const normalized = s.normalize("NFD").replace(ACCENT_RE, "");
	return caseSensitive ? normalized : normalized.toLowerCase();
}
function matchesQuery(text, q, opts = {}) {
	const { mode = "includes", trim = false, caseSensitive = false } = opts;
	if (text == null) return false;
	const query = trim ? q.trim() : q;
	if (!query) return false;
	const value = normalizeText(String(text), caseSensitive);
	const needle = normalizeText(query, caseSensitive);
	return mode === "startsWith" ? value.startsWith(needle) : value.includes(needle);
}
function matchesFields(item, q, opts = {}) {
	const { fields, excludeKeys = [], getValue, ...match } = opts;
	if (typeof item !== "object" || item === null) return false;
	return (fields?.length ? fields : Object.keys(item).filter((k) => !excludeKeys.includes(k))).some((key) => matchesQuery(getValue ? getValue(item, key) : item[key], q, match));
}
//#endregion
//#region src/composables/useSearch.ts
function useSearch(data, options) {
	const { searchQuery, caseSensitive = false } = options;
	return { filteredData: computed(() => {
		const unrefedData = unref(data);
		const query = searchQuery.value.trim();
		if (!query) return unrefedData;
		const fields = unref(options.searchFields) || [];
		const columns = unref(options.columns) || [];
		return unrefedData.filter((item) => {
			if (typeof item !== "object" || item === null) return false;
			return (fields.length > 0 ? fields : Object.keys(item)).some((key) => {
				const col = columns.find((c) => c.key === key);
				if (col?.inputType === "select") {
					const raw = item[key];
					if (raw == null) return false;
					const opt = (typeof col.selectOptions === "function" ? col.selectOptions(item) : col.selectOptions || []).find((o) => o.value === raw);
					if (opt) return matchesFields({ value: opt.label }, query, {
						fields: ["value"],
						caseSensitive
					});
					return false;
				}
				return matchesFields(item, query, {
					fields: [key],
					caseSensitive
				});
			});
		});
	}) };
}
//#endregion
//#region src/components/form/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "cu-autocomplete-options"
};
//#endregion
//#region src/components/form/Autocomplete.vue
var Autocomplete_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Autocomplete",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral",
			validator: isColor
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		placeholder: {
			type: String,
			required: false,
			default: ""
		},
		variant: {
			type: String,
			required: false,
			default: "soft",
			validator: isFieldVariant
		},
		type: {
			type: String,
			required: false,
			default: "text"
		},
		/** Muestra el spinner de carga en el panel de sugerencias. */
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		minChars: {
			type: Number,
			required: false,
			default: 0
		},
		items: {
			type: Array,
			required: false,
			default: () => []
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
		/**
		* Alineación del texto: el input (texto y placeholder) y los items del panel.
		* `left` (default), `center`, `right`.
		*/
		textAlign: {
			type: String,
			required: false,
			default: "left",
			validator: isTextAlign
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["select", "blur"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		/** Valor del texto de búsqueda (v-model). */
		const searchValue = useModel(__props, "modelValue");
		const dropdownRef = ref(null);
		const inputRef = ref(null);
		const rootRef = ref(null);
		const selectedItem = ref(null);
		/**
		* `false` tras seleccionar: la lista ignora el texto y muestra todos los items (con el
		* elegido checkeado). Al volver a escribir se reactiva y filtra con la cadena actual.
		*/
		const filtering = ref(true);
		/** Los items son filas flex: la alineación va por `justify-content`, no por `text-align`. */
		const itemStyle = computed(() => textAlignStyle(props.textAlign));
		/** El `<input>` es un campo de texto nativo: acá sí alinea `text-align`. */
		const inputStyle = computed(() => ({
			width: "100%",
			textAlign: props.textAlign
		}));
		const searchItems = computed(() => props.items);
		const { filteredData: matches } = useSearch(searchItems, {
			searchQuery: searchValue,
			searchFields: ["label", "value"]
		});
		const filteredItems = computed(() => filtering.value ? matches.value : searchItems.value);
		/** Texto que el item escribe en el input (y que define si sigue siendo el seleccionado). */
		function itemText(item) {
			return item.label || item.value || "";
		}
		/** La selección vive mientras el texto del input sea el del item elegido. */
		function syncSelectionWithText(val) {
			if (selectedItem.value && val !== itemText(selectedItem.value)) selectedItem.value = null;
		}
		/**
		* Identidad del item seleccionado. `selectedItem` guarda el proxy del `ref`, mientras
		* los items pueden llegar crudos (propiedad JS del custom element): comparar los
		* proxies directamente da false y el check no aparece. `toRaw` normaliza ambos lados.
		*/
		function isSelected(item) {
			const sel = selectedItem.value;
			return !!sel && toRaw(sel) === toRaw(item);
		}
		watch(searchValue, (val) => syncSelectionWithText(val));
		function onFocus() {
			if (props.disabled) return;
			if (searchValue.value.length < props.minChars) return;
			if (filteredItems.value.length > 0) dropdownRef.value?.open();
		}
		function onInput(val) {
			searchValue.value = val;
			filtering.value = true;
			if (val.length < props.minChars || filteredItems.value.length === 0) {
				dropdownRef.value?.close();
				return;
			}
			dropdownRef.value?.open();
		}
		function onItemClick(item) {
			if (item.disabled) return;
			searchValue.value = itemText(item);
			selectedItem.value = item;
			filtering.value = false;
			emit("select", item);
		}
		function onFocusOut(e) {
			if (!rootRef.value?.contains(e.relatedTarget)) emit("blur");
		}
		/** Devuelve el texto actual. */
		function get() {
			return searchValue.value;
		}
		/** Setea el texto actual en el input sin abrir el panel (para ver sugerencias usá `open()`). */
		function set(val) {
			searchValue.value = val;
			filtering.value = true;
		}
		/** Limpia el texto de búsqueda y la selección. */
		function reset() {
			searchValue.value = "";
			selectedItem.value = null;
			filtering.value = true;
		}
		/** Enfoca el input. */
		function focus() {
			inputRef.value?.focus();
		}
		/** Abre el panel de sugerencias (ignora `minChars`). */
		function open() {
			dropdownRef.value?.open();
		}
		/** Cierra el panel de sugerencias. */
		function close() {
			dropdownRef.value?.close();
		}
		/** Alterna la visibilidad del panel de sugerencias. */
		function toggle() {
			dropdownRef.value?.toggle();
		}
		__expose({
			get,
			set,
			reset,
			focus,
			open,
			close,
			toggle,
			/** Indica si el panel está abierto. */
			isOpen: () => dropdownRef.value?.isOpen() ?? false,
			/** Devuelve el item seleccionado o null. */
			selectedItem: () => selectedItem.value
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "rootRef",
				ref: rootRef,
				tabindex: "-1",
				onFocusout: onFocusOut
			}, [createVNode(Dropdown_default, {
				ref_key: "dropdownRef",
				ref: dropdownRef,
				color: __props.color,
				disabled: __props.disabled,
				position: __props.position,
				align: __props.align,
				fixed: __props.fixed,
				loading: __props.loading,
				offset: 4,
				style: { "width": "100%" }
			}, {
				toggle: withCtx(() => [createVNode(Input_default, {
					ref_key: "inputRef",
					ref: inputRef,
					"model-value": searchValue.value,
					placeholder: __props.placeholder,
					disabled: __props.disabled,
					"read-only": __props.readOnly,
					color: __props.color,
					variant: __props.variant,
					type: __props.type,
					style: normalizeStyle(inputStyle.value),
					"onUpdate:modelValue": onInput,
					onFocus
				}, null, 8, [
					"model-value",
					"placeholder",
					"disabled",
					"read-only",
					"color",
					"variant",
					"type",
					"style"
				])]),
				default: withCtx(() => [filteredItems.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredItems.value, (item, i) => {
					return openBlock(), createBlock(MenuOption_default, {
						key: i,
						label: item.label,
						icon: item.icon,
						"icon-class": "cu-autocomplete-icon",
						color: "neutral",
						variant: "ghost",
						disabled: item.disabled,
						selected: isSelected(item),
						class: normalizeClass(["cu-autocomplete-option", { "cu-autocomplete-option--disabled": item.disabled }]),
						style: normalizeStyle(itemStyle.value),
						onClick: ($event) => onItemClick(item)
					}, null, 8, [
						"label",
						"icon",
						"disabled",
						"selected",
						"class",
						"style",
						"onClick"
					]);
				}), 128))])) : createCommentVNode("v-if", true)]),
				_: 1
			}, 8, [
				"color",
				"disabled",
				"position",
				"align",
				"fixed",
				"loading"
			])], 544);
		};
	}
}), [["styles", ["\n.cu-autocomplete[data-v-c64e5344] {\n  width: 100%;\n  outline: none;\n}\n.cu-autocomplete-options[data-v-c64e5344] {\n  max-height: 240px;\n  overflow-y: auto;\n}\n.cu-autocomplete-option[data-v-c64e5344] {\n  width: 100%;\n  /* La alineación la pone `textAlign` inline (`justify-content`): dentro de un `Button`\n     flex el `text-align` solo no mueve nada. Default: `flex-start`. */\n}\n.cu-autocomplete-option--disabled[data-v-c64e5344] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-autocomplete-icon[data-v-c64e5344] {\n  transform: translateY(2px);\n  opacity: var(--cu-alpha-subtle, 0.6);\n}\n"]], ["__scopeId", "data-v-c64e5344"]]);
//#endregion
//#region src/lib/form/autocomplete.ts
var CuAutocomplete = defineComegenElement("cu-autocomplete", /* @__PURE__ */ defineComponent({
	__name: "Autocomplete.ce",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** `outlined`, `soft`, `ghost`, `subtle` */
		variant: {
			type: String,
			required: false,
			default: "soft"
		},
		/** `text`, `password`, `email`, `number`, `tel`, `url`, `search` */
		type: {
			type: String,
			required: false,
			default: "text"
		},
		/** Muestra el spinner de carga en el panel de sugerencias */
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Estado deshabilitado */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Solo lectura (en HTML se usa como `readonly`) */
		readOnly: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Placeholder del input */
		placeholder: {
			type: String,
			required: false,
			default: ""
		},
		/** Caracteres mínimos para que el menú se abra al tipear o al enfocar (atributo HTML: `min-chars`) */
		minChars: {
			type: Number,
			required: false,
			default: 0
		},
		/** Posición del dropdown: `bottom`, `top` */
		position: {
			type: String,
			required: false,
			default: "bottom"
		},
		/** Alineación: `start`, `center`, `end` */
		align: {
			type: String,
			required: false,
			default: "start"
		},
		/** Panel en `position: fixed` (útil en contenedores con overflow) */
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		/**
		* Alineación del texto: el input (texto y placeholder) y los items del panel.
		* `left` (default), `center`, `right`.
		*/
		textAlign: {
			type: String,
			required: false,
			default: "left",
			validator: isTextAlign
		},
		/** Opciones del menú (ver abajo). Se asigna como propiedad JS */
		items: {
			type: Array,
			required: false,
			default: () => []
		},
		/** Valor actual del texto. El CE sincroniza su estado; asigná `modelValue` sólo si querés controlarlo */
		modelValue: {
			type: String,
			required: false,
			default: ""
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const autocompleteRef = ref(null);
		const instance = getCurrentInstance();
		const localModel = ref(props.modelValue);
		watch(() => props.modelValue, (val) => {
			localModel.value = val;
		});
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const host = el?.getRootNode()?.host || el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		function onUpdate(val) {
			localModel.value = val;
			ceEmit("update:modelValue", val);
		}
		__expose({
			get: () => autocompleteRef.value?.get(),
			/** Setea el texto actual sin abrir el panel (para ver sugerencias usá `open()`). */
			set: (val) => autocompleteRef.value?.set(val),
			focus: () => autocompleteRef.value?.focus(),
			reset: () => autocompleteRef.value?.reset(),
			/** Abre el panel de sugerencias (ignora `min-chars`). */
			open: () => autocompleteRef.value?.open(),
			/** Cierra el panel de sugerencias. */
			close: () => autocompleteRef.value?.close(),
			/** Alterna la visibilidad del panel de sugerencias. */
			toggle: () => autocompleteRef.value?.toggle(),
			isOpen: () => autocompleteRef.value?.isOpen() ?? false,
			selectedItem: () => autocompleteRef.value?.selectedItem?.() ?? null
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Autocomplete_default, {
				ref_key: "autocompleteRef",
				ref: autocompleteRef,
				color: props.color,
				variant: props.variant,
				type: props.type,
				disabled: props.disabled,
				"read-only": props.readOnly,
				loading: props.loading,
				placeholder: props.placeholder,
				"min-chars": props.minChars,
				position: props.position,
				align: props.align,
				fixed: props.fixed,
				"text-align": props.textAlign,
				items: props.items,
				"model-value": localModel.value,
				"onUpdate:modelValue": onUpdate,
				onSelect: _cache[0] || (_cache[0] = ($event) => ceEmit("select", $event)),
				onBlur: _cache[1] || (_cache[1] = ($event) => ceEmit("blur", $event))
			}, null, 8, [
				"color",
				"variant",
				"type",
				"disabled",
				"read-only",
				"loading",
				"placeholder",
				"min-chars",
				"position",
				"align",
				"fixed",
				"text-align",
				"items",
				"model-value"
			]);
		};
	}
}));
//#endregion
export { CuAutocomplete as default };
