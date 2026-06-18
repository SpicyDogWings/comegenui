# Build

ComegenUI tiene un pipeline de build que genera bundles UMD individuales por componente, más un zip con todo.

## Comando principal

```bash
pnpm build:lib
```

Esto ejecuta `build-libs.ts` (Node) que:

1. **Limpia** el directorio `dist/`.
2. **Encuentra** todos los `*.ts` bajo `src/components/` recursivamente.
3. **Compila** cada uno como UMD independiente con Vite.
4. **Copia** `README-BUILD.md` a `dist/` con la versión actualizada.
5. **Crea** `dist/comegenui.zip` con todos los `.umd.js` + `README-BUILD.md`.

## ¿Qué sale en `dist/`?

```
dist/
├── CuAlert.umd.js
├── CuAutocomplete.umd.js
├── CuBadge.umd.js
├── CuButton.umd.js
├── CuCheckbox.umd.js
├── CuDropdownMenu.umd.js
├── CuInput.umd.js
├── CuLabel.umd.js
├── CuModal.umd.js
├── CuPagination.umd.js
├── CuSelect.umd.js
├── CuSwitch.umd.js
├── CuTable.umd.js
├── CuTextarea.umd.js
├── CuSelectNative.umd.js    ← viene de archived/ (ver nota)
├── Cuindex.umd.js           ← viene de data/index.ts (artifact, ver nota)
├── README-BUILD.md
└── comegenui.zip
```

> **Nota:** `cu-select-native` y `Cuindex.umd.js` se generan por el glob sin filtros. Ver [`docs/notes/01-build-glob.md`](../../notes/01-build-glob.md) para detalles.

## Convención de nombres

El nombre del archivo UMD se deriva del nombre del `.ts`:

```ts
// build-libs.ts
const name = "Cu" + basename(file, extname(file));
```

Ejemplos:

- `src/components/Button.ts` → `dist/CuButton.umd.js`
- `src/components/DropdownMenu.ts` → `dist/CuDropdownMenu.umd.js`
- `src/components/form/Input.ts` → `dist/CuInput.umd.js`
- `src/components/data/Table.ts` → `dist/CuTable.umd.js`
- `src/components/labs/Select.ts` → `dist/CuSelect.umd.js`

## Configuración de Vite en el build

`build-libs.ts` configura Vite así:

```ts
{
  configFile: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [
    vue({ features: { customElement: true } }),
    UnoCSS({ mode: "shadow-dom" }),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, file),
      name: name,
      fileName: (format) => `${name}.${format}.js`,
      formats: ["umd"],
    },
    minify: false,
  },
}
```

Puntos clave:

- **`features: { customElement: true }`** — habilita el modo Custom Element de Vue (necesario para `defineCustomElement`).
- **`UnoCSS({ mode: "shadow-dom" })`** — genera CSS scoped al Shadow DOM de cada Custom Element.
- **`minify: false`** — los UMD no se minifican (el consumidor puede minificar si quiere). Esto los hace más grandes pero más fáciles de debuggear.
- **Vue NO está externalizado** — está incluido en cada bundle. Por eso cada `.umd.js` pesa ~180-250 kB.

> **Tradeoff:** incluir Vue en cada bundle hace que el usuario final no tenga que cargar Vue por separado, pero duplica el runtime si carga varios componentes. Ver [SKILL.md principal](../../comegen-ui/SKILL.md#tamaños-de-los-bundles) para los tamaños.

## Versión

La versión se toma de `package.json` (`"version": "2.3.0"`) o del primer argumento:

```bash
pnpm build:lib
# → usa package.json → 2.3.0

pnpm build:lib 2.4.0
# → usa 2.4.0 para el zip y el README-BUILD.md
```

## Comandos relacionados

```bash
pnpm build            # type-check + build-only (vite build) — para dev
pnpm build-only       # vite build (genera el bundle de la app Vite, no los UMD)
pnpm build:lib        # ← ESTE: genera los UMD
pnpm build-storybook  # genera un build estático de Storybook
```

## Hot-reload en desarrollo

```bash
pnpm dev
```

Esto levanta Vite en modo dev, que sirve `index.html` (la app Vite que monta `src/App.vue`).

**No** sirve el playground ni recarga los UMD automáticamente. El playground lee de `dist/`, que solo se regenera con `pnpm build:lib`.

## Build CI / deploy

Hay un script bash que usa `pan` (CLI de hefesto) para automatizar:

```bash
# scripts/build_library.sh
pan confirm -t "Build Library" -m "¿Compilar la librería ComegenUI?" -y "Compilar"
pan spin -l -t "Compilando librería..." -a dots -- pnpm build:lib
```

O el menú interactivo `menu.sh`:

```bash
./menu.sh
# → Library/Build
# → Library/Move and Unzip
# → Storybook Dev
# → Configuración
# → Salir
```

Ver [scripts.md](scripts.md) para el detalle.

## Troubleshooting

### El bundle se ve desactualizado

Los UMD se cachean en el navegador. Agregá `?t=<número>` al src del script en `playground/index.html` para forzar reload:

```html
<script src="../dist/CuTable.umd.js?t=5"></script>
```

### Un componente no aparece en `dist/`

Verificar que exista su archivo `.ts` correspondiente (ej: `Button.ts`). El glob es `"./src/components/**/*.ts"`.

### El bundle no registra el Custom Element

Verificar que el `.ts` llame a `customElements.define(...)`. Si solo hace `export default`, el build igual genera el archivo pero no se registra nada en el navegador.

### El bundle es enorme

Normal: Vue está incluido. Si se quiere externalizar, ver el código comentado en `build-libs.ts` (líneas 40-48).
