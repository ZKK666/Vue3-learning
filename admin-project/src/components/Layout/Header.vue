<template>
  <div class="layout-header">
    <div class="header-left">
      <el-icon class="menu-icon" @click="toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <span class="app-title">Vue3 电商管理后台</span>
    </div>

    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :src="userStore.userAvatar" />
          <span class="user-name">{{ userStore.userName }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 顶部导航栏组件
 * 包含：侧边栏切换、用户信息、退出登录等功能
 */
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'
import { useAppStore } from '@/stores/modules/app'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能待开发')
      break
    case 'settings':
      ElMessage.info('设置功能待开发')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await userStore.logout()
    router.push('/login')
    ElMessage.success('退出成功')
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $header-height;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .menu-icon {
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: $primary-color;
    }
  }

  .app-title {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
}

.header-right {
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f7fa;
    }

    .user-name {
      font-size: 14px;
      color: $text-primary;
    }
  }
}
</style>
