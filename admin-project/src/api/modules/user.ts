/**
 * 用户管理相关 API
 */

import request from '../request'
import type { PageResult } from '@/types/global'
import type { UserInfo, UserQueryParams, UserFormData, UserStatus } from '@/types/models/user'

/**
 * 获取用户列表（分页）
 * @param params 查询参数
 * @returns 分页数据
 */
export function getUserList(params: UserQueryParams): Promise<PageResult<UserInfo>> {
  return request.get('/users', params)
}

/**
 * 获取用户详情
 * @param id 用户 ID
 * @returns 用户详情
 */
export function getUserDetail(id: number): Promise<UserInfo> {
  return request.get(`/users/${id}`)
}

/**
 * 创建用户
 * @param data 用户数据
 * @returns 创建的用户
 */
export function createUser(data: UserFormData): Promise<UserInfo> {
  return request.post('/users', data)
}

/**
 * 更新用户
 * @param id 用户 ID
 * @param data 用户数据
 * @returns 更新后的用户
 */
export function updateUser(id: number, data: Partial<UserFormData>): Promise<UserInfo> {
  return request.put(`/users/${id}`, data)
}

/**
 * 删除用户
 * @param id 用户 ID
 */
export function deleteUser(id: number): Promise<void> {
  return request.delete(`/users/${id}`)
}

/**
 * 启用/禁用用户
 * @param id 用户 ID
 * @param status 用户状态
 */
export function updateUserStatus(id: number, status: UserStatus): Promise<void> {
  return request.put(`/users/${id}/status`, { status })
}

/**
 * 重置用户密码
 * @param id 用户 ID
 * @param newPassword 新密码
 */
export function resetUserPassword(id: number, newPassword: string): Promise<void> {
  return request.post(`/users/${id}/reset-password`, { newPassword })
}

/**
 * 批量删除用户
 * @param ids 用户 ID 列表
 */
export function batchDeleteUsers(ids: number[]): Promise<void> {
  return request.post('/users/batch-delete', { ids })
}

/**
 * 获取角色列表
 * @returns 角色列表
 */
export function getRoleList(): Promise<Array<{ id: string; name: string }>> {
  return request.get('/roles')
}
