import { defineCustomElement } from "vue";
import Tooltip from "@/components/customElements/overlay/Tooltip.ce.vue";

const CuTooltip = defineCustomElement(Tooltip);
customElements.define("cu-tooltip", CuTooltip);

export default CuTooltip;