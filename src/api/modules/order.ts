/**
 * 订单相关 API
 */

import request from '../request'
import type { PageResult } from '@/types/global'
import type { Order, OrderQueryParams, OrderStatus } from '@/types/models/order'

/**
 * 获取订单列表（分页）
 * @param params 查询参数
 * @returns 分页数据
 */
export function getOrderList(params: OrderQueryParams): Promise<PageResult<Order>> {
  return request.get('/orders', params)
}

/**
 * 获取订单详情
 * @param id 订单 ID
 * @returns 订单详情
 */
export function getOrderDetail(id: string): Promise<Order> {
  return request.get(`/orders/${id}`)
}

/**
 * 更新订单状态
 * @param id 订单 ID
 * @param status 新状态
 */
export function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  return request.put(`/orders/${id}/status`, { status })
}

/**
 * 取消订单
 * @param id 订单 ID
 * @param reason 取消原因
 */
export function cancelOrder(id: string, reason?: string): Promise<void> {
  return request.post(`/orders/${id}/cancel`, { reason })
}

/**
 * 发货
 * @param id 订单 ID
 * @param trackingNumber 物流单号
 * @param courier 快递公司
 */
export function shipOrder(
  id: string,
  trackingNumber: string,
  courier: string
): Promise<void> {
  return request.post(`/orders/${id}/ship`, { trackingNumber, courier })
}

/**
 * 导出订单数据
 * @param params 查询参数
 * @param filename 文件名
 */
export function exportOrders(params: OrderQueryParams, filename?: string): Promise<void> {
  return request.download('/orders/export', params, filename || '订单数据.xlsx')
}

/**
 * 获取订单统计数据
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 统计数据
 */
export function getOrderStatistics(
  startDate?: string,
  endDate?: string
): Promise<{
  total: number
  pending: number
  paid: number
  shipped: number
  completed: number
  cancelled: number
  totalAmount: number
}> {
  return request.get('/orders/statistics', { startDate, endDate })
}
