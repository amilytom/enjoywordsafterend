import request from "@/utils/request";

const speechApi = {
  // 获取词性列表（分页）
  speechList(param = {}) {
    return request({
      url: "/speech",
      method: "get",
      params: param,
    });
  },

  // 获取一条词性信息
  getspeechById(pid) {
    return request({
      url: "/speech/" + pid,
      method: "get",
    });
  },

  // 添加一条词性信息
  insertspeech(param = {}) {
    return request({
      url: "/speech",
      method: "post",
      data: param,
    });
  },

  // 更改一条词性信息
  editspeech(param = {}) {
    return request({
      url: "/speech",
      method: "put",
      data: param,
    });
  },

  // 删除一条词性信息
  deletespeech(param = {}) {
    return request({
      url: "/speech",
      method: "delete",
      data: param,
    });
  },
};

export default speechApi;
