# Instalar y actualizar

## Qué trae el zip

```
comegenui-v{version}.zip
├── Cu*.core.umd.js        ← variante core: Vue incluido (autocontenida)
├── Cu*.shared.umd.js      ← variante shared: Vue externo (menos peso)
├── comegen-vue.global.js  ← runtime de Vue para la variante shared
├── css/
│   ├── themes.css         ← todos los temas
│   └── {tema}.css         ← un archivo por tema (light, dark, nord-frost, …)
```

Cada componente se publica en **dos variantes**, con la misma API, el mismo tag y la misma
versión. Elegís una u otra según cuántos componentes cargues:

| Variante | Vue | Cuándo usarla |
|---|---|---|
| `CuX.core.umd.js` | incluido en el UMD | Cargás 1–2 componentes, o querés máxima compatibilidad: un `<script>` suelto y listo. |
| `CuX.shared.umd.js` | externo (`__COMEGEN_VUE__`) | Cargás 3 o más componentes: Vue viaja una sola vez en `comegen-vue.global.js`. |

No hay dependencias que instalar: cada `.umd.js` se auto-registra
(`defineComegenElement('cu-x', …)`) cuando el `<script>` se carga.

## Instalar

1. Descomprimí el zip en una carpeta de tu proyecto (ej. `vendor/comegenui/`).
2. Cargá **primero el CSS del tema** y después sólo los UMD que uses.

**Variante `core`** (Vue adentro, un `<script>` por componente):

```html
<link rel="stylesheet" href="vendor/comegenui/css/themes.css">
<!-- o sólo el tema activo: css/light.css -->

<script src="vendor/comegenui/CuButton.core.umd.js"></script>
<script src="vendor/comegenui/CuAlert.core.umd.js"></script>
```

**Variante `shared`** (cargá el runtime compartido **antes** que los componentes):

```html
<link rel="stylesheet" href="vendor/comegenui/css/themes.css">

<script src="vendor/comegenui/comegen-vue.global.js"></script>  <!-- runtime compartido -->
<script src="vendor/comegenui/CuButton.shared.umd.js"></script>
<script src="vendor/comegenui/CuAlert.shared.umd.js"></script>
```

> El runtime se expone como `globalThis.__COMEGEN_VUE__` (namespace propio), así que **no
> toca ni depende de un `window.Vue` del host**. Si olvidás cargarlo, los componentes
> `shared` fallan al registrarse.

3. Usá los tags:

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-alert color="success" variant="soft">Listo</cu-alert>
```

## Actualizar

Se reemplazan archivos, no hay instalador:

- Copiá los `Cu*.core.umd.js` (o `Cu*.shared.umd.js`) nuevos — podés copiar sólo los que usás.
- En la variante `shared`, copiá también `comegen-vue.global.js`.
- Si cambió el tema o la versión de tokens, copiá también `css/`.
- Si un componente "no cambia nada" después de actualizar, casi siempre quedó el UMD
  viejo en la carpeta o el navegador lo tiene cacheado.
- Para confirmar qué versión está cargada y cómo convivir versiones: `versionado.md`.

## Buildear la lib (sólo en el repo de ComegenUI)

```bash
pnpm build:lib            # dist-lib/Cu*.{core,shared}.umd.js + css + runtime + zip
pnpm build:lib v5.0.0     # fuerza la versión del zip
```

El zip sale de `build-lib.ts`: las dos variantes de cada UMD, `comegen-vue.global.js` y
`css/`. **No** incluye la documentación ni la skill: la doc vive en el repo
(`docs/componentes/`) y la skill se baja aparte (ver `SKILL.md`).
