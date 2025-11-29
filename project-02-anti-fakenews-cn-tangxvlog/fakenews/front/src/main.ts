import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './App.css'
import router from './router'
import { createStore, StoreSymbol } from './store'
import { createI18n, I18nSymbol } from './i18n'

const app = createApp(App)

// 提供 store 与 i18n，类似 React 的 context
const store = createStore()
const i18n = createI18n()
app.provide(StoreSymbol, store)
app.provide(I18nSymbol, i18n)

// 路由切换时显示顶部进度条
router.beforeEach((_to, _from, next) => { store.startProgress(); next() })
router.afterEach(() => { store.finishProgress() })

app.use(router)
app.mount('#app')