<!--
  订单列表页
-->

<template>
  <div class="order-list">
    <h1 class="page-title">订单管理</h1>

    <!-- 搜索栏 -->
    <SearchBar
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 表格 -->
    <el-card>
      <el-table :data="data" :loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column prop="userPhone" label="手机号" width="120" />
        <el-table-column label="订单金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column label="支付方式" width="120">
          <template #default="{ row }">
            {{ PaymentMethodMap[row.paymentMethod] }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <StatusTag type="order" :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">
              查看详情
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
import SearchBar, { type SearchField } from '@/components/Common/SearchBar.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import StatusTag from '@/components/Business/StatusTag.vue'
import { useTable } from '@/composables/useTable'
import { getOrderList } from '@/api/modules/order'
import type { Order } from '@/types/models/order'
import { OrderStatus, PaymentMethodMap } from '@/types/models/order'

const router = useRouter()

const searchFields: SearchField[] = [
  { key: 'keyword', label: '关键词', type: 'input', placeholder: '订单号/用户名/手机号' },
  {
    key: 'status',
    label: '订单状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '待支付', value: OrderStatus.Pending },
      { label: '已支付', value: OrderStatus.Paid },
      { label: '已发货', value: OrderStatus.Shipped },
      { label: '已完成', value: OrderStatus.Completed },
      { label: '已取消', value: OrderStatus.Cancelled }
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
} = useTable<Order>(
  async (params) => {
    const response = await getOrderList(params)
    return { list: response.list, total: response.total }
  },
  { immediate: false, pageSize: 10 }
)

const handleView = (row: Order) => {
  router.push(`/order/detail/${row.id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.order-list {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
}
</style>
