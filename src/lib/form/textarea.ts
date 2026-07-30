import { defineCustomElement } from "vue";
import Textarea from "@/components/customElements/form/Textarea.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuTextarea = defineCustomElement(Textarea);
customElements.define("cu-textarea", CuTextarea);

export default CuTextarea;
