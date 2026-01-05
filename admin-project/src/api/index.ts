/**
 * API 统一导出
 * 方便在组件中导入使用
 *
 * 使用示例：
 * import { login, getProductList } from '@/api'
 */

// 认证相关
export * from './modules/auth'

// 商品相关
export * from './modules/product'

// 订单相关
export * from './modules/order'

// 用户相关
export * from './modules/user'

// Dashboard 相关
export * from './modules/dashboard'

// 导出 request 实例（用于特殊场景）
export { default as request } from './request'
