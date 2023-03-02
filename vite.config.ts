// import { fileURLToPath, URL } from 'node:url'

import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: [`@use "@/assets/style/reset.scss";' '@use "@/assets/style/common.scss"`],
    //   },
    // }
    preprocessorOptions: {
      scss: {
        // 引入var.scss全局预定义变量，
        // 如果引入多个文件，
        // 可以使用
        // 这种格式
        additionalData:
          '@import "@/assets/style/reset.scss"; @import "@/assets/style/common.scss"; @import "@/assets/style/iconfont.scss";',
      },
    },
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: 8000,
  //   open: true,
  //   https: false,
  //   proxy: {
  //     '/': {
  //       target: 'http://api.h5ke.top/',
  //       changeOrigin: true,
  //       rewrite: p => p.replace(/^\//, '')
  //     },

  //   }
  // }
});
