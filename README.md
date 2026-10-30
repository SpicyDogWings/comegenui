# ComegenUI

Librería de componentes UI como **Web Components** (Custom Elements) hecha con Vue 3:
`<cu-button>`, `<cu-alert>`, `<cu-date-picker>`, `<cu-table>`… Cada componente viaja como un bundle
autocontenido —sin dependencias— y podés soltarlo tal cual en HTML plano o
importarlo dentro de un proyecto Vue.

Repo: [`SpicyDogWings/comegenui`](https://github.com/SpicyDogWings/comegenui) ·
Licencia: [MIT](./LICENSE).

## Instalar (vanilla, sin bundler)

Bajá de [Releases](https://github.com/SpicyDogWings/comegenui/releases) el zip de la configuración
que uses, descomprimilo en tu proyecto y cargá los componentes que necesites. Ejemplo con
**`esm-shared`** (ESM con Vue externo, resuelto con un import map):

```html
<script type="importmap">
{ "imports": { "vue": "./vendor/comegenui/comegen-vue.js" } }
</script>
<script type="module" src="./vendor/comegenui/CuButton.js"></script>
<script type="module" src="./vendor/comegenui/CuAlert.js"></script>

<cu-button color="primary">Guardar</cu-button>
<cu-alert color="success" variant="soft">Guardado correctamente</cu-alert>
```

Las **cuatro configuraciones** tienen la misma API y el mismo tag en todas:

| Config | Zip | Formato | Vue | Cuándo |
|---|---|---|---|---|
| `umd-core` | `comegenui-umd-core-v{version}.zip` | UMD | incluido | 1–2 componentes, `<script>` suelto, máxima compatibilidad |
| `umd-shared` | `comegenui-umd-shared-v{version}.zip` | UMD | externo (`__COMEGEN_VUE__`) | varios componentes en HTML; Vue viaja una vez en `comegen-vue.global.js` |
| `esm-core` | `comegenui-esm-core-v{version}.zip` | ESM | incluido | proyecto con bundler (Vite/webpack/Rollup) |
| `esm-shared` | `comegenui-esm-shared-v{version}.zip` | ESM | externo (`import 'vue'`) | bundler que ya tiene Vue, o navegador sin bundler con import map |

Otras formas de cargarlas (UMD, con bundler) y todo el detalle:
**[Instalación](docs/site/instalacion.md)**, en la documentación.

## Actualizar

No hay instalador: se reemplazan archivos. Con **`esm-shared`**:

1. Bajá el zip del ref nuevo y copiá los `CuX.js` que uses, encima de los viejos.
2. Si resolvés `vue` con un import map, reemplazá también `comegen-vue.js`.
3. Confirmá qué quedó cargado: `customElements.get('cu-button').comegen` → `{ version, type, … }`.

Si un componente "no cambia nada" después de actualizar, casi siempre quedó el bundle viejo (o el
navegador lo cacheó). Más detalle, y lo mismo para el resto de las configs:
**[Instalación](docs/site/instalacion.md)**.

## Versiones y documentación

La documentación publicada es la de la **última versión**. Cada release queda en un **tag** de git
(`v5.2.3`, `v5.2.2`, …) y la doc de esa versión se lee desde ahí:

```bash
git checkout v5.1.1
pnpm install
pnpm dev          # el sitio de esa versión en http://localhost:5173
pnpm build:lib    # y sus zips en dist-libs/
```

Detalle: [Versiones anteriores](docs/site/versiones-anteriores.md).

## Temas

El tema lo elige el **host**, no el componente: un atributo y listo.

```html
<html data-theme="dark">
```

- Sin `data-theme`, se usa la preferencia del sistema (`prefers-color-scheme`).
- Podés anidar `data-theme` en cualquier contenedor para tener **varios temas en la misma página**.
- Los colores se piden por nombre semántico (`primary`, `secondary`, `neutral`, `success`,
  `warning`, `danger`) y las variantes por prop (`solid`, `outlined`, `soft`, `ghost`, `subtle`,
  `link`).
- Los componentes **no traen tokens**: el tema lo aporta el CSS del host (`--cu-color-*`). Este sitio
  ya los tiene; en tu app definí los del tema que uses (ver Configuración).

Los colores de cada tema viven en `comegen.config.json`. Para elegir, cambiar, agregar o combinar
temas: **[Personalización](docs/site/personalizacion.md)**. Tokens y clases CSS:
**[Configuración](docs/site/configuracion.md)**.

## Skill `use-comegen` (para agentes)

Los componentes vienen con una skill de uso que **no viaja en el zip**: le enseña a un agente a
elegir, instalar, pasar datos, escuchar eventos, llamar métodos y tematizar. Se baja del repo con
el CLI [`skills`](https://skills.sh):

```sh
npx skills add SpicyDogWings/comegenui --skill use-comegen   # autodetecta el agente
npx skills update use-comegen                                # actualizar la skill
```

Con pnpm: `pnpm dlx skills add …`. Para fijar un ref concreto:

```sh
npx skills add "https://github.com/SpicyDogWings/comegenui/tree/v5.1.1/skills/use-comegen"
```

Sin CLI, bajá sólo la carpeta y copiala a `.opencode/skills/` de tu proyecto:

```sh
git clone --filter=blob:none --sparse --branch main \
  https://github.com/SpicyDogWings/comegenui.git /tmp/comegenui
cd /tmp/comegenui && git sparse-checkout set skills/use-comegen
mkdir -p <proyecto>/.opencode/skills
cp -r skills/use-comegen <proyecto>/.opencode/skills/
```

Cambiá `--branch main` por la rama o tag que quieras. Detalle y correspondencia con la versión de
la lib: [`skills/use-comegen/SKILL.md`](./skills/use-comegen/SKILL.md).

## Licencia

[MIT](./LICENSE) © SpicyDogWings
