import http from "@/utils/http";
import { defineStore } from "pinia";
// 1.定义容器
/** crtl+win+t
 * @name: zhangweihai
 * @params: 参数1：容器的ID,必须唯一，将来pinia会把所有的容器挂载到根容器
 *          参数2：选项对象 
 * @return {*}
 */

export const useSignsStore = defineStore('signs', {
  // 必须是箭头函数 更好的ts类型推导
  state: () => {
    return {
      infos: {}
    }
  },
  getters: {
  },
  actions: {
    // 不能箭头函数
    updateInfos(payload: any) {
      this.infos = payload;
    },
    getTime(payload: any) {
      return http.get('/signs/time', payload)
    },
    putTime(payload: any){
      return http.put('/signs/time', payload);
    }

  }
})