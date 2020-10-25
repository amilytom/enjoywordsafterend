import request from "@/utils/request";

const meanApi = {
  // 获取释义列表（分页）
  meanList(param = {}) {
    return request({
      url: "/mean",
      method: "get",
      params: param,
    });
  },

  // 获取一条释义信息
  getmeanById(mid) {
    return request({
      url: "/mean/" + mid,
      method: "get",
    });
  },

  // 添加一条释义信息
  insertmean(param = {}) {
    return request({
      url: "/mean",
      method: "post",
      data: param,
    });
  },

  // 更改一条释义信息
  editmean(param = {}) {
    return request({
      url: "/mean",
      method: "put",
      data: param,
    });
  },

  // 删除一条释义信息
  deletemean(param = {}) {
    return request({
      url: "/mean",
      method: "delete",
      data: param,
    });
  },
};

export default meanApi;
