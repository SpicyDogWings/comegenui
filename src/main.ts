// import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index"
import CuTokens from "./plugins/cu-tokens"
import Khadgar from "./plugins/khadgar"
import playgroundConfig from "../khadgar.config.json"
import App from './App.vue'

// Chrome real de ComegenUI para el playground (sin esto usa los fallbacks del plugin).
import AppLayout from '@/layouts/AppLayout.vue'
import Navbar from '@/components/navigation/Navbar.vue'
import Outline from '@/components/lab/collapse/navigation/Outline.vue'
import Badge from '@/components/information/Badge.vue'
import Table from '@/components/data/Table.vue'
import Button from '@/components/buttons/Button.vue'
import Tabs from '@/components/Tabs.vue'
import CodeBlock from '@/components/markdown/CodeBlock.vue'
import { getTokenDescription } from '@/config/css-tokens'

const app = createApp(App)
app.use(createPinia())
app.use(Khadgar, {
  router,
  config: playgroundConfig,
  stories: import.meta.glob("./stories/**/*.stories.ts"),
  pages: import.meta.glob("./playground/**/*.vue"),
  chrome: { appLayout: AppLayout, navbar: Navbar, outline: Outline, badge: Badge, table: Table, button: Button, tabs: Tabs, codeBlock: CodeBlock },
  getTokenDescription,
  libStatus: { entries: import.meta.glob('@/lib/**/*.ts'), aliases: { 'advanced-table': 'table' } },
})
app.use(router)
app.use(CuTokens)
app.mount('#app')
