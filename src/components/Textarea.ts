import { defineCustomElement } from "vue";
import Textarea from "./Textarea.ce.vue";

const comegenTextarea = defineCustomElement(Textarea);
customElements.define("cu-textarea", comegenTextarea);

export default comegenTextarea;
