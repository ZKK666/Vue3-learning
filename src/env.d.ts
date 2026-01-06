/// <reference types="vite/client" />

/**
 * 环境变量类型定义
 * Vite 会自动加载 .env 文件中的变量
 */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string
  /** 是否使用 Mock 数据 */
  readonly VITE_USE_MOCK: string
  /** 应用端口 */
  readonly VITE_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
