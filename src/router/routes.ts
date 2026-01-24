/**
 * 路由配置
 * 定义应用的所有路由
 */

import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置说明：
 * - path: 路由路径
 * - name: 路由名称（用于编程式导航）
 * - component: 路由组件
 * - redirect: 重定向路径
 * - meta: 路由元信息
 *   - title: 页面标题
 *   - requiresAuth: 是否需要登录
 *   - roles: 允许访问的角色
 *   - permissions: 需要的权限
 *   - icon: 菜单图标
 *   - hidden: 是否在菜单中隐藏
 */

/**
 * 常量路由（无需权限）
 * 所有用户都可以访问
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hidden: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
      hidden: true
    }
  }
]

/**
 * 异步路由（需要权限）
 * 根据用户权限动态加载
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'DataAnalysis',
          requiresAuth: true
        }
      }
    ]
  },
  // 商品管理
  {
    path: '/product',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/product/list',
    meta: {
      title: '商品管理',
      icon: 'Goods',
      requiresAuth: true
    },
    children: [
      {
        path: '/product/list',
        name: 'ProductList',
        component: () => import('@/views/product/list.vue'),
        meta: {
          title: '商品列表',
          requiresAuth: true
        }
      },
      {
        path: '/product/form',
        name: 'ProductForm',
        component: () => import('@/views/product/form.vue'),
        meta: {
          title: '商品表单',
          requiresAuth: true,
          hidden: true // 不在菜单显示
        }
      },
      {
        path: '/product/detail/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/detail.vue'),
        meta: {
          title: '商品详情',
          requiresAuth: true,
          hidden: true // 不在菜单显示
        }
      }
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'ShoppingCart',
      requiresAuth: true
    },
    children: [
      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单列表',
          requiresAuth: true
        }
      },
      {
        path: '/order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: {
          title: '订单详情',
          requiresAuth: true,
          hidden: true // 不在菜单显示
        }
      }
    ]
  },
  // 用户管理
  {
    path: '/user',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/user/list',
    meta: {
      title: '用户管理',
      icon: 'User',
      requiresAuth: true
    },
    children: [
      {
        path: '/user/list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: {
          title: '用户列表',
          requiresAuth: true
        }
      },
      {
        path: '/user/detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail.vue'),
        meta: {
          title: '用户详情',
          requiresAuth: true,
          hidden: true // 不在菜单显示
        }
      }
    ]
  },

  // 404 页面必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]
