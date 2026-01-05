/**
 * 验证工具函数
 * 用于表单验证和数据校验
 */

/**
 * 验证是否为空
 * @param value 要验证的值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 验证手机号
 * @param phone 手机号
 * @returns 是否为有效手机号
 */
export function isPhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证 URL
 * @param url URL 地址
 * @returns 是否为有效 URL
 */
export function isUrl(url: string): boolean {
  const reg = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return reg.test(url)
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 * @returns 是否为有效身份证号
 */
export function isIdCard(idCard: string): boolean {
  // 18位身份证号正则（简化版）
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  return reg.test(idCard)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 密码强度等级 (0: 无效, 1: 弱, 2: 中, 3: 强)
 *
 * 规则：
 * - 弱：6-20位，仅包含数字或字母
 * - 中：6-20位，包含数字和字母
 * - 强：6-20位，包含数字、字母和特殊字符
 */
export function getPasswordStrength(password: string): number {
  if (!password || password.length < 6 || password.length > 20) {
    return 0
  }

  const hasNumber = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (hasNumber && hasLetter && hasSpecial) {
    return 3 // 强
  } else if ((hasNumber && hasLetter) || (hasNumber && hasSpecial) || (hasLetter && hasSpecial)) {
    return 2 // 中
  } else if (hasNumber || hasLetter) {
    return 1 // 弱
  }

  return 0
}

/**
 * 验证用户名
 * @param username 用户名
 * @returns 是否为有效用户名
 *
 * 规则：4-20位，只能包含字母、数字、下划线
 */
export function isUsername(username: string): boolean {
  const reg = /^[a-zA-Z0-9_]{4,20}$/
  return reg.test(username)
}

/**
 * 验证数字范围
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 是否在范围内
 */
export function isNumberInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * 验证文件类型
 * @param filename 文件名
 * @param allowedTypes 允许的文件类型（扩展名数组）
 * @returns 是否为允许的文件类型
 *
 * 示例：
 * isFileType('image.jpg', ['jpg', 'png']) // true
 * isFileType('doc.pdf', ['jpg', 'png']) // false
 */
export function isFileType(filename: string, allowedTypes: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext ? allowedTypes.includes(ext) : false
}

/**
 * 验证文件大小
 * @param size 文件大小（字节）
 * @param maxSize 最大大小（字节）
 * @returns 是否在允许的大小范围内
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize
}

// ==================== Element Plus 表单验证规则 ====================

/**
 * Element Plus 表单验证规则
 * 可直接用于 el-form 的 rules 属性
 */

/** 必填项验证规则 */
export const requiredRule = (message: string = '此项为必填项') => ({
  required: true,
  message,
  trigger: 'blur'
})

/** 手机号验证规则 */
export const phoneRule = () => ({
  validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }
    if (!isPhone(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

/** 邮箱验证规则 */
export const emailRule = () => ({
  validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }
    if (!isEmail(value)) {
      callback(new Error('请输入正确的邮箱地址'))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

/** 用户名验证规则 */
export const usernameRule = () => ({
  validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }
    if (!isUsername(value)) {
      callback(new Error('用户名为4-20位，只能包含字母、数字、下划线'))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

/** 密码强度验证规则（至少中等强度） */
export const passwordRule = () => ({
  validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }
    const strength = getPasswordStrength(value)
    if (strength < 2) {
      callback(new Error('密码强度不足，需包含字母和数字，长度6-20位'))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})
