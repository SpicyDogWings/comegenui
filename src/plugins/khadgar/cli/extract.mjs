// src/plugins/khadgar/cli/extract.mjs — CLI: extrae la API y escribe `khadgar.json`.
//
// Uso:
//   node src/plugins/khadgar/cli/extract.mjs                 # → public/khadgar.json
//   node src/plugins/khadgar/cli/extract.mjs --stdout        # → stdout
//   node src/plugins/khadgar/cli/extract.mjs --only Alert,Button
//   node src/plugins/khadgar/cli/extract.mjs --out dist/khadgar.json
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildIndex } from "../extract/index.mjs";

function parseArgs(argv) {
  const args = { only: null, out: null, stdout: false, config: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--stdout") args.stdout = true;
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--only") args.only = argv[++i];
    else if (arg === "--config") args.config = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log("khadgar extract [--stdout] [--out <file>] [--only A,B] [--config <file>]");
      process.exit(0);
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const configPath = resolve(root, args.config ?? "khadgar.config.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf-8")) : {};

let components = config.components;
if (args.only) {
  const names = new Set(args.only.split(",").map((name) => name.trim()).filter(Boolean));
  components = (config.components ?? []).filter((item) => names.has(item.name));
}

const index = buildIndex({ root, config, components });

if (args.stdout) {
  process.stdout.write(JSON.stringify(index, null, 2));
} else {
  const out = resolve(root, args.out ?? "public/khadgar.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(index, null, 2));
  console.log(`khadgar: ${index.components.length} componentes → ${out}`);
}
