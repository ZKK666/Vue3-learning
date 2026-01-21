<!--
  用户详情页
-->

<template>
  <div class="user-detail">
    <div v-if="loading" v-loading="loading" class="loading-container"></div>

    <template v-else-if="data">
      <div class="detail-header">
        <h1 class="page-title">用户详情</h1>
        <div class="actions">
          <el-button @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack">返回列表</el-button>
        </div>
      </div>

      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <StatusTag type="user" :status="data.status" />
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <div class="avatar-section">
              <el-avatar :src="data.avatar" :size="120">
                {{ data.name.charAt(0) }}
              </el-avatar>
              <h3>{{ data.name }}</h3>
              <p class="username">@{{ data.username }}</p>
            </div>
          </el-col>

          <el-col :xs="24" :md="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户 ID">
                {{ data.id }}
              </el-descriptions-item>
              <el-descriptions-item label="用户名">
                {{ data.username }}
              </el-descriptions-item>
              <el-descriptions-item label="姓名">
                {{ data.name }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ data.email }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ data.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="角色">
                <el-tag
                  v-for="role in data.roles"
                  :key="role"
                  type="primary"
                  size="small"
                  style="margin-right: 4px"
                >
                  {{ role }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ data.createdAt }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ data.updatedAt }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 权限列表 -->
      <el-card v-if="data.permissions && data.permissions.length > 0" class="info-card">
        <template #header>权限列表</template>
        <el-tag
          v-for="permission in data.permissions"
          :key="permission"
          type="info"
          size="small"
          style="margin: 4px"
        >
          {{ permission }}
        </el-tag>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StatusTag from '@/components/Business/StatusTag.vue'
import { useRequest } from '@/composables/useRequest'
import { getUserDetail } from '@/api/modules/user'
import type { UserInfo } from '@/types/models/user'

const router = useRouter()
const route = useRoute()
const userId = Number(route.params.id)

const { data, loading, execute: loadDetail } = useRequest<UserInfo, [number]>(
  getUserDetail,
  { immediate: false }
)

const handleEdit = () => {
  router.push(`/user/form?id=${userId}`)
}

const handleBack = () => {
  router.push('/user/list')
}

onMounted(() => {
  loadDetail(userId)
})
</script>

<style scoped lang="scss">
.user-detail {
  .loading-container {
    min-height: 400px;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }

  .info-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      h3 {
        margin: 16px 0 4px;
        font-size: 20px;
        color: #303133;
      }

      .username {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>
