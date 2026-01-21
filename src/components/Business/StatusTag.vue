<!--
  StatusTag 状态标签组件

  用途：统一展示各种状态标签（订单状态、商品状态等）

  与 React 的区别：
  - React: 通常使用条件渲染
  - Vue3: 使用 computed 计算状态映射，更声明式

  使用示例：
  <StatusTag type="order" :status="1" />
  <StatusTag type="product" :status="0" />
-->

<template>
  <el-tag :type="tagType" :effect="effect">
    {{ statusText }}
  </el-tag>
</template>

<script setup lang="ts">
/**
 * 组件 Props
 */
export interface StatusTagProps {
  /** 状态类型 */
  type: 'order' | 'product' | 'user' | 'payment'
  /** 状态值 */
  status: number
  /** 标签效果 */
  effect?: 'light' | 'dark' | 'plain'
}

import { computed } from 'vue'

const props = withDefaults(defineProps<StatusTagProps>(), {
  effect: 'light'
})

/**
 * 订单状态映射
 */
const ORDER_STATUS_MAP = {
  0: { text: '待付款', type: 'info' },
  1: { text: '待发货', type: 'warning' },
  2: { text: '待收货', type: 'primary' },
  3: { text: '已完成', type: 'success' },
  4: { text: '已取消', type: 'danger' }
} as const

/**
 * 商品状态映射
 */
const PRODUCT_STATUS_MAP = {
  0: { text: '已下架', type: 'info' },
  1: { text: '已上架', type: 'success' },
  2: { text: '草稿', type: 'warning' }
} as const

/**
 * 用户状态映射
 */
const USER_STATUS_MAP = {
  0: { text: '禁用', type: 'danger' },
  1: { text: '正常', type: 'success' }
} as const

/**
 * 支付状态映射
 */
const PAYMENT_STATUS_MAP = {
  0: { text: '未支付', type: 'info' },
  1: { text: '已支付', type: 'success' },
  2: { text: '已退款', type: 'warning' }
} as const

/**
 * 获取状态映射
 *
 * 与 React 的区别：
 * - React: 使用 useMemo 缓存计算结果
 * - Vue3: 使用 computed 自动缓存和依赖追踪
 */
const statusMap = computed(() => {
  switch (props.type) {
    case 'order':
      return ORDER_STATUS_MAP
    case 'product':
      return PRODUCT_STATUS_MAP
    case 'user':
      return USER_STATUS_MAP
    case 'payment':
      return PAYMENT_STATUS_MAP
    default:
      return ORDER_STATUS_MAP
  }
})

/**
 * 状态文本
 */
const statusText = computed(() => {
  const map = statusMap.value as Record<number, { text: string; type: string }>
  return map[props.status]?.text || '未知'
})

/**
 * 标签类型
 */
const tagType = computed(() => {
  const map = statusMap.value as Record<number, { text: string; type: string }>
  return (map[props.status]?.type || 'info') as
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'primary'
})
</script>

<style scoped lang="scss">
// 可以添加自定义样式
</style>
