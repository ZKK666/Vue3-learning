/**
 * Vue Router 配置入口
 */

import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes, asyncRoutes } from './routes'
import { setupRouterGuards } from './guards'

/**
 * 创建 Router 实例
 *
 * createWebHistory: HTML5 History 模式
 * - URL: http://example.com/user/id
 * - 需要服务器配置支持
 *
 * createWebHashHistory: Hash 模式
 * - URL: http://example.com/#/user/id
 * - 无需服务器配置
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  // 滚动行为：每次路由切换时滚动到顶部
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 设置路由守卫
setupRouterGuards(router)

export default router
