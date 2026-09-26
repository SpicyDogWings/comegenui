# API por componente (índice)

Todo lo que se exporta como custom element. Los componentes que no figuran acá
**no** tienen UMD: sólo se usan desde Vue (ver `docs/componentes/vue/`).

`props sólo por JS` = arrays/objetos/funciones: **no** van por atributo, se asignan
como propiedad (`el.items = [...]`). Ver `gotchas.md`.

| Tag | UMD | Grupo | Props sólo por JS | Eventos | Métodos |
|---|---|---|---|---|---|
| `cu-alert` | `CuAlert.umd.js` | Información | — | `close`, `open`, `update:show` | 4 |
| `cu-author-card` | `CuAuthorCard.umd.js` | Información | — | — | — |
| `cu-autocomplete` | `CuAutocomplete.umd.js` | Formularios | `items` | `update:modelValue`, `select`, `blur` | 5 |
| `cu-avatar` | `CuAvatar.umd.js` | Información | — | — | — |
| `cu-badge` | `CuBadge.umd.js` | Información | — | — | — |
| `cu-button` | `CuButton.umd.js` | Buttons | — | `loading-change` | — |
| `cu-calendar` | `CuCalendar.umd.js` | Controles | `events` | `select`, `change`, `update:modelValue`, `update:viewMonth`, `update:rangeStart`, `update:rangeEnd` | 8 |
| `cu-card` | `CuCard.umd.js` | Información | — | `click` | — |
| `cu-cells-importer` | `CuCellsImporter.umd.js` | Formularios | `columns`, `formats`, `template` | `parse`, `error`, `change` | 10 |
| `cu-checkbox` | `CuCheckbox.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-collapse` | `CuCollapse.umd.js` | Overlay | — | `toggle` | 4 |
| `cu-color-picker` | `CuColorPicker.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-command-palette` | `CuCommandPalette.umd.js` | Overlay | — | `select`, `close` | — |
| `cu-date-picker` | `CuDatePicker.umd.js` | Formularios | `events` | `select`, `change`, `open`, `close`, `update:modelValue`, `update:startDate`, `update:endDate` | 10 |
| `cu-dropdown-menu` | `CuDropdownMenu.umd.js` | Controles | `items` | `close`, `open` | 4 |
| `cu-file-input` | `CuFileInput.umd.js` | Formularios | — | `update:modelValue` | 5 |
| `cu-file-input-zone` | `CuFileInputZone.umd.js` | Formularios | — | `update:modelValue` | 5 |
| `cu-floating-button` | `CuFloatingButton.umd.js` | Buttons | — | — | — |
| `cu-input` | `CuInput.umd.js` | Formularios | — | `update:modelValue` | 4 |
| `cu-label` | `CuLabel.umd.js` | Formularios | — | — | — |
| `cu-markdown` | `CuMarkdown.umd.js` | Markdown | — | — | — |
| `cu-modal` | `CuModal.umd.js` | Overlay | — | `close`, `opened`, `closed`, `cancel`, `accept` | 4 |
| `cu-navbar` | `CuNavbar.umd.js` | Navegación | `items`, `searchFields` | `search` | — |
| `cu-navbar-horizontal` | `CuNavbarHorizontal.umd.js` | Navegación | `items` | — | — |
| `cu-pagination` | `CuPagination.umd.js` | Controles | `pageSizeOptions` | `update:currentPage`, `update:itemsPerPage` | — |
| `cu-select` | `CuSelect.umd.js` | Formularios | `options` | `update:modelValue`, `select`, `close`, `blur` | 6 |
| `cu-side-over` | `CuSideOver.umd.js` | Overlay | — | `update:open`, `close` | 4 |
| `cu-switch` | `CuSwitch.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-table` | `CuTable.umd.js` | Datos | `columns`, `data`, `pageSizeOptions`, `searchFields`, `filters`, `actions`, `footer` | `update:currentPage`, `update:itemsPerPage`, `update:search`, `edit-start`, `edit-save`, `edit-cancel`, `edit-error` | 6 |
| `cu-tabs` | `CuTabs.umd.js` | Navegación | `tabs` | `update:modelValue`, `change` | 4 |
| `cu-textarea` | `CuTextarea.umd.js` | Formularios | — | `update:modelValue` | 4 |
| `cu-tooltip` | `CuTooltip.umd.js` | Overlay | — | — | — |
