import { defineCustomElement } from "vue";
import Badge from "./Badge.ce.vue";

const comegenBadge = defineCustomElement(Badge);
customElements.define("cu-badge", comegenBadge);

export default comegenBadge;
