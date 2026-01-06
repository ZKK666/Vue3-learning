/**
 * 用户状态管理
 * 使用 Pinia Setup Store 语法（类似 React Hooks）
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams } from '@/types/models/user'
import { login as loginApi, getUserInfo as getUserInfoApi, logout as logoutApi } from '@/api'
import { tokenStorage, userInfoStorage } from '@/utils/storage'
import { usePermissionStore } from './permission'

/**
 * 定义用户 Store
 *
 * Pinia Setup Store 特点：
 * 1. 使用 Composition API 语法
 * 2. ref() = state
 * 3. computed() = getters
 * 4. function() = actions
 * 5. 自动的 TypeScript 类型推断
 *
 * 与 React Redux 对比：
 * - Redux: const [user, setUser] = useState()
 * - Pinia: const user = ref()
 *
 * - Redux: const isLogin = useMemo(() => !!user, [user])
 * - Pinia: const isLogin = computed(() => !!user.value)
 */
export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  // ref 定义状态，类似 React 的 useState
  const token = ref<string>(tokenStorage.get() || '')
  const userInfo = ref<UserInfo | null>(userInfoStorage.get<UserInfo>())

  // ==================== Getters ====================
  // computed 定义派生状态，类似 React 的 useMemo
  const isLogin = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name || '')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const roles = computed(() => userInfo.value?.roles || [])
  const permissions = computed(() => userInfo.value?.permissions || [])

  // ==================== Actions ====================
  /**
   * 登录
   * @param loginParams 登录参数
   *
   * 与 Redux 的区别：
   * - Redux: dispatch(loginAction(params))
   * - Pinia: await userStore.login(params)
   */
  async function login(loginParams: LoginParams) {
    try {
      const response = await loginApi(loginParams)

      // 保存 Token
      token.value = response.token
      tokenStorage.set(response.token)

      // 保存用户信息
      userInfo.value = response.userInfo
      userInfoStorage.set(response.userInfo)

      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  /**
   * 获取用户信息
   * 登录后调用，获取最新的用户信息和权限
   */
  async function getUserInfo() {
    try {
      const info = await getUserInfoApi()
      userInfo.value = info
      userInfoStorage.set(info)
      return info
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 登出
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 无论成功失败，都清除本地状态
      clearUserData()
    }
  }

  /**
   * 清除用户数据
   */
  function clearUserData() {
    token.value = ''
    userInfo.value = null
    tokenStorage.remove()
    userInfoStorage.remove()

    // 清除权限数据
    const permissionStore = usePermissionStore()
    permissionStore.clearPermissions()
  }

  /**
   * 更新用户信息（部分更新）
   * @param info 要更新的用户信息
   */
  function updateUserInfo(info: Partial<UserInfo>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...info }
      userInfoStorage.set(userInfo.value)
    }
  }

  /**
   * 检查是否有指定权限
   * @param permission 权限标识
   * @returns 是否有权限
   */
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  /**
   * 检查是否有指定角色
   * @param role 角色标识
   * @returns 是否有角色
   */
  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  // ==================== 返回 ====================
  /**
   * Setup Store 必须返回所有需要暴露的状态和方法
   * 类似 React Custom Hook 的返回值
   */
  return {
    // State
    token,
    userInfo,

    // Getters
    isLogin,
    userName,
    userAvatar,
    roles,
    permissions,

    // Actions
    login,
    logout,
    getUserInfo,
    clearUserData,
    updateUserInfo,
    hasPermission,
    hasRole
  }
})
