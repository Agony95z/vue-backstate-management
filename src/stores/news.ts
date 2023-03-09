import { ref, computed } from 'vue'
import { defineStore } from 'pinia';
import http from "@/utils/http";

export const useNewsStore = defineStore('news', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    getRemind(params: any) {
      return http.get('/news/remind', params)
    },
    putRemind(params: any) {
      return http.put('/news/remind', params)
    }
  },
})
