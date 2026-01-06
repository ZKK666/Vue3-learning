/**
 * 全局常量定义
 */

/** Token 键名 */
export const TOKEN_KEY = 'token'

/** 刷新 Token 键名 */
export const REFRESH_TOKEN_KEY = 'refresh_token'

/** 用户信息键名 */
export const USER_INFO_KEY = 'userInfo'

/** 默认分页大小 */
export const DEFAULT_PAGE_SIZE = 10

/** 分页大小选项 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

/** 文件上传最大大小（5MB，字节） */
export const MAX_FILE_SIZE = 5 * 1024 * 1024

/** 图片上传允许的类型 */
export const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp']

/** 文档上传允许的类型 */
export const DOC_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 30000

/** 日期格式 */
export const DATE_FORMAT = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY'
} as const

/** HTTP 状态码 */
export const HTTP_STATUS = {
  OK: 200, // 成功
  CREATED: 201, // 已创建
  NO_CONTENT: 204, // 无内容
  BAD_REQUEST: 400, // 错误的请求
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403, // 禁止访问
  NOT_FOUND: 404, // 未找到
  INTERNAL_SERVER_ERROR: 500, // 服务器内部错误
  SERVICE_UNAVAILABLE: 503 // 服务不可用
} as const

/** 业务状态码 */
export const BIZ_CODE = {
  SUCCESS: 0, // 成功
  ERROR: -1, // 失败
  TOKEN_EXPIRED: 401, // Token 过期
  NO_PERMISSION: 403, // 无权限
  NOT_FOUND: 404, // 资源不存在
  SERVER_ERROR: 500 // 服务器错误
} as const

/** 路由白名单（不需要登录即可访问） */
export const WHITE_LIST = ['/login', '/404', '/403']

/** 默认头像 */
export const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

/** 商品默认图片 */
export const DEFAULT_PRODUCT_IMAGE =
  'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'

/** 侧边栏宽度 */
export const SIDEBAR = {
  WIDTH: 200, // 展开宽度
  COLLAPSED_WIDTH: 64 // 折叠宽度
} as const

/** 顶部导航栏高度 */
export const HEADER_HEIGHT = 60

/** 表格默认配置 */
export const TABLE_CONFIG = {
  STRIPE: true, // 斑马纹
  BORDER: true, // 边框
  SIZE: 'default' as const, // 尺寸
  HEIGHT: 'auto' // 高度
}
