// import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index"
import CuTokens from "./plugins/cu-tokens"
import CuPlayground from "./plugins/cu-playground"
import playgroundConfig from "../cu-playground.config.json"
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(CuPlayground, {
  router,
  config: playgroundConfig,
  stories: import.meta.glob("./stories/**/*.stories.ts"),
  pages: import.meta.glob("./playground/**/*.vue"),
})
app.use(router)
app.use(CuTokens)
app.mount('#app')
