<!--
  商品列表页

  功能：
  - 商品列表展示（分页）
  - 搜索和筛选
  - 批量操作（删除、上架、下架）
  - 跳转到详情/编辑页

  与 React 的区别：
  - React: 使用多个 useState 管理状态，useEffect 处理副作用
  - Vue3: 使用 Composables 封装逻辑，代码更简洁模块化
-->

<template>
  <div class="product-list">
    <h1 class="page-title">商品管理</h1>

    <!-- 搜索栏 -->
    <SearchBar
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 操作栏 -->
    <el-card class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleCreate">
        新增商品
      </el-button>
      <el-button
        type="danger"
        :icon="Delete"
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
      <el-button
        type="success"
        :disabled="selectedRows.length === 0"
        @click="handleBatchOnSale"
      >
        批量上架
      </el-button>
      <el-button
        type="warning"
        :disabled="selectedRows.length === 0"
        @click="handleBatchOffSale"
      >
        批量下架
      </el-button>
    </el-card>

    <!-- 表格 -->
    <el-card class="table-card">
      <el-table
        :data="data"
        :loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />

        <!-- 商品信息 -->
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div class="product-info">
              <el-image
                v-if="row.images && row.images.length > 0"
                :src="row.images[0]"
                :preview-src-list="row.images"
                class="product-image"
                fit="cover"
              />
              <div class="product-text">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-desc">{{ row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 分类 -->
        <el-table-column prop="category" label="分类" width="120" />

        <!-- 价格 -->
        <el-table-column label="价格" width="120">
          <template #default="{ row }">
            <div class="price-info">
              <div class="current-price">¥{{ row.price }}</div>
              <div v-if="row.originalPrice" class="original-price">
                ¥{{ row.originalPrice }}
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 库存 -->
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <el-tag :type="row.stock > 0 ? 'success' : 'danger'">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 销量 -->
        <el-table-column prop="sales" label="销量" width="100" />

        <!-- 状态 -->
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <StatusTag type="product" :status="row.status" />
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column prop="createdAt" label="创建时间" width="180" />

        <!-- 操作 -->
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.status === ProductStatus.OnSale"
              link
              type="warning"
              size="small"
              @click="handleOffSale(row)"
            >
              下架
            </el-button>
            <el-button
              v-else
              link
              type="success"
              size="small"
              @click="handleOnSale(row)"
            >
              上架
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
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

    <!-- 确认删除对话框 -->
    <ConfirmDialog
      v-model="deleteDialogVisible"
      title="确认删除"
      message="确定要删除选中的商品吗？此操作不可撤销。"
      type="warning"
      confirm-type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 商品列表页
 *
 * 与 React 的区别：
 * - React: 组件逻辑分散在多个 Hook 中
 * - Vue3: 使用 Composables 统一管理，逻辑更内聚
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

import SearchBar, { type SearchField } from '@/components/Common/SearchBar.vue'
import TablePagination from '@/components/Common/TablePagination.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import StatusTag from '@/components/Business/StatusTag.vue'

import { useTable } from '@/composables/useTable'
import {
  getProductList,
  deleteProduct,
  batchDeleteProducts,
  onSaleProduct,
  offSaleProduct
} from '@/api/modules/product'
import type { Product } from '@/types/models/product'
import { ProductStatus } from '@/types/models/product'

const router = useRouter()

/**
 * 搜索字段配置
 */
const searchFields: SearchField[] = [
  {
    key: 'keyword',
    label: '商品名称',
    type: 'input',
    placeholder: '请输入商品名称'
  },
  {
    key: 'category',
    label: '分类',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '电子产品', value: '电子产品' },
      { label: '服装', value: '服装' },
      { label: '食品', value: '食品' },
      { label: '图书', value: '图书' }
    ]
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '全部', value: '' },
      { label: '草稿', value: ProductStatus.Draft },
      { label: '在售', value: ProductStatus.OnSale },
      { label: '下架', value: ProductStatus.OffSale },
      { label: '售罄', value: ProductStatus.OutOfStock }
    ]
  }
]

/**
 * 使用 useTable 管理表格逻辑
 *
 * 与 React 的区别：
 * - React: 需要手动管理 data, loading, pagination 等多个状态
 * - Vue3: useTable 一次性提供所有需要的状态和方法
 */
const {
  data,
  loading,
  pagination,
  selectedRows,
  loadData,
  handleSearch,
  reset: handleReset,
  handleSelectionChange
} = useTable<Product>(
  async (params) => {
    const response = await getProductList(params)
    return {
      list: response.list,
      total: response.total
    }
  },
  {
    immediate: false,
    pageSize: 10
  }
)

/**
 * 删除确认对话框
 */
const deleteDialogVisible = ref(false)
const deleteTarget = ref<Product | null>(null)

/**
 * 新增商品
 */
const handleCreate = () => {
  router.push('/product/form')
}

/**
 * 查看详情
 */
const handleView = (row: Product) => {
  router.push(`/product/detail/${row.id}`)
}

/**
 * 编辑商品
 */
const handleEdit = (row: Product) => {
  router.push(`/product/form?id=${row.id}`)
}

/**
 * 上架商品
 */
const handleOnSale = async (row: Product) => {
  try {
    await onSaleProduct(row.id)
    ElMessage.success('上架成功')
    loadData()
  } catch (error) {
    console.error('上架失败:', error)
  }
}

/**
 * 下架商品
 */
const handleOffSale = async (row: Product) => {
  try {
    await offSaleProduct(row.id)
    ElMessage.success('下架成功')
    loadData()
  } catch (error) {
    console.error('下架失败:', error)
  }
}

/**
 * 删除商品
 */
const handleDelete = (row: Product) => {
  deleteTarget.value = row
  deleteDialogVisible.value = true
}

/**
 * 确认删除
 */
const confirmDelete = async () => {
  try {
    if (deleteTarget.value) {
      await deleteProduct(deleteTarget.value.id)
      ElMessage.success('删除成功')
      deleteDialogVisible.value = false
      loadData()
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

/**
 * 批量删除
 */
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个商品吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const ids = selectedRows.value.map((row) => row.id)
      await batchDeleteProducts(ids)
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {
      // 取消操作
    })
}

/**
 * 批量上架
 */
const handleBatchOnSale = async () => {
  try {
    const promises = selectedRows.value.map((row) => onSaleProduct(row.id))
    await Promise.all(promises)
    ElMessage.success('上架成功')
    loadData()
  } catch (error) {
    console.error('上架失败:', error)
  }
}

/**
 * 批量下架
 */
const handleBatchOffSale = async () => {
  try {
    const promises = selectedRows.value.map((row) => offSaleProduct(row.id))
    await Promise.all(promises)
    ElMessage.success('下架成功')
    loadData()
  } catch (error) {
    console.error('下架失败:', error)
  }
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.product-list {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .toolbar {
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .table-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .product-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .product-text {
      flex: 1;
      min-width: 0;

      .product-name {
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-desc {
        font-size: 12px;
        color: #909399;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .price-info {
    .current-price {
      font-weight: 600;
      color: #f56c6c;
      font-size: 16px;
    }

    .original-price {
      font-size: 12px;
      color: #909399;
      text-decoration: line-through;
    }
  }
}
</style>
