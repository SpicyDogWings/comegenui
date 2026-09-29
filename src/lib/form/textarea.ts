import { defineComegenElement } from "@/utils/comegen-element";
import Textarea from "@/components/customElements/form/Textarea.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuTextarea = defineComegenElement("cu-textarea", Textarea);

export default CuTextarea;
