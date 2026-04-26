import { defineCustomElement } from "vue";
import Input from "./components/Input.ce.vue";

const CuInput = defineCustomElement(Input);

// Definir sin shadow DOM para que los eventos del input interno burbujeen
customElements.define("cu-input", CuInput);

export default CuInput;
