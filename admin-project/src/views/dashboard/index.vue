<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>

    <!-- 核心指标卡片 -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <div class="metric-info">
              <p class="metric-label">总销售额</p>
              <h3 class="metric-value">¥128,560</h3>
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
              <h3 class="metric-value">1,234</h3>
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
              <h3 class="metric-value">856</h3>
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
              <h3 class="metric-value">342</h3>
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
 */
import { Money, ShoppingCart, User, Goods } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.dashboard {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
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
        .metric-label {
          margin: 0 0 8px;
          font-size: 14px;
          color: #909399;
        }

        .metric-value {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          color: #303133;
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
