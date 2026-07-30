import { defineCustomElement } from "vue";
import Switch from "./Switch.ce.vue";

const comegenSwitch = defineCustomElement(Switch);
customElements.define("cu-switch", comegenSwitch);

export default comegenSwitch;
