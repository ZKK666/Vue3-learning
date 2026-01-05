<template>
  <div class="layout-sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :unique-opened="true"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><DataAnalysis /></el-icon>
        <template #title>Dashboard</template>
      </el-menu-item>

      <!-- 后续可以添加更多菜单 -->
    </el-menu>
  </div>
</template>

<script setup lang="ts">
/**
 * 侧边栏组件
 * 显示导航菜单
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DataAnalysis } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/modules/app'

const route = useRoute()
const appStore = useAppStore()

// 当前激活的菜单
const activeMenu = computed(() => route.path)
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
