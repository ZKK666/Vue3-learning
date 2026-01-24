/**
 * 格式化工具函数
 * 用于数据的格式化展示
 */

import dayjs from 'dayjs'

/**
 * 格式化日期时间
 * @param date 日期字符串或时间戳
 * @param format 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 *
 * 示例：
 * formatDateTime('2024-01-01 10:30:00') // '2024-01-01 10:30:00'
 * formatDateTime('2024-01-01', 'YYYY-MM-DD') // '2024-01-01'
 */
export function formatDateTime(
  date: string | number | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * 格式化日期（仅日期部分）
 * @param date 日期字符串或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | number | Date): string {
  return formatDateTime(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间（仅时间部分）
 * @param date 日期字符串或时间戳
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: string | number | Date): string {
  return formatDateTime(date, 'HH:mm:ss')
}

/**
 * 格式化金额
 * @param amount 金额
 * @param decimals 小数位数，默认 2
 * @param symbol 货币符号，默认 '¥'
 * @returns 格式化后的金额字符串
 *
 * 示例：
 * formatMoney(1234.567) // '¥1,234.57'
 * formatMoney(1234.567, 0) // '¥1,235'
 * formatMoney(1234.567, 2, '$') // '$1,234.57'
 */
export function formatMoney(
  amount: number | string,
  decimals: number = 2,
  symbol: string = '¥'
): string {
  if (amount === null || amount === undefined) return '-'

  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num)) return '-'

  // 保留小数位
  const fixed = num.toFixed(decimals)

  // 添加千分位分隔符
  const parts = fixed.split('.')
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return symbol + parts.join('.')
}

/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 *
 * 示例：
 * formatFileSize(1024) // '1.00 KB'
 * formatFileSize(1048576) // '1.00 MB'
 */
export function formatFileSize(size: number): string {
  if (size === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(size) / Math.log(k))

  return (size / Math.pow(k, i)).toFixed(2) + ' ' + units[i]
}

/**
 * 格式化手机号（中间四位用 * 替代）
 * @param phone 手机号
 * @returns 格式化后的手机号
 *
 * 示例：
 * formatPhone('13812345678') // '138****5678'
 */
export function formatPhone(phone: string): string {
  if (!phone) return '-'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化数字（添加千分位分隔符）
 * @param num 数字
 * @param decimals 小数位数，默认保留原始精度
 * @returns 格式化后的数字字符串
 *
 * 示例：
 * formatNumber(12345) // '12,345'
 * formatNumber(12345.678, 2) // '12,345.68'
 */
export function formatNumber(num: number | string, decimals?: number): string {
  if (num === null || num === undefined) return '-'

  const number = typeof num === 'string' ? parseFloat(num) : num

  if (isNaN(number)) return '-'

  // 如果指定了小数位，则格式化
  const formatted = decimals !== undefined ? number.toFixed(decimals) : number.toString()

  // 添加千分位分隔符
  const parts = formatted.split('.')
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return parts.join('.')
}

/**
 * 格式化百分比
 * @param value 数值（0-1 或 0-100）
 * @param decimals 小数位数，默认 2
 * @param isDecimal 是否为小数形式（0-1），默认 false
 * @returns 格式化后的百分比字符串
 *
 * 示例：
 * formatPercent(0.8567, 2, true) // '85.67%'
 * formatPercent(85.67, 2) // '85.67%'
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  isDecimal: boolean = false
): string {
  if (value === null || value === undefined) return '-'

  const percent = isDecimal ? value * 100 : value

  return percent.toFixed(decimals) + '%'
}
