/*! comegenui v5.2.0 · CuModal (cu-modal) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, defineCustomElement, getCurrentInstance, nextTick, normalizeClass, normalizeStyle, openBlock, reactive, ref, renderSlot, shallowRef, toDisplayString, toValue, unref, useSlots, vShow, watch, withCtx, withDirectives } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.0",
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
/** Un constructor nuevo por tag: el registry no admite el mismo en dos nombres. */
function makeElement(component, meta) {
	return attachMeta(defineCustomElement(component), meta);
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
var isVariantFull = oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
var isSize = oneOf(SIZES);
oneOf(SIZES_SM);
var isModalSize = oneOf(MODAL_SIZES);
oneOf(ALIGNS);
oneOf(TEXT_ALIGNS);
oneOf(POSITIONS);
oneOf(POSITIONS_VERTICAL);
oneOf(TRIGGERS);
oneOf(BUTTON_TYPES);
oneOf(INPUT_TYPES);
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
//#region node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.6.0-rc.11_@typescript+typescript6@6.0.2_/node_modules/@vueuse/shared/dist/index.js
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
var noop = () => {};
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
function whenever(source, cb, options) {
	const stop = watch(source, (v, ov, onInvalidate) => {
		if (v) {
			if (options === null || options === void 0 ? void 0 : options.once) nextTick(() => stop());
			cb(v, ov, onInvalidate);
		}
	}, {
		...options,
		once: false
	});
	return stop;
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
var DefaultMagicKeysAliasMap = {
	ctrl: "control",
	command: "meta",
	cmd: "meta",
	option: "alt",
	up: "arrowup",
	down: "arrowdown",
	left: "arrowleft",
	right: "arrowright"
};
/**
* Reactive keys pressed state, with magical keys combination support.
*
* @see https://vueuse.org/useMagicKeys
*/
function useMagicKeys(options = {}) {
	const { reactive: useReactive = false, target = defaultWindow, aliasMap = DefaultMagicKeysAliasMap, passive = true, onEventFired = noop } = options;
	const current = reactive(/* @__PURE__ */ new Set());
	const obj = {
		toJSON() {
			return {};
		},
		current
	};
	const refs = useReactive ? reactive(obj) : obj;
	const metaDeps = /* @__PURE__ */ new Set();
	const depsMap = /* @__PURE__ */ new Map([
		["Meta", metaDeps],
		["Shift", /* @__PURE__ */ new Set()],
		["Alt", /* @__PURE__ */ new Set()]
	]);
	const usedKeys = /* @__PURE__ */ new Set();
	function setRefs(key, value) {
		if (key in refs) if (useReactive) refs[key] = value;
		else refs[key].value = value;
	}
	function reset() {
		current.clear();
		for (const key of usedKeys) setRefs(key, false);
	}
	function updateDeps(value, e, keys) {
		if (!value || typeof e.getModifierState !== "function") return;
		for (const [modifier, depsSet] of depsMap) if (e.getModifierState(modifier)) {
			keys.forEach((key) => depsSet.add(key));
			break;
		}
	}
	function clearDeps(value, key) {
		if (value) return;
		const depsMapKey = `${key[0].toUpperCase()}${key.slice(1)}`;
		const deps = depsMap.get(depsMapKey);
		if (!["shift", "alt"].includes(key) || !deps) return;
		const depsArray = Array.from(deps);
		const depsIndex = depsArray.indexOf(key);
		depsArray.forEach((key, index) => {
			if (index >= depsIndex) {
				current.delete(key);
				setRefs(key, false);
			}
		});
		deps.clear();
	}
	function updateRefs(e, value) {
		var _e$key, _e$code;
		const key = (_e$key = e.key) === null || _e$key === void 0 ? void 0 : _e$key.toLowerCase();
		const values = [(_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.toLowerCase(), key].filter(Boolean);
		if (!key) return;
		if (key) if (value) current.add(key);
		else current.delete(key);
		for (const key of values) {
			usedKeys.add(key);
			setRefs(key, value);
		}
		updateDeps(value, e, [...current, ...values]);
		clearDeps(value, key);
		if (key === "meta" && !value) {
			metaDeps.forEach((key) => {
				current.delete(key);
				setRefs(key, false);
			});
			metaDeps.clear();
		}
	}
	useEventListener(target, "keydown", (e) => {
		updateRefs(e, true);
		return onEventFired(e);
	}, { passive });
	useEventListener(target, "keyup", (e) => {
		updateRefs(e, false);
		return onEventFired(e);
	}, { passive });
	useEventListener("blur", reset, { passive });
	useEventListener("focus", reset, { passive });
	const proxy = new Proxy(refs, { get(target, prop, rec) {
		if (typeof prop !== "string") return Reflect.get(target, prop, rec);
		prop = prop.toLowerCase();
		if (prop in aliasMap) prop = aliasMap[prop];
		if (!(prop in refs)) if (/[+_-]/.test(prop)) {
			const keys = prop.split(/[+_-]/g).map((i) => i.trim());
			refs[prop] = computed(() => keys.map((key) => toValue(proxy[key])).every(Boolean));
		} else refs[prop] = shallowRef(false);
		const r = Reflect.get(target, prop, rec);
		return useReactive ? toValue(r) : r;
	} });
	return proxy;
}
Number.POSITIVE_INFINITY;
//#endregion
//#region src/components/icons/IconBase.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = ["width", "height"];
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
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$2);
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
var _hoisted_1$1 = ["href", "target"];
var _hoisted_2$1 = ["type", "disabled"];
var _hoisted_3$1 = ["type", "disabled"];
var Button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Button",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			required: false,
			default: "neutral"
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
			default: "button"
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
		}
	},
	emits: ["loading-change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const isDisabled = computed(() => props.disabled || props.loading);
		const emit = __emit;
		watch(() => props.loading, (value) => emit("loading-change", value));
		const colorStyles = computed(() => ({
			"--btn-bg": `var(--cu-color-${props.color})`,
			"--btn-bg-hover": `var(--cu-color-${props.color}-hover)`,
			"--btn-bg-active": `var(--cu-color-${props.color}-active)`,
			"--btn-ghost-hover": `var(--cu-color-${props.color}-ghost-hover)`,
			"--btn-ghost-active": `var(--cu-color-${props.color}-ghost-active)`,
			"--btn-soft": `var(--cu-color-${props.color}-soft)`,
			"--btn-soft-hover": `var(--cu-color-${props.color}-soft-hover)`,
			"--btn-soft-active": `var(--cu-color-${props.color}-soft-active)`,
			"--btn-subtle": `var(--cu-color-${props.color}-subtle)`,
			"--btn-subtle-hover": `var(--cu-color-${props.color}-subtle-hover)`,
			"--btn-subtle-active": `var(--cu-color-${props.color}-subtle-active)`,
			"--btn-subtle-border": `var(--cu-color-${props.color}-subtle-border)`
		}));
		return (_ctx, _cache) => {
			return props.to ? (openBlock(), createElementBlock("a", {
				key: 0,
				href: props.to,
				target: props.target,
				class: normalizeClass([{ "cu-button--disabled": isDisabled.value }, "cu-button-link"])
			}, [createElementVNode("button", {
				type: props.type,
				class: normalizeClass([
					"cu-button",
					`cu-button--${props.variant}`,
					`cu-button--${props.size}`,
					{ "cu-button--disabled": isDisabled.value }
				]),
				style: normalizeStyle(colorStyles.value),
				disabled: isDisabled.value
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_2$1)], 10, _hoisted_1$1)) : (openBlock(), createElementBlock("button", {
				key: 1,
				type: props.type,
				class: normalizeClass([
					"cu-button",
					`cu-button--${props.variant}`,
					`cu-button--${props.size}`,
					{ "cu-button--disabled": isDisabled.value }
				]),
				style: normalizeStyle(colorStyles.value),
				disabled: isDisabled.value
			}, [
				props.loading ? (openBlock(), createBlock(LucideLoader_default, {
					key: 0,
					class: "cu-button-spinner"
				})) : createCommentVNode("v-if", true),
				createCommentVNode(" Contenido del botón (label y/o íconos SVG inline) "),
				renderSlot(_ctx.$slots, "default", {}, void 0, true)
			], 14, _hoisted_3$1));
		};
	}
});
//#endregion
//#region src/components/buttons/Button.vue?vue&type=style&index=0&inline&scoped=50087dcd&lang.css
var Button_vue_vue_type_style_index_0_inline_scoped_50087dcd_lang_default = "\n.cu-button[data-v-50087dcd] {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-md) var(--cu-space-lg);\n  border-radius: var(--cu-radius);\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--cu-space-xs);\n  box-sizing: border-box;\n  transition: all 150ms ease;\n}\n.cu-button[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  transform: scale(0.97);\n}\n.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n  cursor: not-allowed;\n}\n\n/* sizes (md = base; link mantiene su padding 0) */\n.cu-button--sm[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-xs);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n}\n.cu-button--lg[data-v-50087dcd]:not(.cu-button--link) {\n  font-size: var(--cu-font-size-lg);\n  padding: var(--cu-space-lg) var(--cu-space-xl);\n}\n\n/* solid */\n.cu-button.cu-button--solid[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--solid[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* ghost */\n.cu-button.cu-button--ghost[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--ghost[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* soft */\n.cu-button.cu-button--soft[data-v-50087dcd] {\n  background-color: var(--btn-soft);\n  color: var(--btn-bg);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-hover);\n}\n.cu-button.cu-button--soft[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-soft-active);\n}\n\n/* subtle */\n.cu-button.cu-button--subtle[data-v-50087dcd] {\n  background-color: var(--btn-subtle);\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-subtle-border);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-hover);\n}\n.cu-button.cu-button--subtle[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-subtle-active);\n}\n\n/* outlined */\n.cu-button.cu-button--outlined[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  border: var(--cu-border-thin) solid var(--btn-bg);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-hover);\n}\n.cu-button.cu-button--outlined[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-ghost-active);\n}\n\n/* link */\n.cu-button.cu-button--link[data-v-50087dcd] {\n  background-color: transparent;\n  color: var(--btn-bg);\n  padding: 0;\n  box-shadow: none;\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button.cu-button--link[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  text-decoration-thickness: 2px;\n}\n\n/* none */\n.cu-button.cu-button--none[data-v-50087dcd] {\n  background-color: var(--btn-bg);\n  color: var(--cu-color-surface);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:hover:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-hover);\n}\n.cu-button.cu-button--none[data-v-50087dcd]:active:not(.cu-button--disabled) {\n  background-color: var(--btn-bg-active);\n}\n\n/* link wrapper */\n.cu-button-link[data-v-50087dcd] {\n  text-decoration: none;\n}\n.cu-button-link[data-v-50087dcd]:hover {\n  text-decoration: underline;\n  text-underline-offset: var(--cu-space-2xs);\n}\n.cu-button-link.cu-button--disabled[data-v-50087dcd] {\n  opacity: var(--cu-alpha-disabled, 0.7);\n}\n\n/* icon-only */\n.cu-button--icon-only[data-v-50087dcd] {\n  padding: var(--cu-space-sm);\n}\n\n/* loading spinner */\n.cu-button-spinner[data-v-50087dcd] {\n  animation: cu-spin-50087dcd 0.8s linear infinite;\n}\n@keyframes cu-spin-50087dcd {\nfrom { transform: rotate(0deg);\n}\nto { transform: rotate(360deg);\n}\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/buttons/Button.vue
var Button_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Button_vue_vue_type_script_setup_true_lang_default, [["styles", [Button_vue_vue_type_style_index_0_inline_scoped_50087dcd_lang_default]], ["__scopeId", "data-v-50087dcd"]]);
//#endregion
//#region src/components/overlay/Modal.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["aria-labelledby", "aria-describedby"];
var _hoisted_2 = ["data-size", "data-height"];
var _hoisted_3 = { class: "cu-modal-header-text" };
var _hoisted_4 = {
	key: 0,
	class: "cu-modal-title-row"
};
var _hoisted_5 = {
	id: "modal-title",
	class: "cu-modal-title"
};
var _hoisted_6 = {
	key: 1,
	id: "modal-description",
	class: "cu-modal-description"
};
var _hoisted_7 = { class: "cu-modal-body" };
var _hoisted_8 = { class: "cu-modal-footer" };
var _hoisted_9 = {
	key: 0,
	class: "cu-modal-footer-default"
};
//#endregion
//#region src/components/overlay/Modal.vue
var Modal_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Modal",
	props: {
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		title: {
			type: String,
			required: false,
			default: ""
		},
		description: {
			type: String,
			required: false,
			default: ""
		},
		persistent: {
			type: Boolean,
			required: false,
			default: false
		},
		size: {
			type: String,
			required: false,
			default: "auto",
			validator: isModalSize
		},
		height: {
			type: String,
			required: false,
			default: "auto",
			validator: isModalSize
		}
	},
	emits: [
		"close",
		"opened",
		"closed",
		"cancel",
		"accept"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const slots = useSlots();
		const isOpen = ref(false);
		const hasFooter = computed(() => !!slots.footer?.());
		const colorStyles = computed(() => ({ "--modal-color": `var(--cu-color-${props.color})` }));
		/** Abre el modal. */
		function open() {
			isOpen.value = true;
		}
		/** Cierra el modal. */
		function close() {
			isOpen.value = false;
		}
		/** Alterna la visibilidad del modal. */
		function toggle() {
			isOpen.value = !isOpen.value;
		}
		function handleCancel() {
			emit("cancel");
			close();
		}
		function handleAccept() {
			emit("accept");
			close();
		}
		const keys = useMagicKeys({ target: typeof window !== "undefined" ? window : void 0 });
		whenever(() => keys.Escape?.value, () => !props.persistent && isOpen.value && close());
		function handleBackdropClick(event) {
			if (!props.persistent && event.target === event.currentTarget) close();
		}
		watch(isOpen, (newVal) => {
			emit(newVal ? "opened" : "closed");
			if (!newVal) emit("close");
		});
		__expose({
			open,
			close,
			toggle,
			/** Devuelve true si el modal está abierto. */
			isOpen: () => isOpen.value
		});
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("div", {
				onClick: handleBackdropClick,
				tabindex: "-1",
				role: "dialog",
				class: "cu-modal-backdrop",
				"aria-modal": "true",
				"aria-labelledby": __props.title ? "modal-title" : void 0,
				"aria-describedby": __props.description ? "modal-description" : void 0
			}, [createElementVNode("div", {
				class: "cu-modal",
				style: normalizeStyle(colorStyles.value),
				"data-size": __props.size,
				"data-height": __props.height
			}, [
				createElementVNode("header", { class: normalizeClass(["cu-modal-header", { "cu-modal-header--accent": __props.color !== "neutral" }]) }, [createElementVNode("div", _hoisted_3, [__props.title ? (openBlock(), createElementBlock("div", _hoisted_4, [renderSlot(_ctx.$slots, "icon"), createElementVNode("h2", _hoisted_5, toDisplayString(__props.title), 1)])) : createCommentVNode("v-if", true), __props.description ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(__props.description), 1)) : createCommentVNode("v-if", true)]), !__props.persistent ? (openBlock(), createBlock(Button_default, {
					key: 0,
					color: __props.color,
					variant: "ghost",
					onClick: close,
					class: "cu-modal-close",
					"aria-label": "Cerrar modal"
				}, {
					default: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						width: "20",
						height: "20",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						"stroke-linejoin": "round"
					}, [createElementVNode("path", { d: "M18 6 6 18" }), createElementVNode("path", { d: "m6 6 12 12" })], -1)])]),
					_: 1
				}, 8, ["color"])) : createCommentVNode("v-if", true)], 2),
				createElementVNode("main", _hoisted_7, [renderSlot(_ctx.$slots, "default")]),
				createElementVNode("footer", _hoisted_8, [renderSlot(_ctx.$slots, "footer", {}, () => [!hasFooter.value ? (openBlock(), createElementBlock("div", _hoisted_9, [__props.persistent ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createVNode(Button_default, {
					color: "neutral",
					variant: "ghost",
					onClick: handleCancel
				}, {
					default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("Cancelar", -1)])]),
					_: 1
				}), createVNode(Button_default, {
					color: __props.color,
					variant: "solid",
					onClick: handleAccept
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("Aceptar", -1)])]),
					_: 1
				}, 8, ["color"])], 64)) : (openBlock(), createBlock(Button_default, {
					key: 1,
					color: "neutral",
					variant: "ghost",
					onClick: close
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("Cerrar", -1)])]),
					_: 1
				}))])) : createCommentVNode("v-if", true)])])
			], 12, _hoisted_2)], 8, _hoisted_1)), [[vShow, isOpen.value]]);
		};
	}
}), [["styles", ["\n.cu-modal-backdrop {\n  z-index: 1000;\n  position: fixed;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: var(--cu-space-md);\n  background-color: rgba(0, 0, 0, 0.3);\n  backdrop-filter: blur(4px);\n}\n.cu-modal {\n  background-color: var(--cu-color-surface);\n  color: var(--cu-color-neutral);\n  border-radius: var(--cu-radius);\n  box-shadow: var(--cu-shadow-xl);\n  padding: var(--cu-space-md);\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: visible;\n  box-sizing: border-box;\n}\n\n/* size */\n.cu-modal[data-size=\"auto\"] { max-width: var(--cu-modal-size-auto, 50vw);\n}\n.cu-modal[data-size=\"sm\"] { max-width: var(--cu-modal-size-sm, 25vw);\n}\n.cu-modal[data-size=\"md\"] { max-width: var(--cu-modal-size-md, 30vw);\n}\n.cu-modal[data-size=\"lg\"] { max-width: var(--cu-modal-size-lg, 35vw);\n}\n.cu-modal[data-size=\"xl\"] { max-width: var(--cu-modal-size-xl, 40vw);\n}\n.cu-modal[data-size=\"full\"] { max-width: var(--cu-modal-size-full, 90vw);\n}\n\n/* height */\n.cu-modal[data-height=\"auto\"] { max-height: var(--cu-modal-height-auto, 50vh);\n}\n.cu-modal[data-height=\"sm\"] { max-height: var(--cu-modal-height-sm, 30vh);\n}\n.cu-modal[data-height=\"md\"] { max-height: var(--cu-modal-height-md, 40vh);\n}\n.cu-modal[data-height=\"lg\"] { max-height: var(--cu-modal-height-lg, 50vh);\n}\n.cu-modal[data-height=\"xl\"] { max-height: var(--cu-modal-height-xl, 60vh);\n}\n.cu-modal[data-height=\"full\"] {\n  max-height: var(--cu-modal-height-full, 90vh);\n  height: var(--cu-modal-height-full, 90vh);\n}\n.cu-modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: var(--cu-space-lg);\n  gap: var(--cu-space-md);\n}\n.cu-modal-header-text {\n  display: flex;\n  flex-direction: column;\n  gap: var(--cu-space-2xs);\n  min-width: 0;\n}\n.cu-modal-title-row {\n  display: flex;\n  align-items: center;\n  gap: var(--cu-space-sm);\n}\n.cu-modal-title {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-lg);\n  font-weight: var(--cu-font-weight-bold);\n  margin: 0;\n  color: var(--modal-color);\n}\n.cu-modal-description {\n  font-family: var(--cu-font-sans);\n  font-size: var(--cu-font-size-sm);\n  margin: 0;\n  color: var(--cu-color-neutral);\n  opacity: 0.7;\n}\n.cu-modal-close {\n  flex-shrink: 0;\n  padding: var(--cu-space-sm) !important;\n  height: auto !important;\n  width: auto !important;\n}\n.cu-modal-body {\n  padding: 0 var(--cu-space-lg) var(--cu-space-lg);\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n}\n.cu-modal-body > * {\n  width: 100%;\n}\n.cu-modal-footer {\n  padding: var(--cu-space-lg);\n  border-top: var(--cu-border-thin) solid var(--cu-border-color);\n}\n.cu-modal-footer-default {\n  display: flex;\n  justify-content: flex-end;\n  gap: var(--cu-space-sm);\n}\n"]]]);
//#endregion
//#region src/lib/overlay/modal.ts
var CuModal = defineComegenElement("cu-modal", /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Modal.ce",
	props: {
		/** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** Título del modal (se muestra en la cabecera) */
		title: String,
		/** Descripción bajo el título (texto secundario) */
		description: String,
		/** Si es `true`, no se cierra con click en el backdrop ni con `Escape` */
		persistent: Boolean,
		/** Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
		size: {
			type: String,
			default: "auto"
		},
		/** Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
		height: {
			type: String,
			default: "auto"
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const modalRef = ref(null);
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
		/** Abre el modal */
		function open() {
			modalRef.value?.open();
		}
		/** Cierra el modal */
		function close() {
			modalRef.value?.close();
		}
		/** Alterna visibilidad */
		function toggle() {
			modalRef.value?.toggle();
		}
		/** Devuelve el estado actual (`boolean`) */
		function isOpen() {
			return modalRef.value?.isOpen() ?? false;
		}
		__expose({
			open,
			close,
			toggle,
			isOpen
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Modal_default, {
				ref_key: "modalRef",
				ref: modalRef,
				color: props.color,
				title: props.title,
				description: props.description,
				persistent: props.persistent,
				size: props.size,
				height: props.height,
				onClose: _cache[0] || (_cache[0] = ($event) => ceEmit("close", $event)),
				onOpened: _cache[1] || (_cache[1] = ($event) => ceEmit("opened", $event)),
				onClosed: _cache[2] || (_cache[2] = ($event) => ceEmit("closed", $event)),
				onCancel: _cache[3] || (_cache[3] = ($event) => ceEmit("cancel", $event)),
				onAccept: _cache[4] || (_cache[4] = ($event) => ceEmit("accept", $event))
			}, {
				icon: withCtx(() => [createCommentVNode(" Ícono en la cabecera (junto al título) "), renderSlot(_ctx.$slots, "icon")]),
				footer: withCtx(() => [createCommentVNode(" Pie del modal (típicamente botones de acción) "), renderSlot(_ctx.$slots, "footer")]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"color",
				"title",
				"description",
				"persistent",
				"size",
				"height"
			]);
		};
	}
}), [["styles", ["\n/* layer: preflights */\n*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);};\n"]]]));
//#endregion
export { CuModal as default };
