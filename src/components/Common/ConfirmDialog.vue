<!--
  ConfirmDialog 确认对话框组件

  用途：封装确认操作的对话框，支持自定义内容

  与 React 的区别：
  - React: 通常使用 Portal + useState 控制显示
  - Vue3: 使用 v-model 双向绑定，更简洁

  使用示例：
  <ConfirmDialog
    v-model="dialogVisible"
    title="确认删除"
    message="确定要删除这条记录吗？"
    @confirm="handleDelete"
  />
-->

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    @update:model-value="handleUpdate"
    @close="handleClose"
  >
    <!-- 对话框内容 -->
    <div class="confirm-content">
      <!-- 图标 -->
      <el-icon v-if="showIcon" :class="`icon-${type}`" :size="48">
        <WarningFilled v-if="type === 'warning'" />
        <InfoFilled v-else-if="type === 'info'" />
        <SuccessFilled v-else-if="type === 'success'" />
        <CircleCloseFilled v-else-if="type === 'error'" />
      </el-icon>

      <!-- 消息文本 -->
      <div class="message">
        <p v-if="message">{{ message }}</p>
        <!-- 自定义内容插槽 -->
        <slot></slot>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleCancel">
        {{ cancelText }}
      </el-button>
      <el-button
        :type="confirmType"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/**
 * 组件 Props
 */
export interface ConfirmDialogProps {
  /** 是否显示对话框 */
  modelValue: boolean
  /** 对话框标题 */
  title?: string
  /** 消息文本 */
  message?: string
  /** 对话框类型 */
  type?: 'warning' | 'info' | 'success' | 'error'
  /** 是否显示图标 */
  showIcon?: boolean
  /** 对话框宽度 */
  width?: string | number
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮类型 */
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /** 是否显示加载状态 */
  loading?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 按 ESC 是否关闭 */
  closeOnPressEscape?: boolean
}

/**
 * 组件 Emits
 */
export interface ConfirmDialogEmits {
  /** 更新 modelValue */
  (e: 'update:modelValue', value: boolean): void
  /** 确认事件 */
  (e: 'confirm'): void
  /** 取消事件 */
  (e: 'cancel'): void
  /** 关闭事件 */
  (e: 'close'): void
}

import {
  WarningFilled,
  InfoFilled,
  SuccessFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'

/**
 * Props 默认值
 */
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  title: '提示',
  message: '',
  type: 'warning',
  showIcon: true,
  width: '420px',
  confirmText: '确定',
  cancelText: '取消',
  confirmType: 'primary',
  loading: false,
  closeOnClickModal: false,
  closeOnPressEscape: true
})

const emit = defineEmits<ConfirmDialogEmits>()

/**
 * 更新 modelValue
 *
 * 与 React 的区别：
 * - React: 调用 setState 或 props.onClose
 * - Vue3: emit update:modelValue 实现双向绑定
 */
const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}

/**
 * 处理确认
 */
const handleConfirm = () => {
  emit('confirm')
}

/**
 * 处理取消
 */
const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

/**
 * 处理关闭
 */
const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.confirm-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .icon-warning {
    color: #e6a23c;
  }

  .icon-info {
    color: #909399;
  }

  .icon-success {
    color: #67c23a;
  }

  .icon-error {
    color: #f56c6c;
  }

  .message {
    flex: 1;
    font-size: 14px;
    color: #606266;
    line-height: 1.6;

    p {
      margin: 0;
    }
  }
}
</style>
