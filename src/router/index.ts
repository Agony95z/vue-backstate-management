import { createRouter, createWebHistory } from 'vue-router';
import { useUsersStore } from '@/stores/users';
// import Home from '@/views/Home/Home.vue';
import http from '@/utils/http';
const Login = () => import('@/views/Login/Login.vue');
const Home = () => import('@/views/Home/Home.vue');
const Sign = () => import('@/views/Sign/Sign.vue');
const Exception = () => import('@/views/Exception/Exception.vue');
const Apply = () => import('@/views/Apply/Apply.vue');
const Check = () => import('@/views/Check/Check.vue');
let userStore: any = null;
declare module 'vue-router' {
  interface RouteMeta {
    menu?: boolean
    title?: string
    icon?: string 
    auth?: boolean
  }
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/sign',
      meta: {
        menu: true,
        title: '考勤管理',
        icon: 'document-copy',
        auth: true // 访问是否需要权限
      },
      children: [
        {
          path: 'sign',
          name: 'sign',
          component: Sign,
          meta: {
            menu: true,
            title: '在线打卡签到',
            icon: 'calendar',
            auth: true
          },
        },
        {
          path: 'exception',
          name: 'exception',
          component: Exception,
          meta: {
            menu: true,
            title: '异常考勤查询',
            icon: 'warning',
            auth: true,
          }
        },
        {
          path: 'apply',
          name: 'apply',
          component: Apply,
          meta: {
            menu: true,
            title: '添加考勤审批',
            icon: 'document-add',
            auth: true,
          }
        },
        {
          path: 'check',
          name: 'check',
          component: Check,
          meta: {
            menu: true,
            title: '我的考勤审批',
            icon: 'finished',
            auth: true,
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (userStore === null) {
    userStore = useUsersStore();
  }
  const token = userStore.token;
  const infos = userStore.infos; // 判断用户信息
  // 需要登录权限
  // 有token 获取infos
  if (to.meta.auth && Object.keys(infos).length === 0) {
    // 有token 获取infos
    if (token) {
      http.get("/users/infos").then(res => {
        if (res.data.errorcode === 0) { // 成功
          userStore.updateInfos(res.data.infos);
          next();
        }
      }) // 如果返回失败 去响应拦截器做统一拦截处理
    } else {
      next('/login');
    }
  } else {
    // 有token且数据正确
    if (token && to.path === '/login') {
      // 重定向到首页
      next('/');
    } else {
      next()
    }
  }
})
export default router
