<!--
  商品表单页（新增/编辑）

  功能：
  - 新增商品
  - 编辑商品
  - 表单验证
  - 图片上传

  与 React 的区别：
  - React: 使用 react-hook-form 或手动管理表单状态
  - Vue3: 使用 useForm + v-model，更符合直觉
-->

<template>
  <div class="product-form">
    <h1 class="page-title">{{ isEdit ? '编辑商品' : '新增商品' }}</h1>

    <el-card>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <!-- 基本信息 -->
        <h3 class="section-title">基本信息</h3>

        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入商品名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品分类" prop="category">
          <el-select
            v-model="formData.category"
            placeholder="请选择商品分类"
            style="width: 100%"
          >
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
            <el-option label="图书" value="图书" />
          </el-select>
        </el-form-item>

        <!-- 价格和库存 -->
        <h3 class="section-title">价格与库存</h3>

        <el-form-item label="销售价格" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0.01"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
          <span class="form-tip">单位：元</span>
        </el-form-item>

        <el-form-item label="原价" prop="originalPrice">
          <el-input-number
            v-model="formData.originalPrice"
            :min="0"
            :step="0.01"
            :precision="2"
            style="width: 100%"
          />
          <span class="form-tip">选填，用于显示划线价</span>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number
            v-model="formData.stock"
            :min="0"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 商品状态 -->
        <h3 class="section-title">商品状态</h3>

        <el-form-item label="上架状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="ProductStatus.Draft">草稿</el-radio>
            <el-radio :value="ProductStatus.OnSale">立即上架</el-radio>
            <el-radio :value="ProductStatus.OffSale">暂不上架</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 商品图片 -->
        <h3 class="section-title">商品图片</h3>

        <el-form-item label="商品图片" prop="images">
          <ImageUpload
            v-model="formData.images"
            :limit="5"
            :max-size="2"
          />
          <div class="form-tip">
            建议尺寸 800x800，支持 JPG、PNG 格式，单张不超过 2MB，最多 5 张
          </div>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '立即创建' }}
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 商品表单页
 *
 * 与 React 的区别：
 * - React: 使用 react-hook-form 的 register, handleSubmit
 * - Vue3: 使用 v-model + useForm，更直观
 */
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'

import ImageUpload from '@/components/Common/ImageUpload.vue'
import { useForm } from '@/composables/useForm'
import {
  getProductDetail,
  createProduct,
  updateProduct
} from '@/api/modules/product'
import type { ProductFormData } from '@/types/models/product'
import { ProductStatus } from '@/types/models/product'

const router = useRouter()
const route = useRoute()

/**
 * 判断是否为编辑模式
 */
const isEdit = computed(() => !!route.query.id)
const productId = computed(() => Number(route.query.id))

/**
 * 表单初始数据
 */
const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined,
  stock: 0,
  category: '',
  images: [],
  status: ProductStatus.Draft
}

/**
 * 表单验证规则
 *
 * 与 React 的区别：
 * - React: react-hook-form 使用 yup 或 zod 验证
 * - Vue3: Element Plus Form 使用内置验证规则
 */
const rules: FormRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入销售价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于 0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于 0', trigger: 'blur' }
  ],
  images: [
    { required: true, message: '请上传商品图片', trigger: 'change' }
  ]
}

/**
 * 使用 useForm 管理表单逻辑
 *
 * 与 React 的区别：
 * - React: 需要手动管理表单状态和提交逻辑
 * - Vue3: useForm 封装了验证、提交、加载状态等
 */
const {
  formRef,
  formData,
  loading,
  handleSubmit: submitForm
} = useForm<ProductFormData>(
  { ...initialFormData },
  async (data) => {
    if (isEdit.value) {
      // 编辑模式
      await updateProduct(productId.value, data)
    } else {
      // 新增模式
      await createProduct(data)
    }
  },
  {
    successMessage: isEdit.value ? '保存成功' : '创建成功',
    onSuccess: () => {
      // 成功后跳转到列表页
      router.push('/product/list')
    }
  }
)

/**
 * 处理提交
 */
const handleSubmit = () => {
  submitForm()
}

/**
 * 处理取消
 */
const handleCancel = () => {
  router.back()
}

/**
 * 加载商品详情（编辑模式）
 */
const loadProductDetail = async () => {
  if (!isEdit.value) return

  try {
    const product = await getProductDetail(productId.value)

    // 填充表单数据
    Object.assign(formData, {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      category: product.category,
      images: product.images,
      status: product.status
    })
  } catch (error) {
    ElMessage.error('加载商品详情失败')
    router.back()
  }
}

/**
 * 组件挂载时加载数据
 */
onMounted(() => {
  if (isEdit.value) {
    loadProductDetail()
  }
})
</script>

<style scoped lang="scss">
.product-form {
  .page-title {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .section-title {
    margin: 0 0 16px;
    padding-bottom: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-bottom: 1px solid #dcdfe6;
  }

  .form-tip {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
}
</style>
