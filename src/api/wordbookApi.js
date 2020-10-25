import request from "@/utils/request";

const wordbookbookApi = {
  // 获取单词教材列表（分页）
  wordbookList(param = {}) {
    return request({
      url: "/wbook",
      method: "get",
      params: param,
    });
  },

  // 获取一条单词教材信息
  getwordbookById(id) {
    return request({
      url: "/wbook/" + id,
      method: "get",
    });
  },

  // 添加一条单词教材信息
  insertwordbook(param = {}) {
    return request({
      url: "/wbook",
      method: "post",
      data: param,
    });
  },

  // 更改一条单词教材信息
  editwordbook(param = {}) {
    return request({
      url: "/wbook",
      method: "put",
      data: param,
    });
  },

  // 删除一条单词教材信息
  deletewordbook(param = {}) {
    return request({
      url: "/wbook",
      method: "delete",
      data: param,
    });
  },
};

export default wordbookbookApi;
