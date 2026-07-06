import { defineCustomElement } from "vue";
import FileInputZone from "./FileInputZone.ce.vue";

const comegenFileInputZone = defineCustomElement(FileInputZone);
customElements.define("cu-file-input-zone", comegenFileInputZone);

export default comegenFileInputZone;
