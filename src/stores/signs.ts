
import { defineStore } from "pinia";
// 1.定义容器
/** crtl+win+t
 * @name: zhangweihai
 * @params: 参数1：容器的ID,必须唯一，将来pinia会把所有的容器挂载到根容器
 *          参数2：选项对象 
 * @return {*}
 */
export const useUsersStore = defineStore('signs', {
  // 必须是箭头函数 更好的ts类型推导
  state: () => {
    return {
      count: 100,
      foo: 'bar',
      arr: [1, 2, 3] as any
    }
  },
  getters: {
    // 函数接受一个可选参数 state 状态对象
    // count10(state) {
    //   return state.count + 10
    // }
    
    // 在getters中使用this 则需要手动指定返回值类型 否则推导不出来
    count10():number {
      return this.count + 10
    }
  },
  actions: {
    // 不能箭头函数
    changeState() {
      this.count++
      this.foo = 'hello'
      this.arr.push(5)
      // this.$patch({})
      // this.$patch(state => ())
    }
  }
})
// 2.使用容器中的state
// 3.修改state
// 4.容器中action的使用