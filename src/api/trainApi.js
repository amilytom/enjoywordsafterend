import request from "@/utils/request";

const trainApi = {
  // 获取练习列表（分页）
  trainList(param = {}) {
    return request({
      url: "/train",
      method: "get",
      params: param,
    });
  },

  // 获取一条练习信息
  gettrainById(eid) {
    return request({
      url: "/train/" + eid,
      method: "get",
    });
  },

  // 添加一条练习信息
  inserttrain(param = {}) {
    return request({
      url: "/train",
      method: "post",
      data: param,
    });
  },

  // 更改一条练习信息
  edittrain(param = {}) {
    return request({
      url: "/train",
      method: "put",
      data: param,
    });
  },

  // 删除一条练习信息
  deletetrain(param = {}) {
    return request({
      url: "/train",
      method: "delete",
      data: param,
    });
  },
};

export default trainApi;
