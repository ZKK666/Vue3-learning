/**
 * Mock 数据
 * 用于开发环境模拟后端接口
 */

import { ProductStatus } from '@/types/models/product'
import { OrderStatus, PaymentMethod } from '@/types/models/order'
import { UserStatus } from '@/types/models/user'

/**
 * Dashboard 核心指标数据
 */
export const mockDashboardMetrics = {
  totalSales: 1285600,
  totalOrders: 1234,
  totalUsers: 856,
  totalProducts: 342,
  todaySales: 38500,
  todayOrders: 56,
  todayUsers: 12,
  yesterdaySales: 32000
}

/**
 * 商品列表数据
 */
export const mockProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Apple 最新旗舰手机，A17 Pro 芯片，钛金属设计',
    price: 9999,
    originalPrice: 10999,
    stock: 128,
    category: '电子产品',
    images: [
      'https://picsum.photos/800/800?random=1',
      'https://picsum.photos/800/800?random=2'
    ],
    status: ProductStatus.OnSale,
    sales: 523,
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-20 15:20:00'
  },
  {
    id: 2,
    name: 'MacBook Pro 14英寸 M3 芯片',
    description: '专业级笔记本电脑，适合开发和设计',
    price: 14999,
    originalPrice: 15999,
    stock: 45,
    category: '电子产品',
    images: ['https://picsum.photos/800/800?random=3'],
    status: ProductStatus.OnSale,
    sales: 234,
    createdAt: '2024-01-10 09:00:00',
    updatedAt: '2024-01-18 11:30:00'
  },
  {
    id: 3,
    name: 'AirPods Pro 第二代',
    description: '主动降噪无线耳机，支持空间音频',
    price: 1899,
    originalPrice: 1999,
    stock: 0,
    category: '电子产品',
    images: ['https://picsum.photos/800/800?random=4'],
    status: ProductStatus.OutOfStock,
    sales: 1256,
    createdAt: '2024-01-05 14:20:00',
    updatedAt: '2024-01-22 16:45:00'
  },
  {
    id: 4,
    name: 'Nike Air Max 90 运动鞋',
    description: '经典复古跑鞋，舒适透气',
    price: 899,
    originalPrice: 1099,
    stock: 256,
    category: '服装',
    images: ['https://picsum.photos/800/800?random=5'],
    status: ProductStatus.OnSale,
    sales: 789,
    createdAt: '2024-01-12 11:15:00',
    updatedAt: '2024-01-19 09:30:00'
  },
  {
    id: 5,
    name: '纯棉T恤 基础款',
    description: '100%纯棉，多色可选',
    price: 89,
    stock: 500,
    category: '服装',
    images: ['https://picsum.photos/800/800?random=6'],
    status: ProductStatus.Draft,
    sales: 0,
    createdAt: '2024-01-23 16:00:00',
    updatedAt: '2024-01-23 16:00:00'
  }
]

/**
 * 订单列表数据
 */
export const mockOrders = [
  {
    id: '1',
    orderNo: 'ORD202401230001',
    userId: 1,
    userName: '张三',
    userPhone: '13800138000',
    items: [
      {
        productId: 1,
        productName: 'iPhone 15 Pro Max 256GB',
        productImage: 'https://picsum.photos/800/800?random=1',
        price: 9999,
        quantity: 1,
        subtotal: 9999
      }
    ],
    totalAmount: 9999,
    paymentAmount: 9899,
    discountAmount: 100,
    paymentMethod: PaymentMethod.Alipay,
    status: OrderStatus.Paid,
    shippingAddress: {
      consignee: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      address: '科技园南区深南大道 10000 号',
      zipCode: '518000'
    },
    createdAt: '2024-01-23 10:30:25',
    paidAt: '2024-01-23 10:32:18'
  },
  {
    id: '2',
    orderNo: 'ORD202401230002',
    userId: 2,
    userName: '李四',
    userPhone: '13900139000',
    items: [
      {
        productId: 2,
        productName: 'MacBook Pro 14英寸 M3 芯片',
        productImage: 'https://picsum.photos/800/800?random=3',
        price: 14999,
        quantity: 1,
        subtotal: 14999
      },
      {
        productId: 3,
        productName: 'AirPods Pro 第二代',
        productImage: 'https://picsum.photos/800/800?random=4',
        price: 1899,
        quantity: 1,
        subtotal: 1899
      }
    ],
    totalAmount: 16898,
    paymentAmount: 16698,
    discountAmount: 200,
    paymentMethod: PaymentMethod.WeChat,
    status: OrderStatus.Shipped,
    shippingAddress: {
      consignee: '李四',
      phone: '13900139000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      address: '建国路 88 号 SOHO 现代城',
      zipCode: '100000'
    },
    createdAt: '2024-01-23 09:15:30',
    paidAt: '2024-01-23 09:20:45',
    shippedAt: '2024-01-23 14:30:00'
  },
  {
    id: '3',
    orderNo: 'ORD202401230003',
    userId: 3,
    userName: '王五',
    userPhone: '13700137000',
    items: [
      {
        productId: 4,
        productName: 'Nike Air Max 90 运动鞋',
        productImage: 'https://picsum.photos/800/800?random=5',
        price: 899,
        quantity: 2,
        subtotal: 1798
      }
    ],
    totalAmount: 1798,
    paymentAmount: 1798,
    discountAmount: 0,
    paymentMethod: PaymentMethod.Cash,
    status: OrderStatus.Pending,
    shippingAddress: {
      consignee: '王五',
      phone: '13700137000',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      address: '陆家嘴环路 1000 号',
      zipCode: '200000'
    },
    createdAt: '2024-01-23 15:45:12'
  }
]

/**
 * 用户列表数据
 */
export const mockUsers = [
  {
    id: 1,
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    avatar: 'https://i.pravatar.cc/150?img=1',
    roles: ['admin', 'editor'],
    permissions: ['product:*', 'order:*', 'user:*'],
    status: UserStatus.Active,
    createdAt: '2023-06-01 10:00:00',
    updatedAt: '2024-01-20 15:30:00'
  },
  {
    id: 2,
    username: 'lisi',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13900139000',
    avatar: 'https://i.pravatar.cc/150?img=2',
    roles: ['editor'],
    permissions: ['product:read', 'product:update', 'order:read'],
    status: UserStatus.Active,
    createdAt: '2023-08-15 14:20:00',
    updatedAt: '2024-01-18 09:15:00'
  },
  {
    id: 3,
    username: 'wangwu',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13700137000',
    avatar: 'https://i.pravatar.cc/150?img=3',
    roles: ['viewer'],
    permissions: ['product:read', 'order:read'],
    status: UserStatus.Disabled,
    createdAt: '2023-10-10 16:45:00',
    updatedAt: '2024-01-22 11:20:00'
  }
]

/**
 * 根据 ID 查找商品
 */
export function getMockProductById(id: number) {
  return mockProducts.find(p => p.id === id)
}

/**
 * 根据 ID 查找订单
 */
export function getMockOrderById(id: string) {
  return mockOrders.find(o => o.id === id)
}

/**
 * 根据 ID 查找用户
 */
export function getMockUserById(id: number) {
  return mockUsers.find(u => u.id === id)
}
