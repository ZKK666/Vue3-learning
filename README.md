# Vue3 电商管理后台

一个基于 Vue3 + TypeScript + Vite + Element Plus 构建的企业级管理系统，专为从 React 转向 Vue3 的开发者设计。

## ✨ 特性

- ⚡️ **Vue 3.5** - 最新的 Composition API
- 🔥 **TypeScript** - 完整的类型支持
- 🚀 **Vite 7** - 极速开发体验
- 📦 **Pinia** - 官方推荐的状态管理
- 🛣️ **Vue Router 4** - 动态路由和权限控制
- 🎨 **Element Plus** - 企业级 UI 组件库
- 📝 **完整注释** - 每个文件都有详细的中文注释

## 🎯 学习目标

从 React 开发者视角学习 Vue3 的核心概念：
- Composition API ↔ React Hooks
- Pinia ↔ Redux/Zustand
- Vue Router ↔ React Router
- 响应式系统 vs 状态管理
- 单文件组件 vs JSX

## 📦 技术栈

### 核心框架
- Vue 3.5.24
- TypeScript 5.9.3
- Vite 7.2.4

### 状态与路由
- Pinia 3.0.4
- Vue Router 4.6.4

### UI 组件库
- Element Plus 2.13.0

### 工具库
- Axios 1.13.2
- VueUse 14.1.0
- dayjs 1.11.19

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

### 登录演示
- 用户名：任意
- 密码：任意
- 点击登录即可进入系统

## 📁 项目结构

```
Vue3-learning/
├── src/
│   ├── api/              # API 接口层
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia Store
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   └── views/            # 页面组件
├── public/               # 静态资源
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
├── package.json          # 依赖配置
├── VUE3-LEARNING-ROADMAP.md          # 学习路线图
├── VUE3-ECOMMERCE-ADMIN-PLAN.md      # 技术方案
├── DEVELOPMENT-PLAN.md               # 开发计划
└── README.md             # 项目说明
```

## 🎓 核心功能

### ✅ 已完成
- [x] 项目初始化和配置
- [x] TypeScript 类型系统
- [x] Axios 请求封装
- [x] Pinia 状态管理
- [x] Vue Router 路由配置
- [x] 布局系统
- [x] 登录页面
- [x] Dashboard 首页

### 🚧 待扩展
- [ ] 商品管理模块
- [ ] 订单管理模块
- [ ] 用户管理模块

## 💡 学习要点

### Composition API vs React Hooks

**React**:
```tsx
const [count, setCount] = useState(0)
```

**Vue3**:
```ts
const count = ref(0)
```

### Pinia vs Redux

**Pinia 更简洁**：无需 reducer，直接修改 state

## 📖 学习资源

- [Vue3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)

## 📝 许可

MIT License
