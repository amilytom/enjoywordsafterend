import loginApi from "@/api/loginApi";
import { getToken, setToken, removeToken } from "@/utils/auth";
import Cookies from "js-cookie";
import timeFormat from "@/utils/timeFormat";

const user = {
  state: {
    token: getToken(),
    uid: "",
    username: "",
    name: "",
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
  },

  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi
          .login(userInfo)
          .then((response) => {
            if (response.data.token) {
              console.log(response.data);
              const data = response.data;
              //console.log("登录信息", data);
              commit("SET_TOKEN", data.token); // 登录时保存token到vuex
              setToken(data.token); // 同时也保存到cookie
              Cookies.set("username", data.username); // 保存用户名
              commit("SET_USERNAME", data.username);
              Cookies.set("name", data.name); // 保存姓名
              commit("SET_NAME", data.name);
              Cookies.set("uid", data.uid); // 保存uid
              commit("SET_UID", data.uid);
              let nowTime = new Date();
              let lastLoginTime = timeFormat.dateToTimestamp(nowTime);
              Cookies.set("lastLoginAt", lastLoginTime); // 保存最后登录时间戳
              resolve(response);
            } else {
              resolve(response);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        removeToken();
        Cookies.remove("username");
        Cookies.remove("name");
        Cookies.remove("lastLoginAt");
        resolve();
      }).catch((error) => {
        reject(error);
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        removeToken();
        Cookies.remove("username");
        Cookies.remove("name");
        Cookies.remove("role");
        Cookies.remove("lastLoginAt");
        resolve();
      });
    },
  },
};

export default user;
