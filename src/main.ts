// import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index"
import CuTokens from "./plugins/cu-tokens"
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CuTokens)
app.mount('#app')
