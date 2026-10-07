# API por componente (índice)

Todo lo que se exporta como custom element. Los componentes que no figuran acá
**no** tienen UMD: sólo se usan desde Vue (ver `docs/componentes/vue/`).

`props sólo por JS` = arrays/objetos/funciones: **no** van por atributo, se asignan
como propiedad (`el.items = [...]`). Ver `gotchas.md`.

| Tag | UMD | Grupo | Props sólo por JS | Eventos | Métodos |
|---|---|---|---|---|---|
| `cu-alert` | `CuAlert.core.umd.js` | Información | — | `close`, `open`, `update:show` | 4 |
| `cu-author-card` | `CuAuthorCard.core.umd.js` | Información | — | — | — |
| `cu-autocomplete` | `CuAutocomplete.core.umd.js` | Formularios | `items` | `update:modelValue`, `select`, `blur` | 6 |
| `cu-avatar` | `CuAvatar.core.umd.js` | Información | — | — | — |
| `cu-badge` | `CuBadge.core.umd.js` | Información | — | — | — |
| `cu-button` | `CuButton.core.umd.js` | Buttons | — | `loading-change` | — |
| `cu-calendar` | `CuCalendar.core.umd.js` | Controles | `events` | `select`, `change`, `update:modelValue`, `update:viewMonth`, `update:rangeStart`, `update:rangeEnd` | 8 |
| `cu-card` | `CuCard.core.umd.js` | Información | — | `click` | — |
| `cu-cells-importer` | `CuCellsImporter.core.umd.js` | Formularios | `columns`, `formats`, `template`, `sheet` | `parse`, `error`, `change` | 10 |
| `cu-checkbox` | `CuCheckbox.core.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-collapse` | `CuCollapse.core.umd.js` | Overlay | — | `toggle` | 4 |
| `cu-color-picker` | `CuColorPicker.core.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-command-palette` | `CuCommandPalette.core.umd.js` | Overlay | — | `select`, `close` | 5 |
| `cu-date-picker` | `CuDatePicker.core.umd.js` | Formularios | `events` | `select`, `change`, `open`, `close`, `update:modelValue`, `update:startDate`, `update:endDate` | 10 |
| `cu-dropdown-menu` | `CuDropdownMenu.core.umd.js` | Controles | `items` | `close`, `open` | 4 |
| `cu-file-input` | `CuFileInput.core.umd.js` | Formularios | — | `update:modelValue` | 5 |
| `cu-file-input-zone` | `CuFileInputZone.core.umd.js` | Formularios | — | `update:modelValue` | 5 |
| `cu-floating-button` | `CuFloatingButton.core.umd.js` | Buttons | — | — | — |
| `cu-input` | `CuInput.core.umd.js` | Formularios | — | `update:modelValue` | 4 |
| `cu-label` | `CuLabel.core.umd.js` | Formularios | — | — | — |
| `cu-markdown` | `CuMarkdown.core.umd.js` | Markdown | — | `parsed` | 1 |
| `cu-modal` | `CuModal.core.umd.js` | Overlay | — | `close`, `opened`, `closed`, `cancel`, `accept` | 4 |
| `cu-navbar` | `CuNavbar.core.umd.js` | Navegación | `items`, `searchFields` | `search` | — |
| `cu-navbar-horizontal` | `CuNavbarHorizontal.core.umd.js` | Navegación | `items` | — | — |
| `cu-pagination` | `CuPagination.core.umd.js` | Controles | `pageSizeOptions` | `update:currentPage`, `update:itemsPerPage` | — |
| `cu-select` | `CuSelect.core.umd.js` | Formularios | `options` | `update:modelValue`, `select`, `close`, `blur` | 6 |
| `cu-side-over` | `CuSideOver.core.umd.js` | Overlay | — | `update:open`, `close` | 4 |
| `cu-switch` | `CuSwitch.core.umd.js` | Formularios | — | `update:modelValue`, `change` | 4 |
| `cu-table` | `CuTable.core.umd.js` | Datos | `columns`, `data`, `pageSizeOptions`, `searchFields`, `filters`, `actions`, `footer`, `rowDisabled` | `update:currentPage`, `update:itemsPerPage`, `update:search`, `edit-start`, `edit-save`, `edit-cancel`, `edit-error` | 6 |
| `cu-tabs` | `CuTabs.core.umd.js` | Navegación | `tabs` | `update:modelValue`, `change` | 4 |
| `cu-textarea` | `CuTextarea.core.umd.js` | Formularios | — | `update:modelValue` | 4 |
| `cu-tooltip` | `CuTooltip.core.umd.js` | Overlay | — | — | — |
