# Instalar y actualizar

## Qué trae el zip

```
comegenui-v{version}.zip
├── Cu*.umd.js      ← un UMD por componente (trae el runtime de Vue adentro)
├── css/
│   ├── themes.css  ← todos los temas
│   └── {tema}.css  ← un archivo por tema (light, dark, nord-frost, …)
└── README-BUILD.md
```

No hay dependencias que instalar: cada `.umd.js` se auto-registra
(`customElements.define('cu-x', …)`) cuando el `<script>` se carga.

## Instalar

1. Descomprimí el zip en una carpeta de tu proyecto (ej. `vendor/comegenui/`).
2. Cargá **primero el CSS del tema** y después sólo los UMD que uses:

```html
<link rel="stylesheet" href="vendor/comegenui/css/themes.css">
<!-- o sólo el tema activo: css/light.css -->

<script src="vendor/comegenui/CuButton.umd.js"></script>
<script src="vendor/comegenui/CuAlert.umd.js"></script>
```

3. Usá los tags:

```html
<cu-button color="primary" variant="solid">Guardar</cu-button>
<cu-alert color="success" variant="soft">Listo</cu-alert>
```

## Actualizar

Se reemplazan archivos, no hay instalador:

- Copiá los `Cu*.umd.js` nuevos (podés copiar sólo los que usás).
- Si cambió el tema o la versión de tokens, copiá también `css/`.
- Si un componente "no cambia nada" después de actualizar, casi siempre quedó el UMD
  viejo en la carpeta o el navegador lo tiene cacheado.

## Buildear la lib (sólo en el repo de ComegenUI)

```bash
pnpm build:lib            # dist-lib/*.umd.js + dist-lib/css + dist-lib/comegenui-v{version}.zip
pnpm build:lib v5.0.0     # fuerza la versión del zip
```

El zip sale de `build-lib.ts`: los UMD + `css/` + `README-BUILD.md`. **No** incluye la
documentación ni los updaters (se eliminaron): la doc vive en el repo
(`docs/componentes/`).
