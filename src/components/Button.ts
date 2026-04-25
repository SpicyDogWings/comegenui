import { defineCustomElement } from "vue";
import Button from "./Button.ce.vue";

const comegenButton = defineCustomElement(Button);
customElements.define("cu-button", comegenButton);

export default comegenButton;
