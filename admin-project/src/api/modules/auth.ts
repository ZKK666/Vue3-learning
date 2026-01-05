/**
 * 认证相关 API
 */

import request from '../request'
import type { LoginParams, LoginResponse, UserInfo } from '@/types/models/user'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应（包含 token 和用户信息）
 */
export function login(params: LoginParams): Promise<LoginResponse> {
  return request.post('/auth/login', params)
}

/**
 * 登出
 */
export function logout(): Promise<void> {
  return request.post('/auth/logout')
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return request.get('/auth/user-info')
}

/**
 * 刷新 Token
 * @param refreshToken 刷新 Token
 * @returns 新的 Token
 */
export function refreshToken(refreshToken: string): Promise<{ token: string }> {
  return request.post('/auth/refresh-token', { refreshToken })
}

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  return request.post('/auth/change-password', { oldPassword, newPassword })
}
