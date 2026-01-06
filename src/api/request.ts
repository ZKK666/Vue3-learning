/**
 * Axios 请求封装
 * 提供统一的 HTTP 请求接口，包含请求/响应拦截器
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/global'
import { tokenStorage } from '@/utils/storage'
import { REQUEST_TIMEOUT, HTTP_STATUS, BIZ_CODE } from '@/utils/constants'

/**
 * 创建 Axios 实例
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 基础路径
  timeout: REQUEST_TIMEOUT, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

/**
 * 请求拦截器
 * 在发送请求之前做些什么
 */
service.interceptors.request.use(
  (config) => {
    // 添加 Token 到请求头
    const token = tokenStorage.get()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 如果是 FormData，修改 Content-Type
    if (config.data instanceof FormData) {
      config.headers!['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 对响应数据做点什么
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data

    // 根据业务状态码处理
    switch (code) {
      case BIZ_CODE.SUCCESS:
        // 成功，直接返回数据
        return data

      case BIZ_CODE.TOKEN_EXPIRED:
        // Token 过期，清除 Token 并跳转到登录页
        ElMessage.error('登录已过期，请重新登录')
        tokenStorage.remove()
        // 跳转到登录页（在路由守卫中会自动处理）
        window.location.href = '/login'
        return Promise.reject(new Error(message))

      case BIZ_CODE.NO_PERMISSION:
        // 无权限
        ElMessage.error(message || '无权限访问')
        return Promise.reject(new Error(message))

      case BIZ_CODE.NOT_FOUND:
        // 资源不存在
        ElMessage.error(message || '请求的资源不存在')
        return Promise.reject(new Error(message))

      default:
        // 其他错误
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message))
    }
  },
  (error: AxiosError) => {
    // HTTP 错误处理
    if (error.response) {
      const { status, statusText } = error.response

      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          ElMessage.error('请求参数错误')
          break

        case HTTP_STATUS.UNAUTHORIZED:
          ElMessage.error('未授权，请重新登录')
          tokenStorage.remove()
          window.location.href = '/login'
          break

        case HTTP_STATUS.FORBIDDEN:
          ElMessage.error('拒绝访问')
          break

        case HTTP_STATUS.NOT_FOUND:
          ElMessage.error('请求地址不存在')
          break

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          ElMessage.error('服务器内部错误')
          break

        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          ElMessage.error('服务不可用')
          break

        default:
          ElMessage.error(statusText || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      ElMessage.error('网络错误，请检查您的网络连接')
    } else {
      // 发生了一些问题触发请求
      ElMessage.error(error.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

/**
 * 通用请求方法
 */
export const request = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置项
   */
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config })
  },

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置项
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置项
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置项
   */
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config })
  },

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置项
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData 表单数据
   * @param onProgress 上传进度回调
   */
  upload<T = any>(
    url: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void
  ): Promise<T> {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    })
  },

  /**
   * 下载文件
   * @param url 请求地址
   * @param params 请求参数
   * @param filename 文件名
   */
  async download(url: string, params?: any, filename?: string): Promise<void> {
    const response = await service.get(url, {
      params,
      responseType: 'blob'
    })

    // 创建下载链接
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

export default request
