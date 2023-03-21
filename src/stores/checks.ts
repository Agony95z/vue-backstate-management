
import { defineStore } from "pinia";
// 1.定义容器
/** crtl+win+t
 * @name: zhangweihai
 * @params: 参数1：容器的ID,必须唯一，将来pinia会把所有的容器挂载到根容器
 *          参数2：选项对象 
 * @return {*}
 */
export const useChecksStore = defineStore('checks', {
  // 必须是箭头函数 更好的ts类型推导
  state: () => {
    return {
      checks: {
        applyList: []
      }
    }
  },
  getters: {
  },
  actions: {
    
  }
})