import { defineComegenElement } from "@/utils/comegen-element";
import Autocomplete from "@/components/customElements/form/Autocomplete.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuAutocomplete = defineComegenElement("cu-autocomplete", Autocomplete);

export default CuAutocomplete;
