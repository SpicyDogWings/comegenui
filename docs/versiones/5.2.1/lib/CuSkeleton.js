/*! comegenui v5.2.1 · CuSkeleton (cu-skeleton) · esm-shared · Vue externo (bare import) */
import { Fragment, computed, createBlock, createElementBlock, defineComponent, defineCustomElement, normalizeClass, normalizeStyle, openBlock, renderList } from "vue";
//#region src/utils/comegen-element.ts
var BUILD_META = {
	"version": "5.2.1",
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
