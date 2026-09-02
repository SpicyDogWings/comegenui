import { defineCustomElement } from 'vue'
import Markdown from '@/components/customElements/markdown/Markdown.ce.vue'

const CuMarkdown = defineCustomElement(Markdown)
customElements.define('cu-markdown', CuMarkdown)

export default CuMarkdown
