import { defineCustomElement } from 'vue'
import Card from '@/components/customElements/information/Card.ce.vue'

const CuCard = defineCustomElement(Card)
customElements.define('cu-card', CuCard)

export default CuCard
