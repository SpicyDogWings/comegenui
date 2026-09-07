import { defineCustomElement } from "vue";
import CommandPalette from "@/components/customElements/overlay/CommandPalette.ce.vue";

const CuCommandPalette = defineCustomElement(CommandPalette);
customElements.define("cu-command-palette", CuCommandPalette);

export default CuCommandPalette;
