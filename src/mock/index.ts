/**
 * Mock 服务
 * 拦截 API 请求并返回模拟数据
 *
 * 使用方式：
 * 1. 在 main.ts 中导入并启用： import { setupMock } from '@/mock'
 * 2. 只在开发环境启用： if (import.meta.env.DEV) { setupMock() }
 */

import type { AxiosRequestConfig } from 'axios'
import {
  mockDashboardMetrics,
  mockProducts,
  mockOrders,
  mockUsers,
  getMockProductById,
  getMockOrderById,
  getMockUserById
} from './data'

/**
 * 模拟延迟（模拟真实网络请求）
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock 数据映射表
 */
const mockHandlers: Record<string, (config: AxiosRequestConfig) => Promise<any>> = {
  // Dashboard
  'GET /dashboard/core-metrics': async () => {
    await delay(300)
    return { code: 0, data: mockDashboardMetrics, message: 'success' }
  },

  // 商品管理
  'GET /products': async (config) => {
    await delay(500)
    const params = config.params || {}
    const { page = 1, pageSize = 10, keyword, category, status } = params

    let filteredProducts = [...mockProducts]

    // 搜索过滤
    if (keyword) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.includes(keyword) || p.description.includes(keyword)
      )
    }

    // 分类过滤
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    // 状态过滤
    if (status !== undefined && status !== '') {
      filteredProducts = filteredProducts.filter(p => p.status === Number(status))
    }

    // 分页
    const total = filteredProducts.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredProducts.slice(start, end)

    return {
      code: 0,
      data: { list, total },
      message: 'success'
    }
  },

  'GET /products/:id': async (config) => {
    await delay(300)
    const id = parseInt(config.url?.split('/').pop() || '0')
    const product = getMockProductById(id)

    if (!product) {
      return { code: 404, data: null, message: '商品不存在' }
    }

    return { code: 0, data: product, message: 'success' }
  },

  'POST /products': async (config) => {
    await delay(500)
    // 模拟创建成功
    return {
      code: 0,
      data: { id: Date.now(), ...config.data },
      message: 'success'
    }
  },

  'PUT /products/:id': async (config) => {
    await delay(500)
    return { code: 0, data: config.data, message: 'success' }
  },

  'DELETE /products/:id': async () => {
    await delay(300)
    return { code: 0, data: null, message: 'success' }
  },

  'POST /products/:id/on-sale': async () => {
    await delay(300)
    return { code: 0, data: null, message: 'success' }
  },

  'POST /products/:id/off-sale': async () => {
    await delay(300)
    return { code: 0, data: null, message: 'success' }
  },

  // 订单管理
  'GET /orders': async (config) => {
    await delay(500)
    const params = config.params || {}
    const { page = 1, pageSize = 10, keyword, status } = params

    let filteredOrders = [...mockOrders]

    // 关键词搜索
    if (keyword) {
      filteredOrders = filteredOrders.filter(o =>
        o.orderNo.includes(keyword) ||
        o.userName.includes(keyword) ||
        o.userPhone.includes(keyword)
      )
    }

    // 状态过滤
    if (status !== undefined && status !== '') {
      filteredOrders = filteredOrders.filter(o => o.status === Number(status))
    }

    // 分页
    const total = filteredOrders.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredOrders.slice(start, end)

    return {
      code: 0,
      data: { list, total },
      message: 'success'
    }
  },

  'GET /orders/:id': async (config) => {
    await delay(300)
    const id = config.url?.split('/').pop() || ''
    const order = getMockOrderById(id)

    if (!order) {
      return { code: 404, data: null, message: '订单不存在' }
    }

    return { code: 0, data: order, message: 'success' }
  },

  // 用户管理
  'GET /users': async (config) => {
    await delay(500)
    const params = config.params || {}
    const { page = 1, pageSize = 10, keyword, status } = params

    let filteredUsers = [...mockUsers]

    // 关键词搜索
    if (keyword) {
      filteredUsers = filteredUsers.filter(u =>
        u.username.includes(keyword) ||
        u.name.includes(keyword) ||
        u.phone.includes(keyword)
      )
    }

    // 状态过滤
    if (status !== undefined && status !== '') {
      filteredUsers = filteredUsers.filter(u => u.status === Number(status))
    }

    // 分页
    const total = filteredUsers.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filteredUsers.slice(start, end)

    return {
      code: 0,
      data: { list, total },
      message: 'success'
    }
  },

  'GET /users/:id': async (config) => {
    await delay(300)
    const id = parseInt(config.url?.split('/').pop() || '0')
    const user = getMockUserById(id)

    if (!user) {
      return { code: 404, data: null, message: '用户不存在' }
    }

    return { code: 0, data: user, message: 'success' }
  },

  'PUT /users/:id/status': async () => {
    await delay(300)
    return { code: 0, data: null, message: 'success' }
  }
}

/**
 * 匹配 Mock 处理器
 */
function matchMockHandler(method: string, url: string) {
  // 完全匹配
  const exactKey = `${method.toUpperCase()} ${url}`
  if (mockHandlers[exactKey]) {
    return mockHandlers[exactKey]
  }

  // 路径参数匹配 (如 /products/:id)
  for (const key in mockHandlers) {
    const [mockMethod, mockPath] = key.split(' ')

    if (mockMethod !== method.toUpperCase()) {
      continue
    }

    // 将路径参数模式转换为正则表达式
    if (mockPath) {
      const pattern = mockPath.replace(/:\w+/g, '[^/]+')
      const regex = new RegExp(`^${pattern}$`)

      if (regex.test(url)) {
        return mockHandlers[key]
      }
    }
  }

  return null
}

/**
 * 启用 Mock 服务
 *
 * 拦截 axios 请求并返回模拟数据
 */
export function setupMock() {
  // 动态导入 axios（避免循环依赖）
  import('axios').then((axiosModule) => {
    const axios = axiosModule.default

    // 添加请求拦截器（在原有拦截器之前）
    axios.interceptors.request.use(
      async (config: any) => {
        const { method = 'GET', url = '' } = config

        // 移除 baseURL
        const cleanUrl = url.replace(config.baseURL || '', '')

        // 匹配 Mock 处理器
        const handler = matchMockHandler(method, cleanUrl)

        if (handler) {
          console.log(`[Mock] ${method} ${cleanUrl}`)

          // 创建一个 Promise 来模拟异步响应
          const mockResponse = await handler(config)

          // 取消真实请求，返回 mock 数据
          config.adapter = () => {
            return Promise.resolve({
              data: mockResponse,
              status: 200,
              statusText: 'OK',
              headers: {},
              config
            })
          }
        }

        return config
      },
      (error: any) => Promise.reject(error)
    )

    console.log('[Mock] Mock 服务已启用')
  })
}
