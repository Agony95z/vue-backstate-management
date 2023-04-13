import { useGlobalStore } from '@/stores';
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router';

function getModules() {
  const m = <any>{};
  const originModules = import.meta.glob('./**/*.ts', { eager: true });
  console.log(originModules, 'originModules');
  for (const [key, mvalue] of Object.entries(originModules)) {
    //名称  因为这里拿到的是  ./modules/app.js ，所以需要两层处理
    const moduleName = key.replace(/^\.\/(.*)\.\w+$/, '$1');
    const name = moduleName.split('/')[1];
    //具体的内容，都是每个js中返回值  value.default
    m[name] = (mvalue as any).default;
  }
  return m;
}
const dmodules = getModules();

// @ts-ignore
const routes = [...Object.values(dmodules)];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
});
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  const globalStore = useGlobalStore();
  const isNeedSensorTrack = (to, from) => {
    const arr = ['/jkyylxb/0328v1', '/jkyylxb/clause'];
    if (arr.indexOf(to.path) > -1) {
      globalStore.init_sensorTrack(to.path);
    }
  };
  // /* 判断是否需要初始化神策埋点 */
  isNeedSensorTrack(to, from);

  const nowTime = new Date().getTime();
  // 截止时间
  const endTime = new Date('2023/04/08 23:59:59').getTime();
  // 养老社区升级活动页关闭
  if (nowTime > endTime && to.fullPath.includes('communityUpgrade')) {
    if (to.path === '/communityUpgrade/endPage') {
      next();
    } else {
      next({
        path: '/communityUpgrade/endPage',
      });
    }
  } else {
    next();
  }
});

export default router;