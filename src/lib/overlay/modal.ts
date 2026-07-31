import { defineCustomElement } from 'vue'
import Modal from '@/components/customElements/overlay/Modal.ce.vue'

const CuModal = defineCustomElement(Modal)
customElements.define('cu-modal', CuModal)

export default CuModal
