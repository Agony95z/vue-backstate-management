import { defineStore } from "pinia";
import http from "@/utils/http";
import { login } from "@/api/users";
// 1.定义容器
/** crtl+win+t
 * @name: zhangweihai
 * @params: 参数1：容器的ID,必须唯一，将来pinia会把所有的容器挂载到根容器
 *          参数2：选项对象
 * @return {*}
 */
import type { IUser, IUserState } from "@/stores/typeCheck";
export const useUsersStore = defineStore("users", {
  // 必须是箭头函数 更好的ts类型推导
  state: (): IUserState => {
    return {
      token: '',
      infos: {}
    };
  },
  // 模块部分数据持久化
  persist: {
    // key: 'token', // 修改key名称
    storage: localStorage, //修改为 sessionStorage，默认为 localStorage
    paths: ['token', 'infos'],
  },
  getters: {
  },
  actions: {
    // 不能箭头函数
    async updateToken(token: string) {
      this.token = token;
      const res = await this.getInfos();
      this.updateInfos(res.data.infos);
    },
    clearToken() {
      this.token = '';
    },
    clearInfos() {
      this.infos = {};
    },
    updateInfos(infos: any) {
      this.infos = infos;
    },
    getInfos() {
      return http.get("/users/infos");
    },
    login(payload: IUser) {
      // const ret = await login()
      const ret = http.post("/users/login", payload);
      return ret;
    },
  },
});
