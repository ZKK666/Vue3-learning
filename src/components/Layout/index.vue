<template>
  <div class="layout-container">
    <LayoutHeader />
    <div class="layout-body">
      <LayoutSidebar />
      <LayoutMain />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 布局容器组件
 * 组合 Header、Sidebar、Main 三个部分
 */
import LayoutHeader from './Header.vue'
import LayoutSidebar from './Sidebar.vue'
import LayoutMain from './Main.vue'
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
