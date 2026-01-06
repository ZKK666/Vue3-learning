/**
 * Pinia Store 入口
 * 配置 Pinia 实例和插件
 */

import { createPinia } from 'pinia'

/**
 * 创建 Pinia 实例
 * Pinia 是 Vue3 官方推荐的状态管理库
 *
 * 与 Redux 的区别：
 * 1. 更简洁的 API，无需 reducer
 * 2. 完整的 TypeScript 支持，类型自动推断
 * 3. 支持 Composition API 风格（Setup Store）
 * 4. 模块化设计，无需手动组合 Store
 * 5. 支持插件系统
 */
const pinia = createPinia()

export default pinia

// 导出所有 Store modules
export * from './modules/user'
export * from './modules/app'
export * from './modules/permission'
