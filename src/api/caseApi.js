import request from "@/utils/request";

const caseApi = {
  // 获取例句列表（分页）
  caseList(param = {}) {
    return request({
      url: "/case",
      method: "get",
      params: param,
    });
  },

  // 获取一条例句信息
  getcaseById(id) {
    return request({
      url: "/case/" + id,
      method: "get",
    });
  },

  // 添加一条信息
  insertcase(param = {}) {
    return request({
      url: "/case",
      method: "post",
      data: param,
    });
  },

  // 更改一条例句信息
  editcase(param = {}) {
    return request({
      url: "/case",
      method: "put",
      data: param,
    });
  },

  // 删除一条例句信息
  deletecase(param = {}) {
    return request({
      url: "/case",
      method: "delete",
      data: param,
    });
  },
};

export default caseApi;
