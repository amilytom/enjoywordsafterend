import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Global from "./utils/global";

// 引入全局变量
Vue.prototype.Global = Global;

// 引入element-ui及默认主题
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 引入babel-polyfill让不支持es6的浏览器能够正常运行
import "babel-polyfill";

// 引入公共样式
import "./assets/css/global.css";

// vue使用element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
});
