// ══════════════════════════════════════════════
// Button Labs — Example
// ══════════════════════════════════════════════

const variants = ['solid', 'ghost', 'soft', 'subtle', 'outlined', 'link']
const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']

function createButtonGrid(containerId) {
  const container = document.getElementById(containerId)
  const table = document.createElement('table')
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px'

  // Header
  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  const thVariant = document.createElement('th')
  thVariant.style.cssText = 'padding:6px 8px;text-align:left;opacity:.6'
  thVariant.textContent = 'variant \\ color'
  headerRow.appendChild(thVariant)

  colors.forEach(color => {
    const th = document.createElement('th')
    th.style.cssText = 'padding:6px 8px;text-align:left;opacity:.6'
    th.textContent = color
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // Body
  const tbody = document.createElement('tbody')
  variants.forEach(variant => {
    const tr = document.createElement('tr')
    const tdLabel = document.createElement('td')
    tdLabel.style.cssText = 'padding:4px 8px;opacity:.6'
    tdLabel.textContent = variant
    tr.appendChild(tdLabel)

    colors.forEach(color => {
      const td = document.createElement('td')
      td.style.cssText = 'padding:4px 4px'
      td.innerHTML = `<cu-button color="${color}" variant="${variant}">${variant}</cu-button>`
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)

  container.appendChild(table)
}

// Default config (uses built-in defaults)
createButtonGrid('default-buttons')

// Custom config (uses CSS variable overrides)
createButtonGrid('custom-buttons')
