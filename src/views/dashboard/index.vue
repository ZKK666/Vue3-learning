<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>

    <!-- 加载状态 -->
    <div v-if="loading" v-loading="loading" class="loading-container"></div>

    <!-- 核心指标卡片 -->
    <el-row v-else :gutter="20" class="metrics-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <p class="metric-label">总销售额</p>
              <h3 class="metric-value">¥{{ formatNumber(metricsData?.totalSales) }}</h3>
              <p class="metric-trend">
                今日: ¥{{ formatNumber(metricsData?.todaySales) }}
              </p>
            </div>
            <el-icon class="metric-icon" color="#409eff">
              <Money />
            </el-icon>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <p class="metric-label">总订单数</p>
              <h3 class="metric-value">{{ formatNumber(metricsData?.totalOrders) }}</h3>
              <p class="metric-trend">
                今日: {{ formatNumber(metricsData?.todayOrders) }}
              </p>
            </div>
            <el-icon class="metric-icon" color="#67c23a">
              <ShoppingCart />
            </el-icon>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <p class="metric-label">总用户数</p>
              <h3 class="metric-value">{{ formatNumber(metricsData?.totalUsers) }}</h3>
              <p class="metric-trend">
                今日新增: {{ formatNumber(metricsData?.todayUsers) }}
              </p>
            </div>
            <el-icon class="metric-icon" color="#e6a23c">
              <User />
            </el-icon>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <p class="metric-label">总商品数</p>
              <h3 class="metric-value">{{ formatNumber(metricsData?.totalProducts) }}</h3>
            </div>
            <el-icon class="metric-icon" color="#f56c6c">
              <Goods />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 欢迎信息 -->
    <el-card class="welcome-card">
      <h2>欢迎使用 Vue3 电商管理后台</h2>
      <p>这是一个基于 Vue3 + TypeScript + Vite + Element Plus 构建的企业级管理系统</p>
      <el-divider />
      <div class="tech-stack">
        <h3>技术栈</h3>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-tag type="primary">Vue 3.5</el-tag>
          </el-col>
          <el-col :span="8">
            <el-tag type="success">TypeScript 5.9</el-tag>
          </el-col>
          <el-col :span="8">
            <el-tag type="warning">Vite 7.2</el-tag>
          </el-col>
          <el-col :span="8">
            <el-tag type="danger">Pinia 3.0</el-tag>
          </el-col>
          <el-col :span="8">
            <el-tag type="info">Vue Router 4</el-tag>
          </el-col>
          <el-col :span="8">
            <el-tag>Element Plus</el-tag>
          </el-col>
        </el-row>
      </div>
      <el-divider />
      <div class="features">
        <h3>核心功能</h3>
        <ul>
          <li>✅ 用户认证与权限管理</li>
          <li>✅ Pinia 状态管理</li>
          <li>✅ Vue Router 动态路由</li>
          <li>✅ Axios 请求封装</li>
          <li>✅ TypeScript 类型系统</li>
          <li>✅ Element Plus UI 组件库</li>
          <li>✅ Composables 逻辑复用（useRequest, useTable, useForm, usePagination）</li>
          <li>🚧 商品管理模块（待开发）</li>
          <li>🚧 订单管理模块（待开发）</li>
          <li>🚧 用户管理模块（待开发）</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard 首页
 * 展示核心指标和系统概览
 *
 * 与 React 的区别：
 * - React: 使用 useEffect + useState 管理数据和加载状态
 * - Vue3: 使用 Composable（useRequest）封装请求逻辑，代码更简洁
 */
import { onMounted } from 'vue'
import { Money, ShoppingCart, User, Goods } from '@element-plus/icons-vue'
import { getCoreMetrics, type CoreMetrics } from '@/api/modules/dashboard'
import { useRequest } from '@/composables/useRequest'

/**
 * 使用 useRequest 封装 API 请求
 *
 * 与 React 的区别：
 * - React: 需要手动管理 loading, data, error 状态
 * - Vue3: useRequest 自动管理这些状态，开箱即用
 */
const { data: metricsData, loading, execute: loadMetrics } = useRequest<CoreMetrics, []>(
  getCoreMetrics,
  {
    immediate: false, // 不立即执行，等组件挂载后再执行
    showErrorMessage: true // 显示错误提示
  }
)

/**
 * 格式化数字（添加千分位分隔符）
 *
 * @param value - 数值
 * @returns 格式化后的字符串
 */
const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return '0'
  }
  return value.toLocaleString('zh-CN')
}

/**
 * 组件挂载时加载数据
 *
 * 与 React 的区别：
 * - React: useEffect(() => { loadData() }, [])
 * - Vue3: onMounted(() => { loadData() })
 *
 * 两者概念相似，但 Vue3 的生命周期钩子更明确
 */
onMounted(() => {
  loadMetrics()
})
</script>

<style scoped lang="scss">
.dashboard {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .loading-container {
    min-height: 200px;
  }

  .metrics-row {
    margin-bottom: 20px;
  }

  .metric-card {
    .metric-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .metric-info {
        flex: 1;

        .metric-label {
          margin: 0 0 8px;
          font-size: 14px;
          color: #909399;
        }

        .metric-value {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 600;
          color: #303133;
        }

        .metric-trend {
          margin: 0;
          font-size: 12px;
          color: #67c23a;
        }
      }

      .metric-icon {
        font-size: 48px;
        opacity: 0.8;
      }
    }
  }

  .welcome-card {
    h2 {
      margin: 0 0 12px;
      font-size: 20px;
      color: #303133;
    }

    p {
      margin: 0;
      color: #606266;
    }

    .tech-stack {
      h3 {
        margin-bottom: 12px;
        font-size: 16px;
        color: #303133;
      }

      .el-row {
        row-gap: 12px;
      }

      .el-tag {
        width: 100%;
        justify-content: center;
      }
    }

    .features {
      h3 {
        margin-bottom: 12px;
        font-size: 16px;
        color: #303133;
      }

      ul {
        margin: 0;
        padding-left: 20px;
        color: #606266;

        li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
