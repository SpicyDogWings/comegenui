import { defineComegenElement } from "@/utils/comegen-element";
import Input from "@/components/customElements/form/Input.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuInput = defineComegenElement("cu-input", Input);

export default CuInput;
