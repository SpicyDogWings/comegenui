/*! comegenui v5.2.1 · CuColors (cu-colors) · esm-shared · Vue externo (bare import) */
//#region src/lib/colors.ts
function hexToRgba(hex, alpha) {
	const h = hex.replace("#", "");
	return `rgba(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}, ${alpha / 100})`;
}
//#endregion
export { hexToRgba };
