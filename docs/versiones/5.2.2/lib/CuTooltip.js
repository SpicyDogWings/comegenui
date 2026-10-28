/*! comegenui v5.2.2 · CuTooltip (cu-tooltip) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, createSlots, createTextVNode, defineComponent, defineCustomElement, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderSlot, toDisplayString, useSlots, withCtx } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.2",
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
oneOf(VARIANTS_FULL);
oneOf(VARIANTS_NO_GHOST);
oneOf(VARIANTS_FIELD);
oneOf(VARIANTS_FIELD_NONE);
oneOf(VARIANTS_TABS);
oneOf(SIZES);
oneOf(SIZES_SM);
oneOf(MODAL_SIZES);
var isAlign = oneOf(ALIGNS);
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
//#region src/components/overlay/Popover.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = ["role"];
var HOVER_REGISTRY_KEY = "__cu_hover_registry__";
var Popover_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
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
			}, [renderSlot(_ctx.$slots, "default", {}, void 0, true)], 14, _hoisted_1)) : createCommentVNode("v-if", true)], 544);
		};
	}
});
//#endregion
//#region src/components/overlay/Popover.vue?vue&type=style&index=0&inline&scoped=50458841&lang.css
var Popover_vue_vue_type_style_index_0_inline_scoped_50458841_lang_default = "\n.cu-popover[data-v-50458841] {\n  position: relative;\n  display: inline-block;\n  box-sizing: border-box;\n}\n.cu-popover-panel[data-v-50458841] {\n  padding: var(--cu-space-sm);\n  border-radius: var(--cu-radius-md);\n  font-family: var(--cu-font-sans);\n  box-shadow: var(--cu-shadow-xl);\n}\n";
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region src/components/overlay/Popover.vue
var Popover_default = /*#__PURE__*/ _plugin_vue_export_helper_default(Popover_vue_vue_type_script_setup_true_lang_default, [["styles", [Popover_vue_vue_type_style_index_0_inline_scoped_50458841_lang_default]], ["__scopeId", "data-v-50458841"]]);
//#endregion
//#region src/components/overlay/Tooltip.vue
var Tooltip_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "Tooltip",
	props: {
		text: {
			type: String,
			required: false,
			default: ""
		},
		color: {
			type: String,
			required: false,
			default: "neutral"
		},
		position: {
			type: String,
			required: false,
			default: "top",
			validator: isPosition
		},
		align: {
			type: String,
			required: false,
			default: "center",
			validator: isAlign
		},
		offset: {
			type: Number,
			required: false,
			default: 6
		},
		delay: {
			type: Number,
			required: false,
			default: 200
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const tooltipStyles = computed(() => ({ "--cu-popover-bg": `var(--cu-color-${props.color})` }));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Popover_default, {
				hover: "",
				position: __props.position,
				align: __props.align,
				offset: __props.offset,
				"hover-delay": __props.delay,
				disabled: __props.disabled,
				role: "tooltip",
				"panel-class": "cu-tooltip-panel",
				style: normalizeStyle(tooltipStyles.value),
				class: "cu-tooltip"
			}, {
				toggle: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, void 0, true)]),
				default: withCtx(() => [renderSlot(_ctx.$slots, "content", {}, () => [createTextVNode(toDisplayString(__props.text), 1)], true)]),
				_: 3
			}, 8, [
				"position",
				"align",
				"offset",
				"hover-delay",
				"disabled",
				"style"
			]);
		};
	}
}), [["styles", ["\n.cu-tooltip[data-v-d647c158] {\n  --cu-popover-width: max-content;\n  --cu-popover-min-width: 0;\n  --cu-popover-max-width: 18rem;\n}\n.cu-tooltip[data-v-d647c158] .cu-tooltip-panel {\n  color: var(--cu-color-surface);\n  font-size: var(--cu-font-size-xs);\n  font-weight: var(--cu-font-weight-medium);\n  padding: var(--cu-space-xs) var(--cu-space-sm);\n  border-radius: var(--cu-radius-sm);\n  box-shadow: var(--cu-shadow-md);\n}\n"]], ["__scopeId", "data-v-d647c158"]]);
//#endregion
//#region src/lib/overlay/tooltip.ts
var CuTooltip = defineComegenElement("cu-tooltip", /* @__PURE__ */ defineComponent({
	__name: "Tooltip.ce",
	props: {
		/** Texto del tooltip. Si se usa el slot `content`, tiene prioridad */
		text: {
			type: String,
			default: ""
		},
		/** Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
		color: {
			type: String,
			default: "neutral"
		},
		/** Lado donde aparece: `top`, `bottom`, `left`, `right` */
		position: {
			type: String,
			default: "top"
		},
		/** Alineación respecto al elemento: `start`, `center`, `end` */
		align: {
			type: String,
			default: "center"
		},
		/** Distancia (px) entre el elemento y el tooltip */
		offset: {
			type: Number,
			default: 6
		},
		/** Retardo (ms) antes de mostrar el tooltip al hacer hover */
		delay: {
			type: Number,
			default: 200
		},
		/** Deshabilita el tooltip (no se muestra) */
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const slots = useSlots();
		const hasContent = computed(() => !!slots.content);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Tooltip_default, {
				text: props.text,
				color: props.color,
				position: props.position,
				align: props.align,
				offset: props.offset,
				delay: props.delay,
				disabled: props.disabled
			}, createSlots({
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 2
			}, [hasContent.value ? {
				name: "content",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "content")]),
				key: "0"
			} : void 0]), 1032, [
				"text",
				"color",
				"position",
				"align",
				"offset",
				"delay",
				"disabled"
			]);
		};
	}
}));
//#endregion
export { CuTooltip as default };
