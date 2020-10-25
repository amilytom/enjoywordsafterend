import axios from "axios";
import { Message } from "element-ui";
import store from "@/store/index";
import { getToken } from "@/utils/auth";
import Cookies from "js-cookie";

// 获取设置的代理网址
const base_url =
  process.env.NODE_ENV === "development"
    ? process.env.BASE_API
    : process.env.API_ROOT;

// 创建axios实例
const service = axios.create({
  baseURL: base_url, // api的base_url
  timeout: 8 * 1000, // 请求超时时间
  withCredentials: true, // 允许携带cookie
});

// 配置公共的请求头
//service.defaults.headers.common["Authorization"] = Cookies.get("token");

//配置公共的 post 的 Content-Type
service.defaults.headers.post["Content-Type"] = "application/json";

//跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
const toLogin = () => {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
};

//请求失败后的错误统一处理
//@param {Number} status 请求失败的状态码
const errorHandle = (status, msg) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      Message({
        showClose: true,
        message: "尚未登录，请登录",
        type: "warning",
        duration: 1500,
      });
      toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      Message({
        showClose: true,
        message: "登录过期，请重新登录",
        type: "warning",
        duration: 1500,
      });
      //localStorage.removeItem('token');
      //store.commit('loginSuccess', null);
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    // 404请求不存在
    case 404:
      Message({
        showClose: true,
        message: "网络请求不存在",
        type: "error",
        duration: 1500,
      });
      break;
    default:
      Message({
        showClose: true,
        message: msg,
        type: "error",
        duration: 1500,
      });
  }
};

//request 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = Cookies.get("access-token");
    token && (config.headers.token = token);
    //console.log(config);
    return config;
  },
  (error) => {
    //console.log(error);
    return Promise.error(error);
  }
);

//respone 响应拦截器
service.interceptors.response.use(
  //请求成功,返回状态码为200
  (response) => {
    //后台返回的json字符串需转换
    const res = JSON.parse(JSON.stringify(response.data));
    //console.log(res);
    //通过res.code判断是否获得到数据
    //如果code等于10000，返回一个带着给定值解析过的Promise对象
    if (res.code === 10000) {
      return Promise.resolve(res);
    } else {
      //如果code不等于0000，则弹窗提示返回的错误信息
      Message({
        showClose: true,
        message: res.msg,
        type: "error",
        duration: 1500,
      });
      //返回一个带有拒绝原因的Promise对象
      return Promise.reject(res);
    }
  },
  //请求失败，需根据状态码提示进行不同的操作
  (error) => {
    if (error.response.status) {
      //获取状态码
      let status = error.response.status; // 状态码
      let msg = response.data.message; // 错误提示
      errorHandle(status, msg);
      //返回一个带有拒绝原因的Promise对象
      return Promise.reject(error.response);
    } else {
      //处理无法访问或断网的情况
      //弹窗提示请求超时
      Message({
        showClose: true,
        message: `服务器错误！错误代码：${error.response.status}`,
        type: "error",
        duration: 1500,
      });
      //需要在vuex中提供请求超时处理的方法
      //定时刷新重新获取数据
      //store.commit('changeNetwork', false);
    }
  }
);

export default service;
