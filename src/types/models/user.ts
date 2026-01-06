/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  name: string
  email: string
  phone: string
  avatar?: string
  roles: string[] // 用户角色列表
  permissions: string[] // 权限列表
  status: UserStatus
  createdAt: string
  updatedAt: string
}

/** 用户状态枚举 */
export enum UserStatus {
  Active = 1, // 正常
  Disabled = 0 // 禁用
}

/** 登录参数 */
export interface LoginParams {
  username: string
  password: string
  remember?: boolean // 记住我
}

/** 登录响应 */
export interface LoginResponse {
  token: string
  refreshToken?: string
  userInfo: UserInfo
}

/** 用户查询参数 */
export interface UserQueryParams {
  page: number
  pageSize: number
  keyword?: string // 搜索关键词（用户名/姓名/手机号）
  status?: UserStatus
  role?: string
}

/** 用户表单数据 */
export interface UserFormData {
  username: string
  name: string
  email: string
  phone: string
  password?: string // 新增时必填，编辑时选填
  roles: string[]
  status: UserStatus
}
