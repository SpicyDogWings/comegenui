import { build } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import fg from "fast-glob";
import { resolve, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import pkg from "archiver";
const { create } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = fg.sync("./src/components/**/*.ts");
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"));

async function runBuilds() {
  console.log("🧹 Limpiando directorio dist...");
  if (fs.existsSync(resolve(__dirname, "dist"))) {
    fs.rmSync(resolve(__dirname, "dist"), { recursive: true, force: true });
  }
  fs.mkdirSync(resolve(__dirname, "dist"), { recursive: true });

  console.log(`🚀 Iniciando exportación de ${files.length} componentes...`);
  for (const file of files) {
    const name = "Cu" + basename(file, extname(file));
    console.log(`📦 Empaquetando: ${name}...`);
    await build({
      configFile: false,
      define: { "process.env.NODE_ENV": JSON.stringify("production") },
      plugins: [vue({ features: { customElement: true } }), UnoCSS({ mode: "shadow-dom" })],
      build: {
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, file),
          name: name,
          fileName: (format) => `${name}.${format}.js`,
          formats: ["umd"],
        },
        minify: false,
        //rollupOptions: {
        //  external: ["vue"],
        //  output: {
        //    inlineDynamicImports: true,
        //    globals: {
        //      vue: "Vue",
        //    },
        //    manualChunks: undefined,
        //  },
        //},
      },
    });
  }
  console.log("\n✅ ¡Todos los componentes exportados en /dist!");
}

async function createZip(version: string) {
  console.log("📦 Creando zip con solo archivos UMD...");
  const output = fs.createWriteStream(resolve(__dirname, `dist/canary-ui-${version}.zip`));
  const archive = create("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ Zip creado: canary-ui-${version}.zip (${archive.pointer()} bytes)`);
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  
  // Agregar solo archivos UMD
  const umdFiles = fs.readdirSync(resolve(__dirname, "dist")).filter(f => f.endsWith(".umd.js"));
  for (const file of umdFiles) {
    archive.file(resolve(__dirname, "dist", file), { name: file });
  }
  
  await archive.finalize();
}

const version = process.argv[2] || packageJson.version;
await runBuilds();
await createZip(version);
