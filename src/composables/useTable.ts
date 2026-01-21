/**
 * 表格逻辑封装 Composable
 *
 * 用途：封装表格相关的逻辑，包括数据加载、分页、搜索、选择等
 *
 * 与 React 的区别：
 * - React: 需要组合多个 Hook（useState, useEffect, useCallback）
 * - Vue3: 在单个 Composable 中统一管理，更简洁
 *
 * @example
 * ```typescript
 * const {
 *   data,
 *   loading,
 *   pagination,
 *   loadData,
 *   refresh
 * } = useTable(getProductList)
 *
 * // 组件挂载时自动加载数据
 * onMounted(() => loadData())
 * ```
 */

import { ref, type Ref } from 'vue'
import { usePagination, type UsePaginationOptions } from './usePagination'
import { ElMessage } from 'element-plus'

/**
 * 表格请求参数
 */
export interface TableRequestParams {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 其他搜索参数 */
  [key: string]: any
}

/**
 * 表格响应数据
 */
export interface TableResponse<T> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
}

/**
 * 表格配置选项
 */
export interface UseTableOptions extends UsePaginationOptions {
  /** 是否在创建时立即加载（默认 false） */
  immediate?: boolean
  /** 初始搜索参数 */
  initialParams?: Record<string, any>
  /** 是否显示错误提示（默认 true） */
  showErrorMessage?: boolean
}

/**
 * 表格返回类型
 */
export interface UseTableReturn<T> {
  /** 表格数据 */
  data: Ref<T[]>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 分页信息 */
  pagination: ReturnType<typeof usePagination>
  /** 搜索参数 */
  searchParams: Ref<Record<string, any>>
  /** 选中的行 */
  selectedRows: Ref<T[]>
  /** 加载数据 */
  loadData: (params?: Record<string, any>) => Promise<void>
  /** 刷新当前页 */
  refresh: () => Promise<void>
  /** 重置表格（清空搜索参数，回到第一页） */
  reset: () => Promise<void>
  /** 处理搜索 */
  handleSearch: (params: Record<string, any>) => Promise<void>
  /** 处理选择变化 */
  handleSelectionChange: (rows: T[]) => void
}

/**
 * useTable - 表格逻辑封装
 *
 * @param apiFunction - 获取表格数据的 API 函数
 * @param options - 配置选项
 * @returns 表格状态和方法
 */
export function useTable<T>(
  apiFunction: (params: TableRequestParams) => Promise<TableResponse<T>>,
  options: UseTableOptions = {}
): UseTableReturn<T> {
  const {
    immediate = false,
    initialParams = {},
    showErrorMessage = true,
    ...paginationOptions
  } = options

  // 表格数据
  const data = ref<T[]>([]) as Ref<T[]>

  // 加载状态
  const loading = ref(false)

  // 搜索参数
  const searchParams = ref<Record<string, any>>({ ...initialParams })

  // 选中的行
  const selectedRows = ref<T[]>([]) as Ref<T[]>

  // 分页
  const paginationInstance = usePagination(paginationOptions)

  /**
   * 加载数据
   *
   * 与 React 的区别：
   * - React: 通常在 useEffect 中调用，需要处理依赖项
   * - Vue3: 可以在任何地方调用，更灵活
   *
   * @param params - 额外的搜索参数
   */
  const loadData = async (params?: Record<string, any>) => {
    try {
      loading.value = true

      // 合并搜索参数
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      // 构建请求参数
      const requestParams: TableRequestParams = {
        page: paginationInstance.pagination.page,
        pageSize: paginationInstance.pagination.pageSize,
        ...searchParams.value
      }

      // 调用 API
      const response = await apiFunction(requestParams)

      // 更新数据
      data.value = response.list
      paginationInstance.setTotal(response.total)
    } catch (error) {
      // 错误处理
      if (showErrorMessage) {
        const message =
          error instanceof Error ? error.message : '加载数据失败'
        ElMessage.error(message)
      }

      // 清空数据
      data.value = []
      paginationInstance.setTotal(0)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新当前页
   */
  const refresh = async () => {
    await loadData()
  }

  /**
   * 重置表格
   * 清空搜索参数，回到第一页，重新加载数据
   */
  const reset = async () => {
    searchParams.value = { ...initialParams }
    paginationInstance.reset()
    await loadData()
  }

  /**
   * 处理搜索
   * 设置搜索参数，回到第一页，重新加载数据
   *
   * @param params - 搜索参数
   */
  const handleSearch = async (params: Record<string, any>) => {
    searchParams.value = { ...params }
    paginationInstance.pagination.page = 1
    await loadData()
  }

  /**
   * 处理选择变化
   *
   * @param rows - 选中的行
   */
  const handleSelectionChange = (rows: T[]) => {
    selectedRows.value = rows
  }

  // 立即加载（如果配置了 immediate）
  if (immediate) {
    loadData()
  }

  return {
    data,
    loading,
    pagination: paginationInstance,
    searchParams,
    selectedRows,
    loadData,
    refresh,
    reset,
    handleSearch,
    handleSelectionChange
  }
}
