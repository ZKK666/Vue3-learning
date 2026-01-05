/**
 * 本地存储工具
 * 封装 localStorage 和 sessionStorage，支持过期时间和类型安全
 */

/** 存储项结构 */
interface StorageItem<T> {
  value: T
  expire?: number // 过期时间戳（毫秒）
}

/**
 * 存储类型
 */
type StorageType = 'local' | 'session'

/**
 * 获取存储对象
 */
function getStorage(type: StorageType): Storage {
  return type === 'local' ? localStorage : sessionStorage
}

/**
 * 设置存储项
 * @param key 键名
 * @param value 值
 * @param expire 过期时间（秒），不传则永不过期
 * @param type 存储类型，默认 localStorage
 *
 * 示例：
 * setStorage('token', 'abc123', 3600) // 1小时后过期
 * setStorage('userInfo', { name: 'John' }) // 永不过期
 */
export function setStorage<T>(
  key: string,
  value: T,
  expire?: number,
  type: StorageType = 'local'
): void {
  const storage = getStorage(type)

  const item: StorageItem<T> = {
    value,
    expire: expire ? Date.now() + expire * 1000 : undefined
  }

  try {
    storage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error('存储失败:', error)
  }
}

/**
 * 获取存储项
 * @param key 键名
 * @param type 存储类型，默认 localStorage
 * @returns 存储的值，如果不存在或已过期则返回 null
 *
 * 示例：
 * const token = getStorage<string>('token')
 * const userInfo = getStorage<UserInfo>('userInfo')
 */
export function getStorage<T>(key: string, type: StorageType = 'local'): T | null {
  const storage = getStorage(type)

  try {
    const itemStr = storage.getItem(key)

    if (!itemStr) return null

    const item: StorageItem<T> = JSON.parse(itemStr)

    // 检查是否过期
    if (item.expire && Date.now() > item.expire) {
      removeStorage(key, type)
      return null
    }

    return item.value
  } catch (error) {
    console.error('读取存储失败:', error)
    return null
  }
}

/**
 * 删除存储项
 * @param key 键名
 * @param type 存储类型，默认 localStorage
 */
export function removeStorage(key: string, type: StorageType = 'local'): void {
  const storage = getStorage(type)
  storage.removeItem(key)
}

/**
 * 清空存储
 * @param type 存储类型，默认 localStorage
 */
export function clearStorage(type: StorageType = 'local'): void {
  const storage = getStorage(type)
  storage.clear()
}

/**
 * 检查存储项是否存在
 * @param key 键名
 * @param type 存储类型，默认 localStorage
 * @returns 是否存在且未过期
 */
export function hasStorage(key: string, type: StorageType = 'local'): boolean {
  return getStorage<any>(key, type) !== null
}

// ==================== 常用存储项的快捷方法 ====================

/**
 * Token 存储（默认7天过期）
 */
export const tokenStorage = {
  set(token: string, expire: number = 7 * 24 * 3600): void {
    setStorage('token', token, expire)
  },

  get(): string | null {
    return getStorage<string>('token')
  },

  remove(): void {
    removeStorage('token')
  },

  has(): boolean {
    return hasStorage('token')
  }
}

/**
 * 用户信息存储
 */
export const userInfoStorage = {
  set<T>(userInfo: T): void {
    setStorage('userInfo', userInfo)
  },

  get<T>(): T | null {
    return getStorage<T>('userInfo')
  },

  remove(): void {
    removeStorage('userInfo')
  },

  has(): boolean {
    return hasStorage('userInfo')
  }
}

/**
 * 主题模式存储
 */
export const themeStorage = {
  set(theme: 'light' | 'dark'): void {
    setStorage('theme', theme)
  },

  get(): 'light' | 'dark' | null {
    return getStorage<'light' | 'dark'>('theme')
  },

  remove(): void {
    removeStorage('theme')
  }
}

/**
 * 语言设置存储
 */
export const localeStorage = {
  set(locale: string): void {
    setStorage('locale', locale)
  },

  get(): string | null {
    return getStorage<string>('locale')
  },

  remove(): void {
    removeStorage('locale')
  }
}
