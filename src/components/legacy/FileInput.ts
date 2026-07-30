import { defineCustomElement } from "vue";
import FileInput from "./FileInput.ce.vue";

const comegenFileInput = defineCustomElement(FileInput);
customElements.define("cu-file-input", comegenFileInput);

export default comegenFileInput;
