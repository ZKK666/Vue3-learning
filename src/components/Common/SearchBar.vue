<!--
  SearchBar 搜索栏组件

  用途：封装常见的搜索栏功能，支持多个搜索字段

  与 React 的区别：
  - React: 通常使用受控组件 + onChange 处理
  - Vue3: 使用 v-model 双向绑定，更简洁

  使用示例：
  <SearchBar
    :fields="searchFields"
    @search="handleSearch"
    @reset="handleReset"
  />
-->

<template>
  <el-form
    :inline="true"
    :model="formData"
    class="search-bar"
  >
    <!-- 动态渲染搜索字段 -->
    <el-form-item
      v-for="field in fields"
      :key="field.key"
      :label="field.label"
    >
      <!-- 输入框 -->
      <el-input
        v-if="field.type === 'input'"
        v-model="formData[field.key]"
        :placeholder="field.placeholder || `请输入${field.label}`"
        clearable
        @keyup.enter="handleSearch"
      />

      <!-- 选择器 -->
      <el-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.key]"
        :placeholder="field.placeholder || `请选择${field.label}`"
        clearable
      >
        <el-option
          v-for="option in field.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="field.type === 'date'"
        v-model="formData[field.key]"
        type="date"
        :placeholder="field.placeholder || `请选择${field.label}`"
        clearable
      />

      <!-- 日期范围选择器 -->
      <el-date-picker
        v-else-if="field.type === 'daterange'"
        v-model="formData[field.key]"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        clearable
      />
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="handleSearch">
        搜索
      </el-button>
      <el-button :icon="Refresh" @click="handleReset">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
/**
 * 搜索字段配置
 */
export interface SearchField {
  /** 字段 key */
  key: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type: 'input' | 'select' | 'date' | 'daterange'
  /** 占位符 */
  placeholder?: string
  /** 选项（当 type 为 select 时） */
  options?: Array<{ label: string; value: any }>
  /** 默认值 */
  defaultValue?: any
}

/**
 * 组件 Props
 */
export interface SearchBarProps {
  /** 搜索字段配置 */
  fields: SearchField[]
}

/**
 * 组件 Emits
 */
export interface SearchBarEmits {
  /** 搜索事件 */
  (e: 'search', params: Record<string, any>): void
  /** 重置事件 */
  (e: 'reset'): void
}

import { reactive } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const props = defineProps<SearchBarProps>()
const emit = defineEmits<SearchBarEmits>()

/**
 * 表单数据
 *
 * 与 React 的区别：
 * - React: 使用 useState 管理每个字段
 * - Vue3: 使用 reactive 统一管理，自动双向绑定
 */
const formData = reactive<Record<string, any>>(
  props.fields.reduce(
    (acc, field) => {
      acc[field.key] = field.defaultValue ?? ''
      return acc
    },
    {} as Record<string, any>
  )
)

/**
 * 处理搜索
 */
const handleSearch = () => {
  // 过滤空值
  const params = Object.keys(formData).reduce(
    (acc, key) => {
      const value = formData[key]
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>
  )

  emit('search', params)
}

/**
 * 处理重置
 */
const handleReset = () => {
  // 重置为默认值
  props.fields.forEach((field) => {
    formData[field.key] = field.defaultValue ?? ''
  })

  emit('reset')
}
</script>

<style scoped lang="scss">
.search-bar {
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 16px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
