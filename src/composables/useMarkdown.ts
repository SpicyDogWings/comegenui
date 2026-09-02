import { ref, computed, unref, type Ref } from 'vue'
import DOMPurify from 'dompurify'
import { parseMarkdown } from '@/markdown'

function dedent(text: string): string {
  const lines = text.split('\n')
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()

  let minIndent = Infinity
  for (const line of lines) {
    if (line.trim() === '') continue
    const match = line.match(/^(\s*)/)
    if (match) {
      minIndent = Math.min(minIndent, match[1].length)
    }
  }

  if (minIndent === Infinity) minIndent = 0
  return lines.map(line => line.slice(minIndent)).join('\n')
}

export function useMarkdown(source: string | Ref<string>) {
  const sourceRef = ref(source)

  const rendered = computed(() => {
    const raw = dedent(unref(sourceRef.value))
    if (!raw) return ''
    const html = parseMarkdown(raw)
    return DOMPurify.sanitize(html)
  })

  return {
    rendered,
  }
}
