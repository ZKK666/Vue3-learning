/**
 * HTTP 请求封装 Composable
 *
 * 用途：封装常见的 HTTP 请求逻辑，包括 loading 状态、错误处理等
 *
 * 与 React 的区别：
 * - React: 使用 useEffect + useState 处理异步请求
 * - Vue3: 使用 ref + async/await 更直观地处理异步逻辑
 *
 * @example
 * ```typescript
 * const { data, loading, error, execute } = useRequest(getUserList)
 *
 * // 手动触发请求
 * await execute({ page: 1 })
 * ```
 */

import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 请求配置选项
 */
export interface UseRequestOptions<T> {
  /** 是否立即执行请求（默认 false） */
  immediate?: boolean
  /** 初始数据 */
  initialData?: T
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: Error) => void
  /** 是否显示错误提示（默认 true） */
  showErrorMessage?: boolean
}

/**
 * 请求返回类型
 */
export interface UseRequestReturn<T, P extends any[]> {
  /** 响应数据 */
  data: Ref<T | undefined>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<Error | null>
  /** 执行请求 */
  execute: (...params: P) => Promise<T | undefined>
  /** 重置状态 */
  reset: () => void
}

/**
 * useRequest - HTTP 请求封装
 *
 * @param apiFunction - API 函数
 * @param options - 配置选项
 * @returns 请求状态和方法
 */
export function useRequest<T, P extends any[]>(
  apiFunction: (...params: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, P> {
  const {
    immediate = false,
    initialData,
    onSuccess,
    onError,
    showErrorMessage = true
  } = options

  // 响应数据（使用 ref 创建响应式引用）
  const data = ref<T | undefined>(initialData) as Ref<T | undefined>

  // 加载状态
  const loading = ref(false)

  // 错误信息
  const error = ref<Error | null>(null)

  /**
   * 执行请求
   *
   * 与 React 的区别：
   * - React: 需要在 useEffect 中处理异步，并注意清理函数
   * - Vue3: 可以直接在 setup 中使用 async/await，更符合直觉
   */
  const execute = async (...params: P): Promise<T | undefined> => {
    try {
      // 设置加载状态
      loading.value = true
      error.value = null

      // 调用 API 函数
      const result = await apiFunction(...params)

      // 更新数据
      data.value = result

      // 成功回调
      onSuccess?.(result)

      return result
    } catch (err) {
      // 错误处理
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj

      // 显示错误提示
      if (showErrorMessage) {
        ElMessage.error(errorObj.message || '请求失败')
      }

      // 失败回调
      onError?.(errorObj)

      return undefined
    } finally {
      // 无论成功失败，都重置加载状态
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    data.value = initialData
    loading.value = false
    error.value = null
  }

  // 立即执行（如果配置了 immediate）
  if (immediate) {
    execute(...([] as unknown as P))
  }

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}
