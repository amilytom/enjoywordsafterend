import Vue from "vue";
import Router from "vue-router";
import Cookies from "js-cookie";

Vue.use(Router);

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/",
      redirect: "/intro",
    },
    {
      path: "/",
      name: "Home",
      component: () => import("../components/home.vue"),
      meta: { title: "自述文件" },
      children: [
        {
          path: "/intro",
          name: "Intro",
          component: () => import("../views/intro.vue"),
          meta: { title: "系统首页" },
        },
        {
          path: "/dict",
          mame: "Dict",
          component: () => import("../views/dict.vue"),
          meta: { title: "字典管理" },
        },
        {
          path: "/user",
          name: "User",
          component: () => import("../views/user.vue"),
          meta: { title: "用户管理" },
        },
        {
          path: "/class",
          mame: "Class",
          component: () => import("../views/class.vue"),
          meta: { title: "班级管理" },
        },
        {
          path: "/book",
          name: "Book",
          component: () => import("../views/book.vue"),
          meta: { title: "教材管理" },
        },
        {
          path: "/word",
          name: "Word",
          component: () => import("../views/word.vue"),
          meta: { title: "单词管理" },
        },
        {
          path: "/wbook",
          name: "WordBook",
          component: () => import("../views/wordbook.vue"),
          meta: { title: "教材单词" },
        },
        {
          path: "/speech",
          mame: "Speech",
          component: () => import("../views/speech.vue"),
          meta: { title: "词性管理" },
        },
        {
          path: "/mean",
          name: "Mean",
          component: () => import("../views/mean.vue"),
          meta: { title: "释义管理" },
        },
        {
          path: "/case",
          mame: "Case",
          component: () => import("../views/case.vue"),
          meta: { title: "例句管理" },
        },
        {
          path: "/train",
          name: "Train",
          component: () => import("../views/train.vue"),
          meta: { title: "练习管理" },
        },
        {
          path: "/test",
          mame: "Test",
          component: () => import("../views/test.vue"),
          meta: { title: "试卷管理" },
        },
        {
          path: "/mistake",
          name: "Mistake",
          component: () => import("../views/mistake.vue"),
          meta: { title: "错题管理" },
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/404",
      name: "NoFound",
      component: () => import("../views/404.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const token = Cookies.get("access-token");
  if (!token && to.path !== "/login") {
    next("/login");
  }
  next();
});
