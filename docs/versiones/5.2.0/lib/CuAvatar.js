/*! comegenui v5.2.0 · CuAvatar (cu-avatar) · esm-shared · Vue externo (bare import) */
import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, defineCustomElement, normalizeClass, normalizeStyle, openBlock, renderSlot, toDisplayString, withCtx } from "vue";
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
var _hoisted_1 = ["src"];
var _hoisted_2 = {
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
				}, null, 8, _hoisted_1)) : props.initials ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(props.initials), 1)) : createCommentVNode("v-if", true),
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
//#region src/lib/information/avatar.ts
var CuAvatar = defineComegenElement("cu-avatar", /* @__PURE__ */ defineComponent({
	__name: "Avatar.ce",
	props: {
		/** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales */
		color: {
			type: String,
			default: ""
		},
		/** Tamaño: `sm`, `md`, `lg` */
		size: {
			type: String,
			default: "md"
		},
		/** Texto que se muestra como iniciales cuando no hay `src` */
		initials: {
			type: String,
			default: ""
		},
		/** URL de la imagen */
		src: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Avatar_default, {
				color: props.color,
				size: props.size,
				initials: props.initials,
				src: props.src
			}, {
				default: withCtx(() => [createCommentVNode(" Contenido del avatar (alternativo a `initials`) "), renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"color",
				"size",
				"initials",
				"src"
			]);
		};
	}
}));
//#endregion
export { CuAvatar as default };
