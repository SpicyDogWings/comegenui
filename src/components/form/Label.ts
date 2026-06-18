import { defineCustomElement } from "vue";
import Label from "./Label.ce.vue";

const comegenLabel = defineCustomElement(Label);
customElements.define("cu-label", comegenLabel);

export default comegenLabel;
