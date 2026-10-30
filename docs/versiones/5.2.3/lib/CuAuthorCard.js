/*! comegenui v5.2.3 · CuAuthorCard (cu-author-card) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, defineCustomElement, normalizeClass, normalizeStyle, openBlock, renderSlot, toDisplayString } from "vue";
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
oneOf(VARIANTS);
oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
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
//#region src/components/information/Avatar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = ["src"];
var _hoisted_2$1 = {
	key: 1,
	class: "cu-avatar-initials"
};
var Avatar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Avatar",
	props: {
		color: {
			type: String,
			required: false,
			default: ""
		},
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		},
		initials: {
			type: String,
			required: false,
			default: ""
		},
		src: {
			type: String,
			required: false,
			default: ""
		}
	},
	setup(__props) {
		const PALETTE = [
			"primary",
			"secondary",
			"success",
			"neutral"
		];
		function hashString(str) {
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				hash = (hash << 5) - hash + str.charCodeAt(i);
				hash |= 0;
			}
			return Math.abs(hash);
		}
		const props = __props;
		const ALL_COLORS = [
			"primary",
			"secondary",
			"success",
			"warning",
			"danger",
			"neutral"
		];
		const resolvedColors = computed(() => {
			if (props.color) {
				const idx = ALL_COLORS.indexOf(props.color);
				return {
					bg: props.color,
					gradient: ALL_COLORS[(idx + 1) % ALL_COLORS.length]
				};
			}
			const idx = hashString((props.initials || props.name || "x").toLowerCase()) % PALETTE.length;
			return {
				bg: PALETTE[idx],
				gradient: PALETTE[(idx + 1) % PALETTE.length]
			};
		});
		const avatarStyles = computed(() => ({
			"--avatar-bg": `var(--cu-color-${resolvedColors.value.bg}, #6366f1)`,
			"background-color": `var(--cu-color-${resolvedColors.value.bg}, #6366f1)`
		}));
		const sizeClass = computed(() => `cu-avatar--${props.size}`);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-avatar", sizeClass.value]),
				style: normalizeStyle(avatarStyles.value)
			}, [
				props.src ? (openBlock(), createElementBlock("img", {
					key: 0,
					src: props.src,
					class: "cu-avatar-img",
					alt: ""
				}, null, 8, _hoisted_1$1)) : props.initials ? (openBlock(), createElementBlock("span", _hoisted_2$1, toDisplayString(props.initials), 1)) : createCommentVNode("v-if", true),
				createCommentVNode(" Iniciales o contenido del avatar. "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 6);
		};
	}
});
//#endregion
//#region src/components/information/Avatar.vue?vue&type=style&index=0&inline&scoped=116b6a17&lang.css
var Avatar_vue_vue_type_style_index_0_inline_scoped_116b6a17_lang_default = "\n.cu-avatar[data-v-116b6a17] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background-color: var(--avatar-bg);\n  color: white;\n  font-weight: var(--cu-font-weight-semibold);\n  flex-shrink: 0;\n}\n.cu-avatar--sm[data-v-116b6a17] {\n  width: 28px;\n  height: 28px;\n  font-size: var(--cu-font-size-xs);\n}\n.cu-avatar--md[data-v-116b6a17] {\n  width: 36px;\n  height: 36px;\n  font-size: var(--cu-font-size-sm);\n}\n.cu-avatar--lg[data-v-116b6a17] {\n  width: 48px;\n  height: 48px;\n  font-size: var(--cu-font-size-md);\n}\n.cu-avatar-initials[data-v-116b6a17] {\n  line-height: 1;\n}\n.cu-avatar-img[data-v-116b6a17] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Avatar.vue
var Avatar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Avatar_vue_vue_type_script_setup_true_lang_default, [["styles", [Avatar_vue_vue_type_style_index_0_inline_scoped_116b6a17_lang_default]], ["__scopeId", "data-v-116b6a17"]]);
//#endregion
//#region src/components/information/AuthorCard.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "cu-author" };
var _hoisted_2 = { class: "cu-author-info" };
var _hoisted_3 = { class: "cu-author-name" };
var _hoisted_4 = {
	key: 0,
	class: "cu-author-role"
};
//#endregion
//#region src/components/information/AuthorCard.vue
var AuthorCard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "AuthorCard",
	props: {
		name: {
			type: String,
			required: true
		},
		role: {
			type: String,
			required: false,
			default: ""
		},
		color: {
			type: String,
			required: false,
			default: ""
		},
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSize
		},
		src: {
			type: String,
			required: false,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const initials = computed(() => {
			const parts = props.name.trim().split(/\s+/);
			if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
			return parts[0]?.slice(0, 2).toUpperCase() || "";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createVNode(Avatar_default, {
				initials: initials.value,
				color: props.color,
				size: props.size,
				src: props.src
			}, null, 8, [
				"initials",
				"color",
				"size",
				"src"
			]), createElementVNode("div", _hoisted_2, [createElementVNode("span", _hoisted_3, toDisplayString(props.name), 1), props.role ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(props.role), 1)) : createCommentVNode("v-if", true)])]);
		};
	}
}), [["styles", ["\n.cu-author[data-v-6575f2a3] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n.cu-author-info[data-v-6575f2a3] {\n  display: flex;\n  flex-direction: column;\n}\n.cu-author-name[data-v-6575f2a3] {\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  color: var(--cu-color-neutral);\n  line-height: var(--cu-line-height-tight);\n}\n.cu-author-role[data-v-6575f2a3] {\n  font-size: var(--cu-font-size-xs);\n  color: var(--cu-color-neutral);\n  opacity: 0.5;\n  line-height: var(--cu-line-height-tight);\n}\n"]], ["__scopeId", "data-v-6575f2a3"]]);
//#endregion
//#region src/lib/information/author-card.ts
var CuAuthorCard = defineComegenElement("cu-author-card", /* @__PURE__ */ defineComponent({
	__name: "AuthorCard.ce",
	props: {
		/** Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) */
		name: {
			type: String,
			required: true
		},
		/** Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) */
		role: {
			type: String,
			default: ""
		},
		/** Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales */
		color: {
			type: String,
			default: ""
		},
		/** Tamaño del avatar: `sm`, `md`, `lg` */
		size: {
			type: String,
			default: "md"
		},
		/** URL de la imagen del avatar (reemplaza las iniciales) */
		src: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(AuthorCard_default, {
				name: props.name,
				role: props.role,
				color: props.color,
				size: props.size,
				src: props.src
			}, null, 8, [
				"name",
				"role",
				"color",
				"size",
				"src"
			]);
		};
	}
}));
//#endregion
export { CuAuthorCard as default };
