<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { reactive, toRefs } from "vue";
const reactiveVal = reactive({
  locale: zhCn,
});
const { locale } = toRefs(reactiveVal);
</script>

<style lang="scss" scoped></style>
