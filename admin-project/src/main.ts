/**
 * 应用入口文件
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 导入全局样式
import '@/assets/styles/index.scss'
import '@/assets/styles/element-override.scss'

// 导入 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')
