/**
 * 商品相关 API
 */

import request from '../request'
import type { PageResult } from '@/types/global'
import type {
  Product,
  ProductQueryParams,
  ProductFormData,
  ProductCategory
} from '@/types/models/product'

/**
 * 获取商品列表（分页）
 * @param params 查询参数
 * @returns 分页数据
 */
export function getProductList(params: ProductQueryParams): Promise<PageResult<Product>> {
  return request.get('/products', params)
}

/**
 * 获取商品详情
 * @param id 商品 ID
 * @returns 商品详情
 */
export function getProductDetail(id: number): Promise<Product> {
  return request.get(`/products/${id}`)
}

/**
 * 创建商品
 * @param data 商品数据
 * @returns 创建的商品
 */
export function createProduct(data: ProductFormData): Promise<Product> {
  return request.post('/products', data)
}

/**
 * 更新商品
 * @param id 商品 ID
 * @param data 商品数据
 * @returns 更新后的商品
 */
export function updateProduct(id: number, data: ProductFormData): Promise<Product> {
  return request.put(`/products/${id}`, data)
}

/**
 * 删除商品
 * @param id 商品 ID
 */
export function deleteProduct(id: number): Promise<void> {
  return request.delete(`/products/${id}`)
}

/**
 * 批量删除商品
 * @param ids 商品 ID 列表
 */
export function batchDeleteProducts(ids: number[]): Promise<void> {
  return request.post('/products/batch-delete', { ids })
}

/**
 * 商品上架
 * @param id 商品 ID
 */
export function onSaleProduct(id: number): Promise<void> {
  return request.post(`/products/${id}/on-sale`)
}

/**
 * 商品下架
 * @param id 商品 ID
 */
export function offSaleProduct(id: number): Promise<void> {
  return request.post(`/products/${id}/off-sale`)
}

/**
 * 获取商品分类列表
 * @returns 商品分类树
 */
export function getProductCategories(): Promise<ProductCategory[]> {
  return request.get('/products/categories')
}

/**
 * 上传商品图片
 * @param file 图片文件
 * @param onProgress 上传进度回调
 * @returns 图片 URL
 */
export function uploadProductImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  return request.upload('/products/upload-image', formData, (progressEvent) => {
    if (onProgress && progressEvent.total) {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(percent)
    }
  })
}
