/**
 * 全局类型定义
 * 定义项目中通用的类型
 */

/** 分页参数 */
export interface PageParams {
  page: number
  pageSize: number
}

/** 分页响应数据 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 通用 API 响应结构 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/** 表格列配置 */
export interface TableColumn {
  prop: string
  label: string
  width?: string
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (row: any, column: TableColumn, cellValue: any) => string
}

/** 选项类型（用于下拉框等） */
export interface Option {
  label: string
  value: string | number
}

/** 菜单项类型 */
export interface MenuItem {
  id: string
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

/** 上传文件响应 */
export interface UploadFileResponse {
  url: string
  name: string
  size: number
}

/** 键值对类型 */
export type RecordType<T = any> = Record<string, T>

/** ID 类型 */
export type ID = string | number
