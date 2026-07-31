import { defineCustomElement } from "vue";
import Autocomplete from "@/components/customElements/form/Autocomplete.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuAutocomplete = defineCustomElement(Autocomplete);
customElements.define("cu-autocomplete", CuAutocomplete);

export default CuAutocomplete;
