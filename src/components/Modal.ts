import { defineCustomElement } from "vue";
import Modal from "./Modal.ce.vue";

const comegenModal = defineCustomElement(Modal);
customElements.define("cu-modal", comegenModal);

export default comegenModal;
