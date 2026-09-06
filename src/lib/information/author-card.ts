import { defineCustomElement } from 'vue'
import AuthorCard from '@/components/customElements/information/AuthorCard.ce.vue'

const CuAuthorCard = defineCustomElement(AuthorCard)
customElements.define('cu-author-card', CuAuthorCard)

export default CuAuthorCard
