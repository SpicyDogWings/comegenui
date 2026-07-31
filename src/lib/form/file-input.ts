import { defineCustomElement } from 'vue'
import FileInput from '@/components/customElements/form/FileInput.ce.vue'

const CuFileInput = defineCustomElement(FileInput)
customElements.define('cu-file-input', CuFileInput)

export default CuFileInput
