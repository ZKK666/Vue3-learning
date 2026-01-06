# 项目目录结构说明

```
admin-project/
├── public/                          # 静态资源目录
│   └── vite.svg                     # 网站图标
│
├── src/                             # 源代码目录
│   ├── api/                         # API 接口层
│   │   ├── modules/                 # API 模块（按业务划分）
│   │   │   ├── auth.ts              # 认证相关 API
│   │   │   ├── product.ts           # 商品相关 API
│   │   │   ├── order.ts             # 订单相关 API
│   │   │   ├── user.ts              # 用户相关 API
│   │   │   └── dashboard.ts         # 统计相关 API
│   │   ├── request.ts               # Axios 封装
│   │   └── index.ts                 # API 统一导出
│   │
│   ├── assets/                      # 资源文件
│   │   ├── images/                  # 图片资源
│   │   └── styles/                  # 样式文件
│   │       ├── index.scss           # 全局样式
│   │       ├── variables.scss       # 样式变量
│   │       └── element-override.scss # Element Plus 样式覆盖
│   │
│   ├── components/                  # 组件目录
│   │   ├── Layout/                  # 布局组件
│   │   │   ├── Header.vue           # 顶部导航栏
│   │   │   ├── Sidebar.vue          # 侧边栏
│   │   │   ├── Main.vue             # 主内容区
│   │   │   └── index.vue            # 布局容器
│   │   ├── Common/                  # 通用基础组件
│   │   │   ├── SearchBar.vue        # 搜索栏
│   │   │   ├── TablePagination.vue  # 分页组件
│   │   │   ├── ImageUpload.vue      # 图片上传
│   │   │   └── ConfirmDialog.vue    # 确认对话框
│   │   └── Business/                # 业务组件
│   │       ├── StatusTag.vue        # 状态标签
│   │       └── PriceDisplay.vue     # 价格展示
│   │
│   ├── composables/                 # 组合式函数（Hooks）
│   │   ├── useRequest.ts            # HTTP 请求封装
│   │   ├── useTable.ts              # 表格逻辑
│   │   ├── useForm.ts               # 表单逻辑
│   │   ├── useAuth.ts               # 认证逻辑
│   │   └── usePermission.ts         # 权限判断
│   │
│   ├── directives/                  # 自定义指令
│   │   ├── index.ts                 # 指令注册入口
│   │   ├── permission.ts            # v-permission 权限指令
│   │   └── loading.ts               # v-loading 加载指令
│   │
│   ├── router/                      # 路由配置
│   │   ├── index.ts                 # 路由主文件
│   │   ├── routes.ts                # 路由配置
│   │   └── guards.ts                # 路由守卫
│   │
│   ├── stores/                      # Pinia Store
│   │   ├── modules/                 # Store 模块
│   │   │   ├── user.ts              # 用户状态
│   │   │   ├── permission.ts        # 权限状态
│   │   │   ├── app.ts               # 应用全局状态
│   │   │   └── cache.ts             # 数据缓存
│   │   └── index.ts                 # Store 入口
│   │
│   ├── types/                       # TypeScript 类型定义
│   │   ├── models/                  # 数据模型类型
│   │   │   ├── user.ts              # 用户模型
│   │   │   ├── product.ts           # 商品模型
│   │   │   └── order.ts             # 订单模型
│   │   ├── global.d.ts              # 全局类型声明
│   │   ├── api.d.ts                 # API 接口类型
│   │   ├── auto-imports.d.ts        # 自动导入类型（自动生成）
│   │   └── components.d.ts          # 组件类型（自动生成）
│   │
│   ├── utils/                       # 工具函数
│   │   ├── format.ts                # 格式化工具
│   │   ├── validate.ts              # 验证工具
│   │   ├── storage.ts               # 本地存储封装
│   │   └── constants.ts             # 常量定义
│   │
│   ├── views/                       # 页面组件
│   │   ├── login/                   # 登录页
│   │   │   └── index.vue
│   │   ├── dashboard/               # 数据统计
│   │   │   └── index.vue
│   │   ├── product/                 # 商品管理
│   │   │   ├── list.vue             # 商品列表
│   │   │   ├── detail.vue           # 商品详情
│   │   │   └── form.vue             # 商品表单
│   │   ├── order/                   # 订单管理
│   │   │   ├── list.vue             # 订单列表
│   │   │   └── detail.vue           # 订单详情
│   │   └── user/                    # 用户管理
│   │       ├── list.vue             # 用户列表
│   │       └── detail.vue           # 用户详情
│   │
│   ├── App.vue                      # 根组件
│   ├── main.ts                      # 应用入口
│   └── env.d.ts                     # 环境变量类型定义
│
├── .env.development                 # 开发环境变量
├── .env.production                  # 生产环境变量
├── .gitignore                       # Git 忽略文件
├── index.html                       # HTML 模板
├── package.json                     # 项目配置
├── tsconfig.json                    # TypeScript 配置（引用）
├── tsconfig.app.json                # 应用 TypeScript 配置
├── tsconfig.node.json               # Node TypeScript 配置
├── vite.config.ts                   # Vite 配置
└── README.md                        # 项目说明
```

## 目录说明

### api/ - API 接口层
封装所有与后端交互的 API 接口，按业务模块划分。

### components/ - 组件目录
- **Layout**: 布局组件（Header, Sidebar, Main）
- **Common**: 通用基础组件（可跨项目复用）
- **Business**: 业务组件（项目特定）

### composables/ - 组合式函数
类似 React 的 Custom Hooks，用于封装可复用的逻辑。

### stores/ - 状态管理
使用 Pinia 进行状态管理，按模块划分。

### types/ - 类型定义
所有 TypeScript 类型定义，包括数据模型、API 接口类型等。

### utils/ - 工具函数
纯函数工具，如格式化、验证、存储等。

### views/ - 页面组件
应用的页面级组件，对应路由。

## 命名规范

- **文件名**: kebab-case（短横线命名）
- **组件名**: PascalCase（大驼峰）
- **函数名**: camelCase（小驼峰）
- **常量名**: UPPER_SNAKE_CASE（大写下划线）
- **类型名**: PascalCase（大驼峰）

## 导入路径别名

```typescript
// 使用 @ 别名代替相对路径
import { useUserStore } from '@/stores/modules/user'
import type { User } from '@/types/models/user'
```
