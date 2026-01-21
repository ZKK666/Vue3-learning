<!--
  订单详情页
-->

<template>
  <div class="order-detail">
    <div v-if="loading" v-loading="loading" class="loading-container"></div>

    <template v-else-if="data">
      <div class="detail-header">
        <h1 class="page-title">订单详情</h1>
        <el-button @click="handleBack">返回列表</el-button>
      </div>

      <!-- 订单信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span>订单信息</span>
            <StatusTag type="order" :status="data.status" />
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ data.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ data.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ data.userName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ data.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ PaymentMethodMap[data.paymentMethod] }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            <span class="amount">¥{{ data.totalAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item v-if="data.paidAt" label="支付时间">
            {{ data.paidAt }}
          </el-descriptions-item>
          <el-descriptions-item v-if="data.shippedAt" label="发货时间">
            {{ data.shippedAt }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 收货地址 -->
      <el-card class="info-card">
        <template #header>收货地址</template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">
            {{ data.shippingAddress.consignee }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ data.shippingAddress.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ data.shippingAddress.province }}
            {{ data.shippingAddress.city }}
            {{ data.shippingAddress.district }}
            {{ data.shippingAddress.address }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品清单 -->
      <el-card class="info-card">
        <template #header>商品清单</template>
        <el-table :data="data.items" border>
          <el-table-column label="商品信息" min-width="200">
            <template #default="{ row }">
              <div class="product-info">
                <el-image
                  :src="row.productImage"
                  class="product-image"
                  fit="cover"
                />
                <span>{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="120">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥{{ row.subtotal }}</template>
          </el-table-column>
        </el-table>

        <div class="amount-summary">
          <div class="amount-item">
            <span>商品总额：</span>
            <span>¥{{ data.totalAmount }}</span>
          </div>
          <div v-if="data.discountAmount > 0" class="amount-item">
            <span>优惠金额：</span>
            <span class="discount">-¥{{ data.discountAmount }}</span>
          </div>
          <div class="amount-item total">
            <span>实付金额：</span>
            <span class="amount">¥{{ data.paymentAmount }}</span>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StatusTag from '@/components/Business/StatusTag.vue'
import { useRequest } from '@/composables/useRequest'
import { getOrderDetail } from '@/api/modules/order'
import type { Order } from '@/types/models/order'
import { PaymentMethodMap } from '@/types/models/order'

const router = useRouter()
const route = useRoute()
const orderId = String(route.params.id)

const { data, loading, execute: loadDetail } = useRequest<Order, [string]>(
  getOrderDetail,
  { immediate: false }
)

const handleBack = () => {
  router.push('/order/list')
}

onMounted(() => {
  loadDetail(orderId)
})
</script>

<style scoped lang="scss">
.order-detail {
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
  }

  .info-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .amount {
      font-size: 18px;
      font-weight: 600;
      color: #f56c6c;
    }

    .product-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .product-image {
        width: 60px;
        height: 60px;
        border-radius: 4px;
      }
    }

    .amount-summary {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #ebeef5;
      text-align: right;

      .amount-item {
        margin-bottom: 8px;
        font-size: 14px;

        .discount {
          color: #67c23a;
        }

        &.total {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 600;

          .amount {
            font-size: 20px;
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>
