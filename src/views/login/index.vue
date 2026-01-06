<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Vue3 电商管理后台</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        <p>提示：输入任意用户名和密码即可登录（演示模式）</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录页面
 */
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import type { LoginParams } from '@/types/models/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive<LoginParams>({
  username: 'admin',
  password: '123456',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 加载状态
const loading = ref(false)

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return

  // 验证表单
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    // 调用登录接口（演示模式：模拟登录成功）
    // 实际项目中会调用真实的 API
    // await userStore.login(loginForm)

    // 演示模式：直接设置 token 和用户信息
    const mockToken = 'mock-token-' + Date.now()
    const mockUserInfo = {
      id: 1,
      username: loginForm.username,
      name: loginForm.username === 'admin' ? '管理员' : '用户',
      email: 'user@example.com',
      phone: '13800138000',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      roles: ['admin'],
      permissions: ['*'],
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 保存到 store
    userStore.token = mockToken
    userStore.userInfo = mockUserInfo
    userStore.updateUserInfo(mockUserInfo)

    // 保存 token
    import('@/utils/storage').then(({ tokenStorage, userInfoStorage }) => {
      tokenStorage.set(mockToken)
      userInfoStorage.set(mockUserInfo)
    })

    ElMessage.success('登录成功')

    // 跳转到首页或重定向页面
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.login-form {
  .login-button {
    width: 100%;
  }
}

.login-tip {
  margin-top: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;

  p {
    margin: 0;
    font-size: 12px;
    color: #909399;
    text-align: center;
  }
}
</style>
