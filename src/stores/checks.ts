
import http from "@/utils/http";
import { defineStore } from "pinia";
// 1.定义容器
/** crtl+win+t
 * @name: zhangweihai
 * @params: 参数1：容器的ID,必须唯一，将来pinia会把所有的容器挂载到根容器
 *          参数2：选项对象 
 * @return {*}
 */
interface IList {
  [index: string]: any;
}
export const useChecksStore = defineStore('checks', {
  // 必须是箭头函数 更好的ts类型推导
  state: () => {
    return {
      applyList: [] as IList[],
      checkList: []
    }
  },
  getters: {
  },
  actions: {
    updateApplyList(payload: any){
      this.applyList = payload;
    },
    updateCheckList(payload: any){
      this.checkList = payload;
    },
    getApply(payload: any){
      return http.get('/checks/apply', payload);
    },
    postApply(payload: any){
      return http.post('/checks/apply', payload);
    },
    putApply(payload: any){
      return http.put('/checks/apply', payload);
    }
  }
})