/**
 * 权限状态管理
 * 管理动态路由和权限控制
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 定义权限 Store
 */
export const usePermissionStore = defineStore('permission', () => {
  // ==================== State ====================
  /** 动态路由列表 */
  const routes = ref<RouteRecordRaw[]>([])

  /** 菜单列表（侧边栏显示） */
  const menuRoutes = ref<RouteRecordRaw[]>([])

  /** 是否已生成路由 */
  const isRoutesGenerated = ref(false)

  // ==================== Actions ====================
  /**
   * 根据角色生成路由
   * @param roles 用户角色列表
   * @returns 可访问的路由
   *
   * 动态路由的作用：
   * 1. 根据用户角色/权限动态生成可访问的路由
   * 2. 防止用户通过 URL 直接访问无权限的页面
   * 3. 实现菜单的动态显示隐藏
   */
  async function generateRoutes(_roles: string[]): Promise<RouteRecordRaw[]> {
    // 这里可以根据角色从后端获取路由配置
    // 或者从本地路由配置中过滤
    // 暂时返回所有路由（后续完善）

    // TODO: 根据角色过滤路由
    const accessibleRoutes: RouteRecordRaw[] = []

    routes.value = accessibleRoutes
    menuRoutes.value = accessibleRoutes
    isRoutesGenerated.value = true

    return accessibleRoutes
  }

  /**
   * 设置路由
   * @param newRoutes 路由列表
   */
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = newRoutes
  }

  /**
   * 添加路由
   * @param route 路由配置
   */
  function addRoute(route: RouteRecordRaw) {
    routes.value.push(route)
  }

  /**
   * 清除权限数据
   */
  function clearPermissions() {
    routes.value = []
    menuRoutes.value = []
    isRoutesGenerated.value = false
  }

  /**
   * 检查路由是否有权限访问
   * @param path 路由路径
   * @returns 是否有权限
   */
  function hasRoutePermission(path: string): boolean {
    return routes.value.some((route) => route.path === path)
  }

  // ==================== 返回 ====================
  return {
    // State
    routes,
    menuRoutes,
    isRoutesGenerated,

    // Actions
    generateRoutes,
    setRoutes,
    addRoute,
    clearPermissions,
    hasRoutePermission
  }
})
