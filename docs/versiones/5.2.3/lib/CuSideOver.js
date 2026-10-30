/*! comegenui v5.2.3 · CuSideOver (cu-side-over) · esm-shared · Vue externo (bare import) */
import { Teleport, Transition, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderSlot, toDisplayString, useAttrs, useId, watch, withCtx } from "vue";
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
//#region src/components/overlay/SideOver.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-labelledby", "aria-label"];
var _hoisted_2 = ["data-size"];
var _hoisted_3 = {
	key: 0,
	class: "cu-sideover-header"
};
var _hoisted_4 = { class: "cu-sideover-body" };
var openInstances = [];
var scrollLocks = 0;
var previousBodyOverflow = "";
function lockBodyScroll() {
	if (scrollLocks === 0) {
		previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
	}
	scrollLocks += 1;
}
function unlockBodyScroll() {
	if (scrollLocks === 0) return;
	scrollLocks -= 1;
	if (scrollLocks === 0) document.body.style.overflow = previousBodyOverflow;
}
var SideOver_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	inheritAttrs: false,
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
		},
		/** Teleporta el panel a `body`; el CE lo desactiva para conservar el slot. */
		teleport: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:modelValue", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const titleId = `${useId()}-title`;
		const panelRef = ref(null);
		/** Elemento que tenía el foco al abrir: se le devuelve al cerrar. */
		const trigger = ref(null);
		const dialogLabel = computed(() => props.title ? void 0 : attrs["aria-label"] || "Panel");
		const FOCUSABLE_SELECTOR = [
			"a[href]",
			"area[href]",
			"button:not([disabled])",
			"input:not([disabled]):not([type=\"hidden\"])",
			"select:not([disabled])",
			"textarea:not([disabled])",
			"iframe",
			"object",
			"embed",
			"audio[controls]",
			"video[controls]",
			"summary",
			"[contenteditable=\"true\"]",
			"[tabindex]:not([tabindex=\"-1\"])"
		].join(",");
		/** Oculta por atributo/inline style (v-show): `focus()` no serviría y el trap no debe contarla. */
		function isHidden(el) {
			for (let node = el; node; node = node.parentElement) {
				if (node.hasAttribute("hidden")) return true;
				const style = node.style;
				if (style && (style.display === "none" || style.visibility === "hidden")) return true;
			}
			return false;
		}
		function isFocusable(el) {
			return el instanceof HTMLElement && el.matches(FOCUSABLE_SELECTOR) && !isHidden(el);
		}
		/**
		* Focusables del panel en orden de tabulación. Recorre slots (`assignedElements`)
		* y shadow roots anidados: en el custom element el contenido vive en el light DOM
		* del host y `querySelectorAll` no cruza ninguna de las dos fronteras.
		*/
		function collectFocusables(root, out = []) {
			for (const child of Array.from(root.children)) {
				if (child.tagName === "SLOT" && "assignedElements" in child) {
					const slot = child;
					const assigned = slot.assignedElements({ flatten: true });
					const source = assigned.length ? assigned : Array.from(slot.children);
					for (const node of source) {
						if (isFocusable(node)) out.push(node);
						if (node.shadowRoot) collectFocusables(node.shadowRoot, out);
						collectFocusables(node, out);
					}
					continue;
				}
				if (isFocusable(child)) out.push(child);
				if (child.shadowRoot) collectFocusables(child.shadowRoot, out);
				collectFocusables(child, out);
			}
			return out;
		}
		function panelFocusables() {
			return panelRef.value ? collectFocusables(panelRef.value) : [];
		}
		/** Elemento realmente enfocado, atravesando shadow roots anidados. */
		function deepActiveElement() {
			let active = document.activeElement;
			while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
			return active;
		}
		/** Foco inicial: `[autofocus]` si existe, si no el primer focusable, si no el panel. */
		function focusFirst() {
			const panel = panelRef.value;
			if (!panel) return;
			const focusables = panelFocusables();
			const active = deepActiveElement();
			if (active && (focusables.includes(active) || panel.contains(active))) return;
			(panel.querySelector("[autofocus]") ?? focusables[0] ?? panel).focus();
		}
		/** Devuelve el foco al trigger; si es un custom element, a su control interno. */
		function restoreFocus() {
			const el = trigger.value;
			trigger.value = null;
			if (!el || !el.isConnected) return;
			el.focus();
			if (document.activeElement !== el && el.shadowRoot) collectFocusables(el.shadowRoot)[0]?.focus();
		}
		function trapTab(event) {
			if (event.key !== "Tab") return;
			const panel = panelRef.value;
			if (!panel) return;
			const focusables = panelFocusables();
			if (!focusables.length) {
				event.preventDefault();
				panel.focus();
				return;
			}
			const target = (typeof event.composedPath === "function" ? event.composedPath() : [])[0] ?? event.target;
			const index = target ? focusables.indexOf(target) : -1;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (index === -1) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
			} else if (event.shiftKey && index === 0) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && index === focusables.length - 1) {
				event.preventDefault();
				first.focus();
			}
		}
		const instanceId = Symbol("cu-sideover");
		let registered = false;
		function isTopmost() {
			return openInstances[openInstances.length - 1] === instanceId;
		}
		function onKeydown(e) {
			if (!props.modelValue || !isTopmost()) return;
			if (e.key === "Escape") {
				close();
				return;
			}
			if (e.key === "Tab") trapTab(e);
		}
		function register() {
			if (registered) return;
			registered = true;
			openInstances.push(instanceId);
			lockBodyScroll();
			const active = deepActiveElement();
			trigger.value = active instanceof HTMLElement ? active : null;
			document.addEventListener("keydown", onKeydown);
			nextTick(() => {
				if (props.modelValue) focusFirst();
			});
		}
		function unregister() {
			if (!registered) return;
			registered = false;
			const index = openInstances.indexOf(instanceId);
			if (index !== -1) openInstances.splice(index, 1);
			unlockBodyScroll();
			document.removeEventListener("keydown", onKeydown);
			restoreFocus();
		}
		watch(() => props.modelValue, (open) => {
			if (open) register();
			else unregister();
		});
		onMounted(() => {
			if (props.modelValue) register();
		});
		onUnmounted(() => {
			unregister();
		});
		function close() {
			if (props.persistent) return;
			emit("update:modelValue", false);
			emit("close");
		}
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
			return openBlock(), createBlock(Teleport, {
				to: "body",
				disabled: !props.teleport
			}, [createVNode(Transition, { name: "cu-sideover" }, {
				default: withCtx(() => [__props.modelValue ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "cu-sideover",
					style: normalizeStyle({ zIndex: props.zIndex }),
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": props.title ? titleId : void 0,
					"aria-label": dialogLabel.value
				}, [createElementVNode("div", {
					class: "cu-sideover-backdrop",
					onClick: close
				}), createElementVNode("div", {
					ref_key: "panelRef",
					ref: panelRef,
					class: normalizeClass(["cu-sideover-panel", [`cu-sideover-panel--${props.position}`, { "cu-sideover-panel--fullscreen": props.fullscreen }]]),
					tabindex: "-1",
					"data-size": isPresetSize.value ? props.size : void 0,
					style: normalizeStyle(panelStyle.value)
				}, [props.title || !props.persistent ? (openBlock(), createElementBlock("header", _hoisted_3, [props.title ? (openBlock(), createElementBlock("h2", {
					key: 0,
					id: titleId,
					class: "cu-sideover-title"
				}, toDisplayString(props.title), 1)) : createCommentVNode("v-if", true), !props.persistent ? (openBlock(), createElementBlock("button", {
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
				}, [createElementVNode("path", { d: "M18 6 6 18" }), createElementVNode("path", { d: "m6 6 12 12" })], -1)])])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "default", {}, void 0, true)])], 14, _hoisted_2)], 12, _hoisted_1)) : createCommentVNode("v-if", true)]),
				_: 3
			})], 8, ["disabled"]);
		};
	}
});
//#endregion
//#region src/components/overlay/SideOver.vue?vue&type=style&index=0&inline&scoped=f4ad9796&lang.css
var SideOver_vue_vue_type_style_index_0_inline_scoped_f4ad9796_lang_default = "\n.cu-sideover[data-v-f4ad9796] {\n  position: fixed;\n  inset: 0;\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-backdrop[data-v-f4ad9796] {\n  position: absolute;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.4);\n}\n.cu-sideover-panel[data-v-f4ad9796] {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--cu-color-surface);\n  box-shadow: var(--cu-shadow-xl);\n  overflow: hidden;\n  /* Un preset mayor que el viewport no puede dejar el título fuera de pantalla. */\n  max-width: 100%;\n  max-height: 100%;\n}\n.cu-sideover-panel--left[data-v-f4ad9796] { top: 0; left: 0; bottom: 0;\n}\n.cu-sideover-panel--right[data-v-f4ad9796] { top: 0; right: 0; bottom: 0;\n}\n.cu-sideover-panel--top[data-v-f4ad9796] { top: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--bottom[data-v-f4ad9796] { bottom: 0; left: 0; right: 0;\n}\n.cu-sideover-panel--fullscreen[data-v-f4ad9796] { inset: 0; width: 100vw !important; height: 100dvh !important;\n}\n\n/* Presets de tamaño: se resuelven via CSS vars (override con\n   --cu-sideover-size-{sm|md|lg|xl|full} en el host) */\n.cu-sideover-panel[data-size='sm'][data-v-f4ad9796] { --cu-sideover-dimension: var(--cu-sideover-size-sm, 320px);\n}\n.cu-sideover-panel[data-size='md'][data-v-f4ad9796] { --cu-sideover-dimension: var(--cu-sideover-size-md, 400px);\n}\n.cu-sideover-panel[data-size='lg'][data-v-f4ad9796] { --cu-sideover-dimension: var(--cu-sideover-size-lg, 512px);\n}\n.cu-sideover-panel[data-size='xl'][data-v-f4ad9796] { --cu-sideover-dimension: var(--cu-sideover-size-xl, 640px);\n}\n.cu-sideover-panel[data-size='full'][data-v-f4ad9796] { --cu-sideover-dimension: var(--cu-sideover-size-full, 100%);\n}\n.cu-sideover-panel--left[data-size][data-v-f4ad9796],\n.cu-sideover-panel--right[data-size][data-v-f4ad9796] { width: var(--cu-sideover-dimension);\n}\n.cu-sideover-panel--top[data-size][data-v-f4ad9796],\n.cu-sideover-panel--bottom[data-size][data-v-f4ad9796] { height: var(--cu-sideover-dimension);\n}\n.cu-sideover-header[data-v-f4ad9796] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  flex-shrink: 0;\n}\n.cu-sideover-title[data-v-f4ad9796] {\n  margin: 0;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  color: var(--cu-color-neutral);\n}\n.cu-sideover-close[data-v-f4ad9796] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  padding: var(--cu-space-2xs);\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: var(--cu-color-neutral);\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.cu-sideover-close[data-v-f4ad9796]:hover { background-color: var(--cu-color-neutral-subtle-hover);\n}\n.cu-sideover-close[data-v-f4ad9796]:focus-visible {\n  outline: 2px solid var(--cu-color-primary);\n  outline-offset: 2px;\n}\n.cu-sideover-body[data-v-f4ad9796] {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: var(--cu-space-lg);\n}\n\n/* Transición: scrim con fade + panel deslizando desde su borde */\n.cu-sideover-enter-active[data-v-f4ad9796],\n.cu-sideover-leave-active[data-v-f4ad9796] {\n  transition: opacity 0.25s ease;\n}\n.cu-sideover-enter-active .cu-sideover-panel[data-v-f4ad9796],\n.cu-sideover-leave-active .cu-sideover-panel[data-v-f4ad9796] {\n  transition: transform 0.25s ease;\n}\n.cu-sideover-enter-from[data-v-f4ad9796],\n.cu-sideover-leave-to[data-v-f4ad9796] {\n  opacity: 0;\n}\n.cu-sideover-enter-from .cu-sideover-panel--left[data-v-f4ad9796],\n.cu-sideover-leave-to .cu-sideover-panel--left[data-v-f4ad9796] { transform: translateX(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--right[data-v-f4ad9796],\n.cu-sideover-leave-to .cu-sideover-panel--right[data-v-f4ad9796] { transform: translateX(100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--top[data-v-f4ad9796],\n.cu-sideover-leave-to .cu-sideover-panel--top[data-v-f4ad9796] { transform: translateY(-100%);\n}\n.cu-sideover-enter-from .cu-sideover-panel--bottom[data-v-f4ad9796],\n.cu-sideover-leave-to .cu-sideover-panel--bottom[data-v-f4ad9796] { transform: translateY(100%);\n}\n@media (prefers-reduced-motion: reduce) {\n.cu-sideover-enter-active[data-v-f4ad9796],\n  .cu-sideover-leave-active[data-v-f4ad9796],\n  .cu-sideover-enter-active .cu-sideover-panel[data-v-f4ad9796],\n  .cu-sideover-leave-active .cu-sideover-panel[data-v-f4ad9796] {\n    transition: none;\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/overlay/SideOver.vue
var SideOver_default = /*#__PURE__*/ _plugin_vue_export_helper_default(SideOver_vue_vue_type_script_setup_true_lang_default, [["styles", [SideOver_vue_vue_type_style_index_0_inline_scoped_f4ad9796_lang_default]], ["__scopeId", "data-v-f4ad9796"]]);
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
			setOpen(value);
		}
		function setOpen(value) {
			if (isOpen.value === value) return;
			isOpen.value = value;
			ceEmit("update:open", value);
			if (!value) ceEmit("close", void 0);
		}
		/** Abre el panel */
		function show() {
			setOpen(true);
		}
		/** Cierra el panel */
		function close() {
			setOpen(false);
		}
		/** Alterna visibilidad */
		function toggle() {
			setOpen(!isOpen.value);
		}
		function isOpenValue() {
			return isOpen.value;
		}
		__expose({
			show,
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
				teleport: false,
				"onUpdate:modelValue": onUpdate
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
