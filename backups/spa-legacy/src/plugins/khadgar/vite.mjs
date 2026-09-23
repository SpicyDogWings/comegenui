// src/plugins/khadgar/vite.mjs — Plugin Vite de Khadgar (Node-only).
//
// - dev: sirve la API on-demand en `/@khadgar/index.json` y `/@khadgar/:name.json`.
// - build: escribe el estático `public/khadgar.json` (Vite lo copia a `dist/`).
//
// No se importa desde el browser (`src/main.ts` usa `index.ts`). El extractor se
// carga con `import()` de ruta absoluta para que el bundling del config no lo rompa.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_EXTRACT = "src/plugins/khadgar/extract/index.mjs";
const DEFAULT_CHECKER = "src/plugins/khadgar/extract/checker.mjs";

export default function khadgar(options = {}) {
  let root = process.cwd();
  let cache = null;

  const load = (rel) => import(pathToFileURL(resolve(root, rel)).href);
  const loadConfig = () => {
    const file = resolve(root, options.configFile ?? "khadgar.config.json");
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf-8")) : {};
  };
  const getIndex = async () => {
    if (cache) return cache;
    const { buildIndex } = await load(options.extract ?? DEFAULT_EXTRACT);
    cache = buildIndex({ root, config: loadConfig() });
    return cache;
  };
  const invalidate = async () => {
    cache = null;
    const { resetChecker } = await load(options.checker ?? DEFAULT_CHECKER);
    resetChecker();
  };

  const json = (res, code, body) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.end(JSON.stringify(body));
  };

  return {
    name: "khadgar",
    configResolved(config) {
      root = options.root ?? config.root;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        if (!url.startsWith("/@khadgar/")) return next();
        getIndex()
          .then((index) => {
            if (url === "/@khadgar/index.json") return json(res, 200, index);
            const match = /^\/@khadgar\/(.+)\.json$/.exec(url);
            if (!match) return next();
            const key = decodeURIComponent(match[1]).toLowerCase();
            const component = index.components.find(
              (item) => item.name.toLowerCase() === key || item.tag === key,
            );
            if (!component) return json(res, 404, { error: `khadgar: no existe "${key}"` });
            return json(res, 200, component);
          })
          .catch((error) => json(res, 500, { error: String(error?.message ?? error) }));
      });

      server.watcher.on("all", (_event, file) => {
        if (
          file.includes("/src/components/") ||
          file.endsWith("khadgar.config.json") ||
          file.endsWith(".doc.json")
        ) {
          invalidate().catch(() => {});
        }
      });
    },
    async buildStart() {
      if (options.write === false) return;
      const { buildIndex } = await load(options.extract ?? DEFAULT_EXTRACT);
      const index = buildIndex({ root, config: loadConfig() });
      const out = resolve(root, options.out ?? "public/khadgar.json");
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, JSON.stringify(index));
    },
  };
}
