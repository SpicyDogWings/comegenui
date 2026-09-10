# `cu-playground` — plugin de playground

Plugin de desarrollo de ComegenUI. Toma un `.vue`, le lee el **contrato**
(props, emits, exposes, slots, tokens) con `vue/compiler-sfc`, genera/actualiza su
story y sirve la página del playground en runtime (con nav automático y
posibilidad de páginas físicas de override).

## Entry points

| Archivo | Tipo | Qué hace |
|---|---|---|
| `index.ts` | Vue plugin | `app.use(CuPlayground, { router, stories, pages, config })`: registra la ruta `components/:name`, provee el registry (stories + nav + páginas) y arma el nav desde las stories. **Instalar antes de `app.use(router)`**. |
| `keys.ts` | Tipos + `InjectionKey` | `playgroundKey`, `PlaygroundRegistry`, `StoryEntry`, `NavGroup`. Lo consume el runtime. |
| `config.ts` | Tipos | `PlaygroundConfig` + `resolvePlaygroundConfig` (defaults). |
| `runtime/` | Vue SFCs | `StoryPage`, `StoryBody`, `StoryRenderer`, `PlaygroundLayout`, `PlaygroundStyle`, `PlaygroundApiComponents`, `SectionDemo`, `TestResultBadge`, `outline.ts`. |
| `cli/generate.mjs` | Node CLI | Genera/actualiza la story desde el contrato del `.vue`. |
| `cli/parse-sfc.mjs` | Node CLI | Parser del `.vue` (props/emits/exposes/slots/tokens/sub-componentes). |
| `vitest/reporter.ts` | Reporter | Escribe `public/test-results.json` (badges ✅/❌). |

## Comandos

```bash
pnpm cu-playground:generate Button            # story + test desde el contrato
pnpm cu-playground:generate Button --meta-only # solo tokens/api (página genérica)
pnpm cu-playground:generate Button --pages     # + página física editable
pnpm cu-playground:generate --all              # barre componentsDir
pnpm cu-playground:generate Button --force     # pisa story existente
```

> `stories:generate` sigue como alias del mismo comando.

## Configuración: `cu-playground.config.json` (raíz)

```json
{
  "componentsDir": "src/components",
  "storiesDir": "src/stories",
  "playgroundDir": "src/playground",
  "base": "/playground/components",
  "pages": false,
  "exclude": [],
  "nav": {
    "order": ["buttons", "form"],
    "groups": { "form": "Formularios" },
    "exclude": []
  }
}
```

El runtime la recibe desde `main.ts`; el CLI la lee del archivo.

## Runtime

- **Registry lazy**: `import.meta.glob("./stories/**/*.stories.ts")` (sin
  `eager`) → cada story es un chunk y se carga al navegar. El nav se deriva del
  path del glob (categoría = subcarpeta), sin cargar contenido.
- **Página genérica**: `StoryPage` resuelve `:name` → página física si existe,
  si no la story y renderiza `StoryBody` (secciones + extras + Style + API).
- **Página física**: si hay un `.vue` en `playgroundDir` con el nombre del
  componente, el plugin lo usa como override (aunque no lo haya generado el
  plugin).

## Convenciones

- Config por componente: `src/stories/{cat}/X.stories.config.json`
  (`include`/`exclude`/`order`, `sections`, `custom`, `attrs`, `api`, `tokens`,
  `subComponents`, `components`, `interfaceCode`).
- Extras por componente: `src/stories/{cat}/X.stories.extras.ts` (`StoryExtra[]`).
- El generador **no pisa** la story (salvo `--force`) ni el archivo de extras.
- `--meta-only` preserva descripciones y deps curadas.

## Llevarlo a otro proyecto

1. Copiá `src/plugins/cu-playground/` al `src/plugins/` del destino.
2. Copiá `cu-playground.config.json` y ajustá rutas.
3. En `main.ts`:
   ```ts
   app.use(CuPlayground, {
     router,
     config: playgroundConfig,
     stories: import.meta.glob("./stories/**/*.stories.ts"),
     pages: import.meta.glob("./playground/**/*.vue"),
   })
   ```
   **antes** de `app.use(router)`.
4. En `vitest.config.ts`: `reporters: ["default", "./src/plugins/cu-playground/vitest/reporter.ts"]`.

> El runtime usa componentes de ComegenUI (`Navbar`, `Outline`, `Badge`, `Table`,
> `CodeBlock`, `Tabs`). Al llevarlo, copiá esos archivos o parametrizalos.
