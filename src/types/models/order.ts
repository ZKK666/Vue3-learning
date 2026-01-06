/**
 * 订单相关类型定义
 */

/** 订单信息 */
export interface Order {
  id: string
  orderNo: string // 订单号
  userId: number
  userName: string
  userPhone: string
  items: OrderItem[] // 订单商品
  totalAmount: number // 总金额
  paymentAmount: number // 实付金额
  discountAmount: number // 优惠金额
  paymentMethod: PaymentMethod // 支付方式
  status: OrderStatus
  shippingAddress: ShippingAddress // 收货地址
  remark?: string // 备注
  createdAt: string
  paidAt?: string // 支付时间
  shippedAt?: string // 发货时间
  completedAt?: string // 完成时间
}

/** 订单商品项 */
export interface OrderItem {
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  subtotal: number // 小计
}

/** 订单状态枚举 */
export enum OrderStatus {
  Pending = 0, // 待支付
  Paid = 1, // 已支付
  Shipped = 2, // 已发货
  Completed = 3, // 已完成
  Cancelled = 4 // 已取消
}

/** 支付方式枚举 */
export enum PaymentMethod {
  Alipay = 1, // 支付宝
  WeChat = 2, // 微信支付
  UnionPay = 3, // 银联
  Cash = 4 // 货到付款
}

/** 收货地址 */
export interface ShippingAddress {
  consignee: string // 收货人
  phone: string
  province: string // 省
  city: string // 市
  district: string // 区
  address: string // 详细地址
  zipCode?: string // 邮编
}

/** 订单查询参数 */
export interface OrderQueryParams {
  page: number
  pageSize: number
  keyword?: string // 订单号/用户名/手机号
  status?: OrderStatus
  paymentMethod?: PaymentMethod
  startDate?: string // 开始日期
  endDate?: string // 结束日期
}

/** 订单状态标签映射 */
export const OrderStatusMap: Record<OrderStatus, { label: string; type: string }> = {
  [OrderStatus.Pending]: { label: '待支付', type: 'warning' },
  [OrderStatus.Paid]: { label: '已支付', type: 'success' },
  [OrderStatus.Shipped]: { label: '已发货', type: 'primary' },
  [OrderStatus.Completed]: { label: '已完成', type: 'info' },
  [OrderStatus.Cancelled]: { label: '已取消', type: 'danger' }
}

/** 支付方式标签映射 */
export const PaymentMethodMap: Record<PaymentMethod, string> = {
  [PaymentMethod.Alipay]: '支付宝',
  [PaymentMethod.WeChat]: '微信支付',
  [PaymentMethod.UnionPay]: '银联',
  [PaymentMethod.Cash]: '货到付款'
}
