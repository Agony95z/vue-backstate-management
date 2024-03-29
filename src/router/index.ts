import { createRouter, createWebHistory } from "vue-router";
import { useUsersStore } from "@/stores/users";
import { useSignsStore } from "@/stores/signs";
import { useChecksStore } from "@/stores/checks";
import * as _ from "lodash";
const Login = () => import("@/views/Login/Login.vue");
const Home = () => import("@/views/Home/Home.vue");
const Sign = () => import("@/views/Sign/Sign.vue");
const Exception = () => import("@/views/Exception/Exception.vue");
const Apply = () => import("@/views/Apply/Apply.vue");
const Check = () => import("@/views/Check/Check.vue");
const NotFound = () => import("@/views/403.vue");
let userStore: any = null;
let signStore: any = null;
let checkStore: any = null;
declare module "vue-router" {
  interface RouteMeta {
    menu?: boolean;
    title?: string;
    icon?: string;
    auth?: boolean;
  }
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
      meta: {
        menu: true,
        title: "考勤管理",
        icon: "document-copy",
        auth: true,
      },
    },
    {
      path: "/403",
      name: "403",
      meta: {
        menu: false,
        title: "403",
        icon: "document-copy",
        auth: false,
      },
      component: NotFound,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        menu: true,
        title: "考勤管理",
        icon: "document-copy",
        auth: true,
      },
      children: [
        {
          path: "sign",
          name: "sign",
          component: Sign,
          meta: {
            menu: true,
            title: "在线打卡签到",
            icon: "calendar",
            auth: true,
          },
          async beforeEnter(to, from, next) {
            if (userStore === null) {
              userStore = useUsersStore();
            }
            if (signStore === null) {
              signStore = useSignsStore();
            }
            const userInfos = userStore.infos;
            const signInfos = signStore.infos;
            if (_.isEmpty(signInfos)) {
              // 获取当前用户的考勤数据
              const res = await signStore.getTime({ userid: userInfos._id });
              if (res.data.errcode === 0) {
                signStore.updateInfos(res.data.infos);
                next();
              }
            } else {
              next();
            }
          },
        },
        {
          path: "exception",
          name: "exception",
          component: Exception,
          meta: {
            menu: true,
            title: "异常考勤查询",
            icon: "warning",
            auth: true,
          },
          async beforeEnter(to, from, next) {
            if (userStore === null) {
              userStore = useUsersStore();
            }
            if (signStore === null) {
              signStore = useSignsStore();
            }
            const userInfos = userStore.infos;
            const signInfos = signStore.infos;
            if (_.isEmpty(signInfos)) {
              // 获取当前用户的考勤数据
              const res = await signStore.getTime({ userid: userInfos._id });
              if (res.data.errcode === 0) {
                signStore.updateInfos(res.data.infos);
                next();
              }
            } else {
              next();
            }
          },
        },
        {
          path: "apply",
          name: "apply",
          component: Apply,
          meta: {
            menu: true,
            title: "添加考勤审批",
            icon: "document-add",
            auth: true,
          },
          async beforeEnter(to, from, next) {
            if (userStore === null) {
              userStore = useUsersStore();
            }
            if (checkStore === null) {
              checkStore = useChecksStore();
            }
            const userInfos = userStore.infos;
            const checksApplyList = checkStore.applyList;
            if (_.isEmpty(checksApplyList)) {
              // 获取当前用户的考勤数据
              const res = await checkStore.getApply({ applicantid: userInfos._id });
              if (res.data.errcode === 0) {
                checkStore.updateApplyList(res.data.rets);
                next();
              }
            } else {
              next();
            }
          },
        },
        {
          path: "check",
          name: "check",
          component: Check,
          meta: {
            menu: true,
            title: "我的考勤审批",
            icon: "finished",
            auth: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        menu: true,
        title: "考勤管理",
        icon: "document-copy",
        auth: false,
      },
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (userStore === null) {
    userStore = useUsersStore();
  }
  const token = userStore.token;
  if (to?.meta?.auth) {
    if (token) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
