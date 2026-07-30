import { defineCustomElement } from "vue";
import Input from "@/components/customElements/form/Input.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuInput = defineCustomElement(Input);
customElements.define("cu-input", CuInput);

export default CuInput;
