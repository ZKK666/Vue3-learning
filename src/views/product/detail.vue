<!--
  商品详情页

  功能：
  - 展示商品详细信息
  - 快捷操作（编辑、上架、下架、删除）
  - 图片轮播展示

  与 React 的区别：
  - React: 使用 useEffect 加载数据
  - Vue3: 使用 onMounted + useRequest，更直观
-->

<template>
  <div class="product-detail">
    <!-- 加载状态 -->
    <div v-if="loading" v-loading="loading" class="loading-container"></div>

    <!-- 详情内容 -->
    <template v-else-if="data">
      <!-- 头部操作栏 -->
      <div class="detail-header">
        <h1 class="page-title">商品详情</h1>
        <div class="actions">
          <el-button :icon="Edit" @click="handleEdit">
            编辑
          </el-button>
          <el-button
            v-if="data.status === ProductStatus.OnSale"
            type="warning"
            @click="handleOffSale"
          >
            下架
          </el-button>
          <el-button
            v-else
            type="success"
            @click="handleOnSale"
          >
            上架
          </el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelete">
            删除
          </el-button>
          <el-button @click="handleBack">
            返回列表
          </el-button>
        </div>
      </div>

      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
            <StatusTag type="product" :status="data.status" />
          </div>
        </template>

        <el-row :gutter="20">
          <!-- 商品图片 -->
          <el-col :xs="24" :md="12">
            <div class="image-gallery">
              <el-carousel
                v-if="data.images && data.images.length > 0"
                :interval="3000"
                height="400px"
              >
                <el-carousel-item
                  v-for="(image, index) in data.images"
                  :key="index"
                >
                  <el-image
                    :src="image"
                    :preview-src-list="data.images"
                    :initial-index="index"
                    fit="contain"
                    class="carousel-image"
                  />
                </el-carousel-item>
              </el-carousel>
              <div v-else class="no-image">
                暂无图片
              </div>
            </div>
          </el-col>

          <!-- 商品信息 -->
          <el-col :xs="24" :md="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="商品 ID">
                {{ data.id }}
              </el-descriptions-item>
              <el-descriptions-item label="商品名称">
                {{ data.name }}
              </el-descriptions-item>
              <el-descriptions-item label="商品描述">
                {{ data.description }}
              </el-descriptions-item>
              <el-descriptions-item label="分类">
                {{ data.category }}
              </el-descriptions-item>
              <el-descriptions-item label="销售价格">
                <span class="price">¥{{ data.price }}</span>
              </el-descriptions-item>
              <el-descriptions-item
                v-if="data.originalPrice"
                label="原价"
              >
                <span class="original-price">¥{{ data.originalPrice }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="库存">
                <el-tag :type="data.stock > 0 ? 'success' : 'danger'">
                  {{ data.stock }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="销量">
                {{ data.sales }}
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
    </template>

    <!-- 确认删除对话框 -->
    <ConfirmDialog
      v-model="deleteDialogVisible"
      title="确认删除"
      message="确定要删除这个商品吗？此操作不可撤销。"
      type="warning"
      confirm-type="danger"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 商品详情页
 *
 * 与 React 的区别：
 * - React: useEffect + useState 管理数据加载
 * - Vue3: onMounted + useRequest，代码更简洁
 */
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'

import StatusTag from '@/components/Business/StatusTag.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import { useRequest } from '@/composables/useRequest'
import {
  getProductDetail,
  deleteProduct,
  onSaleProduct,
  offSaleProduct
} from '@/api/modules/product'
import type { Product } from '@/types/models/product'
import { ProductStatus } from '@/types/models/product'

const router = useRouter()
const route = useRoute()

const productId = Number(route.params.id)

/**
 * 使用 useRequest 加载商品详情
 *
 * 与 React 的区别：
 * - React: 需要手动管理 loading, data, error 状态
 * - Vue3: useRequest 自动管理这些状态
 */
const { data, loading, execute: loadDetail } = useRequest<Product, [number]>(
  getProductDetail,
  {
    immediate: false
  }
)

/**
 * 删除确认对话框
 */
const deleteDialogVisible = ref(false)

/**
 * 编辑商品
 */
const handleEdit = () => {
  router.push(`/product/form?id=${productId}`)
}

/**
 * 上架商品
 */
const handleOnSale = async () => {
  try {
    await onSaleProduct(productId)
    ElMessage.success('上架成功')
    loadDetail(productId)
  } catch (error) {
    console.error('上架失败:', error)
  }
}

/**
 * 下架商品
 */
const handleOffSale = async () => {
  try {
    await offSaleProduct(productId)
    ElMessage.success('下架成功')
    loadDetail(productId)
  } catch (error) {
    console.error('下架失败:', error)
  }
}

/**
 * 删除商品
 */
const handleDelete = () => {
  deleteDialogVisible.value = true
}

/**
 * 确认删除
 */
const confirmDelete = async () => {
  try {
    await deleteProduct(productId)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    router.push('/product/list')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.push('/product/list')
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  loadDetail(productId)
})
</script>

<style scoped lang="scss">
.product-detail {
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
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .image-gallery {
      .carousel-image {
        width: 100%;
        height: 100%;
      }

      .no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
        background-color: #f5f7fa;
        color: #909399;
        font-size: 14px;
      }
    }

    .price {
      font-size: 24px;
      font-weight: 600;
      color: #f56c6c;
    }

    .original-price {
      font-size: 16px;
      color: #909399;
      text-decoration: line-through;
    }
  }

  // 响应式适配
  @media (max-width: 768px) {
    .detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .actions {
        width: 100%;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
