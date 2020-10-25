import request from "@/utils/request";

const dictApi = {
  // 获取字典列表（分页）
  dictList(param = {}) {
    return request({
      url: "/dict",
      method: "get",
      params: param,
    });
  },

  // 获取一条字典信息
  getdictById(did) {
    return request({
      url: "/dict/" + did,
      method: "get",
    });
  },

  // 添加一条字典信息
  insertdict(param = {}) {
    return request({
      url: "/dict",
      method: "post",
      data: param,
    });
  },

  // 更改一条字典信息
  editdict(param = {}) {
    return request({
      url: "/dict",
      method: "put",
      data: param,
    });
  },

  // 删除一条字典信息
  deletedict(param = {}) {
    return request({
      url: "/dict",
      method: "delete",
      data: param,
    });
  },
};

export default dictApi;
