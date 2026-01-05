/**
 * 商品相关类型定义
 */

/** 商品信息 */
export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number // 原价
  stock: number // 库存
  category: string // 分类
  images: string[] // 商品图片
  status: ProductStatus
  sales: number // 销量
  createdAt: string
  updatedAt: string
}

/** 商品状态枚举 */
export enum ProductStatus {
  Draft = 0, // 草稿
  OnSale = 1, // 在售
  OffSale = 2, // 下架
  OutOfStock = 3 // 售罄
}

/** 商品查询参数 */
export interface ProductQueryParams {
  page: number
  pageSize: number
  keyword?: string // 商品名称
  category?: string // 分类
  status?: ProductStatus
  priceMin?: number // 最低价格
  priceMax?: number // 最高价格
}

/** 商品表单数据 */
export interface ProductFormData {
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  category: string
  images: string[]
  status: ProductStatus
}

/** 商品分类 */
export interface ProductCategory {
  id: string
  name: string
  parentId?: string
  children?: ProductCategory[]
}

/** 商品状态标签映射 */
export const ProductStatusMap: Record<ProductStatus, { label: string; type: string }> = {
  [ProductStatus.Draft]: { label: '草稿', type: 'info' },
  [ProductStatus.OnSale]: { label: '在售', type: 'success' },
  [ProductStatus.OffSale]: { label: '下架', type: 'warning' },
  [ProductStatus.OutOfStock]: { label: '售罄', type: 'danger' }
}
