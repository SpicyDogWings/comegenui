import { defineCustomElement } from 'vue'
import FileInputZone from '@/components/customElements/form/FileInputZone.ce.vue'

const CuFileInputZone = defineCustomElement(FileInputZone)
customElements.define('cu-file-input-zone', CuFileInputZone)

export default CuFileInputZone
