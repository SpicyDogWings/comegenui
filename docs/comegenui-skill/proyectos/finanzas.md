# Comegen UI en Proyecto Finanzas - Guía Rápida

---

## 📦 **Imports Obligatorios**

En cada controlador que use componentes:

```php
"js" => [
    "views/libs/comegen-ui/vendor/vue-runtime.iife.js",  // 1. Vue (SIEMPRE PRIMERO)
    "views/libs/comegen-ui/CuButton.umd.js",             // 2. Botones
    "views/libs/comegen-ui/CuTable.umd.js",              // 3. Tablas
    // ... otros componentes que uses
    "tu_ruta/js/tu_archivo.js",                          // 4. Tu JS (SIEMPRE ÚLTIMO)
],
"css" => [
    "views/libs/comegenui/styles.css",                   // Estilos base
]
```

---

## 🔧 **Componentes**

### Botones `<cu-button>`
```html
<!-- Navegación -->
<cu-button color="primary" variant="solid" to="/ruta">Guardar</cu-button>

<!-- Con icono -->
<cu-button color="neutral" variant="link" to="/ruta">
    <svg ...></svg>
    <span>Ver inventario</span>
</cu-button>
```
> ⚠️ Usa **`to`** (no `href`)

---

### Tabla `<cu-table>`
```html
<cu-table id="mi_tabla" style="max-height: 500px"></cu-table>
```

**JS:**
```javascript
const table = document.getElementById("mi_tabla");

// Configurar columnas
table.columns = [
    { key: "nombre", label: "Nombre" },                    // key ≠ accessorKey
    { key: "estado", label: "Estado",                      // label ≠ header
      badges: (row) => [{ value: row.estado, color: "primary" }]  // badges ≠ badge
    },
    { key: "acciones", label: "Acciones",
      cell: (row) => row.nombre || "Sin nombre"            // cell recibe row directamente
    }
];

// Cargar datos
table.loading = true;
fetch("/api/datos")
    .then(r => r.json())
    .then(data => {
        table.data = data;
        table.loading = false;
    });
```

---

## 🔄 **Diferencias con el código anterior**

| Anterior | Comegen UI |
|----------|------------|
| `accessorKey` | `key` |
| `header` | `label` |
| `badge: (v, row) => {color, label}` | `badges: (row) => [{value, color}]` |
| `cell: ({row}) => row.getValue("x")` | `cell: (row) => row.x` |
| `<a href="..." class="btn btn-primary">` | `<cu-button to="..." color="primary" variant="solid">` |
