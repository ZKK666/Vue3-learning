<!--
  用户列表页
-->

<template>
  <div class="user-list">
    <h1 class="page-title">用户管理</h1>

    <!-- 搜索栏 -->
    <SearchBar
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格 -->
    <el-card>
      <el-table :data="data" :loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar :src="row.avatar" :size="40">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div class="user-text">
                <div class="user-name">{{ row.name }}</div>
                <div class="username">@{{ row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="角色" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              type="primary"
              size="small"
              style="margin-right: 4px"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <StatusTag type="user" :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              查看
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              link
              :type="row.status === UserStatus.Active ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === UserStatus.Active ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <TablePagination
        v-model:page="pagination.pagination.page"
        v-model:page-size="pagination.pagination.pageSize"
        :total="pagination.pagination.total"
        @change="loadData"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SearchBar, { type SearchField } from '@/components/Common/SearchBar.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import StatusTag from '@/components/Business/StatusTag.vue'
import { useTable } from '@/composables/useTable'
import { getUserList, updateUserStatus } from '@/api/modules/user'
import type { UserInfo } from '@/types/models/user'
import { UserStatus } from '@/types/models/user'

const router = useRouter()

const searchFields: SearchField[] = [
  { key: 'keyword', label: '关键词', type: 'input', placeholder: '用户名/姓名/手机号' },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: UserStatus.Active },
      { label: '禁用', value: UserStatus.Disabled }
    ]
  }
]

const {
  data,
  loading,
  pagination,
  loadData,
  handleSearch,
  reset: handleReset
} = useTable<UserInfo>(
  async (params) => {
    const response = await getUserList(params)
    return { list: response.list, total: response.total }
  },
  { immediate: false, pageSize: 10 }
)

const handleView = (row: UserInfo) => {
  router.push(`/user/detail/${row.id}`)
}

const handleEdit = (row: UserInfo) => {
  router.push(`/user/form?id=${row.id}`)
}

const handleToggleStatus = async (row: UserInfo) => {
  try {
    const newStatus = row.status === UserStatus.Active ? UserStatus.Disabled : UserStatus.Active
    await updateUserStatus(row.id, newStatus)
    ElMessage.success(newStatus === UserStatus.Active ? '启用成功' : '禁用成功')
    loadData()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.user-list {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-text {
      .user-name {
        font-weight: 500;
        color: #303133;
      }

      .username {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>
