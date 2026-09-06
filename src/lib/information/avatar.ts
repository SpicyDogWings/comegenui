import { defineCustomElement } from 'vue'
import Avatar from '@/components/customElements/information/Avatar.ce.vue'

const CuAvatar = defineCustomElement(Avatar)
customElements.define('cu-avatar', CuAvatar)

export default CuAvatar
