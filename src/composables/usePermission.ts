/**
 * 权限判断 Composable
 *
 * 用途：封装权限判断逻辑，配合自定义指令使用
 *
 * 与 React 的区别：
 * - React: 通常创建 HOC 或 render props 组件
 * - Vue3: 结合自定义指令（v-permission）更优雅
 *
 * @example
 * ```typescript
 * const { hasPermission, hasRole } = usePermission()
 *
 * // 检查是否有某个权限
 * if (hasPermission('product:create')) {
 *   // 显示创建按钮
 * }
 *
 * // 检查是否有某个角色
 * if (hasRole('admin')) {
 *   // 显示管理员功能
 * }
 * ```
 */

import { computed, type ComputedRef } from 'vue'
import { useUserStore } from '@/stores/modules/user'

/**
 * 权限返回类型
 */
export interface UsePermissionReturn {
  /** 所有权限列表 */
  permissions: ComputedRef<string[]>
  /** 所有角色列表 */
  roles: ComputedRef<string[]>
  /** 检查是否有指定权限 */
  hasPermission: (permission: string | string[]) => boolean
  /** 检查是否有指定角色 */
  hasRole: (role: string | string[]) => boolean
  /** 检查是否有任一权限 */
  hasAnyPermission: (permissions: string[]) => boolean
  /** 检查是否有所有权限 */
  hasAllPermissions: (permissions: string[]) => boolean
  /** 检查是否是超级管理员 */
  isSuperAdmin: ComputedRef<boolean>
}

/**
 * usePermission - 权限判断封装
 *
 * @returns 权限状态和方法
 */
export function usePermission(): UsePermissionReturn {
  const userStore = useUserStore()

  /**
   * 所有权限列表（计算属性）
   *
   * 与 React 的区别：
   * - React: 使用 useSelector + useMemo
   * - Vue3: 使用 computed，自动依赖追踪
   */
  const permissions = computed(() => {
    return userStore.permissions || []
  })

  /**
   * 所有角色列表（计算属性）
   */
  const roles = computed(() => {
    return userStore.roles || []
  })

  /**
   * 检查是否是超级管理员
   */
  const isSuperAdmin = computed(() => {
    return roles.value.includes('super_admin') || roles.value.includes('admin')
  })

  /**
   * 检查是否有指定权限
   *
   * 权限格式：
   * - 'product:create' - 创建商品
   * - 'product:update' - 更新商品
   * - 'product:delete' - 删除商品
   * - 'product:*' - 商品所有权限
   *
   * @param permission - 权限标识（支持单个或数组）
   * @returns 是否有权限
   */
  const hasPermission = (permission: string | string[]): boolean => {
    // 超级管理员拥有所有权限
    if (isSuperAdmin.value) {
      return true
    }

    const permissionList = permissions.value

    // 如果权限列表为空，没有任何权限
    if (permissionList.length === 0) {
      return false
    }

    // 如果传入的是数组，检查是否拥有任一权限
    if (Array.isArray(permission)) {
      return permission.some((p) => permissionList.includes(p))
    }

    // 检查单个权限
    return permissionList.includes(permission)
  }

  /**
   * 检查是否有指定角色
   *
   * 角色格式：
   * - 'admin' - 管理员
   * - 'editor' - 编辑
   * - 'viewer' - 查看者
   *
   * @param role - 角色标识（支持单个或数组）
   * @returns 是否有角色
   */
  const hasRole = (role: string | string[]): boolean => {
    const roleList = roles.value

    // 如果角色列表为空，没有任何角色
    if (roleList.length === 0) {
      return false
    }

    // 如果传入的是数组，检查是否拥有任一角色
    if (Array.isArray(role)) {
      return role.some((r) => roleList.includes(r))
    }

    // 检查单个角色
    return roleList.includes(role)
  }

  /**
   * 检查是否有任一权限（OR 逻辑）
   *
   * @param permissionList - 权限列表
   * @returns 是否有任一权限
   */
  const hasAnyPermission = (permissionList: string[]): boolean => {
    return hasPermission(permissionList)
  }

  /**
   * 检查是否有所有权限（AND 逻辑）
   *
   * @param permissionList - 权限列表
   * @returns 是否有所有权限
   */
  const hasAllPermissions = (permissionList: string[]): boolean => {
    // 超级管理员拥有所有权限
    if (isSuperAdmin.value) {
      return true
    }

    const userPermissions = permissions.value

    // 如果权限列表为空，没有任何权限
    if (userPermissions.length === 0) {
      return false
    }

    // 检查是否拥有所有权限
    return permissionList.every((p) => userPermissions.includes(p))
  }

  return {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin
  }
}
