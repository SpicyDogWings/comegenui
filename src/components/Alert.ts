import { defineCustomElement } from "vue";
import Alert from "./Alert.ce.vue";

const comegenAlert = defineCustomElement(Alert);
customElements.define("cu-alert", comegenAlert);

export default comegenAlert;
