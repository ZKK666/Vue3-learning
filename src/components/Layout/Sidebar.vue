<template>
  <div class="layout-sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :unique-opened="true"
      router
    >
      <!-- 递归渲染菜单 -->
      <sidebar-item
        v-for="route in menuRoutes"
        :key="route.path"
        :route="route"
      />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
/**
 * 侧边栏组件
 * 显示导航菜单
 *
 * 功能：
 * - 根据路由配置自动生成菜单
 * - 支持多级嵌套菜单
 * - 支持菜单折叠
 * - 动态图标渲染
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

/**
 * 当前激活的菜单
 */
const activeMenu = computed(() => route.path)

/**
 * 过滤出需要在菜单中显示的路由
 *
 * 过滤规则：
 * 1. 不显示 hidden: true 的路由
 * 2. 只显示有 meta.title 的路由
 */
const menuRoutes = computed(() => {
  const routes = router.getRoutes()

  // 找出所有一级路由（Layout 子路由）
  return routes
    .filter(r => {
      // 只保留有 title 且不隐藏的路由
      return r.meta?.title && !r.meta?.hidden && r.path !== '/'
    })
    .filter(r => {
      // 过滤掉详情页、表单页等（这些页面不应该在菜单显示）
      return !r.path.includes(':id') && !r.path.includes('/form')
    })
    // 按照业务模块分组
    .reduce((acc, route) => {
      const segments = route.path.split('/').filter(Boolean)
      const modulePath = `/${segments[0]}`

      // 如果是模块首页（如 /product/list）
      if (segments.length > 1) {
        // 查找是否已有该模块的分组
        let moduleGroup = acc.find(r => r.path === modulePath)

        if (!moduleGroup) {
          // 创建模块分组
          moduleGroup = {
            path: modulePath,
            name: `${segments[0]}Module`,
            meta: route.meta,
            children: []
          }
          acc.push(moduleGroup)
        }

        // 将子路由添加到分组
        if (!moduleGroup.children) {
          moduleGroup.children = []
        }
        moduleGroup.children.push(route)
      } else {
        // 一级路由（如 /dashboard）
        acc.push(route)
      }

      return acc
    }, [] as any[])
    // 去重，只保留模块路由
    .filter((route, index, self) => {
      return self.findIndex(r => r.path === route.path) === index
    })
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.layout-sidebar {
  width: $sidebar-width;
  height: 100%;
  background-color: #001529;
  transition: width $transition-duration;
  overflow-x: hidden;

  &.collapsed {
    width: $sidebar-collapsed-width;
  }

  :deep(.el-menu) {
    border-right: none;
    background-color: #001529;

    .el-menu-item {
      color: rgba(255, 255, 255, 0.65);

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: #fff;
      }

      &.is-active {
        background-color: $primary-color !important;
        color: #fff;
      }
    }

    .el-sub-menu__title {
      color: rgba(255, 255, 255, 0.65);

      &:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: #fff;
      }
    }
  }
}
</style>
