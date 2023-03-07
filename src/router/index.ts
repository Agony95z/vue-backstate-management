import { createRouter, createWebHistory } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import http from '@/utils/http';
const Login = () => import('@/views/Login/Login.vue');
const Home = () => import('@/views/Home/Home.vue');
const Sign = () => import('@/views/Sign/Sign.vue');
const Exception = () => import('@/views/Exception/Exception.vue');
const Apply = () => import('@/views/Apply/Apply.vue');
const Check = () => import('@/views/Check/Check.vue');
const NotFound = () => import('@/views/403.vue');
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
      redirect: '/home',
      meta: {
        menu: true,
        title: '考勤管理',
        icon: 'document-copy',
        auth: true
      },
    },
    {
      path: '/403',
      name: '403',
      meta: {
        menu: false,
        title: '403',
        icon: 'document-copy',
        auth: false 
      },
      component: NotFound,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        menu: true,
        title: '考勤管理',
        icon: 'document-copy',
        auth: true
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
      component: Login,
      meta: {
        menu: true,
        title: '考勤管理',
        icon: 'document-copy',
        auth: false
      },
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (userStore === null) {
    userStore = useUsersStore();
  }
  const token = userStore.token;
  if (to?.meta?.auth) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router
