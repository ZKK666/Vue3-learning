/**
 * Dashboard 数据统计相关 API
 */

import request from '../request'

/**
 * 核心指标数据
 */
export interface CoreMetrics {
  totalSales: number // 总销售额
  totalOrders: number // 总订单数
  totalUsers: number // 总用户数
  totalProducts: number // 总商品数
  todaySales: number // 今日销售额
  todayOrders: number // 今日订单数
  todayUsers: number // 今日新增用户
  yesterdaySales: number // 昨日销售额（用于计算增长率）
}

/**
 * 销售趋势数据点
 */
export interface SalesTrendDataPoint {
  date: string // 日期
  sales: number // 销售额
  orders: number // 订单数
}

/**
 * 商品分类销售数据
 */
export interface CategorySalesData {
  category: string // 分类名称
  sales: number // 销售额
  percentage: number // 占比
}

/**
 * 近期订单
 */
export interface RecentOrder {
  id: string
  orderNo: string
  userName: string
  totalAmount: number
  status: number
  createdAt: string
}

/**
 * 获取核心指标数据
 * @returns 核心指标
 */
export function getCoreMetrics(): Promise<CoreMetrics> {
  return request.get('/dashboard/core-metrics')
}

/**
 * 获取销售趋势数据
 * @param days 天数，默认 7 天
 * @returns 销售趋势数据
 */
export function getSalesTrend(days: number = 7): Promise<SalesTrendDataPoint[]> {
  return request.get('/dashboard/sales-trend', { days })
}

/**
 * 获取商品分类销售数据
 * @returns 分类销售数据
 */
export function getCategorySales(): Promise<CategorySalesData[]> {
  return request.get('/dashboard/category-sales')
}

/**
 * 获取近期订单
 * @param limit 数量限制，默认 10 条
 * @returns 近期订单列表
 */
export function getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
  return request.get('/dashboard/recent-orders', { limit })
}

/**
 * 获取用户增长数据
 * @param days 天数，默认 7 天
 * @returns 用户增长数据
 */
export function getUserGrowth(
  days: number = 7
): Promise<Array<{ date: string; count: number }>> {
  return request.get('/dashboard/user-growth', { days })
}
