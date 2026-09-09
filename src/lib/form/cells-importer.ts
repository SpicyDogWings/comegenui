import { defineCustomElement } from 'vue'
import CellsImporter from '@/components/customElements/form/CellsImporter.ce.vue'

const CuCellsImporter = defineCustomElement(CellsImporter)
customElements.define('cu-cells-importer', CuCellsImporter)

export default CuCellsImporter