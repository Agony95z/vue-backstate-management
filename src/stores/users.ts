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
import type { User } from "@/stores/typeCheck";
export const useUsersStore = defineStore("users", {
  // 必须是箭头函数 更好的ts类型推导
  state: () => {
    return {
      token: ''
      // count: 100,
      // foo: "bar",
      // arr: [1, 2, 3] as any,
    };
  },
  // 模块部分数据持久化
  persist: {
    key: 'token', // 修改key名称
    storage: localStorage, //修改为 sessionStorage，默认为 localStorage
    paths: ['token'],
  },
  getters: {
    // 函数接受一个可选参数 state 状态对象
    // count10(state) {
    //   return state.count + 10
    // }

    // 在getters中使用this 则需要手动指定返回值类型 否则推导不出来
    // count10(): number {
    //   // return this.count + 10;
    // },
  },
  actions: {
    // 不能箭头函数
    changeState() {
      // this.count++;
      // this.foo = "hello";
      // this.arr.push(5);
      // console.log(this.arr, "mmmmm");
      // this.$patch({})
      // this.$patch(state => ())
    },
    updateToken(token: string) {
      this.token = token;
    },
    login(payload: User) {
      // const ret = await login()
      const ret = http.post("/users/login", payload);
      return ret;
    },
  },
});
// 2.使用容器中的state
// 3.修改state
// 4.容器中action的使用
