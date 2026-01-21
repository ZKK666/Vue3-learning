/**
 * 分页逻辑封装 Composable
 *
 * 用途：封装分页相关的状态和方法，配合表格组件使用
 *
 * 与 React 的区别：
 * - React: 需要多个 useState 管理分页状态，使用 useCallback 优化函数
 * - Vue3: 使用 reactive 对象统一管理，computed 自动计算派生状态
 *
 * @example
 * ```typescript
 * const pagination = usePagination({
 *   pageSize: 20,
 *   total: 100
 * })
 *
 * // 切换页码
 * pagination.handlePageChange(2)
 *
 * // 重置分页
 * pagination.reset()
 * ```
 */

import { reactive, computed, type ComputedRef } from 'vue'

/**
 * 分页配置选项
 */
export interface UsePaginationOptions {
  /** 当前页码（默认 1） */
  page?: number
  /** 每页条数（默认 10） */
  pageSize?: number
  /** 总条数（默认 0） */
  total?: number
  /** 可选的每页条数（默认 [10, 20, 50, 100]） */
  pageSizes?: number[]
}

/**
 * 分页状态
 */
export interface PaginationState {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 可选的每页条数 */
  pageSizes: number[]
}

/**
 * 分页返回类型
 */
export interface UsePaginationReturn {
  /** 分页状态（响应式对象） */
  pagination: PaginationState
  /** 总页数（计算属性） */
  totalPages: ComputedRef<number>
  /** 是否有上一页 */
  hasPrev: ComputedRef<boolean>
  /** 是否有下一页 */
  hasNext: ComputedRef<boolean>
  /** 当前页的起始索引（从 1 开始） */
  startIndex: ComputedRef<number>
  /** 当前页的结束索引 */
  endIndex: ComputedRef<number>
  /** 切换页码 */
  handlePageChange: (page: number) => void
  /** 切换每页条数 */
  handleSizeChange: (size: number) => void
  /** 设置总条数 */
  setTotal: (total: number) => void
  /** 重置分页（回到第一页） */
  reset: () => void
}

/**
 * usePagination - 分页逻辑封装
 *
 * @param options - 配置选项
 * @returns 分页状态和方法
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    page = 1,
    pageSize = 10,
    total = 0,
    pageSizes = [10, 20, 50, 100]
  } = options

  /**
   * 分页状态（使用 reactive 创建响应式对象）
   *
   * 与 React 的区别：
   * - React: 需要多个 useState，每个状态独立管理
   * - Vue3: 使用 reactive 统一管理相关状态，更内聚
   */
  const pagination = reactive<PaginationState>({
    page,
    pageSize,
    total,
    pageSizes
  })

  /**
   * 总页数（计算属性）
   *
   * 与 React 的区别：
   * - React: 使用 useMemo 缓存计算结果
   * - Vue3: 使用 computed，自动依赖追踪和缓存
   */
  const totalPages = computed(() => {
    return Math.ceil(pagination.total / pagination.pageSize) || 1
  })

  /**
   * 是否有上一页
   */
  const hasPrev = computed(() => {
    return pagination.page > 1
  })

  /**
   * 是否有下一页
   */
  const hasNext = computed(() => {
    return pagination.page < totalPages.value
  })

  /**
   * 当前页的起始索引（从 1 开始）
   */
  const startIndex = computed(() => {
    if (pagination.total === 0) return 0
    return (pagination.page - 1) * pagination.pageSize + 1
  })

  /**
   * 当前页的结束索引
   */
  const endIndex = computed(() => {
    const end = pagination.page * pagination.pageSize
    return Math.min(end, pagination.total)
  })

  /**
   * 切换页码
   *
   * @param page - 目标页码
   */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages.value) {
      console.warn(`Invalid page number: ${page}`)
      return
    }
    pagination.page = page
  }

  /**
   * 切换每页条数
   *
   * @param size - 每页条数
   */
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    // 切换每页条数后，回到第一页
    pagination.page = 1
  }

  /**
   * 设置总条数
   *
   * @param total - 总条数
   */
  const setTotal = (total: number) => {
    pagination.total = total

    // 如果当前页超出范围，回到最后一页
    if (pagination.page > totalPages.value) {
      pagination.page = Math.max(1, totalPages.value)
    }
  }

  /**
   * 重置分页（回到第一页）
   */
  const reset = () => {
    pagination.page = 1
    pagination.pageSize = pageSize
    pagination.total = 0
  }

  return {
    pagination,
    totalPages,
    hasPrev,
    hasNext,
    startIndex,
    endIndex,
    handlePageChange,
    handleSizeChange,
    setTotal,
    reset
  }
}
