<template>
  <div class="home-header">
    <span class="home-header-logo">
      <i class="iconfont icon-Vue"></i>
      <i class="iconfont icon-test"></i>
      <i class="iconfont icon-typescript"></i>
    </span>
    <span class="home-header-title">在线考勤系统</span>

    <el-dropdown>
      <el-badge>
        <el-icon :size="20"><Bell /></el-icon>
      </el-badge>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>暂无消息</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown>
      <el-space class="home-header-space">
        <el-avatar :src="(head as string)" /> {{ name }}
      </el-space>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUsersStore } from "@/stores/users";
const userStore = useUsersStore();
const head = computed(() => userStore.infos.head);
const name = computed(() => userStore.infos.name);
const handleLogout = () => {
  userStore.clearToken();
  userStore.clearInfos();
  setTimeout(() => {
    window.location.replace("/login");
  }, 500);
};
</script>

<style scoped lang="scss">
.home-header {
  font-size: 34px;
  display: flex;
  align-items: center;
  height: 100%;
  .home-header-logo {
    .icon-Vue,
    .icon-icon-test,
    .icon-typescript {
      margin-right: 5px;
      font-size: inherit;
    }
    .icon-Vue {
      color: green;
    }
    .icon-test {
      color: #deb887;
      font-size: 22px;
    }
    .icon-typescript {
      color: blue;
    }
  }
  .home-header-title {
    margin-left: 30px;
    font-weight: 700;
    font-size: 18px;
    margin-right: auto;
  }
  .home-header-space {
    margin-left: 20px;
  }
}
</style>
