import request from "@/utils/request";

const wordApi = {
  // 获取单词列表（分页）
  wordList(param = {}) {
    return request({
      url: "/word",
      method: "get",
      params: param,
    });
  },

  // 获取一条单词信息
  getwordById(wid) {
    return request({
      url: "/word/" + wid,
      method: "get",
    });
  },

  // 添加一条单词信息
  insertword(param = {}) {
    return request({
      url: "/word",
      method: "post",
      data: param,
    });
  },

  // 更改一条单词信息
  editword(param = {}) {
    return request({
      url: "/word",
      method: "put",
      data: param,
    });
  },

  // 删除一条单词信息
  deleteword(param = {}) {
    return request({
      url: "/word",
      method: "delete",
      data: param,
    });
  },
};

export default wordApi;
