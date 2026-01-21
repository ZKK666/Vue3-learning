<!--
  TablePagination 分页组件

  用途：封装分页功能，配合表格使用

  与 React 的区别：
  - React: 通常需要传递多个 props 和回调函数
  - Vue3: 使用 v-model 双向绑定，代码更简洁

  使用示例：
  <TablePagination
    v-model:page="pagination.page"
    v-model:page-size="pagination.pageSize"
    :total="pagination.total"
    @change="loadData"
  />
-->

<template>
  <div class="table-pagination">
    <!-- 信息显示 -->
    <div class="pagination-info">
      <span>共 {{ total }} 条记录</span>
      <span v-if="total > 0">
        ，当前显示第 {{ startIndex }} - {{ endIndex }} 条
      </span>
    </div>

    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :background="background"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 组件 Props
 */
export interface TablePaginationProps {
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 总条数 */
  total?: number
  /** 可选的每页条数 */
  pageSizes?: number[]
  /** 布局 */
  layout?: string
  /** 是否显示背景色 */
  background?: boolean
}

/**
 * 组件 Emits
 */
export interface TablePaginationEmits {
  /** 更新当前页码 */
  (e: 'update:page', page: number): void
  /** 更新每页条数 */
  (e: 'update:pageSize', pageSize: number): void
  /** 分页变化事件 */
  (e: 'change'): void
}

import { computed } from 'vue'

/**
 * Props 默认值
 *
 * 与 React 的区别：
 * - React: 使用 defaultProps 或参数默认值
 * - Vue3: 使用 withDefaults 提供类型安全的默认值
 */
const props = withDefaults(defineProps<TablePaginationProps>(), {
  page: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true
})

const emit = defineEmits<TablePaginationEmits>()

/**
 * 当前页的起始索引
 */
const startIndex = computed(() => {
  if (props.total === 0) return 0
  return (props.page - 1) * props.pageSize + 1
})

/**
 * 当前页的结束索引
 */
const endIndex = computed(() => {
  const end = props.page * props.pageSize
  return Math.min(end, props.total)
})

/**
 * 处理页码变化
 *
 * 与 React 的区别：
 * - React: 调用父组件传入的回调函数
 * - Vue3: 使用 emit 触发事件，支持 v-model 双向绑定
 *
 * @param page - 目标页码
 */
const handlePageChange = (page: number) => {
  emit('update:page', page)
  emit('change')
}

/**
 * 处理每页条数变化
 *
 * @param pageSize - 每页条数
 */
const handleSizeChange = (pageSize: number) => {
  emit('update:pageSize', pageSize)
  // 切换每页条数后，回到第一页
  emit('update:page', 1)
  emit('change')
}
</script>

<style scoped lang="scss">
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;

  .pagination-info {
    font-size: 14px;
    color: #606266;

    span {
      margin-right: 8px;
    }
  }

  // 小屏幕适配
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .pagination-info {
      margin-bottom: 12px;
    }

    :deep(.el-pagination) {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
