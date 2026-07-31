import { defineCustomElement } from "vue";
import Label from "@/components/customElements/form/Label.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuLabel = defineCustomElement(Label);
customElements.define("cu-label", CuLabel);

export default CuLabel;
