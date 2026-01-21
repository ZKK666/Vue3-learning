/**
 * 表单逻辑封装 Composable
 *
 * 用途：封装表单相关的逻辑，包括提交、重置、验证等
 *
 * 与 React 的区别：
 * - React: 通常使用 react-hook-form 或手动管理表单状态
 * - Vue3: 配合 Element Plus 的 Form 组件，通过 ref 访问实例方法
 *
 * @example
 * ```typescript
 * const { formRef, formData, loading, handleSubmit, resetForm } = useForm(
 *   { name: '', email: '' },
 *   async (data) => {
 *     await createUser(data)
 *   }
 * )
 *
 * // 在模板中绑定 ref
 * <el-form ref="formRef" :model="formData">
 * ```
 */

import { ref, reactive, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'

/**
 * 表单配置选项
 */
export interface UseFormOptions<T> {
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: Error) => void
  /** 是否显示成功提示（默认 true） */
  showSuccessMessage?: boolean
  /** 成功提示文本（默认：操作成功） */
  successMessage?: string
  /** 是否显示错误提示（默认 true） */
  showErrorMessage?: boolean
  /** 提交成功后是否重置表单（默认 false） */
  resetAfterSubmit?: boolean
}

/**
 * 表单返回类型
 */
export interface UseFormReturn<T> {
  /** 表单 ref（用于调用 validate 等方法） */
  formRef: Ref<FormInstance | undefined>
  /** 表单数据（响应式对象） */
  formData: T
  /** 提交状态 */
  loading: Ref<boolean>
  /** 处理提交 */
  handleSubmit: () => Promise<void>
  /** 重置表单 */
  resetForm: () => void
  /** 清空验证 */
  clearValidate: () => void
  /** 验证表单 */
  validate: () => Promise<boolean>
}

/**
 * useForm - 表单逻辑封装
 *
 * 与 React 的区别：
 * - React: react-hook-form 使用非受控组件，通过 register 注册
 * - Vue3: Element Plus Form 使用受控组件，通过 v-model 绑定
 *
 * @param initialData - 初始表单数据
 * @param submitFunction - 提交函数
 * @param options - 配置选项
 * @returns 表单状态和方法
 */
export function useForm<T extends Record<string, any>>(
  initialData: T,
  submitFunction: (data: T) => Promise<any>,
  options: UseFormOptions<T> = {}
): UseFormReturn<T> {
  const {
    onSuccess,
    onError,
    showSuccessMessage = true,
    successMessage = '操作成功',
    showErrorMessage = true,
    resetAfterSubmit = false
  } = options

  /**
   * 表单 ref
   *
   * 与 React 的区别：
   * - React: useRef 返回 { current: value }，需要通过 .current 访问
   * - Vue3: ref 返回 { value: value }，通过 .value 访问
   */
  const formRef = ref<FormInstance>()

  /**
   * 表单数据（使用 reactive 创建响应式对象）
   *
   * 为什么用 reactive 而不是 ref？
   * - ref: 适合基本类型，需要 .value 访问
   * - reactive: 适合对象，直接访问属性，更符合直觉
   */
  const formData = reactive<T>({ ...initialData })

  // 提交状态
  const loading = ref(false)

  /**
   * 验证表单
   *
   * @returns 验证是否通过
   */
  const validate = async (): Promise<boolean> => {
    if (!formRef.value) {
      console.warn('formRef is not defined')
      return false
    }

    try {
      // Element Plus 的 validate 方法返回 Promise
      await formRef.value.validate()
      return true
    } catch (error) {
      console.warn('Form validation failed:', error)
      return false
    }
  }

  /**
   * 处理提交
   *
   * 与 React 的区别：
   * - React: 通常使用 handleSubmit(onSubmit) 包装
   * - Vue3: 直接调用 @submit.prevent="handleSubmit"
   */
  const handleSubmit = async () => {
    try {
      // 验证表单
      const valid = await validate()
      if (!valid) {
        return
      }

      // 设置加载状态
      loading.value = true

      // 调用提交函数
      await submitFunction(formData)

      // 显示成功提示
      if (showSuccessMessage) {
        ElMessage.success(successMessage)
      }

      // 成功回调
      onSuccess?.(formData)

      // 提交成功后重置表单
      if (resetAfterSubmit) {
        resetForm()
      }
    } catch (error) {
      // 错误处理
      const errorObj = error instanceof Error ? error : new Error(String(error))

      if (showErrorMessage) {
        ElMessage.error(errorObj.message || '操作失败')
      }

      // 失败回调
      onError?.(errorObj)
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置表单
   * 包括重置数据和清除验证
   */
  const resetForm = () => {
    // 重置数据
    Object.assign(formData, initialData)

    // 清除验证（需要在下一个 tick 执行）
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  /**
   * 清空验证
   */
  const clearValidate = () => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }

  return {
    formRef,
    formData,
    loading,
    handleSubmit,
    resetForm,
    clearValidate,
    validate
  }
}
