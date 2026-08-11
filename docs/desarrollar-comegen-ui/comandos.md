# Comandos rápidos

Cheatsheet de los comandos más usados en el día a día.

## pnpm

### Desarrollo

```bash
pnpm dev                # Vite dev server (monta src/App.vue, hot-reload)
pnpm storybook          # Storybook en http://localhost:6006
```

### Build

```bash
pnpm build              # type-check + vite build (build de la app, no de la lib)
pnpm build-only         # vite build (sin type-check)
pnpm build:lib          # ← build de los UMD (lo que se distribuye)
pnpm build-storybook    # build estático de Storybook
```

### Testing

```bash
pnpm vitest             # modo watch
pnpm vitest run         # corre una vez
pnpm vitest --coverage  # con cobertura
```

### Type-check

```bash
pnpm type-check         # vue-tsc --build
```

## Bash scripts

```bash
./menu.sh                              # menú interactivo
bash scripts/build_library.sh          # compilar la lib
bash scripts/move_unzip.sh             # deploy del zip
bash scripts/storybook_dev.sh          # storybook
bash scripts/config.sh                 # editar variables de env
```

## Flujo típico: agregar un componente nuevo

```bash
# 0. Trabajar en una rama propia (nunca directo en main)
git checkout main && git pull --ff-only
git checkout -b feat/cu-mi-componente
# 1. Crear los 3 archivos del componente (.vue, .ce.vue, .ts)
# 2. Crear la storybook (src/stories/X.stories.ts)
# 3. Compilar
pnpm build:lib
# 4. Probar en el playground
# 5. Documentar (usar skill documentar-comegen-ui)
# 6. Commit y merge a main (o MR)
git add -A && git commit -m "feat(componente): descripción"
git push -u origin feat/cu-mi-componente
```

## Git (workflow de ramas)

Ver [convenciones-desarrollo.md](convenciones-desarrollo.md#workflow-de-ramas-git). Resumen:

```bash
git checkout main && git pull --ff-only            # actualizar main
git checkout -b <tipo>/<nombre>                    # crear rama (feat/fix/docs/test/chore)
# ...trabajar...
git add -A && git commit -m "<tipo>(<scope>): descripción"
git push -u origin <tipo>/<nombre>                 # subir rama
# mergear a main (o abrir MR) y borrar la rama local:
git checkout main && git pull --ff-only && git merge <tipo>/<nombre>
git branch -d <tipo>/<nombre>
```

## Flujo típico: iterar visualmente sobre un componente existente

```bash
pnpm dev                # vite dev (HMR de Vue/UnoCSS)
# o
pnpm storybook          # storybook con controles
```

## Flujo típico: deploy

```bash
# Opción A: con menú
./menu.sh
# → Library/Build
# → Library/Move and Unzip

# Opción B: comandos directos
pnpm build:lib
bash scripts/move_unzip.sh
```

## Verificar estado del build

```bash
ls dist/                # ver los UMD generados
ls -lh dist/*.umd.js    # ver tamaños
unzip -l dist/comegenui.zip   # ver contenido del zip
```

## Limpiar

```bash
rm -rf dist/            # borra el output del build
rm -rf node_modules/    # borra dependencias (cuidado)
rm -rf storybook-static/  # borra el build de Storybook
```

## Variables de entorno (path-dependent)

Si moviste el proyecto de lugar, los scripts van a fallar. Editá las variables:

```bash
bash scripts/config.sh
# → Configuración
# → Archivos/SOURCE_ZIP
# → Archivos/DESTINATION_PATH
```

O manualmente en `scripts/env.sh`:

```bash
SOURCE_ZIP="/nuevo/path/dist/comegenui.zip"
DESTINATION_PATH="/nuevo/destino"
```

## Dependencias clave

- **Vue 3.5+** — el framework base.
- **UnoCSS** — utility-first CSS.
- **color2k** — manipulación de color.
- **Vite 8** — build/dev server.
- **Storybook 10** — dev visual.
- **Vitest 4** — tests.
- **fast-glob** — discovery de archivos para el build de UMD.
- **archiver** — crear el zip final.

## Versiones

```bash
pnpm --version          # versión de pnpm
node --version          # requerido: ^20.19.0 || >=22.12.0
```

## Tabla resumen

| Tarea | Comando |
|-------|---------|
| Levantar dev server | `pnpm dev` |
| Levantar Storybook | `pnpm storybook` |
| Compilar UMD | `pnpm build:lib` |
| Compilar app | `pnpm build` |
| Type-check | `pnpm type-check` |
| Tests | `pnpm vitest` |
| Deploy | `./menu.sh` o `bash scripts/move_unzip.sh` |
| Editar paths de deploy | `bash scripts/config.sh` |
| Build Storybook (estático) | `pnpm build-storybook` |
