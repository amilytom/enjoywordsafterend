import request from "@/utils/request";

const userApi = {
  // 获取用户列表（分页）
  getUserList(param = {}) {
    return request({
      url: "/user",
      method: "get",
      params: param,
    });
  },

  // 获取一条用户信息
  getUserById(uid) {
    return request({
      url: "/user/" + uid,
      method: "get",
    });
  },

  // 添加一条用户信息
  insertUser(param = {}) {
    return request({
      url: "/user",
      method: "post",
      data: param,
    });
  },

  // 更改一条用户信息
  editUser(param = {}) {
    return request({
      url: "/user",
      method: "put",
      data: param,
    });
  },

  // 更改一条管理员信息
  editUserPwd(param = {}) {
    return request({
      url: "/user/pwd",
      method: "put",
      data: param,
    });
  },

  // 删除一条用户信息
  deleteUser(param = {}) {
    return request({
      url: "/user",
      method: "delete",
      data: param,
    });
  },
};

export default userApi;
