import { build } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import fg from 'fast-glob';
import { resolve, basename, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const files = fg.sync("./src/components/**/*.ts");

async function runBuilds() {
  console.log(`🚀 Iniciando exportación de ${files.length} componentes...`);
  for (const file of files) {
    const name = 'Cu' + basename(file, extname(file));
    console.log(`📦 Empaquetando: ${name}...`);
    await build({
      configFile: false,
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      plugins: [
        vue({ features: { customElement: true } }),
        UnoCSS({ mode: "shadow-dom" }),
      ],
      build: {
        emptyOutDir: file === files[0],
        lib: {
          entry: resolve(__dirname, file),
          name: name,
          fileName: (format) => `${name}.${format}.js`,
          formats: ["umd", "iife"],
        },
        minify: false,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      },
    });
  }
  console.log('\n✅ ¡Todos los componentes exportados en /dist!');
}

runBuilds();
