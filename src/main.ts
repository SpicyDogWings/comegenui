// import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index"
import CuTokens from "./plugins/cu-tokens"
import StoryPlayground from "./plugins/story-playground"
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(StoryPlayground, {
  router,
  stories: import.meta.glob("./stories/**/*.stories.ts", { eager: true }),
})
app.use(router)
app.use(CuTokens)
app.mount('#app')
