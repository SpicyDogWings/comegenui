import { defineCustomElement } from "vue";
import Autocomplete from "./Autocomplete.ce.vue";

const comegenAutocomplete = defineCustomElement(Autocomplete);
customElements.define("cu-autocomplete", comegenAutocomplete);

export default comegenAutocomplete;
