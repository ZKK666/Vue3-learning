/**
 * 路由守卫
 * 在路由跳转前进行权限验证、用户信息获取等操作
 */

import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { usePermissionStore } from '@/stores/modules/permission'
import { WHITE_LIST } from '@/utils/constants'

/**
 * 设置路由守卫
 * @param router Vue Router 实例
 *
 * 守卫执行流程：
 * 1. 检查目标路由是否在白名单中
 * 2. 检查用户是否已登录（Token）
 * 3. 已登录：检查是否有用户信息，没有则获取
 * 4. 未登录：跳转到登录页
 *
 * 与 React Router 的区别：
 * - React: 使用 ProtectedRoute 组件包装
 * - Vue: 使用全局路由守卫
 */
export function setupRouterGuards(router: Router) {
  /**
   * 全局前置守卫
   * 在每次路由跳转前执行
   */
  router.beforeEach(async (to, _from, next) => {
    // 设置页面标题
    document.title = (to.meta.title as string) || 'Vue3 电商管理后台'

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 1. 检查白名单（不需要登录的页面）
    if (WHITE_LIST.includes(to.path)) {
      next()
      return
    }

    // 2. 检查是否已登录
    if (!userStore.isLogin) {
      // 未登录，跳转到登录页，并记录目标路径
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 3. 已登录，检查是否有用户信息
    if (!userStore.userInfo) {
      try {
        // 获取用户信息
        await userStore.getUserInfo()

        // 根据用户角色生成动态路由
        const accessRoutes = await permissionStore.generateRoutes(userStore.roles)

        // 动态添加路由
        accessRoutes.forEach((route) => {
          router.addRoute(route)
        })

        // 重新进入目标路由（确保动态路由已加载）
        next({ ...to, replace: true })
      } catch (error) {
        // 获取用户信息失败，清除登录状态并跳转到登录页
        console.error('获取用户信息失败:', error)
        userStore.clearUserData()
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
      return
    }

    // 4. 检查路由权限（如果路由有权限要求）
    if (to.meta.permission && !userStore.hasPermission(to.meta.permission as string)) {
      // 无权限，跳转到 403 页面
      next('/404') // 暂时跳转到 404，后续可以添加 403 页面
      return
    }

    // 5. 所有检查通过，允许访问
    next()
  })

  /**
   * 全局后置钩子
   * 在路由跳转完成后执行
   */
  router.afterEach((_to, _from) => {
    // 可以在这里添加一些后置处理
    // 例如：页面访问统计、埋点等
  })

  /**
   * 路由错误处理
   */
  router.onError((error) => {
    console.error('路由错误:', error)
  })
}
