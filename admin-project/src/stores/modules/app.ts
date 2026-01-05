/**
 * 应用全局状态管理
 * 管理应用级别的配置和状态
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { themeStorage, localeStorage } from '@/utils/storage'

/**
 * 定义应用 Store
 */
export const useAppStore = defineStore('app', () => {
  // ==================== State ====================
  /** 侧边栏是否折叠 */
  const sidebarCollapsed = ref(false)

  /** 主题模式 */
  const theme = ref<'light' | 'dark'>(themeStorage.get() || 'light')

  /** 语言 */
  const locale = ref<string>(localeStorage.get() || 'zh-CN')

  /** 全局 Loading 状态 */
  const globalLoading = ref(false)

  /** 设备类型 */
  const device = ref<'desktop' | 'mobile'>('desktop')

  // ==================== Actions ====================
  /**
   * 切换侧边栏折叠状态
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 设置侧边栏折叠状态
   * @param collapsed 是否折叠
   */
  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  /**
   * 设置主题
   * @param newTheme 主题模式
   */
  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    themeStorage.set(newTheme)

    // 更新 HTML 的 class，用于 CSS 主题切换
    document.documentElement.className = newTheme
  }

  /**
   * 设置语言
   * @param newLocale 语言代码
   */
  function setLocale(newLocale: string) {
    locale.value = newLocale
    localeStorage.set(newLocale)
  }

  /**
   * 显示全局 Loading
   */
  function showGlobalLoading() {
    globalLoading.value = true
  }

  /**
   * 隐藏全局 Loading
   */
  function hideGlobalLoading() {
    globalLoading.value = false
  }

  /**
   * 设置设备类型
   * @param deviceType 设备类型
   */
  function setDevice(deviceType: 'desktop' | 'mobile') {
    device.value = deviceType
  }

  /**
   * 初始化应用设置
   * 从本地存储读取配置并应用
   */
  function initAppSettings() {
    // 应用主题
    document.documentElement.className = theme.value

    // 根据屏幕宽度判断设备类型
    const handleResize = () => {
      const width = document.documentElement.clientWidth
      if (width < 768) {
        setDevice('mobile')
        setSidebarCollapsed(true) // 移动端默认折叠侧边栏
      } else {
        setDevice('desktop')
      }
    }

    // 初始化时检查一次
    handleResize()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    // 返回清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // ==================== 返回 ====================
  return {
    // State
    sidebarCollapsed,
    theme,
    locale,
    globalLoading,
    device,

    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme,
    setLocale,
    showGlobalLoading,
    hideGlobalLoading,
    setDevice,
    initAppSettings
  }
})
