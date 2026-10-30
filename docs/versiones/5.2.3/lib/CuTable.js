/*! comegenui v5.2.3 · CuTable (cu-table) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, guardReactiveProps, mergeModels, mergeProps, nextTick, normalizeClass, normalizeProps, normalizeStyle, onBeforeUnmount, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, resolveDynamicComponent, shallowRef, toDisplayString, toRaw, toRef, toValue, unref, useModel, useSlots, useTemplateRef, watch, withCtx, withKeys, withModifiers } from "vue";
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
var isVariant = oneOf(VARIANTS);
var isVariantFull = oneOf(VARIANTS_FULL);
var isVariantNoGhost = oneOf(VARIANTS_NO_GHOST);
var isFieldVariant = oneOf(VARIANTS_FIELD);
var isFieldVariantNone = oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
var isSizeSm = oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
var isAlign = oneOf(ALIGNS);
var isTextAlign = oneOf(TEXT_ALIGNS);
var isPosition = oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
var isButtonType = oneOf(BUTTON_TYPES);
var isInputType = oneOf(INPUT_TYPES);
var isLabelPosition = oneOf(LABEL_POSITIONS);
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
var isSelectSearchMode = oneOf(SELECT_SEARCH_MODES);
oneOf(CELLS_IMPORTER_INPUT_TYPES);
//#endregion
//#region src/components/information/Loader.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$21 = { class: "cu-loader" };
var Loader_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
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
			return openBlock(), createElementBlock("div", _hoisted_1$21, [createElementVNode("div", {
				class: normalizeClass(["cu-loader-bar", `cu-loader-bar--${props.animation}`]),
				style: normalizeStyle(loaderStyles.value)
			}, null, 6)]);
		};
	}
});
//#endregion
//#region src/components/information/Loader.vue?vue&type=style&index=0&inline&scoped=045244b1&lang.css
var Loader_vue_vue_type_style_index_0_inline_scoped_045244b1_lang_default = "\n.cu-loader[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 30;\n  overflow: hidden;\n  height: 3px;\n}\n.cu-loader-bar[data-v-045244b1] {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  background: var(--cu-loader-color);\n}\n.cu-loader-bar--loading[data-v-045244b1] {\n  width: 60%;\n  background: linear-gradient(90deg, transparent 0%, var(--cu-loader-color) 50%, transparent 100%);\n  animation: cu-loader-slide-045244b1 1.5s ease-in-out infinite;\n}\n.cu-loader-bar--cooldown[data-v-045244b1] {\n  left: 0;\n  width: 100%;\n  animation: cu-loader-cooldown-045244b1 var(--cu-loader-delay) linear forwards;\n}\n@keyframes cu-loader-slide-045244b1 {\n0% { left: -100%;\n}\n50% { left: 0%;\n}\n100% { left: 100%;\n}\n}\n@keyframes cu-loader-cooldown-045244b1 {\nfrom { width: 100%;\n}\nto { width: 0%;\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/information/Loader.vue
var Loader_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Loader_vue_vue_type_script_setup_true_lang_default, [["styles", [Loader_vue_vue_type_style_index_0_inline_scoped_045244b1_lang_default]], ["__scopeId", "data-v-045244b1"]]);
//#endregion
//#region src/components/data/Table.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$20 = { class: "cu-table-scroll" };
var _hoisted_2$10 = { class: "cu-table-element" };
var _hoisted_3$7 = { class: "cu-table-th-content" };
var _hoisted_4$5 = ["innerHTML"];
var _hoisted_5$4 = { key: 0 };
var _hoisted_6$4 = ["colspan"];
var _hoisted_7$3 = { key: 0 };
var _hoisted_8$2 = ["colspan"];
//#endregion
//#region src/components/data/Table.vue
var Table_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Table",
	props: {
		columns: {
			type: Array,
			required: false,
			default: () => []
		},
		data: {
			type: Array,
			required: false,
			default: () => []
		},
		empty: {
			type: String,
			required: false,
			default: "No hay datos que mostrar"
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
			validator: isVariant
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		maxHeight: {
			type: String,
			required: false,
			default: ""
		},
		rowDisabled: {
			type: [Boolean, Function],
			required: false,
			default: false
		},
		htmlCells: {
			type: Boolean,
			required: false,
			default: false
		},
		footer: {
			type: Array,
			required: false,
			default: () => []
		},
		compact: {
			type: Boolean,
			required: false,
			default: false
		},
		/**
		* Atributos extra por columna para el `<th>` (ej. `aria-sort` cuando la
		* columna se ordena). `{ [col.key]: { 'aria-sort': 'ascending' } }`.
		*/
		headerAttrs: {
			type: Object,
			required: false,
			default: () => ({})
		}
	},
	setup(__props, { slots: $slots }) {
		const props = __props;
		const tableStyles = computed(() => ({
			"--table-fg": `var(--cu-color-${props.color}-text)`,
			"--table-bg-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--table-bd": `var(--cu-color-${props.color}-subtle-border)`,
			"--table-bg-solid": `var(--cu-color-${props.color})`,
			...props.maxHeight ? { maxHeight: props.maxHeight } : {}
		}));
		const thStyle = computed(() => {
			const base = {
				"width": "",
				"background-color": `var(--cu-color-${props.color}-soft)`,
				"color": `var(--cu-color-${props.color}-text)`,
				"border-bottom": `var(--cu-border-thin) solid var(--cu-color-neutral-subtle-border)`
			};
			if (props.maxHeight) base["backdrop-filter"] = "blur(8px)";
			if (props.variant === "solid") {
				base["background-color"] = `var(--cu-color-${props.color}-solid)`;
				base["color"] = "var(--cu-color-surface)";
				base["border-bottom"] = "none";
				base["backdrop-filter"] = "none";
			} else if (props.variant === "ghost" || props.variant === "outlined") {
				base["background-color"] = "transparent";
				if (props.variant === "outlined") base["border-bottom"] = `var(--cu-border-medium) solid var(--cu-color-${props.color}-subtle-border)`;
			}
			return base;
		});
		const thStyleFn = (col) => {
			return {
				...thStyle.value,
				width: col.width || ""
			};
		};
		const tableColumns = computed(() => {
			if (props.columns.length > 0) return props.columns;
			if (props.data.length > 0 && props.data[0]) return Object.keys(props.data[0]).map((key) => ({
				key,
				label: key
			}));
			return [];
		});
		const getCellValue = (row, col) => {
			return row[col.key] != null ? String(row[col.key]) : "";
		};
		const isRowDisabled = (row) => {
			const rd = props.rowDisabled;
			return typeof rd === "function" ? rd(row) : !!rd;
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-table", {
					"cu-table--outlined": __props.variant === "outlined",
					"cu-table--compact": props.compact
				}]),
				style: normalizeStyle(tableStyles.value)
			}, [__props.loading ? (openBlock(), createBlock(Loader_default, {
				key: 0,
				color: __props.color,
				animation: "loading"
			}, null, 8, ["color"])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_1$20, [createElementVNode("table", _hoisted_2$10, [
				createElementVNode("thead", null, [createElementVNode("tr", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(tableColumns.value, (col) => {
					return openBlock(), createElementBlock("th", mergeProps({
						key: col.key,
						class: "cu-table-th",
						style: thStyleFn(col)
					}, { ref_for: true }, props.headerAttrs[col.key] || {}), [renderSlot(_ctx.$slots, `header-${col.key}`, {
						column: col,
						color: props.color,
						variant: props.variant
					}, () => [createElementVNode("span", _hoisted_3$7, toDisplayString(col.label ?? col.key), 1)], true)], 16);
				}), 128))])]),
				createElementVNode("tbody", { class: normalizeClass({ "cu-table-loading": props.loading }) }, [(openBlock(true), createElementBlock(Fragment, null, renderList(props.data, (row, rowIndex) => {
					return openBlock(), createElementBlock("tr", {
						key: rowIndex,
						class: normalizeClass(["cu-table-row", { "cu-table-row--disabled": isRowDisabled(row) }])
					}, [createCommentVNode(" Fila completa custom; scoped: { row, rowIndex, columns, getCellValue }. "), renderSlot(_ctx.$slots, "template", {
						row,
						rowIndex,
						columns: tableColumns.value,
						getCellValue
					}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(tableColumns.value, (col) => {
						return openBlock(), createElementBlock("td", {
							key: col.key,
							class: normalizeClass(["cu-table-td", {
								"cu-table-td--left": col.align !== "center" && col.align !== "right",
								"cu-table-td--center": col.align === "center",
								"cu-table-td--right": col.align === "right"
							}])
						}, [renderSlot(_ctx.$slots, `cell-${col.key}`, {
							row,
							column: col,
							index: rowIndex,
							value: getCellValue(row, col)
						}, () => [props.htmlCells ? (openBlock(), createElementBlock("span", {
							key: 0,
							innerHTML: getCellValue(row, col)
						}, null, 8, _hoisted_4$5)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(toDisplayString(getCellValue(row, col)), 1)], 64))], true)], 2);
					}), 128))], true)], 2);
				}), 128)), props.data.length === 0 ? (openBlock(), createElementBlock("tr", _hoisted_5$4, [createElementVNode("td", {
					colspan: tableColumns.value.length,
					class: "cu-table-empty"
				}, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString(__props.empty), 1)], true)], 8, _hoisted_6$4)])) : createCommentVNode("v-if", true)], 2),
				$slots.footer || props.footer.length ? (openBlock(), createElementBlock("tfoot", _hoisted_7$3, [renderSlot(_ctx.$slots, "footer", { columns: tableColumns.value }, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(props.footer, (fRow, fi) => {
					return openBlock(), createElementBlock("tr", { key: fi }, [(openBlock(true), createElementBlock(Fragment, null, renderList(fRow.cells, (cell, ci) => {
						return openBlock(), createElementBlock("td", {
							key: ci,
							colspan: cell.colspan,
							class: normalizeClass(["cu-table-td cu-table-td--footer", {
								"cu-table-td--left": cell.align !== "center" && cell.align !== "right",
								"cu-table-td--center": cell.align === "center",
								"cu-table-td--right": cell.align === "right"
							}])
						}, toDisplayString(cell.value), 11, _hoisted_8$2);
					}), 128))]);
				}), 128))], true)])) : createCommentVNode("v-if", true)
			])])], 6);
		};
	}
}), [["styles", ["\n.cu-table[data-v-8e793034] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n  overflow: hidden;\n}\n.cu-table-scroll[data-v-8e793034] {\n  overflow: auto;\n  border-radius: var(--cu-radius-md);\n  flex: 1;\n}\n.cu-table-element[data-v-8e793034] {\n  width: 100%;\n  border-collapse: collapse;\n}\n.cu-table--outlined .cu-table-scroll[data-v-8e793034] {\n  border: var(--cu-border-medium) solid var(--table-bd);\n}\n.cu-table-th[data-v-8e793034] {\n  text-align: left;\n  padding: var(--cu-space-md);\n  font-family: var(--cu-font-sans);\n  font-weight: var(--cu-font-weight-medium);\n  position: sticky;\n  top: 0;\n  z-index: 20;\n  user-select: none;\n}\n.cu-table .cu-table-th-content[data-v-8e793034] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  color: inherit;\n}\n.cu-table-row[data-v-8e793034] {\n  border-bottom: var(--cu-border-thin) solid rgba(0, 0, 0, 0.08);\n  transition: background-color 150ms ease;\n}\n.cu-table--outlined .cu-table-row[data-v-8e793034] {\n  border-bottom-color: var(--table-bd);\n}\n.cu-table-row[data-v-8e793034]:hover {\n  background-color: var(--table-bg-hover);\n}\n.cu-table-row--disabled[data-v-8e793034] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  pointer-events: none;\n}\n.cu-table-row--disabled[data-v-8e793034]:hover {\n  background-color: transparent;\n}\n.cu-table-row[data-v-8e793034]:last-child {\n  border-bottom: none;\n}\n.cu-table-loading[data-v-8e793034] {\n  opacity: var(--cu-alpha-faded, 0.4);\n  pointer-events: none;\n}\n[data-v-8e793034] .cu-table-td {\n  padding: var(--cu-space-md);\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral-text);\n}\n[data-v-8e793034] .cu-table-td--left { text-align: left;\n}\n[data-v-8e793034] .cu-table-td--center { text-align: center;\n}\n[data-v-8e793034] .cu-table-td--right { text-align: right;\n}\n[data-v-8e793034] .cu-table-empty {\n  padding: var(--cu-space-xl);\n  text-align: center;\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n  font-style: italic;\n  font-family: var(--cu-font-sans);\n}\n[data-v-8e793034] .cu-table-td--footer {\n  font-weight: var(--cu-font-weight-semibold);\n  border-top: var(--cu-border-medium) solid var(--cu-color-neutral-soft);\n}\n.cu-table tr:last-child td[data-v-8e793034] {\n  border-bottom: none;\n}\n\n/* compact: menos padding en celdas */\n.cu-table--compact .cu-table-th[data-v-8e793034] {\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-table--compact[data-v-8e793034] .cu-table-td {\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-table--compact[data-v-8e793034] .cu-table-empty {\n  padding: var(--cu-space-md);\n}\n\n"]], ["__scopeId", "data-v-8e793034"]]);
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$19 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$19);
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
var _hoisted_1$18 = [
	"href",
	"target",
	"rel",
	"role",
	"aria-disabled",
	"aria-busy",
	"tabindex"
];
var _hoisted_2$9 = [
	"type",
	"disabled",
	"aria-busy"
];
//#endregion
//#region src/components/buttons/Button.vue
var Button_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
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
			], 14, _hoisted_1$18)) : (openBlock(), createElementBlock("button", {
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
			], 14, _hoisted_2$9));
		};
	}
}), [["styles", ["\n.cu-button[data-v-cb9decf8] {\n  font-family: var(--cu-font-sans);\n  text-decoration: none;\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  box-sizing: border-box;\n  transition: all 150ms ease;\n}\n.cu-button[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  transform: scale(0.97);\n}\n.cu-button--disabled[data-v-cb9decf8] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* sizes (md = base; link mantiene su padding 0) */\n.cu-button--sm[data-v-cb9decf8]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-xs);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-button--lg[data-v-cb9decf8]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-lg);\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n}\n\n/* solid */\n.cu-button.cu-button--solid[data-v-cb9decf8] {\n  background-color: var(--btn-solid);\n  color: var(--btn-solid-text);\n}\n.cu-button.cu-button--solid[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-hover);\n}\n.cu-button.cu-button--solid[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-active);\n}\n\n/* ghost */\n.cu-button.cu-button--ghost[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n}\n.cu-button.cu-button--ghost[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--ghost[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* soft */\n.cu-button.cu-button--soft[data-v-cb9decf8] {\n  background-color: var(--btn-soft);\n  color: var(--btn-text);\n}\n.cu-button.cu-button--soft[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n.cu-button.cu-button--soft[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-active);\n}\n\n/* subtle */\n.cu-button.cu-button--subtle[data-v-cb9decf8] {\n  background-color: var(--btn-subtle);\n  color: var(--btn-text);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-button.cu-button--subtle[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n.cu-button.cu-button--subtle[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-active);\n}\n\n/* outlined */\n.cu-button.cu-button--outlined[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n  border: var(--cu-border-thin) solid var(--btn-border);\n}\n.cu-button.cu-button--outlined[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--outlined[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* link */\n.cu-button.cu-button--link[data-v-cb9decf8] {\n  background-color: transparent;\n  color: var(--btn-text);\n  padding: 0;\n  box-shadow: none;\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button.cu-button--link[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  text-decoration-thickness: 2px;\n}\n\n/* none */\n.cu-button.cu-button--none[data-v-cb9decf8] {\n  background-color: var(--btn-solid);\n  color: var(--btn-solid-text);\n}\n.cu-button.cu-button--none[data-v-cb9decf8]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-hover);\n}\n.cu-button.cu-button--none[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-solid-active);\n}\n\n/* link wrapper */\n.cu-button-link[data-v-cb9decf8] {\n  text-decoration: none;\n}\n.cu-button-link[data-v-cb9decf8]:hover {\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button-link.cu-button--disabled[data-v-cb9decf8] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* icon-only */\n.cu-button--icon-only[data-v-cb9decf8] {\n  padding: var(--cu-space-sm);\n}\n\n/* loading spinner */\n.cu-button-spinner[data-v-cb9decf8] {\n  animation: cu-spin-cb9decf8 0.8s linear infinite;\n}\n@keyframes cu-spin-cb9decf8 {\nfrom { transform: rotate(0deg);\n}\nto { transform: rotate(360deg);\n}\n}\n@media (prefers-reduced-motion: reduce) {\n.cu-button[data-v-cb9decf8] {\n    transition: none;\n}\n.cu-button[data-v-cb9decf8]:active:not(.cu-button--disabled) {\n    transform: none;\n}\n.cu-button-spinner[data-v-cb9decf8] {\n    animation: none;\n}\n}\n"]], ["__scopeId", "data-v-cb9decf8"]]);
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
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$17 = ["role"];
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
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1$17)) : createCommentVNode("v-if", true)], 544);
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
var _hoisted_1$16 = ["onClick"];
var _hoisted_2$8 = ["innerHTML"];
var _hoisted_3$6 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_4$4 = {
	key: 0,
	class: "cu-dropdown-menu-divider"
};
var _hoisted_5$3 = ["href", "onClick"];
var _hoisted_6$3 = ["innerHTML"];
var _hoisted_7$2 = { class: "cu-dropdown-menu-item-label" };
var _hoisted_8$1 = ["disabled", "onClick"];
var _hoisted_9$1 = ["innerHTML"];
var _hoisted_10$1 = { class: "cu-dropdown-menu-item-label" };
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
					}, null, 8, _hoisted_2$8)) : createCommentVNode("v-if", true),
					createElementVNode("span", _hoisted_3$6, toDisplayString(__props.label || "Submenú"), 1),
					createVNode(LucideChevronRight_default, {
						width: 14,
						height: 14,
						class: "cu-dropdown-menu-item-chevron"
					})
				], 8, _hoisted_1$16)) : (openBlock(), createBlock(Button_default, {
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
						return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_4$4)) : item.to || item.href ? (openBlock(), createElementBlock("a", {
							key: 1,
							href: item.to || item.href,
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_6$3)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_7$2, toDisplayString(item.label), 1)], 10, _hoisted_5$3)) : (openBlock(), createElementBlock("button", {
							key: 2,
							type: "button",
							class: normalizeClass(["cu-dropdown-menu-item", { "cu-dropdown-menu-item--disabled": item.disabled }]),
							disabled: item.disabled,
							onClick: ($event) => onItemClick(item)
						}, [item.icon ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "cu-dropdown-menu-item-icon",
							innerHTML: item.icon
						}, null, 8, _hoisted_9$1)) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_10$1, toDisplayString(item.label), 1)], 10, _hoisted_8$1))], 64);
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
var _hoisted_1$15 = { class: "cu-menu-option-main" };
var _hoisted_2$7 = ["innerHTML"];
var _hoisted_3$5 = { key: 1 };
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
				default: withCtx(() => [createElementVNode("span", _hoisted_1$15, [props.icon ? (openBlock(), createElementBlock("span", {
					key: 0,
					innerHTML: props.icon,
					class: normalizeClass(props.iconClass)
				}, null, 10, _hoisted_2$7)) : createCommentVNode("v-if", true), props.label ? (openBlock(), createElementBlock("span", _hoisted_3$5, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true)]), props.selected ? (openBlock(), createBlock(LucideCheck_default, {
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
//#region src/components/form/Select.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$14 = {
	key: 1,
	class: "cu-select-options"
};
var _hoisted_2$6 = {
	key: 2,
	class: "cu-select-empty"
};
//#endregion
//#region src/components/form/Select.vue
var Select_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Select",
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
			default: "soft",
			validator: isFieldVariant
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** No abre el dropdown ni cambia la selección; el control sigue enfocable. */
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
		placeholderWrap: {
			type: Boolean,
			required: false,
			default: false
		},
		position: {
			type: String,
			required: false,
			default: "bottom"
		},
		align: {
			type: String,
			required: false,
			default: "start"
		},
		/**
		* Alineación del texto: el label del trigger (placeholder o selección) y las opciones del
		* panel. `left` (default), `center`, `right`.
		*/
		textAlign: {
			type: String,
			required: false,
			default: "left",
			validator: isTextAlign
		},
		fixed: {
			type: Boolean,
			required: false,
			default: false
		},
		modelValue: {
			type: String,
			required: false,
			default: ""
		},
		options: {
			type: Array,
			required: false,
			default: () => []
		},
		searchEnabled: {
			type: Boolean,
			required: false,
			default: false
		},
		searchMode: {
			type: String,
			required: false,
			default: "startsWith",
			validator: isSelectSearchMode
		},
		searchResetDelay: {
			type: Number,
			required: false,
			default: 1e3
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		cooldownVariant: {
			type: String,
			required: false,
			default: "ghost-hover"
		}
	},
	emits: [
		"update:modelValue",
		"select",
		"change",
		"close",
		"blur"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const selectedValue = ref(props.modelValue);
		const dropdownRef = ref(null);
		const selectRoot = ref(null);
		const nativeInputRef = ref(null);
		const searchText = ref("");
		const cooldownActive = ref(false);
		const cooldownKey = ref(0);
		let resetTimeout = null;
		const matchIndex = computed(() => {
			const q = searchText.value;
			if (!q) return -1;
			return props.options.findIndex((o) => !o.disabled && matchesQuery(o.label, q, { mode: props.searchMode }));
		});
		function scheduleReset() {
			if (resetTimeout) clearTimeout(resetTimeout);
			cooldownActive.value = true;
			resetTimeout = setTimeout(() => {
				searchText.value = "";
				cooldownActive.value = false;
			}, props.searchResetDelay);
		}
		function onKeyDown(e) {
			if (props.readOnly || !props.searchEnabled) return;
			if (e.key === "Escape" || e.key === "Tab") return;
			if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				searchText.value += e.key;
				cooldownKey.value++;
				scheduleReset();
				if (matchIndex.value >= 0) nextTick(() => scrollToMatch(matchIndex.value));
			} else if (e.key === "Backspace") {
				e.preventDefault();
				searchText.value = searchText.value.slice(0, -1);
				cooldownKey.value++;
				scheduleReset();
			}
		}
		function scrollToMatch(index) {
			const optionsEl = selectRoot.value?.querySelector(".cu-select-options");
			if (!optionsEl) return;
			const optionEl = optionsEl.children[index];
			if (optionEl) optionEl.scrollIntoView({ block: "nearest" });
		}
		function onDropdownOpen() {
			if (props.searchEnabled) {
				searchText.value = "";
				nextTick(() => {
					const input = nativeInputRef.value;
					if (input) {
						input.addEventListener("keydown", onKeyDown);
						input.focus();
					}
				});
			}
		}
		function onDropdownClose() {
			if (props.searchEnabled) {
				const input = nativeInputRef.value;
				if (input) input.removeEventListener("keydown", onKeyDown);
			}
		}
		watch(() => dropdownRef.value?.isOpen(), (open) => {
			if (open) onDropdownOpen();
			else onDropdownClose();
		});
		watch(() => props.readOnly, (value) => {
			if (value) dropdownRef.value?.close();
		});
		const selectedLabel = computed(() => {
			const opt = props.options.find((o) => o.value === selectedValue.value);
			return opt ? opt.label : props.placeholder || "Seleccionar...";
		});
		watch(() => props.modelValue, (val) => {
			selectedValue.value = val;
		}, { immediate: true });
		function onSelect(option) {
			if (props.readOnly || option.disabled) return;
			selectedValue.value = option.value;
			emit("update:modelValue", option.value);
			emit("select", option);
			emit("change", option.value);
			dropdownRef.value?.close();
		}
		const optionStyle = computed(() => textAlignStyle(props.textAlign));
		/** El label del trigger alinea su texto dentro del espacio que deja el chevron. */
		const labelStyle = computed(() => ({ textAlign: props.textAlign }));
		/** Devuelve el valor seleccionado. */
		function get() {
			return selectedValue.value;
		}
		/** Setea el valor seleccionado y emite `change`. */
		function set(value) {
			selectedValue.value = value;
			emit("change", value);
		}
		/** Limpia la selección y emite `change`. */
		function reset() {
			selectedValue.value = "";
			emit("change", "");
		}
		/** Enfoca el trigger del select. */
		function focus() {
			selectRoot.value?.querySelector(".cu-select-toggle")?.focus();
		}
		function onFocusOut(e) {
			if (!selectRoot.value?.contains(e.relatedTarget)) emit("blur");
		}
		__expose({
			get,
			set,
			reset,
			focus,
			/** Indica si el panel está abierto. */
			isOpen: () => dropdownRef.value?.isOpen() ?? false,
			/** Devuelve la opción seleccionada o null. */
			selectedItem: () => props.options.find((o) => o.value === selectedValue.value) || null
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "selectRoot",
				ref: selectRoot,
				class: normalizeClass(["cu-select", { "cu-select--readonly": __props.readOnly }]),
				tabindex: "-1",
				onFocusout: onFocusOut
			}, [createVNode(Dropdown_default, {
				ref_key: "dropdownRef",
				ref: dropdownRef,
				color: __props.color,
				disabled: __props.disabled || __props.readOnly,
				position: __props.position,
				align: __props.align,
				fixed: __props.fixed,
				offset: 4,
				loading: __props.loading,
				cooldown: cooldownActive.value,
				"cooldown-key": cooldownKey.value,
				"cooldown-variant": __props.cooldownVariant,
				delay: __props.searchResetDelay,
				onClose: _cache[0] || (_cache[0] = ($event) => emit("close"))
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [createVNode(Button_default, {
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					"aria-readonly": __props.readOnly ? "true" : void 0,
					class: "cu-select-toggle",
					onClick: toggle
				}, {
					default: withCtx(() => [createElementVNode("span", {
						class: normalizeClass(["cu-select-label", { "cu-select-label--wrap": __props.placeholderWrap }]),
						style: normalizeStyle(labelStyle.value)
					}, toDisplayString(selectedLabel.value), 7), (openBlock(), createElementBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						class: normalizeClass(["cu-select-chevron", { "cu-select-chevron--open": isOpen }])
					}, [..._cache[1] || (_cache[1] = [createElementVNode("path", { d: "m6 9 6 6 6-6" }, null, -1)])], 2))]),
					_: 2
				}, 1032, [
					"color",
					"variant",
					"disabled",
					"aria-readonly",
					"onClick"
				])]),
				default: withCtx(() => [__props.searchEnabled ? (openBlock(), createElementBlock("input", {
					key: 0,
					ref_key: "nativeInputRef",
					ref: nativeInputRef,
					type: "text",
					class: "cu-select-hidden-input cu-input cu-input--ghost",
					tabindex: "-1",
					autocomplete: "off"
				}, null, 512)) : createCommentVNode("v-if", true), __props.options.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$14, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (opt, i) => {
					return openBlock(), createBlock(MenuOption_default, {
						key: i,
						label: opt.label,
						color: opt.color || __props.color,
						variant: opt.variant || (opt.value === selectedValue.value ? "soft" : "ghost"),
						disabled: opt.disabled,
						selected: opt.value === selectedValue.value,
						class: normalizeClass(["cu-select-option", { "cu-select-option--disabled": opt.disabled }]),
						style: normalizeStyle(optionStyle.value),
						onClick: ($event) => onSelect(opt)
					}, null, 8, [
						"label",
						"color",
						"variant",
						"disabled",
						"selected",
						"class",
						"style",
						"onClick"
					]);
				}), 128))])) : (openBlock(), createElementBlock("div", _hoisted_2$6, " Sin opciones "))]),
				_: 1
			}, 8, [
				"color",
				"disabled",
				"position",
				"align",
				"fixed",
				"loading",
				"cooldown",
				"cooldown-key",
				"cooldown-variant",
				"delay"
			])], 34);
		};
	}
}), [["styles", ["\n.cu-select[data-v-9642187d] {\n  width: 100%;\n  outline: none;\n}\n.cu-select[data-v-9642187d] .cu-dropdown {\n  width: 100%;\n}\n.cu-select-toggle[data-v-9642187d] {\n  width: 100%;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n\n/* Anillo de focus del trigger (como .cu-input:focus) — focus() enfoca el botón\n   de verdad: visible para el usuario y para teclado */\n.cu-select-toggle[data-v-9642187d]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n.cu-select--readonly .cu-select-toggle[data-v-9642187d] {\n  cursor: default;\n}\n.cu-select-label[data-v-9642187d] {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  /* Ocupa el espacio que deja el chevron: sin esto el `text-align` del label no tiene\n     ancho propio y la alineación no se ve. */\n  flex: 1 1 auto;\n}\n.cu-select-label--wrap[data-v-9642187d] {\n  white-space: normal;\n}\n.cu-select-chevron[data-v-9642187d] {\n  transition: transform 200ms ease;\n  flex-shrink: 0;\n}\n.cu-select-chevron--open[data-v-9642187d] {\n  transform: rotate(180deg);\n}\n.cu-select-options[data-v-9642187d] {\n  max-height: 240px;\n  overflow-y: auto;\n}\n.cu-select-option[data-v-9642187d] {\n  width: 100%;\n  /* La alineación la pone `textAlign` inline (`justify-content`): dentro de un `Button`\n     flex el `text-align` solo no mueve nada. Default: `flex-start`. */\n}\n.cu-select-option--disabled[data-v-9642187d] {\n  opacity: var(--cu-alpha-muted, 0.5);\n  cursor: not-allowed;\n}\n.cu-select-hidden-input[data-v-9642187d] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n  opacity: 0;\n}\n.cu-select-empty[data-v-9642187d]{\n  padding: var(--cu-space-md);\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  opacity: var(--cu-alpha-subtle, 0.6);\n  text-align: center;\n}\n"]], ["__scopeId", "data-v-9642187d"]]);
//#endregion
//#region src/components/controls/Pagination.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$13 = {
	key: 0,
	class: "cu-pagination"
};
var _hoisted_2$5 = { class: "cu-pagination-info" };
var _hoisted_3$4 = { class: "cu-pagination-controls" };
var _hoisted_4$3 = {
	key: 0,
	class: "cu-pagination-page-size"
};
var _hoisted_5$2 = { class: "cu-pagination-pages" };
var _hoisted_6$2 = {
	key: 0,
	class: "cu-pagination-ellipsis"
};
//#endregion
//#region src/components/controls/Pagination.vue
var Pagination_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Pagination",
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
			validator: isFieldVariantNone
		},
		currentPage: {
			type: Number,
			required: false,
			default: 1
		},
		totalPages: {
			type: Number,
			required: false,
			default: 1
		},
		totalItems: {
			type: Number,
			required: false,
			default: 0
		},
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		showPageSize: {
			type: Boolean,
			required: false,
			default: false
		},
		pageSizeOptions: {
			type: Array,
			required: false,
			default: () => [
				5,
				10,
				20,
				50
			]
		},
		showFirstAndLast: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: ["update:currentPage", "update:itemsPerPage"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const pageSizeValue = ref(String(props.itemsPerPage));
		watch(() => props.itemsPerPage, (val) => {
			pageSizeValue.value = String(val);
		});
		const pageSizeOptionsFormatted = computed(() => props.pageSizeOptions.map((opt) => ({
			value: String(opt),
			label: String(opt)
		})));
		const handlePageChange = (page) => {
			if (page >= 1 && page <= props.totalPages) emit("update:currentPage", page);
		};
		const handlePageSizeChange = (val) => {
			pageSizeValue.value = val;
			emit("update:itemsPerPage", Number(val));
			emit("update:currentPage", 1);
		};
		const startItem = computed(() => {
			return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
		});
		const endItem = computed(() => {
			return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
		});
		const visiblePages = computed(() => {
			const pages = [];
			const total = props.totalPages;
			let current = props.currentPage;
			if (total <= 7) for (let i = 1; i <= total; i++) pages.push(i);
			else {
				if (props.showFirstAndLast) {
					pages.push(1);
					if (current > 3) pages.push("...");
				}
				let midStart = current - 1;
				let midEnd = current + 1;
				if (props.showFirstAndLast) {
					midStart = Math.max(2, midStart);
					midEnd = Math.min(total - 1, midEnd);
				} else {
					midStart = Math.max(1, midStart);
					midEnd = Math.min(total, midEnd);
				}
				if (midEnd - midStart < 2) {
					if (midStart === (props.showFirstAndLast ? 2 : 1)) midEnd = midStart + 2;
					else midStart = midEnd - 2;
				}
				for (let i = midStart; i <= midEnd; i++) pages.push(i);
				if (props.showFirstAndLast) {
					if (current < total - 2) pages.push("...");
					pages.push(total);
				}
			}
			return pages;
		});
		return (_ctx, _cache) => {
			return __props.totalPages > 1 || __props.showPageSize ? (openBlock(), createElementBlock("div", _hoisted_1$13, [createElementVNode("span", _hoisted_2$5, " Mostrando " + toDisplayString(startItem.value) + " - " + toDisplayString(endItem.value) + " de " + toDisplayString(__props.totalItems), 1), createElementVNode("div", _hoisted_3$4, [__props.showPageSize ? (openBlock(), createElementBlock("div", _hoisted_4$3, [_cache[3] || (_cache[3] = createElementVNode("span", { class: "cu-pagination-label" }, "Por página:", -1)), createVNode(Select_default, {
				"model-value": pageSizeValue.value,
				options: pageSizeOptionsFormatted.value,
				color: props.color,
				style: { "width": "calc(var(--cu-space-3xl) * 2)" },
				onSelect: _cache[0] || (_cache[0] = (opt) => handlePageSizeChange(opt.value))
			}, null, 8, [
				"model-value",
				"options",
				"color"
			])])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_5$2, [
				createVNode(Button_default, {
					onClick: _cache[1] || (_cache[1] = ($event) => handlePageChange(__props.currentPage - 1)),
					disabled: __props.currentPage === 1,
					color: props.color,
					variant: props.variant
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode(" Anterior ", -1)])]),
					_: 1
				}, 8, [
					"disabled",
					"color",
					"variant"
				]),
				(openBlock(true), createElementBlock(Fragment, null, renderList(visiblePages.value, (page, idx) => {
					return openBlock(), createElementBlock(Fragment, { key: idx }, [page === "..." ? (openBlock(), createElementBlock("span", _hoisted_6$2, "...")) : (openBlock(), createBlock(Button_default, {
						key: 1,
						onClick: ($event) => handlePageChange(Number(page)),
						color: props.color,
						variant: __props.currentPage === page ? "solid" : props.variant
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(page), 1)]),
						_: 2
					}, 1032, [
						"onClick",
						"color",
						"variant"
					]))], 64);
				}), 128)),
				createVNode(Button_default, {
					onClick: _cache[2] || (_cache[2] = ($event) => handlePageChange(__props.currentPage + 1)),
					disabled: __props.currentPage === __props.totalPages,
					color: props.color,
					variant: props.variant
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Siguiente ", -1)])]),
					_: 1
				}, 8, [
					"disabled",
					"color",
					"variant"
				])
			])])])) : createCommentVNode("v-if", true);
		};
	}
}), [["styles", ["\n.cu-pagination[data-v-09434202] {\n  width: 100%;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--cu-space-md);\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n.cu-pagination-info[data-v-09434202] {\n  display: none;\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral-text);\n  font-family: var(--cu-font-sans);\n}\n@media (min-width: 768px) {\n.cu-pagination-info[data-v-09434202] {\n    display: inline;\n}\n}\n.cu-pagination-controls[data-v-09434202] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-sm);\n}\n.cu-pagination-page-size[data-v-09434202] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-pagination-label[data-v-09434202] {\n  font-size: var(--cu-font-size-sm);\n  color: var(--cu-color-neutral-text);\n  font-family: var(--cu-font-sans);\n}\n.cu-pagination-pages[data-v-09434202] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n}\n.cu-pagination-ellipsis[data-v-09434202] {\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n  font-size: var(--cu-font-size-sm);\n  font-family: var(--cu-font-sans);\n}\n"]], ["__scopeId", "data-v-09434202"]]);
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
var _hoisted_1$12 = [
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
			}, null, 46, _hoisted_1$12);
		};
	}
}), [["styles", ["\n.cu-input[data-v-416af2a0] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius-md);\n  border: none;\n  outline: none;\n  width: 100%;\n  box-sizing: border-box;\n  background-color: var(--btn-bg);\n  color: var(--cu-color-neutral-text);\n  transition: all 150ms ease;\n}\n\n/* sizes */\n.cu-input--sm[data-v-416af2a0] {\n  padding: var(--cu-space-sm) var(--cu-space-md);\n  font-size: var(--cu-font-size-xs);\n}\n.cu-input--lg[data-v-416af2a0] {\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n  font-size: var(--cu-font-size-md);\n}\n.cu-input[data-v-416af2a0]::placeholder {\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-input[data-v-416af2a0]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n\n/* subtle */\n.cu-input--subtle[data-v-416af2a0] {\n  background-color: var(--btn-subtle);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--subtle[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n\n/* soft */\n.cu-input--soft[data-v-416af2a0] {\n  background-color: var(--btn-soft);\n}\n.cu-input--soft[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n\n/* ghost */\n.cu-input--ghost[data-v-416af2a0] {\n  background-color: transparent;\n}\n.cu-input--ghost[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* outlined */\n.cu-input--outlined[data-v-416af2a0] {\n  background-color: transparent;\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-input--outlined[data-v-416af2a0]:hover:not(.cu-input--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* disabled */\n.cu-input--disabled[data-v-416af2a0] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-416af2a0"]]);
//#endregion
//#region src/components/form/Textarea.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$11 = [
	"placeholder",
	"value",
	"disabled",
	"readonly",
	"rows"
];
//#endregion
//#region src/components/form/Textarea.vue
var Textarea_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Textarea",
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
		rows: {
			type: Number,
			required: false,
			default: 3
		},
		noResize: {
			type: Boolean,
			required: false,
			default: false
		}
	}, {
		"modelValue": { default: "" },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose }) {
		const value = useModel(__props, "modelValue");
		const props = __props;
		const textareaRef = useTemplateRef("textarea");
		const textareaStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		/** Devuelve el valor actual del textarea. */
		const get = () => value.value;
		/** Setea el valor del textarea. */
		const set = (newValue) => {
			value.value = String(newValue);
		};
		/** Limpia el textarea. */
		const reset = () => {
			value.value = "";
		};
		/** Enfoca el textarea. */
		const focus = () => {
			textareaRef.value?.focus();
		};
		__expose({
			get,
			set,
			reset,
			focus
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("textarea", {
				ref: "textarea",
				placeholder: props.placeholder,
				value: value.value,
				onInput: _cache[0] || (_cache[0] = ($event) => value.value = $event.target.value),
				class: normalizeClass(["cu-textarea", [`cu-textarea--${props.variant}`, {
					"cu-textarea--disabled": props.disabled,
					"cu-textarea--no-resize": props.noResize
				}]]),
				style: normalizeStyle(textareaStyles.value),
				disabled: props.disabled,
				readonly: props.readOnly,
				rows: props.rows
			}, null, 46, _hoisted_1$11);
		};
	}
}), [["styles", ["\n.cu-textarea[data-v-be9976ee] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius-md);\n  border: none;\n  outline: none;\n  width: 100%;\n  box-sizing: border-box;\n  background-color: var(--btn-bg);\n  color: var(--cu-color-neutral-text);\n  transition: all 150ms ease;\n  resize: vertical;\n}\n.cu-textarea[data-v-be9976ee]::placeholder {\n  color: var(--cu-color-neutral-text);\n  opacity: var(--cu-alpha-muted, 0.5);\n}\n.cu-textarea[data-v-be9976ee]:focus {\n  box-shadow: 0 0 0 var(--cu-border-thin) var(--btn-subtle-border);\n}\n.cu-textarea--no-resize[data-v-be9976ee] {\n  resize: none;\n}\n\n/* subtle */\n.cu-textarea--subtle[data-v-be9976ee] {\n  background-color: var(--btn-subtle);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-textarea--subtle[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n\n/* soft */\n.cu-textarea--soft[data-v-be9976ee] {\n  background-color: var(--btn-soft);\n}\n.cu-textarea--soft[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n\n/* ghost */\n.cu-textarea--ghost[data-v-be9976ee] {\n  background-color: transparent;\n}\n.cu-textarea--ghost[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* outlined */\n.cu-textarea--outlined[data-v-be9976ee] {\n  background-color: transparent;\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-textarea--outlined[data-v-be9976ee]:hover:not(.cu-textarea--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n\n/* disabled */\n.cu-textarea--disabled[data-v-be9976ee] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-be9976ee"]]);
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
var _hoisted_1$10 = {
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
				default: withCtx(() => [filteredItems.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$10, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredItems.value, (item, i) => {
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
var _hoisted_1$9 = [
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
			}, 8, ["color", "variant"])) : createCommentVNode("v-if", true)], 46, _hoisted_1$9);
		};
	}
}), [["styles", ["\n.cu-month-slider-label[data-v-8e08944d] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  min-width: 150px;\n  justify-content: center;\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: var(--cu-border-none) solid transparent;\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-md);\n  font-weight: var(--cu-font-weight-semibold);\n  cursor: default;\n  user-select: none;\n  touch-action: pan-y;\n  transform: translateX(var(--drag-offset, 0px));\n  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease, color 0.25s ease;\n  will-change: transform;\n}\n\n/* solid: doble clase para ganarle a reglas globales del consumidor (convención del repo) */\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-8e08944d] {\n  background-color: var(--ms-accent);\n  color: var(--ms-surface);\n}\n.cu-month-slider-label.cu-month-slider-label--solid[data-v-8e08944d]:hover {\n  background-color: var(--ms-accent-hover);\n}\n\n/* outlined */\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-8e08944d] {\n  background-color: transparent;\n  color: var(--ms-accent);\n  border: var(--cu-border-thin) solid var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--outlined[data-v-8e08944d]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* soft (default) */\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-8e08944d] {\n  background-color: var(--ms-soft);\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--soft[data-v-8e08944d]:hover {\n  background-color: var(--ms-soft-hover);\n}\n\n/* ghost */\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-8e08944d] {\n  background-color: transparent;\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.cu-month-slider-label--ghost[data-v-8e08944d]:hover {\n  background-color: var(--ms-ghost-hover);\n}\n\n/* subtle */\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-8e08944d] {\n  background-color: var(--ms-subtle);\n  color: var(--ms-accent);\n  border: var(--cu-border-thin) solid var(--ms-subtle-border);\n}\n.cu-month-slider-label.cu-month-slider-label--subtle[data-v-8e08944d]:hover {\n  background-color: var(--ms-subtle-hover);\n}\n\n/* El texto del mes lleva color explícito (inherit del root) con especificidad\n   suficiente para ganarle a reglas globales del consumidor tipo\n   `.playground :is(h1, ..., span, ...) { color: ... }` que pegan en spans internos.\n   La clase scoped [data-v] sube la regla a (0,3,0). */\n.cu-month-slider-label .cu-month-slider-label-month[data-v-8e08944d] {\n  color: inherit;\n}\n\n/* Sobre label solid, el badge del año (variante subtle) se pierde: el tinte\n   translúcido sobre el fondo solid oscuro no aporta contraste y el texto\n   (`--cu-color-{name}-text` = color oscurecido) queda casi negro e imperceptible.\n   Se invierte el badge: fondo = surface (color del texto del label) + texto = accent\n   (color del solid). Specificity (0,4,0) > `.cu-badge.cu-badge--subtle` (0,3,0). */\n.cu-month-slider-label.cu-month-slider-label--solid .cu-month-slider-label-year[data-v-8e08944d] {\n  background-color: var(--ms-surface);\n  color: var(--ms-accent);\n}\n.cu-month-slider-label.is-draggable[data-v-8e08944d] {\n  cursor: grab;\n}\n.cu-month-slider-label.is-dragging[data-v-8e08944d] {\n  cursor: grabbing;\n  transition: none;\n}\n\n/* Al consumir la deslizada, el label vuelve con un rebote suave */\n.cu-month-slider-label.is-fired[data-v-8e08944d] {\n  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.cu-month-slider-label.is-disabled[data-v-8e08944d] {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.cu-month-slider-label[data-v-8e08944d]:focus-visible {\n  outline: var(--cu-border-thin) solid var(--ms-accent);\n  outline-offset: var(--cu-space-2xs);\n}\n\n/* Entrada suave del texto al cambiar el mes (key en el span lo re-monta) */\n.cu-month-slider-label-month[data-v-8e08944d],\n.cu-month-slider-label-year[data-v-8e08944d] {\n  animation: cu-month-slide-in-8e08944d 0.28s cubic-bezier(0.22, 1, 0.36, 1);\n}\n@keyframes cu-month-slide-in-8e08944d {\nfrom {\n    opacity: 0;\n    transform: translateY(5px);\n}\nto {\n    opacity: 1;\n    transform: translateY(0);\n}\n}\n"]], ["__scopeId", "data-v-8e08944d"]]);
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
var _hoisted_1$8 = ["aria-label"];
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
			"--ms-accent": `var(--cu-color-${props.color})`,
			"--ms-accent-hover": `var(--cu-color-${props.color}-hover)`,
			"--ms-accent-text": `var(--cu-color-${props.color}-text)`,
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
			], 14, _hoisted_1$8);
		};
	}
}), [["styles", ["\n.cu-month-slider[data-v-ed7dba25] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-2xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-month-slider.is-disabled[data-v-ed7dba25] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n"]], ["__scopeId", "data-v-ed7dba25"]]);
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
var _hoisted_1$7 = ["aria-label"];
var _hoisted_2$4 = { class: "cu-calendar-header" };
var _hoisted_3$3 = {
	class: "cu-calendar-weekdays",
	role: "row"
};
var _hoisted_4$2 = { class: "cu-calendar-grid" };
var _hoisted_5$1 = ["disabled", "onClick"];
var _hoisted_6$1 = {
	key: 0,
	class: "cu-calendar-dots"
};
var _hoisted_7$1 = {
	key: 1,
	class: "cu-calendar-day--empty"
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
		const disabledWeekdayList = computed(() => {
			if (Array.isArray(props.disabledWeekdays)) return props.disabledWeekdays;
			if (typeof props.disabledWeekdays === "string" && props.disabledWeekdays.trim()) return props.disabledWeekdays.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
			return [];
		});
		const disabledDateList = computed(() => {
			return (Array.isArray(props.disabledDates) ? props.disabledDates : typeof props.disabledDates === "string" && props.disabledDates.trim() ? props.disabledDates.split(",") : []).map((d) => parseDate(String(d).trim())).filter((d) => d !== null);
		});
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
		const internalViewMonth = ref(clampMonth(parseDate(props.modelValue) ?? startOfCurrentMonth()));
		const viewMonthProp = computed(() => parseDate(props.viewMonth));
		const viewMonth = computed(() => viewMonthProp.value ?? internalViewMonth.value);
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
		const dayLabels = computed(() => {
			const base = new Date(2026, 7, 2);
			const labels = [];
			for (let i = 0; i < WEEK_LENGTH; i++) {
				const label = new Intl.DateTimeFormat(props.locale, { weekday: "short" }).format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
				labels.push(label.charAt(0).toUpperCase() + label.slice(1));
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
			return props.events.filter((ev) => sameDay(parseDate(ev.date), day));
		}
		function isDisabledDay(day) {
			if (props.disabled) return true;
			if (minDate.value && day < minDate.value) return true;
			if (maxDate.value && day > maxDate.value) return true;
			if (disabledWeekdayList.value.includes(day.getDay())) return true;
			if (disabledDateList.value.some((d) => sameDay(day, d))) return true;
			return false;
		}
		function selectDay(day) {
			if (isDisabledDay(day)) return;
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
			selectedValue.value = parsed;
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
				createElementVNode("div", _hoisted_2$4, [createVNode(MonthSlider_default, {
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
				createElementVNode("div", _hoisted_3$3, [(openBlock(true), createElementBlock(Fragment, null, renderList(dayLabels.value, (label, i) => {
					return openBlock(), createElementBlock("span", {
						key: i,
						class: "cu-calendar-weekday"
					}, toDisplayString(label), 1);
				}), 128))]),
				createCommentVNode(" Grilla de días: 7 columnas que se reparten el ancho del contenedor "),
				createElementVNode("div", _hoisted_4$2, [(openBlock(true), createElementBlock(Fragment, null, renderList(weeks.value, (week, wi) => {
					return openBlock(), createElementBlock("div", {
						key: wi,
						class: "cu-calendar-week",
						role: "row"
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(week, (cell, ci) => {
						return openBlock(), createElementBlock(Fragment, { key: ci }, [cell.date ? (openBlock(), createElementBlock("button", {
							key: 0,
							type: "button",
							class: normalizeClass(["cu-calendar-day", dayClasses(cell.date)]),
							disabled: isDisabledDay(cell.date),
							role: "gridcell",
							onClick: ($event) => selectDay(cell.date)
						}, [createTextVNode(toDisplayString(cell.date.getDate()) + " ", 1), getEventsForDay(cell.date).length ? (openBlock(), createElementBlock("span", _hoisted_6$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(getEventsForDay(cell.date), (ev, ei) => {
							return openBlock(), createElementBlock("span", {
								key: ei,
								class: "cu-calendar-dot",
								style: normalizeStyle(ev.color ? { "--dot-color": ev.color.startsWith("var(") ? ev.color : `var(--cu-color-${ev.color})` } : void 0)
							}, null, 4);
						}), 128))])) : createCommentVNode("v-if", true)], 10, _hoisted_5$1)) : (openBlock(), createElementBlock("span", _hoisted_7$1))], 64);
					}), 128))]);
				}), 128))])
			], 14, _hoisted_1$7);
		};
	}
}), [["styles", ["\n.cu-calendar[data-v-46d32125] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n  width: 100%;\n  min-width: 240px;\n  font-family: var(--cu-font-sans);\n  box-sizing: border-box;\n}\n\n/* Con navegación de año (4 botones del MonthSlider + label min 150px) el header\n   necesita más ancho que la grilla: forzamos min-width para evitar overflow. */\n.cu-calendar--year-nav[data-v-46d32125] {\n  min-width: 330px;\n}\n.cu-calendar.is-disabled[data-v-46d32125] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-calendar-header[data-v-46d32125] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--cu-space-2xs);\n}\n\n/* 7 columnas: cada una ocupa 1/7 del ancho que mida el contenedor */\n.cu-calendar-weekdays[data-v-46d32125],\n.cu-calendar-week[data-v-46d32125] {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: var(--cu-space-2xs);\n}\n.cu-calendar-weekday[data-v-46d32125] {\n  text-align: center;\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  opacity: var(--cu-alpha-subtle, 0.6);\n  padding: var(--cu-space-2xs) 0;\n}\n.cu-calendar-day[data-v-46d32125] {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  border-radius: var(--cu-radius-sm);\n  background: transparent;\n  color: inherit;\n  font-family: inherit;\n  font-size: var(--cu-font-size-sm);\n  cursor: pointer;\n  transition: background-color 150ms ease, color 150ms ease;\n  box-sizing: border-box;\n}\n\n/* Doble clase (convención del repo): ganarle en cascada a reglas globales\n   del consumidor (reset CSS, `.playground button`, etc.) */\n.cu-calendar-day.cu-calendar-day[data-v-46d32125]:hover:not(:disabled) {\n  background: var(--cal-ghost-hover);\n}\n.cu-calendar-day.cu-calendar-day[data-v-46d32125]:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n/* Hoy: transparente + número en color accent (look ghost). Sin fondo para no\n   confundirse con el día seleccionado — se distingue solo por el color. */\n.cu-calendar-day.cu-calendar-day--today[data-v-46d32125] {\n  background: transparent;\n  color: var(--cal-accent-text);\n  font-weight: var(--cu-font-weight-semibold);\n}\n\n/* Variantes del día seleccionado */\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-46d32125] {\n  background: var(--cal-solid);\n  /* Solid mantiene el texto del tema sobre la variante de fondo ajustada. */\n  color: var(--cal-solid-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--solid[data-v-46d32125]:hover:not(:disabled) {\n  background: var(--cal-solid-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--outlined[data-v-46d32125] {\n  outline: 1.5px solid var(--cal-accent-border);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-46d32125] {\n  background: var(--cal-soft);\n  color: var(--cal-accent-text);\n}\n.cu-calendar-day--selected.cu-calendar-day--soft[data-v-46d32125]:hover:not(:disabled) {\n  background: var(--cal-soft-hover);\n}\n.cu-calendar-day--selected.cu-calendar-day--subtle[data-v-46d32125] {\n  background: var(--cal-subtle);\n  color: var(--cal-accent-text);\n  box-shadow: inset 0 0 0 var(--cu-border-thin) var(--cal-subtle-border);\n}\n.cu-calendar-day--empty[data-v-46d32125] {\n  aspect-ratio: 1;\n}\n\n/* ── Grid interno: líneas separadoras entre días ── */\n.cu-calendar--grid .cu-calendar-weekdays[data-v-46d32125],\n.cu-calendar--grid .cu-calendar-week[data-v-46d32125] {\n  gap: 0;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-46d32125],\n.cu-calendar--grid .cu-calendar-day--empty[data-v-46d32125] {\n  border-right: var(--cu-border-thin) solid var(--cu-border-color);\n  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: 0;\n}\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day[data-v-46d32125],\n.cu-calendar--grid .cu-calendar-week:last-child .cu-calendar-day--empty[data-v-46d32125] {\n  border-bottom: none;\n}\n.cu-calendar--grid .cu-calendar-day[data-v-46d32125]:nth-child(7n),\n.cu-calendar--grid .cu-calendar-day--empty[data-v-46d32125]:nth-child(7n) {\n  border-right: none;\n}\n\n/* ── Borde exterior: marco alrededor de la cuadrícula de días ── */\n.cu-calendar--border .cu-calendar-grid[data-v-46d32125] {\n  border: var(--cu-border-thin) solid var(--cu-border-color);\n  border-radius: var(--cu-radius-sm);\n  overflow: hidden;\n}\n\n/* ── Rango ── */\n.cu-calendar-day.cu-calendar-day--range[data-v-46d32125] {\n  background: var(--cal-soft);\n  border-radius: 0;\n}\n.cu-calendar-day.cu-calendar-day--range-start[data-v-46d32125] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: var(--cu-radius-sm) 0 0 var(--cu-radius-sm);\n}\n.cu-calendar-day.cu-calendar-day--range-end[data-v-46d32125] {\n  background: var(--cal-solid);\n  color: var(--cal-solid-text);\n  border-radius: 0 var(--cu-radius-sm) var(--cu-radius-sm) 0;\n}\n.cu-calendar-day--range-start.cu-calendar-day--range-end[data-v-46d32125] {\n  border-radius: var(--cu-radius-sm);\n}\n\n/* ── Puntos de eventos ── */\n.cu-calendar-day[data-v-46d32125] {\n  position: relative;\n}\n.cu-calendar-dots[data-v-46d32125] {\n  position: absolute;\n  bottom: var(--cu-space-2xs);\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: var(--cu-space-2xs);\n  align-items: center;\n  justify-content: center;\n  pointer-events: none;\n}\n.cu-calendar-dot[data-v-46d32125] {\n  width: var(--cu-space-xs);\n  height: var(--cu-space-xs);\n  border-radius: 50%;\n  background: var(--dot-color, var(--cal-accent));\n  display: block;\n}\n"]], ["__scopeId", "data-v-46d32125"]]);
//#endregion
//#region src/components/controls/DualCalendar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$6 = { class: "cu-dual-calendar" };
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
		function initialMonth() {
			const base = parseDate(props.startDate) ?? /* @__PURE__ */ new Date();
			return new Date(base.getFullYear(), base.getMonth(), 1);
		}
		const firstMonth = ref(initialMonth());
		const secondMonth = ref(addMonths(firstMonth.value, 1));
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
			return openBlock(), createElementBlock("div", _hoisted_1$6, [createVNode(Calendar_default, {
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
}), [["styles", ["\n.cu-dual-calendar[data-v-8e01a709] {\n  display: flex;\n  flex-direction: row;\n  gap: var(--cu-space-md);\n}\n.cu-dual-calendar[data-v-8e01a709] .cu-calendar {\n  flex: 1;\n  min-width: 0;\n}\n"]], ["__scopeId", "data-v-8e01a709"]]);
//#endregion
//#region src/components/form/Label.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = ["for"];
var _hoisted_2$3 = {
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
			}, [props.label ? (openBlock(), createElementBlock("span", _hoisted_2$3, toDisplayString(props.label), 1)) : createCommentVNode("v-if", true), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 12, _hoisted_1$5);
		};
	}
}), [["styles", ["\n.cu-label[data-v-5a2501c1] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--cu-space-xs);\n  font-family: var(--cu-font-sans);\n}\n.cu-label-text[data-v-5a2501c1] {\n  width: fit-content;\n  cursor: pointer;\n  font-family: var(--cu-font-sans);\n}\n\n/* Clases duplicadas a propósito: le ganan a las reglas globales del\n   consumidor que fuerzan color en label/span (p. ej. el playground:\n   `.playground :is(..., span, label)` → (0,2,1)). Scoped compila a (0,3,0). */\n.cu-label.cu-label[data-v-5a2501c1],\n.cu-label-text.cu-label-text[data-v-5a2501c1] {\n  color: var(--label-fg);\n}\n"]], ["__scopeId", "data-v-5a2501c1"]]);
//#endregion
//#region src/components/form/DatePicker.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = { class: "cu-date-picker" };
var _hoisted_2$2 = { class: "cu-date-picker-label" };
var _hoisted_3$2 = { class: "cu-date-picker-panel" };
var _hoisted_4$1 = {
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
			return openBlock(), createElementBlock("div", _hoisted_1$4, [__props.label ? (openBlock(), createBlock(Label_default, {
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
				onOpen: _cache[2] || (_cache[2] = ($event) => emit("open")),
				onClose
			}, {
				toggle: withCtx(({ toggle }) => [createVNode(Button_default, {
					ref_key: "triggerRef",
					ref: triggerRef,
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					class: "cu-date-picker-toggle",
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
						createElementVNode("span", _hoisted_2$2, toDisplayString(selectedLabel.value), 1),
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
					"onClick"
				])]),
				default: withCtx(() => [createElementVNode("div", _hoisted_3$2, [!isRange.value ? (openBlock(), createBlock(Calendar_default, {
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
				])), showToday.value || __props.clearable ? (openBlock(), createElementBlock("div", _hoisted_4$1, [showToday.value ? (openBlock(), createBlock(Button_default, {
					key: 0,
					variant: "ghost",
					color: __props.color,
					class: "cu-date-picker-footer-btn",
					onClick: _cache[0] || (_cache[0] = ($event) => goToday())
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" Hoy ", -1)])]),
					_: 1
				}, 8, ["color"])) : createCommentVNode("v-if", true), __props.clearable ? (openBlock(), createBlock(Button_default, {
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
}), [["styles", ["\n.cu-date-picker[data-v-66f03622] {\n  width: 100%;\n  outline: none;\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n}\n.cu-date-picker[data-v-66f03622] .cu-dropdown {\n  width: 100%;\n}\n.cu-date-picker-toggle[data-v-66f03622] {\n  width: 100%;\n  justify-content: space-between;\n  gap: var(--cu-space-md);\n  box-sizing: border-box;\n}\n.cu-date-picker-icon[data-v-66f03622] {\n  flex-shrink: 0;\n}\n.cu-date-picker-label[data-v-66f03622] {\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  text-align: left;\n}\n.cu-date-picker-chevron[data-v-66f03622] {\n  transition: transform 200ms ease;\n  flex-shrink: 0;\n}\n.cu-date-picker-panel[data-v-66f03622] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-sm);\n}\n.cu-date-picker-footer[data-v-66f03622] {\n  display: flex;\n  justify-content: space-between;\n  gap: var(--cu-space-sm);\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n  padding-top: var(--cu-space-sm);\n}\n.cu-date-picker-footer-btn[data-v-66f03622] {\n  font-size: var(--cu-font-size-xs);\n}\n"]], ["__scopeId", "data-v-66f03622"]]);
//#endregion
//#region src/components/form/Switch.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = ["aria-checked"];
var _hoisted_2$1 = ["checked", "disabled"];
var _hoisted_3$1 = {
	key: 0,
	class: "cu-switch-label"
};
//#endregion
//#region src/components/form/Switch.vue
var Switch_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Switch",
	props: /*@__PURE__*/ mergeModels({
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		size: {
			type: String,
			required: false,
			default: "md",
			validator: isSizeSm
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
		/** Lado del track en el que se muestra la etiqueta: `end` (derecha, default) o `start` (izquierda). */
		labelPosition: {
			type: String,
			required: false,
			default: "end",
			validator: isLabelPosition
		}
	}, {
		"modelValue": {
			type: Boolean,
			default: false
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit, slots: $slots }) {
		const checked = useModel(__props, "modelValue");
		const props = __props;
		const emit = __emit;
		const { focused: inputFocus } = useFocus(useTemplateRef("input"));
		const switchStyles = computed(() => ({
			"--switch-bg": `var(--cu-color-${props.color})`,
			"--switch-hover": `var(--cu-color-${props.color}-hover)`,
			"--switch-active": `var(--cu-color-${props.color}-active)`
		}));
		const toggle = (next) => {
			if (props.disabled) return;
			const value = next ?? !checked.value;
			if (value === checked.value) return;
			checked.value = value;
			emit("change", value);
		};
		const onInput = (e) => {
			toggle(e.target.checked);
		};
		/** Devuelve el estado actual del switch. */
		const get = () => checked.value;
		/** Setea el estado del switch y emite change. */
		const set = (value) => {
			checked.value = value;
			emit("change", value);
		};
		/** Apaga el switch y emite change. */
		const reset = () => {
			checked.value = false;
			emit("change", false);
		};
		__expose({
			get,
			set,
			reset,
			/** Enfoca el input nativo. */
			focus: () => inputFocus.value = true
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass(["cu-switch", [
				`cu-switch--${props.size}`,
				`cu-switch--label-${props.labelPosition}`,
				{ "cu-switch--disabled": props.disabled }
			]]) }, [createElementVNode("span", {
				class: normalizeClass(["cu-switch-track", { "cu-switch--checked": checked.value }]),
				style: normalizeStyle(switchStyles.value),
				role: "switch",
				"aria-checked": checked.value
			}, [_cache[0] || (_cache[0] = createElementVNode("span", { class: "cu-switch-thumb" }, null, -1)), createElementVNode("input", {
				ref: "input",
				type: "checkbox",
				checked: checked.value,
				disabled: props.disabled,
				tabindex: "-1",
				class: "cu-switch-input",
				onChange: onInput
			}, null, 40, _hoisted_2$1)], 14, _hoisted_1$3), props.label || $slots.default ? (openBlock(), createElementBlock("span", _hoisted_3$1, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(props.label), 1)])])) : createCommentVNode("v-if", true)], 2);
		};
	}
}), [["styles", ["\n/* label nativo (misma implementación que Checkbox): el click en el label\n   activa el input anidado y su change alterna */\n.cu-switch {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n  vertical-align: middle;\n  cursor: pointer;\n}\n\n/* `labelPosition`: el track va primero en el DOM y el label después. Con\n   `row-reverse` el label queda a la izquierda sin cambiar el markup: el <label>\n   nativo sigue envolviendo a los dos y el click en la etiqueta alterna igual.\n   El `gap` se mantiene entre ambos y el label conserva su ancho intrínseco. */\n.cu-switch--label-end {\n  flex-direction: row;\n}\n.cu-switch--label-start {\n  flex-direction: row-reverse;\n}\n.cu-switch-track {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  border-radius: var(--cu-radius-full);\n  transition: all 150ms ease;\n  box-sizing: border-box;\n}\n.cu-switch--md .cu-switch-track {\n  width: var(--cu-space-3xl);\n  height: var(--cu-space-2xl);\n}\n.cu-switch--sm .cu-switch-track {\n  width: var(--cu-space-2xl);\n  height: var(--cu-space-xl);\n}\n.cu-switch-track.cu-switch--checked {\n  background-color: var(--switch-bg);\n}\n.cu-switch-track:not(.cu-switch--checked) {\n  background-color: var(--cu-color-neutral-soft);\n}\n\n/* Encendido: el track es sólido, así que el hover/active son las variantes sólidas\n   del color (un poco más oscuro / claro), no las `ghost` translúcidas. */\n.cu-switch-track.cu-switch--checked:hover {\n  background-color: var(--switch-hover);\n}\n.cu-switch-track.cu-switch--checked:active {\n  background-color: var(--switch-active);\n}\n.cu-switch-track:not(.cu-switch--checked):hover {\n  background-color: var(--cu-color-neutral-ghost-hover);\n}\n.cu-switch--disabled {\n  cursor: not-allowed;\n}\n.cu-switch--disabled .cu-switch-track {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  pointer-events: none;\n}\n.cu-switch--disabled .cu-switch-label {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n.cu-switch-thumb {\n  position: absolute;\n  border-radius: var(--cu-radius-full);\n  background-color: var(--cu-color-surface);\n  box-shadow: var(--cu-shadow-sm);\n  transition: all 150ms ease;\n}\n.cu-switch--md .cu-switch-thumb {\n  width: var(--cu-space-xl);\n  height: var(--cu-space-xl);\n  top: var(--cu-space-xs);\n  left: var(--cu-space-xs);\n}\n.cu-switch--sm .cu-switch-thumb {\n  width: var(--cu-space-lg);\n  height: var(--cu-space-lg);\n  top: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);\n  left: calc((var(--cu-space-xl) - var(--cu-space-lg)) / 2);\n}\n.cu-switch--md .cu-switch-track.cu-switch--checked .cu-switch-thumb {\n  transform: translateX(16px);\n}\n.cu-switch--sm .cu-switch-track.cu-switch--checked .cu-switch-thumb {\n  transform: translateX(8px);\n}\n.cu-switch-input {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.cu-switch-label {\n  font-family: var(--cu-font-sans);\n  color: var(--cu-color-neutral);\n}\n.cu-switch--md .cu-switch-label {\n  font-size: var(--cu-font-size-sm);\n}\n.cu-switch--sm .cu-switch-label {\n  font-size: var(--cu-font-size-xs);\n}\n"]]]);
//#endregion
//#region src/components/data/EditableTableCell.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = [
	"role",
	"tabindex",
	"onKeydown"
];
//#endregion
//#region src/components/data/EditableTableCell.vue
var EditableTableCell_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "EditableTableCell",
	props: {
		/** Valor actual de la celda. */
		value: {
			type: [
				String,
				Number,
				Boolean
			],
			required: true
		},
		/** Fila completa a la que pertenece la celda. */
		row: {
			type: Object,
			required: true
		},
		/** Configuración de la columna: editor, validación y alineación. */
		column: {
			type: Object,
			required: true
		},
		/** Índice de la fila en los datos. */
		index: {
			type: Number,
			required: true
		},
		/** Color semántico del editor. */
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		/** Variante visual del editor. */
		variant: {
			type: String,
			required: false,
			default: "ghost"
		},
		/** Estado de validación: success y mensaje de error. */
		validation: {
			type: Object,
			required: true,
			default: () => ({
				success: false,
				error: null
			})
		},
		/** Muestra el editor directo en toda la tabla, sin lápiz. */
		inlineEdit: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Deshabilita la edición de la celda. */
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		"edit-start",
		"edit-save",
		"edit-cancel",
		"edit-error"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const inlineEdit = computed(() => props.inlineEdit === true);
		const columnInlineEdit = computed(() => props.column.inlineEdit === true);
		const isEditing = ref(false);
		const showEditor = computed(() => props.column.inputType === "switch" ? true : props.disabled ? false : columnInlineEdit.value || inlineEdit.value || isEditing.value);
		const saving = ref(false);
		const editValue = ref("");
		const inputRef = ref(null);
		watch(() => props.value, (newVal) => {
			editValue.value = newVal != null ? String(newVal) : "";
		}, { immediate: true });
		const startEditing = async () => {
			if (props.disabled) return;
			if (showEditor.value || saving.value || !canEdit.value) return;
			isEditing.value = true;
			emit("edit-start", {
				row: props.row,
				column: props.column,
				index: props.index
			});
			await nextTick();
			inputRef.value?.focus?.();
		};
		const saveEdit = () => {
			if (saving.value) return;
			let isValid = true;
			const value = editValue.value;
			if (props.column.editable instanceof RegExp && !testRegExp(props.column.editable, value)) isValid = false;
			if (isValid && props.column.validator && !props.column.validator(value, props.row)) isValid = false;
			if (!isValid) {
				emit("edit-error", {
					row: props.row,
					column: props.column,
					value,
					index: props.index
				});
				return;
			}
			saving.value = true;
			emit("edit-save", {
				row: props.row,
				column: props.column,
				value: editValue.value,
				index: props.index
			});
			if (!inlineEdit.value) isEditing.value = false;
			nextTick(() => {
				saving.value = false;
			});
		};
		const cancelEdit = () => {
			emit("edit-cancel", {
				row: props.row,
				column: props.column,
				index: props.index
			});
			saving.value = true;
			nextTick(() => {
				saving.value = false;
			});
			if (inlineEdit.value) editValue.value = props.value != null ? String(props.value) : "";
			else isEditing.value = false;
		};
		const testRegExp = (pattern, value) => {
			pattern.lastIndex = 0;
			const matches = pattern.test(value);
			pattern.lastIndex = 0;
			return matches;
		};
		const onDateChange = (d) => {
			if (!d) return;
			editValue.value = toDateValue(d);
			saveEdit();
		};
		const switchValue = computed(() => props.value === true || props.value === "true");
		const onSwitchChange = (val) => {
			if (saving.value) return;
			saving.value = true;
			emit("edit-save", {
				row: props.row,
				column: props.column,
				value: val,
				index: props.index
			});
			nextTick(() => {
				saving.value = false;
			});
		};
		const onDateClose = () => {
			if (!inlineEdit.value && isEditing.value) isEditing.value = false;
		};
		const handleKeyDown = (event) => {
			if (event.key === "Enter" && props.column.inputType !== "textarea") saveEdit();
			else if (event.key === "Escape") cancelEdit();
		};
		const displayValue = computed(() => {
			if (props.column.inputType === "select") {
				const option = resolvedOptions.value.find((o) => o.value === props.value);
				return option ? option.label : String(props.value);
			}
			if (props.column.inputType === "autocomplete") {
				const item = resolvedAutocompleteItems.value.find((i) => (i.value || i.label) === props.value);
				return item ? item.label : String(props.value);
			}
			if (props.column.inputType === "date") return formatDateValue(String(props.value), props.column.date?.format || "dd/MM/yyyy");
			return props.value != null ? String(props.value) : "";
		});
		function toDateValue(d) {
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		}
		function formatDateValue(value, format) {
			const s = String(value ?? "").trim();
			const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
			if (!m) return s;
			const date = new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, Number(m[3] ?? 1));
			if (Number.isNaN(date.getTime())) return s;
			const pad = (n) => String(n).padStart(2, "0");
			const monthName = (long) => new Intl.DateTimeFormat("es", { month: long ? "long" : "short" }).format(date);
			const tokens = {
				yyyy: () => String(date.getFullYear()),
				yy: () => String(date.getFullYear()).slice(-2),
				MMMM: () => monthName(true),
				MMM: () => monthName(false),
				MM: () => pad(date.getMonth() + 1),
				dd: () => pad(date.getDate())
			};
			return format.replace(/yyyy|MMMM|MMM|yy|MM|dd/g, (t) => tokens[t]?.() ?? t);
		}
		const validationClass = computed(() => {
			if (!props.validation.success && props.validation.error) return "cu-editable-cell--error";
			if (props.validation.success) return "cu-editable-cell--success";
			return "";
		});
		const resolvedOptions = computed(() => {
			const col = props.column;
			const opts = col.select?.options;
			if (typeof opts === "function") return opts(props.row);
			if (opts) return opts;
			if (typeof col.selectOptions === "function") return col.selectOptions(props.row);
			return col.selectOptions || [];
		});
		const resolvedAutocompleteItems = computed(() => {
			const col = props.column;
			const items = col.autocomplete?.items;
			if (typeof items === "function") return items(props.row);
			if (items) return items;
			if (typeof col.autocompleteItems === "function") return col.autocompleteItems(props.row);
			return col.autocompleteItems || [];
		});
		function resolveProp(val, row) {
			return typeof val === "function" ? val(row) : val;
		}
		const elementColor = computed(() => {
			const col = props.column;
			if (props.validation.error) return "danger";
			const c = resolveProp(col.inputType === "select" ? col.select?.color : col.inputType === "autocomplete" ? col.autocomplete?.color : col.inputType === "textarea" ? col.textarea?.color : col.inputType === "input" ? col.input?.color : col.inputType === "date" ? col.date?.color : col.inputType === "switch" ? col.switch?.color : void 0, props.row);
			if (c) return c;
			if (col.color) return col.color;
			return props.color;
		});
		const elementVariant = computed(() => {
			const col = props.column;
			const v = resolveProp(col.inputType === "select" ? col.select?.variant : col.inputType === "autocomplete" ? col.autocomplete?.variant : col.inputType === "textarea" ? col.textarea?.variant : col.inputType === "input" ? col.input?.variant : col.inputType === "date" ? col.date?.variant : void 0, props.row);
			if (v) return v;
			if (col.variant) return col.variant;
			return props.variant;
		});
		const editorAlignStyle = computed(() => {
			const col = props.column;
			const align = col.editorAlign ?? (col.inputType === "switch" ? "center" : null) ?? col.align ?? "start";
			return { textAlign: align === "end" || align === "right" ? "end" : align === "center" ? "center" : "start" };
		});
		const canEdit = computed(() => {
			if (props.disabled) return false;
			if (typeof props.column.editable === "function") return props.column.editable(props.row);
			return true;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass(["cu-editable-cell", { "cu-editable-cell--disabled": props.disabled }]),
				style: normalizeStyle(editorAlignStyle.value),
				onClick: _cache[6] || (_cache[6] = ($event) => __props.column.singleClick !== false && canEdit.value && startEditing()),
				onDblclick: _cache[7] || (_cache[7] = ($event) => __props.column.singleClick === false && canEdit.value && startEditing())
			}, [showEditor.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [__props.column.inputType === "textarea" ? (openBlock(), createBlock(Textarea_default, {
				key: 0,
				ref_key: "inputRef",
				ref: inputRef,
				modelValue: editValue.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => editValue.value = $event),
				onBlur: saveEdit,
				onKeydown: handleKeyDown,
				"no-resize": __props.column.textarea?.noResize !== false,
				rows: __props.column.textarea?.rows ?? 3,
				disabled: props.disabled,
				class: "cu-editable-cell-input",
				color: elementColor.value,
				variant: elementVariant.value
			}, null, 8, [
				"modelValue",
				"no-resize",
				"rows",
				"disabled",
				"color",
				"variant"
			])) : __props.column.inputType === "select" ? (openBlock(), createBlock(Select_default, {
				key: 1,
				ref_key: "inputRef",
				ref: inputRef,
				"model-value": editValue.value,
				options: resolvedOptions.value,
				position: __props.column.select?.position,
				align: __props.column.select?.align,
				"placeholder-wrap": __props.column.select?.placeholderWrap,
				fixed: "",
				"onUpdate:modelValue": _cache[1] || (_cache[1] = (val) => {
					editValue.value = val;
					saveEdit();
				}),
				onSelect: _cache[2] || (_cache[2] = (opt) => {
					editValue.value = opt.value;
					saveEdit();
				}),
				onBlur: saveEdit,
				disabled: props.disabled,
				class: "cu-editable-cell-input",
				color: elementColor.value,
				variant: elementVariant.value
			}, null, 8, [
				"model-value",
				"options",
				"position",
				"align",
				"placeholder-wrap",
				"disabled",
				"color",
				"variant"
			])) : __props.column.inputType === "autocomplete" ? (openBlock(), createBlock(Autocomplete_default, {
				key: 2,
				ref_key: "inputRef",
				ref: inputRef,
				modelValue: editValue.value,
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => editValue.value = $event),
				items: resolvedAutocompleteItems.value,
				"min-chars": __props.column.autocomplete?.minChars ?? 0,
				disabled: props.disabled,
				fixed: "",
				onBlur: saveEdit,
				onSelect: _cache[4] || (_cache[4] = (item) => {
					if (item.value) editValue.value = item.value;
					saveEdit();
				}),
				class: "cu-editable-cell-input",
				color: elementColor.value,
				variant: elementVariant.value
			}, null, 8, [
				"modelValue",
				"items",
				"min-chars",
				"disabled",
				"color",
				"variant"
			])) : __props.column.inputType === "date" ? (openBlock(), createBlock(DatePicker_default, {
				key: 3,
				ref_key: "inputRef",
				ref: inputRef,
				"model-value": editValue.value,
				format: __props.column.date?.format,
				min: __props.column.date?.min,
				max: __props.column.date?.max,
				"year-navigation": __props.column.date?.yearNavigation,
				"disabled-weekdays": __props.column.date?.disabledWeekdays,
				"disabled-dates": __props.column.date?.disabledDates,
				color: elementColor.value,
				variant: elementVariant.value,
				position: __props.column.date?.position,
				align: __props.column.date?.align,
				fixed: __props.column.date?.fixed ?? true,
				disabled: props.disabled,
				onChange: onDateChange,
				onClose: onDateClose,
				class: "cu-editable-cell-input"
			}, null, 8, [
				"model-value",
				"format",
				"min",
				"max",
				"year-navigation",
				"disabled-weekdays",
				"disabled-dates",
				"color",
				"variant",
				"position",
				"align",
				"fixed",
				"disabled"
			])) : __props.column.inputType === "switch" ? (openBlock(), createBlock(Switch_default, {
				key: 4,
				"model-value": switchValue.value,
				color: elementColor.value,
				size: __props.column.switch?.size || "md",
				disabled: props.disabled,
				onChange: onSwitchChange,
				class: "cu-editable-cell-switch"
			}, null, 8, [
				"model-value",
				"color",
				"size",
				"disabled"
			])) : (openBlock(), createBlock(Input_default, {
				key: 5,
				ref_key: "inputRef",
				ref: inputRef,
				modelValue: editValue.value,
				"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => editValue.value = $event),
				type: __props.column.input?.type || "text",
				"start-value": __props.column.input?.startValue,
				disabled: props.disabled,
				onBlur: saveEdit,
				onKeydown: handleKeyDown,
				class: "cu-editable-cell-input",
				color: elementColor.value,
				variant: elementVariant.value
			}, null, 8, [
				"modelValue",
				"type",
				"start-value",
				"disabled",
				"color",
				"variant"
			]))], 64)) : (openBlock(), createElementBlock("span", {
				key: 1,
				class: normalizeClass(["cu-editable-cell-view", { "cu-editable-cell-view--disabled": !canEdit.value }]),
				role: canEdit.value ? "button" : void 0,
				tabindex: canEdit.value ? 0 : void 0,
				title: "Click to edit",
				onKeydown: [withKeys(withModifiers(startEditing, ["prevent"]), ["enter"]), withKeys(withModifiers(startEditing, ["prevent"]), ["space"])]
			}, [(openBlock(), createElementBlock("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				width: "16",
				height: "16",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				class: normalizeClass(["cu-editable-cell-icon", validationClass.value])
			}, [..._cache[8] || (_cache[8] = [createElementVNode("path", { d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }, null, -1), createElementVNode("path", { d: "m15 5 4 4" }, null, -1)])], 2)), createTextVNode(" " + toDisplayString(displayValue.value), 1)], 42, _hoisted_1$2))], 38);
		};
	}
}), [["styles", ["\n.cu-editable-cell[data-v-864bbbcb] {\n  cursor: pointer;\n}\n\n/* La celda no apila opacidad: si lo hiciera, se multiplicaría con la del campo\n   interno y quedaría más apagada que un input disabled vecino. El tono lo pone\n   una sola vez la vista (--cu-alpha-faded) o el editor que se renderice. */\n.cu-editable-cell--disabled[data-v-864bbbcb] {\n  cursor: not-allowed;\n}\n.cu-editable-cell-input[data-v-864bbbcb] {\n  width: 100%;\n}\n\n/* Sin width: el switch conserva su tamaño natural (cu-switch--md/--sm) y NO se\n   estira a la celda. El centrado/alineación lo hace text-align del contenedor\n   (editorAlignStyle). fit-content NO se usa: colapsa el track a 0px porque el\n   thumb está position:absolute (sin contenido in-flow) y el switch queda en blanco. */\n.cu-editable-cell-view[data-v-864bbbcb] {\n  display: flex;\n  align-items: flex-start;\n  gap: var(--cu-space-sm);\n  white-space: pre-line;\n}\n.cu-editable-cell-view--disabled[data-v-864bbbcb] {\n  opacity: var(--cu-alpha-faded, 0.4);\n}\n\n/* La vista es el control (role=\"button\"): el foco de teclado tiene que verse. */\n.cu-editable-cell-view[data-v-864bbbcb]:focus-visible {\n  outline: var(--cu-border-medium) solid var(--cu-border-color-focus);\n  outline-offset: 2px;\n  border-radius: var(--cu-radius-sm);\n}\n.cu-editable-cell-icon[data-v-864bbbcb] {\n  flex-shrink: 0;\n}\n.cu-editable-cell--success[data-v-864bbbcb] {\n  color: var(--cu-color-success);\n}\n.cu-editable-cell--error[data-v-864bbbcb] {\n  color: var(--cu-color-danger);\n}\n"]], ["__scopeId", "data-v-864bbbcb"]]);
//#endregion
//#region src/components/controls/DropdownMenu.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = {
	key: 0,
	class: "cu-dropdown-divider"
};
//#endregion
//#region src/components/controls/DropdownMenu.vue
var DropdownMenu_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "DropdownMenu",
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
		/** Alineación del texto de los items del panel: `left` (default), `center`, `right`. */
		textAlign: {
			type: String,
			required: false,
			default: "left",
			validator: isTextAlign
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
		items: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	emits: ["open", "close"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dropdownRef = ref(null);
		const itemStyle = computed(() => textAlignStyle(props.textAlign));
		function handleItemClick(item) {
			if (item.disabled || item.divider) return;
			if (item.onClick) item.onClick();
			dropdownRef.value?.close();
		}
		__expose({
			/** Abre el menú. */
			open: () => dropdownRef.value?.open(),
			/** Cierra el menú. */
			close: () => dropdownRef.value?.close(),
			/** Alterna la visibilidad del menú. */
			toggle: () => dropdownRef.value?.toggle(),
			/** Devuelve true si el menú está abierto. */
			isOpen: () => dropdownRef.value?.isOpen() ?? false
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Dropdown_default, {
				ref_key: "dropdownRef",
				ref: dropdownRef,
				color: __props.color,
				variant: __props.variant,
				disabled: __props.disabled,
				label: __props.label,
				position: __props.position,
				align: __props.align,
				offset: __props.offset,
				fixed: __props.fixed,
				onOpen: _cache[0] || (_cache[0] = ($event) => emit("open")),
				onClose: _cache[1] || (_cache[1] = ($event) => emit("close"))
			}, {
				toggle: withCtx(({ toggle, isOpen }) => [createCommentVNode(" Contenido del trigger; scoped: { toggle, isOpen }. "), renderSlot(_ctx.$slots, "toggle", {
					toggle,
					isOpen
				}, () => [createVNode(Button_default, {
					color: __props.color,
					variant: __props.variant,
					disabled: __props.disabled,
					class: "cu-dropdown-toggle",
					onClick: toggle
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.label || "Menú") + " ", 1), (openBlock(), createElementBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						width: "16",
						height: "16",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						class: normalizeClass(["cu-dropdown-chevron", { "cu-dropdown-chevron--open": isOpen }])
					}, [..._cache[2] || (_cache[2] = [createElementVNode("path", { d: "m18 15-6-6-6 6" }, null, -1)])], 2))]),
					_: 2
				}, 1032, [
					"color",
					"variant",
					"disabled",
					"onClick"
				])], true)]),
				default: withCtx(() => [__props.items && __props.items.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(__props.items, (item, i) => {
					return openBlock(), createElementBlock(Fragment, { key: i }, [item.divider ? (openBlock(), createElementBlock("hr", _hoisted_1$1)) : (openBlock(), createBlock(MenuOption_default, {
						key: 1,
						label: item.label,
						icon: item.icon,
						"icon-class": "cu-dropdown-icon",
						color: item.color || __props.color,
						variant: item.variant || "ghost",
						href: item.href,
						target: item.target,
						disabled: item.disabled,
						selected: !!item.selected,
						class: "cu-dropdown-item",
						style: normalizeStyle(itemStyle.value),
						onClick: ($event) => handleItemClick(item)
					}, null, 8, [
						"label",
						"icon",
						"color",
						"variant",
						"href",
						"target",
						"disabled",
						"selected",
						"style",
						"onClick"
					]))], 64);
				}), 128)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createCommentVNode(" Contenido del panel. "), renderSlot(_ctx.$slots, "default", {}, void 0, true)], 2112))]),
				_: 3
			}, 8, [
				"color",
				"variant",
				"disabled",
				"label",
				"position",
				"align",
				"offset",
				"fixed"
			]);
		};
	}
}), [["styles", ["\n.cu-dropdown-toggle[data-v-3947e211] {\n  gap: var(--cu-space-md);\n}\n.cu-dropdown-divider[data-v-3947e211] {\n  margin: var(--cu-space-xs) auto;\n  width: 90%;\n  border: 0;\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n.cu-dropdown-item[data-v-3947e211] {\n  width: 100%;\n  /* La alineación del contenido la pone `textAlign` inline (`justify-content`): un\n     `text-align` solo no mueve nada dentro de un `Button` flex. Default: `flex-start`. */\n}\n.cu-dropdown-icon[data-v-3947e211] {\n  transform: translateY(2px);\n  opacity: 0.6;\n}\n.cu-dropdown-chevron[data-v-3947e211] {\n  transition: transform 200ms ease;\n}\n.cu-dropdown-chevron--open[data-v-3947e211] {\n  transform: rotate(90deg);\n}\n"]], ["__scopeId", "data-v-3947e211"]]);
//#endregion
//#region src/composables/usePagination.ts
function usePagination(data, options = {}) {
	const currentPage = ref(options.initialPage || 1);
	const itemsPerPage = ref(options.initialItemsPerPage || 10);
	const filteredData = computed(() => unref(data));
	const displayData = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage.value;
		const end = start + itemsPerPage.value;
		return filteredData.value.slice(start, end);
	});
	const totalItems = computed(() => filteredData.value.length);
	const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
	const showPaginationControl = computed(() => totalPages.value > 1);
	const setCurrentPage = (page) => {
		if (page >= 1 && page <= totalPages.value) currentPage.value = page;
	};
	const setItemsPerPage = (size) => {
		itemsPerPage.value = size;
		currentPage.value = 1;
	};
	const nextPage = () => {
		if (currentPage.value < totalPages.value) currentPage.value++;
	};
	const prevPage = () => {
		if (currentPage.value > 1) currentPage.value--;
	};
	watch([data, itemsPerPage], () => {
		if (currentPage.value > totalPages.value) currentPage.value = 1;
	});
	return {
		currentPage,
		itemsPerPage,
		displayData,
		totalItems,
		totalPages,
		showPaginationControl,
		setCurrentPage,
		setItemsPerPage,
		nextPage,
		prevPage
	};
}
//#endregion
//#region src/composables/useTableData.ts
function useTableData(propsData) {
	const data = ref([...propsData.value]);
	watch(propsData, (newData) => {
		data.value = [...newData];
	}, {
		deep: true,
		immediate: true
	});
	const updateRow = (index, newData) => {
		if (index >= 0 && index < data.value.length && data.value[index]) Object.assign(data.value[index], newData);
	};
	const getData = (filterFn) => {
		let result = data.value.map((item) => JSON.parse(JSON.stringify(item)));
		if (filterFn) result = result.filter(filterFn);
		return result;
	};
	const getRow = (index) => {
		if (index >= 0 && index < data.value.length) return JSON.parse(JSON.stringify(data.value[index]));
	};
	const removeRow = (index) => {
		if (index >= 0 && index < data.value.length) {
			data.value.splice(index, 1);
			return true;
		}
		return false;
	};
	const addRow = (newItem) => {
		if (data.value.length === 0) {
			data.value.push(JSON.parse(JSON.stringify(newItem)));
			return true;
		}
		const firstRowKeys = Object.keys(data.value[0] || {});
		const newItemKeys = Object.keys(newItem || {});
		if (firstRowKeys.every((key) => newItemKeys.includes(key))) {
			data.value.push(JSON.parse(JSON.stringify(newItem)));
			return true;
		}
		return false;
	};
	const pushData = (items) => {
		if (data.value.length === 0) {
			data.value.push(...items.map((item) => JSON.parse(JSON.stringify(item))));
			return true;
		}
		const firstRowKeys = Object.keys(data.value[0] || {});
		if (items.every((item) => firstRowKeys.every((key) => Object.keys(item || {}).includes(key)))) {
			data.value.push(...items.map((item) => JSON.parse(JSON.stringify(item))));
			return true;
		}
		return false;
	};
	return {
		data,
		updateRow,
		getData,
		getRow,
		removeRow,
		addRow,
		pushData
	};
}
//#endregion
//#region src/components/data/AdvancedTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	key: 0,
	class: "cu-advanced-table-search"
};
var _hoisted_2 = { class: "cu-table-th-content" };
var _hoisted_3 = {
	key: 0,
	width: "16",
	height: "16",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
var _hoisted_4 = {
	key: 1,
	width: "16",
	height: "16",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
var _hoisted_5 = {
	key: 2,
	width: "16",
	height: "16",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
var _hoisted_6 = {
	key: 0,
	class: "cu-advanced-table-cell-buttons"
};
var _hoisted_7 = ["innerHTML"];
var _hoisted_8 = { key: 2 };
var _hoisted_9 = {
	key: 1,
	class: "cu-advanced-table-cell-badges"
};
var _hoisted_10 = {
	key: 0,
	class: "cu-advanced-table-cell-lines"
};
var _hoisted_11 = { key: 1 };
var _hoisted_12 = {
	key: 4,
	class: "cu-advanced-table-actions"
};
var _hoisted_13 = { key: 5 };
var _hoisted_14 = {
	key: 1,
	class: "cu-advanced-table-pagination"
};
/** Tamaño de página que se usa cuando `itemsPerPage` no es un entero ≥ 1. */
var DEFAULT_ITEMS_PER_PAGE = 10;
//#endregion
//#region src/components/data/AdvancedTable.vue
var AdvancedTable_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "AdvancedTable",
	props: {
		columns: {
			type: Array,
			required: false,
			default: () => []
		},
		data: {
			type: Array,
			required: false,
			default: () => []
		},
		empty: {
			type: String,
			required: false,
			default: "No hay datos que mostrar"
		},
		pagination: {
			type: Boolean,
			required: false,
			default: true
		},
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		showPageSize: {
			type: Boolean,
			required: false,
			default: false
		},
		pageSizeOptions: {
			type: Array,
			required: false,
			default: () => [
				5,
				10,
				20,
				50
			]
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
			validator: isVariant
		},
		searchEnabled: {
			type: Boolean,
			required: false,
			default: false
		},
		searchPlaceholder: {
			type: String,
			required: false,
			default: "Buscar..."
		},
		searchFields: {
			type: Array,
			required: false,
			default: () => []
		},
		searchValue: {
			type: String,
			required: false,
			default: ""
		},
		tableMaxHeight: {
			type: String,
			required: false,
			default: ""
		},
		filters: {
			type: Object,
			required: false,
			default: () => ({})
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		actions: {
			type: [Array, Function],
			required: false,
			default: () => []
		},
		actionsLabel: {
			type: String,
			required: false,
			default: ""
		},
		inlineEditing: {
			type: Boolean,
			required: false,
			default: false
		},
		rowDisabled: {
			type: [Boolean, Function],
			required: false,
			default: false
		},
		footer: {
			type: Array,
			required: false,
			default: () => []
		},
		compact: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	emits: [
		"update:currentPage",
		"update:itemsPerPage",
		"update:search",
		"edit-start",
		"edit-save",
		"edit-cancel",
		"edit-error"
	],
	setup(__props, { expose: __expose, emit: __emit, slots: $slots }) {
		const validationStates = ref({});
		const hasBadges = (col) => !!col.badges;
		const hasButtons = (col) => !!col.buttons;
		const hasVisibleButtons = (col, row) => hasButtons(col) && getCellButtons(col, row).length > 0;
		const hasCellFunction = (col) => typeof col.cell === "function";
		const isButtonDisabled = (button, row) => {
			const value = button.disabled;
			return typeof value === "function" ? value(row) : !!value;
		};
		const isButtonHidden = (button, row) => typeof button.hidden === "function" ? button.hidden(row) : false;
		const getCellValue = (col, row) => {
			if (hasCellFunction(col)) return col.cell(row);
			return row[col.key];
		};
		const getCellLines = (col, row) => {
			const value = getCellValue(col, row);
			if (!Array.isArray(value)) return null;
			return value.map((line) => line == null ? "" : String(line));
		};
		const getCellBadges = (col, row) => {
			return col.badges ? col.badges(row) : [];
		};
		const getCellButtons = (col, row) => {
			return (col.buttons ? col.buttons(row) : []).filter((button) => !isButtonHidden(button, row));
		};
		const isRowDisabled = (row) => {
			const rd = props.rowDisabled;
			return typeof rd === "function" ? rd(row) : !!rd;
		};
		const isCellDisabled = (col, row) => {
			if (isRowDisabled(row)) return true;
			if (typeof col.disabled === "function" ? col.disabled(row) : !!col.disabled) return true;
			if (typeof col.cellDisabled === "function" && col.cellDisabled(row)) return true;
			return false;
		};
		const hasActions = computed(() => typeof props.actions === "function" || Array.isArray(props.actions) && props.actions.length > 0);
		const getRowActions = (row) => {
			const actions = typeof props.actions === "function" ? props.actions(row) : props.actions;
			return Array.isArray(actions) ? actions : [];
		};
		const getRowDropdownItems = (row) => {
			const items = getRowActions(row).filter((action) => !isButtonHidden(action, row)).map((action) => ({
				...action,
				disabled: isRowDisabled(row) || isButtonDisabled(action, row),
				color: action.color || void 0,
				onClick: () => {
					if (!isRowDisabled(row)) action.onClick?.(row);
				}
			}));
			return items.filter((item, i) => !item.divider || i > 0 && i < items.length - 1 && !items[i - 1]?.divider);
		};
		const hasVisibleRowActions = (row) => getRowActions(row).some((action) => !action.divider && !isButtonHidden(action, row));
		const normalizeItemsPerPage = (value) => {
			const size = Number(value);
			return Number.isFinite(size) && size >= 1 ? Math.floor(size) : DEFAULT_ITEMS_PER_PAGE;
		};
		const props = __props;
		const emit = __emit;
		const searchQuery = ref("");
		const { data: localData, updateRow, getData, getRow, removeRow, addRow, pushData } = useTableData(toRef(() => props.data));
		const { filteredData: searchedData } = useSearch(localData, {
			searchQuery,
			searchFields: computed(() => {
				const raw = props.searchFields;
				if (Array.isArray(raw)) return raw;
				if (typeof raw === "string") try {
					return JSON.parse(raw);
				} catch {
					return [];
				}
				return [];
			}),
			columns: computed(() => props.columns)
		});
		const filteredData = computed(() => {
			const data = searchedData.value;
			const filters = props.filters;
			if (!filters || Object.keys(filters).length === 0) return data;
			return data.filter((row) => Object.entries(filters).every(([key, filter]) => {
				const val = row[key];
				if (typeof filter === "function") return filter(val, row);
				if (Array.isArray(filter)) return filter.includes(val);
				return val === filter;
			}));
		});
		const sortBy = ref("");
		const sortDir = ref("");
		function handleSort(key) {
			if (sortBy.value !== key) {
				sortBy.value = key;
				sortDir.value = "asc";
			} else if (sortDir.value === "asc") sortDir.value = "desc";
			else {
				sortBy.value = "";
				sortDir.value = "";
			}
		}
		function detectSortType(col) {
			if (col.sortable === "string" || col.sortable === "number" || col.sortable === "boolean") return col.sortable;
			const first = filteredData.value[0];
			if (first) {
				const val = first[col.key];
				if (typeof val === "number") return "number";
				if (typeof val === "boolean") return "boolean";
			}
			return "string";
		}
		const sortedData = computed(() => {
			const data = filteredData.value;
			if (!sortBy.value || !sortDir.value) return data;
			const col = props.columns.find((c) => c.key === sortBy.value);
			if (!col?.sortable) return data;
			const type = detectSortType(col);
			return [...data].sort((a, b) => {
				const va = a[sortBy.value];
				const vb = b[sortBy.value];
				let cmp = 0;
				if (type === "number") cmp = (Number(va) || 0) - (Number(vb) || 0);
				else if (type === "boolean") cmp = va === vb ? 0 : va ? -1 : 1;
				else cmp = String(va ?? "").localeCompare(String(vb ?? ""), "es");
				return sortDir.value === "desc" ? -cmp : cmp;
			});
		});
		watch([sortBy, sortDir], () => pagination.setCurrentPage(1));
		const pagination = usePagination(sortedData, {
			initialPage: 1,
			initialItemsPerPage: normalizeItemsPerPage(props.itemsPerPage),
			showPageSize: props.showPageSize,
			pageSizeOptions: props.pageSizeOptions
		});
		watch(() => props.itemsPerPage, (newVal) => {
			const size = normalizeItemsPerPage(newVal);
			if (size !== pagination.itemsPerPage.value) pagination.setItemsPerPage(size);
		});
		watch(() => props.searchValue, (newVal) => {
			searchQuery.value = newVal;
		}, { immediate: true });
		watch(searchQuery, (newVal) => {
			emit("update:search", newVal);
			pagination.setCurrentPage(1);
		});
		const handleSearchUpdate = (value) => {
			searchQuery.value = value;
		};
		const handlePageChange = (page) => {
			pagination.setCurrentPage(page);
			emit("update:currentPage", page);
		};
		const handlePageSizeChange = (size) => {
			const normalized = normalizeItemsPerPage(size);
			pagination.setItemsPerPage(normalized);
			emit("update:itemsPerPage", normalized);
		};
		const renderedData = computed(() => props.pagination ? pagination.displayData.value : sortedData.value);
		const getOriginalIndex = (displayIndex) => localData.value.findIndex((row) => row === renderedData.value[displayIndex]);
		const getCellKey = (rowIndex, colKey) => `${getOriginalIndex(rowIndex)}-${colKey}`;
		const augmentedColumns = computed(() => hasActions.value ? [...props.columns, {
			key: "__actions__",
			label: props.actionsLabel,
			width: "1%",
			align: "center",
			sortable: false
		}] : props.columns);
		const headerAttrs = computed(() => {
			const attrs = {};
			for (const col of props.columns) {
				if (!col.sortable) continue;
				attrs[col.key] = { "aria-sort": sortBy.value === col.key && sortDir.value ? sortDir.value === "asc" ? "ascending" : "descending" : "none" };
			}
			return attrs;
		});
		const tableProps = computed(() => ({
			columns: augmentedColumns.value,
			data: renderedData.value,
			empty: props.empty,
			color: props.color,
			variant: props.variant,
			loading: props.loading,
			rowDisabled: props.rowDisabled,
			footer: props.footer,
			compact: props.compact,
			maxHeight: props.tableMaxHeight,
			headerAttrs: headerAttrs.value
		}));
		const tableStyles = computed(() => ({
			"--table-bg": `var(--cu-color-${props.color}-soft)`,
			"--table-fg": `var(--cu-color-${props.color}-text)`,
			"--table-bg-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--table-bd": `var(--cu-color-${props.color}-subtle-border)`
		}));
		const inputVariant = computed(() => props.variant === "solid" ? "soft" : props.variant);
		const paginationVariant = computed(() => props.variant === "solid" ? "soft" : props.variant);
		__expose({
			/** Actualiza una fila por índice con los campos indicados. */
			updateRow,
			/** Devuelve una copia de las filas actuales, opcionalmente filtradas. */
			getData,
			/** Devuelve una copia de la fila en el índice indicado. */
			getRow,
			/** Elimina la fila en el índice indicado. */
			removeRow,
			/** Agrega una fila al final si respeta las columnas existentes. */
			addRow,
			/** Agrega varias filas al final si respetan las columnas existentes. */
			pushData
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: "cu-advanced-table",
				style: normalizeStyle(tableStyles.value)
			}, [
				props.searchEnabled ? (openBlock(), createElementBlock("div", _hoisted_1, [renderSlot(_ctx.$slots, "search", {
					query: searchQuery.value,
					update: handleSearchUpdate
				}, () => [createVNode(Input_default, {
					placeholder: props.searchPlaceholder,
					"model-value": searchQuery.value,
					"onUpdate:modelValue": handleSearchUpdate,
					color: props.color,
					variant: inputVariant.value
				}, null, 8, [
					"placeholder",
					"model-value",
					"color",
					"variant"
				])], true)])) : createCommentVNode("v-if", true),
				createVNode(Table_default, normalizeProps(guardReactiveProps(tableProps.value)), createSlots({ _: 2 }, [
					renderList($slots, (_, slotName) => {
						return {
							name: slotName,
							fn: withCtx((slotProps) => [renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(slotProps)), void 0, true)])
						};
					}),
					renderList(augmentedColumns.value, (col) => {
						return {
							name: `header-${col.key}`,
							fn: withCtx(({ column, color, variant }) => [renderSlot(_ctx.$slots, `header-${col.key}`, normalizeProps(guardReactiveProps({
								column,
								color,
								variant
							})), () => [createElementVNode("span", _hoisted_2, [column.sortable ? (openBlock(), createBlock(Button_default, {
								key: 0,
								color: props.color,
								style: normalizeStyle(props.variant === "solid" ? { "--btn-text": "var(--cu-color-surface)" } : {}),
								variant: "ghost",
								"aria-label": `Ordenar por ${column.label ?? column.key}`,
								onClick: withModifiers(($event) => handleSort(column.key), ["stop"])
							}, {
								default: withCtx(() => [sortBy.value === column.key && sortDir.value === "asc" ? (openBlock(), createElementBlock("svg", _hoisted_3, [..._cache[1] || (_cache[1] = [createElementVNode("path", { d: "M8 6L12 2L16 6" }, null, -1), createElementVNode("path", { d: "M12 2V22" }, null, -1)])])) : sortBy.value === column.key && sortDir.value === "desc" ? (openBlock(), createElementBlock("svg", _hoisted_4, [..._cache[2] || (_cache[2] = [createElementVNode("path", { d: "M8 18L12 22L16 18" }, null, -1), createElementVNode("path", { d: "M12 2V22" }, null, -1)])])) : (openBlock(), createElementBlock("svg", _hoisted_5, [..._cache[3] || (_cache[3] = [
									createElementVNode("path", { d: "M12 2v20" }, null, -1),
									createElementVNode("path", { d: "m8 18 4 4 4-4" }, null, -1),
									createElementVNode("path", { d: "m8 6 4-4 4 4" }, null, -1)
								])]))]),
								_: 2
							}, 1032, [
								"color",
								"style",
								"aria-label",
								"onClick"
							])) : createCommentVNode("v-if", true), createTextVNode(" " + toDisplayString(column.label ?? column.key), 1)])], true)])
						};
					}),
					renderList(augmentedColumns.value, (col) => {
						return {
							name: `cell-${col.key}`,
							fn: withCtx(({ row, value, index }) => [hasVisibleButtons(col, row) ? (openBlock(), createElementBlock("div", _hoisted_6, [(openBlock(true), createElementBlock(Fragment, null, renderList(getCellButtons(col, row), (button, buttonIndex) => {
								return openBlock(), createBlock(Button_default, {
									key: `button-${index}-${col.key}-${buttonIndex}`,
									color: button.color || props.color,
									variant: button.variant || props.variant,
									to: button.to,
									target: button.target,
									disabled: isCellDisabled(col, row) || isButtonDisabled(button, row),
									onClick: (e) => {
										if (button.onClick && !isCellDisabled(col, row) && !isButtonDisabled(button, row)) {
											e.stopPropagation();
											button.onClick(row);
										}
									}
								}, {
									default: withCtx(() => [typeof button.icon === "object" ? (openBlock(), createBlock(resolveDynamicComponent(button.icon), {
										key: 0,
										class: "cu-advanced-table-icon"
									})) : button.icon ? (openBlock(), createElementBlock("span", {
										key: 1,
										innerHTML: button.icon,
										class: "cu-advanced-table-icon"
									}, null, 8, _hoisted_7)) : createCommentVNode("v-if", true), button.label ? (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(button.label), 1)) : createCommentVNode("v-if", true)]),
									_: 2
								}, 1032, [
									"color",
									"variant",
									"to",
									"target",
									"disabled",
									"onClick"
								]);
							}), 128))])) : hasBadges(col) ? (openBlock(), createElementBlock("div", _hoisted_9, [(openBlock(true), createElementBlock(Fragment, null, renderList(getCellBadges(col, row), (badge, badgeIndex) => {
								return openBlock(), createBlock(Badge_default, {
									key: `badge-${index}-${col.key}-${badgeIndex}`,
									color: badge.color || props.color,
									variant: badge.variant || props.variant
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(badge.value), 1)]),
									_: 2
								}, 1032, ["color", "variant"]);
							}), 128))])) : col.editable ? (openBlock(), createBlock(EditableTableCell_default, {
								key: 2,
								value,
								row,
								column: col,
								"inline-edit": __props.inlineEditing,
								disabled: isCellDisabled(col, row),
								index,
								color: props.color,
								variant: inputVariant.value,
								validation: validationStates.value[getCellKey(index, col.key)] || {
									success: false,
									error: null
								},
								onEditStart: (e) => {
									const displayIndex = e.index;
									const originalIndex = getOriginalIndex(displayIndex);
									const cellKey = getCellKey(displayIndex, e.column.key);
									validationStates.value[cellKey] = {
										success: false,
										error: null
									};
									emit("edit-start", {
										...e,
										index: originalIndex
									});
								},
								onEditSave: (e) => {
									const displayIndex = e.index;
									const originalIndex = getOriginalIndex(displayIndex);
									const cellKey = getCellKey(displayIndex, e.column.key);
									validationStates.value[cellKey] = {
										success: true,
										error: null
									};
									unref(updateRow)(originalIndex, { [e.column.key]: e.value });
									emit("edit-save", {
										...e,
										index: originalIndex
									});
								},
								onEditCancel: (e) => {
									const displayIndex = e.index;
									const originalIndex = getOriginalIndex(displayIndex);
									const cellKey = getCellKey(displayIndex, e.column.key);
									validationStates.value[cellKey] = {
										success: false,
										error: null
									};
									emit("edit-cancel", {
										...e,
										index: originalIndex
									});
								},
								onEditError: (e) => {
									const displayIndex = e.index;
									const originalIndex = getOriginalIndex(displayIndex);
									const cellKey = getCellKey(displayIndex, e.column.key);
									validationStates.value[cellKey] = {
										success: false,
										error: "Formato inválido"
									};
									emit("edit-error", {
										...e,
										index: originalIndex
									});
								}
							}, null, 8, [
								"value",
								"row",
								"column",
								"inline-edit",
								"disabled",
								"index",
								"color",
								"variant",
								"validation",
								"onEditStart",
								"onEditSave",
								"onEditCancel",
								"onEditError"
							])) : hasCellFunction(col) ? (openBlock(), createElementBlock(Fragment, { key: 3 }, [createCommentVNode(" `cell` custom: array de strings = una línea por elemento; string = un nodo. "), getCellLines(col, row)?.length ? (openBlock(), createElementBlock("div", _hoisted_10, [(openBlock(true), createElementBlock(Fragment, null, renderList(getCellLines(col, row), (line, lineIndex) => {
								return openBlock(), createElementBlock("span", { key: `cell-${index}-${col.key}-${lineIndex}` }, toDisplayString(line), 1);
							}), 128))])) : getCellLines(col, row) === null ? (openBlock(), createElementBlock("span", _hoisted_11, toDisplayString(getCellValue(col, row)), 1)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [createCommentVNode(" Array vacío: celda vacía. Sin este nodo el slot quedaría vacío y el\n               `Table` caería a su fallback (el valor crudo de la fila). "), _cache[4] || (_cache[4] = createElementVNode("span", null, null, -1))], 2112))], 64)) : col.key === "__actions__" && hasVisibleRowActions(row) ? (openBlock(), createElementBlock("div", _hoisted_12, [createVNode(DropdownMenu_default, {
								color: props.color,
								variant: "ghost",
								position: "bottom",
								align: "end",
								fixed: "",
								items: getRowDropdownItems(row),
								onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
							}, {
								toggle: withCtx(({ toggle }) => [createVNode(Button_default, {
									color: "neutral",
									variant: "ghost",
									disabled: isRowDisabled(row),
									"aria-label": "Acciones de la fila",
									onClick: toggle,
									class: "cu-advanced-table-actions-btn"
								}, {
									default: withCtx(() => [..._cache[5] || (_cache[5] = [createElementVNode("svg", {
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "currentColor"
									}, [
										createElementVNode("circle", {
											cx: "12",
											cy: "5",
											r: "1.5"
										}),
										createElementVNode("circle", {
											cx: "12",
											cy: "12",
											r: "1.5"
										}),
										createElementVNode("circle", {
											cx: "12",
											cy: "19",
											r: "1.5"
										})
									], -1)])]),
									_: 1
								}, 8, ["disabled", "onClick"])]),
								_: 2
							}, 1032, ["color", "items"])])) : (openBlock(), createElementBlock("span", _hoisted_13, toDisplayString(value), 1))])
						};
					})
				]), 1040),
				props.pagination && (unref(pagination).showPaginationControl.value || props.showPageSize) ? (openBlock(), createElementBlock("div", _hoisted_14, [createVNode(Pagination_default, {
					color: props.color,
					variant: paginationVariant.value,
					"current-page": unref(pagination).currentPage.value,
					"total-pages": unref(pagination).totalPages.value,
					"total-items": unref(pagination).totalItems.value,
					"items-per-page": unref(pagination).itemsPerPage.value,
					"show-page-size": props.showPageSize,
					"page-size-options": props.pageSizeOptions,
					"onUpdate:currentPage": handlePageChange,
					"onUpdate:itemsPerPage": handlePageSizeChange
				}, null, 8, [
					"color",
					"variant",
					"current-page",
					"total-pages",
					"total-items",
					"items-per-page",
					"show-page-size",
					"page-size-options"
				])])) : createCommentVNode("v-if", true)
			], 4);
		};
	}
}), [["styles", ["\n.cu-advanced-table[data-v-c892b555] {\n  display: flex;\n  flex-direction: column;\n  max-width: 100%;\n}\n.cu-advanced-table-search[data-v-c892b555] {\n  padding: var(--cu-space-md);\n}\n.cu-advanced-table-cell-buttons[data-v-c892b555] {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-advanced-table-cell-badges[data-v-c892b555] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: var(--cu-space-sm);\n}\n\n/* `cell` que devuelve string[]: una línea por elemento. */\n.cu-advanced-table-cell-lines[data-v-c892b555] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  white-space: pre-line;\n}\n.cu-advanced-table-icon[data-v-c892b555] {\n  transform: translateY(2px);\n}\n.cu-advanced-table-actions[data-v-c892b555] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.cu-advanced-table-actions-btn[data-v-c892b555] {\n  padding: var(--cu-space-2xs) var(--cu-space-sm);\n  min-width: 0;\n  height: var(--cu-space-2xl);\n  box-sizing: border-box;\n}\n.cu-advanced-table-pagination[data-v-c892b555] {\n  margin-top: var(--cu-space-lg);\n}\n"]], ["__scopeId", "data-v-c892b555"]]);
//#endregion
//#region src/lib/data/table.ts
var CuTable = defineComegenElement("cu-table", /* @__PURE__ */ defineComponent({
	__name: "AdvancedTable.ce",
	props: {
		/** Definición de columnas (ver «Interfaz de columna»). Se asigna como propiedad JS */
		columns: {
			type: Array,
			required: false,
			default: () => []
		},
		/** Filas de la tabla. Se asigna como propiedad JS */
		data: {
			type: Array,
			required: false,
			default: () => []
		},
		/** Texto a mostrar cuando no hay datos */
		empty: {
			type: String,
			required: false,
			default: "No hay datos que mostrar"
		},
		/** Habilita paginación interna */
		pagination: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Tamaño de página (atributo HTML: `items-per-page`) */
		itemsPerPage: {
			type: Number,
			required: false,
			default: 10
		},
		/** Muestra selector de items por página (atributo HTML: `show-page-size`) */
		showPageSize: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Opciones del selector (atributo HTML: `page-size-options`). Se asigna como propiedad JS */
		pageSizeOptions: {
			type: Array,
			required: false,
			default: () => [
				5,
				10,
				20,
				50
			]
		},
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
			default: "soft"
		},
		/** Habilita barra de búsqueda (atributo HTML: `search-enabled`) */
		searchEnabled: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Placeholder del input de búsqueda (atributo HTML: `search-placeholder`) */
		searchPlaceholder: {
			type: String,
			required: false,
			default: "Buscar..."
		},
		/** Columnas donde buscar (atributo HTML: `search-fields`). Vacío = todas */
		searchFields: {
			type: Array,
			required: false,
			default: () => []
		},
		/** Valor controlado del buscador (atributo HTML: `search-value`) */
		searchValue: {
			type: String,
			required: false,
			default: ""
		},
		/** Filtros por columna. Se asigna como propiedad JS */
		filters: {
			type: Object,
			required: false,
			default: () => ({})
		},
		/** Muestra una barra de carga animada en el tope */
		loading: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Acciones de fila (botón "..." al final de cada fila). Array estático o función `(row) => acciones` para decidirlas por fila. Se asigna como propiedad JS */
		actions: {
			type: [Array, Function],
			required: false,
			default: () => []
		},
		/** Texto del header de la columna de acciones. Default vacío. Atributo HTML: `actions-label` */
		actionsLabel: {
			type: String,
			required: false,
			default: ""
		},
		/** Deshabilita filas (ver «Deshabilitar filas, columnas y celdas»). Se asigna como propiedad JS */
		rowDisabled: {
			type: [Boolean, Function],
			required: false,
			default: false
		},
		/** Filas de footer (ver «Footer (API programática)»). Se asigna como propiedad JS */
		footer: {
			type: Array,
			required: false,
			default: () => []
		},
		/** Alto máximo del área scrolleable (CSS, ej. `40rem`). Atributo HTML: `table-max-height` */
		tableMaxHeight: {
			type: String,
			required: false,
			default: ""
		},
		/** Editor visible siempre en las celdas editables, sin el lápiz (atributo HTML: `inline-editing`) */
		inlineEditing: {
			type: Boolean,
			required: false,
			default: false
		},
		/** Filas más compactas */
		compact: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props, { expose: __expose }) {
		const instance = getCurrentInstance();
		/**
		* En un custom element con shadow DOM, Vue **no** expone el light DOM como
		* `$slots`: para que los `<x slot="…">` del host se proyecten hay que renderizar
		* un outlet `<slot name="…">` real (Vue lo emite así cuando `instance.ce` está
		* seteado). Como los nombres son dinámicos (`header-{key}`, `cell-{key}`), los
		* descubrimos del host. Cuando el wrapper se monta como componente Vue (tests,
		* uso interno), no hay `instance.ce` y alcanza con `$slots`.
		*/
		const vueSlots = useSlots();
		const hostSlotNames = ref([]);
		let slotObserver = null;
		const getHostEl = () => instance?.ce ?? null;
		function collectHostSlots() {
			const el = getHostEl();
			if (!el) return;
			const names = /* @__PURE__ */ new Set();
			el.childNodes.forEach((node) => {
				if (node.nodeType === 1) names.add(node.getAttribute("slot") || "default");
			});
			hostSlotNames.value = [...names];
		}
		onMounted(() => {
			collectHostSlots();
			const el = getHostEl();
			if (el && typeof MutationObserver !== "undefined") {
				slotObserver = new MutationObserver(collectHostSlots);
				slotObserver.observe(el, { childList: true });
			}
		});
		onBeforeUnmount(() => slotObserver?.disconnect());
		const forwardedSlots = computed(() => {
			const names = new Set(Object.keys(vueSlots));
			for (const name of hostSlotNames.value) names.add(name);
			return [...names];
		});
		const isVueSlot = (name) => name in vueSlots;
		function ceEmit(event, payload) {
			const el = instance?.vnode.el;
			const root = el?.getRootNode();
			const host = root && "host" in root ? root.host : el;
			if (host) host.dispatchEvent(new CustomEvent(event, {
				detail: payload,
				bubbles: true,
				composed: true
			}));
		}
		const props = __props;
		const tableRef = ref(null);
		__expose({
			updateRow: (rowIndex, newData) => tableRef.value?.updateRow(rowIndex, newData),
			getData: (filterFn) => tableRef.value?.getData(filterFn),
			getRow: (rowIndex) => tableRef.value?.getRow(rowIndex),
			removeRow: (rowIndex) => tableRef.value?.removeRow(rowIndex),
			addRow: (newRow) => tableRef.value?.addRow(newRow),
			pushData: (newData) => tableRef.value?.pushData(newData)
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(AdvancedTable_default, {
				ref_key: "tableRef",
				ref: tableRef,
				columns: props.columns,
				data: props.data,
				empty: props.empty,
				pagination: props.pagination,
				"items-per-page": props.itemsPerPage,
				"show-page-size": props.showPageSize,
				"page-size-options": props.pageSizeOptions,
				color: props.color,
				variant: props.variant,
				"search-enabled": props.searchEnabled,
				"search-placeholder": props.searchPlaceholder,
				"search-fields": props.searchFields,
				"search-value": props.searchValue,
				filters: props.filters,
				loading: props.loading,
				actions: props.actions,
				"actions-label": props.actionsLabel,
				"row-disabled": props.rowDisabled,
				footer: props.footer,
				"table-max-height": props.tableMaxHeight,
				"inline-editing": props.inlineEditing,
				compact: props.compact,
				"onUpdate:currentPage": _cache[0] || (_cache[0] = ($event) => ceEmit("update:currentPage", $event)),
				"onUpdate:itemsPerPage": _cache[1] || (_cache[1] = ($event) => ceEmit("update:itemsPerPage", $event)),
				"onUpdate:search": _cache[2] || (_cache[2] = ($event) => ceEmit("update:search", $event)),
				onEditStart: _cache[3] || (_cache[3] = ($event) => ceEmit("edit-start", $event)),
				onEditSave: _cache[4] || (_cache[4] = ($event) => ceEmit("edit-save", $event)),
				onEditCancel: _cache[5] || (_cache[5] = ($event) => ceEmit("edit-cancel", $event)),
				onEditError: _cache[6] || (_cache[6] = ($event) => ceEmit("edit-error", $event))
			}, createSlots({ _: 2 }, [renderList(forwardedSlots.value, (slotName) => {
				return {
					name: slotName,
					fn: withCtx((slotProps) => [renderSlot(_ctx.$slots, slotName, normalizeProps(guardReactiveProps(isVueSlot(slotName) ? slotProps : void 0)))])
				};
			})]), 1032, [
				"columns",
				"data",
				"empty",
				"pagination",
				"items-per-page",
				"show-page-size",
				"page-size-options",
				"color",
				"variant",
				"search-enabled",
				"search-placeholder",
				"search-fields",
				"search-value",
				"filters",
				"loading",
				"actions",
				"actions-label",
				"row-disabled",
				"footer",
				"table-max-height",
				"inline-editing",
				"compact"
			]);
		};
	}
}));
//#endregion
export { CuTable as default };
