// import 'virtual:uno.css'
import { createApp } from 'vue'
import router from "./router/index"
import CuTokens from "./plugins/cu-tokens"
import App from './App.vue'

createApp(App)
  .use(router)
  .use(CuTokens)
  .mount('#app')
