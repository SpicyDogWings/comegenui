import { defineCustomElement } from "vue";
import Input from "./components/Input.ce.vue";

const CuInput = defineCustomElement(Input);

customElements.define("cu-input", CuInput);

export default CuInput;
