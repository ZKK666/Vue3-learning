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
  // 商品管理（暂时注释，后续添加）
  // {
  //   path: '/product',
  //   component: () => import('@/components/Layout/index.vue'),
  //   redirect: '/product/list',
  //   meta: {
  //     title: '商品管理',
  //     icon: 'Goods'
  //   },
  //   children: [
  //     {
  //       path: '/product/list',
  //       name: 'ProductList',
  //       component: () => import('@/views/product/list.vue'),
  //       meta: {
  //         title: '商品列表',
  //         requiresAuth: true
  //       }
  //     }
  //   ]
  // },

  // 404 页面必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]
