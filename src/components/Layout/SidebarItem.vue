<!--
  侧边栏菜单项组件
  支持递归渲染多级菜单
-->

<template>
  <!-- 有子菜单 - 使用 SubMenu -->
  <el-sub-menu
    v-if="hasChildren"
    :index="route.path"
  >
    <template #title>
      <el-icon v-if="route.meta?.icon">
        <component :is="iconComponent" />
      </el-icon>
      <span>{{ route.meta?.title }}</span>
    </template>

    <!-- 递归渲染子菜单 -->
    <sidebar-item
      v-for="child in route.children"
      :key="child.path"
      :route="child"
    />
  </el-sub-menu>

  <!-- 无子菜单 - 使用 MenuItem -->
  <el-menu-item v-else :index="route.path">
    <el-icon v-if="route.meta?.icon">
      <component :is="iconComponent" />
    </el-icon>
    <template #title>{{ route.meta?.title }}</template>
  </el-menu-item>
</template>

<script setup lang="ts">
/**
 * 侧边栏菜单项组件
 *
 * 功能：
 * - 支持递归渲染（多级菜单）
 * - 动态渲染图标
 * - 根据是否有子路由显示不同组件
 */
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * 组件 Props
 */
interface SidebarItemProps {
  route: RouteRecordRaw | any
}

const props = defineProps<SidebarItemProps>()

/**
 * 是否有子菜单
 */
const hasChildren = computed(() => {
  return (
    props.route.children &&
    props.route.children.length > 0 &&
    props.route.children.some((child: any) => !child.meta?.hidden)
  )
})

/**
 * 动态获取图标组件
 *
 * 与 React 的区别：
 * - React: 通常使用 import 或对象映射
 * - Vue3: 使用 component :is 动态组件更简洁
 */
const iconComponent = computed(() => {
  const iconName = props.route.meta?.icon as string

  if (!iconName) {
    return null
  }

  // 从 Element Plus Icons 中获取图标组件
  return (ElementPlusIconsVue as any)[iconName]
})
</script>

<style scoped lang="scss">
// 样式继承自父组件 Sidebar.vue
</style>
