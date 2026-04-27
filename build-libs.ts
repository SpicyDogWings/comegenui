import { build } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import fg from "fast-glob";
import { resolve, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = fg.sync("./src/components/**/*.ts");

async function runBuilds() {
  console.log("📦 Preparando Vue Core...");
  const vendorDir = resolve(__dirname, "dist/vendor");
  if (!fs.existsSync(vendorDir)) fs.mkdirSync(vendorDir, { recursive: true });
  fs.copyFileSync(
    resolve(__dirname, "node_modules/vue/dist/vue.runtime.global.prod.js"),
    resolve(vendorDir, "vue-runtime.iife.js"),
  );

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
          formats: ["umd", "iife"],
        },
        minify: false,
        rollupOptions: {
          external: ["vue"],
          output: {
            inlineDynamicImports: true,
            globals: {
              vue: "Vue",
            },
          },
        },
      },
    });
  }
  console.log("\n✅ ¡Todos los componentes exportados en /dist!");
}

await runBuilds();
