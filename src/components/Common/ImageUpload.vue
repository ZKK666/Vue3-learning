<!--
  ImageUpload 图片上传组件

  用途：封装图片上传功能，支持预览、删除、限制大小等

  与 React 的区别：
  - React: 通常手动处理文件上传逻辑
  - Vue3: 配合 Element Plus Upload 组件，更简洁

  使用示例：
  <ImageUpload
    v-model="formData.imageUrl"
    :limit="5"
    :max-size="2"
  />
-->

<template>
  <div class="image-upload">
    <el-upload
      :action="uploadAction"
      :headers="uploadHeaders"
      :file-list="fileList"
      :limit="limit"
      :accept="accept"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-preview="handlePreview"
      list-type="picture-card"
    >
      <el-icon><Plus /></el-icon>

      <template #tip>
        <div class="el-upload__tip">
          支持 {{ accept }} 格式，单个文件不超过 {{ maxSize }}MB
          {{ limit > 1 ? `，最多上传 ${limit} 张` : '' }}
        </div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="60%">
      <img :src="previewUrl" class="preview-image" alt="预览" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 组件 Props
 */
export interface ImageUploadProps {
  /** 已上传的图片 URL（单图）或 URL 数组（多图） */
  modelValue?: string | string[]
  /** 最多上传数量 */
  limit?: number
  /** 单个文件最大大小（MB） */
  maxSize?: number
  /** 接受的文件类型 */
  accept?: string
}

/**
 * 组件 Emits
 */
export interface ImageUploadEmits {
  /** 更新 modelValue */
  (e: 'update:modelValue', value: string | string[]): void
}

import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadUserFile } from 'element-plus'

const props = withDefaults(defineProps<ImageUploadProps>(), {
  modelValue: () => [],
  limit: 1,
  maxSize: 2,
  accept: 'image/jpeg,image/jpg,image/png,image/gif'
})

const emit = defineEmits<ImageUploadEmits>()

/**
 * 上传地址
 * 实际项目中应该从环境变量读取
 */
const uploadAction = ref(
  `${import.meta.env.VITE_API_BASE_URL || ''}/upload/image`
)

/**
 * 上传请求头
 */
const uploadHeaders = computed(() => {
  // 从 localStorage 获取 token
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : ''
  }
})

/**
 * 文件列表
 *
 * 与 React 的区别：
 * - React: 使用 useState 管理文件列表
 * - Vue3: 使用 ref，配合 watch 监听 props 变化
 */
const fileList = ref<UploadUserFile[]>([])

/**
 * 预览相关状态
 */
const previewVisible = ref(false)
const previewUrl = ref('')

/**
 * 监听 modelValue 变化，同步到 fileList
 *
 * 与 React 的区别：
 * - React: 使用 useEffect 监听 props 变化
 * - Vue3: 使用 watch 监听，更直观
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      fileList.value = []
      return
    }

    // 单图模式
    if (typeof newValue === 'string') {
      fileList.value = newValue
        ? [{ name: 'image', url: newValue }]
        : []
    }
    // 多图模式
    else if (Array.isArray(newValue)) {
      fileList.value = newValue.map((url, index) => ({
        name: `image-${index}`,
        url
      }))
    }
  },
  { immediate: true }
)

/**
 * 上传前的校验
 *
 * @param file - 待上传的文件
 * @returns 是否通过校验
 */
const handleBeforeUpload = (file: File): boolean => {
  // 检查文件类型
  const isValidType = props.accept
    .split(',')
    .some((type) => file.type === type.trim())

  if (!isValidType) {
    ElMessage.error(
      `只支持上传 ${props.accept.replace(/image\//g, '').toUpperCase()} 格式的图片`
    )
    return false
  }

  // 检查文件大小
  const isValidSize = file.size / 1024 / 1024 < props.maxSize

  if (!isValidSize) {
    ElMessage.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  return true
}

/**
 * 上传成功回调
 *
 * @param response - 服务器响应
 * @param file - 上传的文件
 * @param files - 当前文件列表
 */
const handleSuccess = (
  response: any,
  file: UploadFile,
  files: UploadFiles
) => {
  // 假设服务器返回格式为 { code: 0, data: { url: 'xxx' } }
  if (response.code === 0) {
    ElMessage.success('上传成功')

    // 更新 modelValue
    const urls = files.map((f) => {
      // 如果是新上传的文件，从响应中获取 URL
      if (f.uid === file.uid) {
        return response.data.url
      }
      // 否则使用原有 URL
      return f.url || ''
    }).filter(Boolean)

    // 单图模式
    if (props.limit === 1) {
      emit('update:modelValue', urls[0] || '')
    }
    // 多图模式
    else {
      emit('update:modelValue', urls)
    }
  } else {
    ElMessage.error(response.message || '上传失败')
    // 从文件列表中移除失败的文件
    const index = files.findIndex((f) => f.uid === file.uid)
    if (index > -1) {
      files.splice(index, 1)
    }
  }
}

/**
 * 上传失败回调
 */
const handleError = () => {
  ElMessage.error('上传失败，请重试')
}

/**
 * 删除文件回调
 *
 * @param file - 删除的文件
 * @param files - 剩余文件列表
 */
const handleRemove = (file: UploadFile, files: UploadFiles) => {
  // 更新 modelValue
  const urls = files.map((f) => f.url || '').filter(Boolean)

  // 单图模式
  if (props.limit === 1) {
    emit('update:modelValue', '')
  }
  // 多图模式
  else {
    emit('update:modelValue', urls)
  }
}

/**
 * 超出限制回调
 */
const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}

/**
 * 预览图片
 *
 * @param file - 预览的文件
 */
const handlePreview = (file: UploadFile) => {
  previewUrl.value = file.url || ''
  previewVisible.value = true
}
</script>

<style scoped lang="scss">
.image-upload {
  :deep(.el-upload__tip) {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }

  .preview-image {
    width: 100%;
    display: block;
  }
}
</style>
