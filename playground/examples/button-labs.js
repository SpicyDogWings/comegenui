// ══════════════════════════════════════════════
// Button Labs — Example
// ══════════════════════════════════════════════

const variants = ['solid', 'ghost', 'soft', 'subtle', 'outlined', 'link']
const colors = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']

const grid = document.getElementById('button-grid')

variants.forEach(variant => {
  const tr = document.createElement('tr')

  // Variant label
  const tdLabel = document.createElement('td')
  tdLabel.style.cssText = 'padding:4px 8px;opacity:.6'
  tdLabel.textContent = variant
  tr.appendChild(tdLabel)

  // Color buttons
  colors.forEach(color => {
    const td = document.createElement('td')
    td.style.cssText = 'padding:4px 4px'
    td.innerHTML = `<cu-button color="${color}" variant="${variant}">${variant}</cu-button>`
    tr.appendChild(td)
  })

  grid.appendChild(tr)
})

// Disabled row
const trDisabled = document.createElement('tr')
const tdDisabledLabel = document.createElement('td')
tdDisabledLabel.style.cssText = 'padding:4px 8px;opacity:.6'
tdDisabledLabel.textContent = 'disabled'
trDisabled.appendChild(tdDisabledLabel)

colors.forEach(color => {
  const td = document.createElement('td')
  td.style.cssText = 'padding:4px 4px'
  td.innerHTML = `<cu-button color="${color}" variant="solid" disabled>disabled</cu-button>`
  trDisabled.appendChild(td)
})
grid.appendChild(trDisabled)

// Button Labs loaded
