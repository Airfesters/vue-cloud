<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <aside class="w-64 bg-gray-800 text-white min-h-screen">
    <div class="p-4 text-2xl font-semibold">Dashboard</div>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#2d3748"
      text-color="#cbd5e0"
      active-text-color="#fff"
    >
      <el-menu-item index="1" @click="$router.push('/')">
        <i class="el-icon-house"></i>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="2" @click="$router.push('/admin')">
        <i class="el-icon-setting"></i>
        <span>Admin Panel</span>
      </el-menu-item>
      <el-menu-item index="3" @click="$router.push('/reports')">
        <i class="el-icon-document"></i>
        <span>Reports</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup></script>

<style scoped>
.el-menu-vertical-demo {
  border-right: none;
}
</style>
