import request from "@/utils/request";

const testApi = {
  // 获取试卷列表（分页）
  testList(param = {}) {
    return request({
      url: "/test",
      method: "get",
      params: param,
    });
  },

  // 获取一条试卷信息
  gettestById(tid) {
    return request({
      url: "/test/" + tid,
      method: "get",
    });
  },

  // 添加一条试卷信息
  inserttest(param = {}) {
    return request({
      url: "/test",
      method: "post",
      data: param,
    });
  },

  // 更改一条试卷信息
  edittest(param = {}) {
    return request({
      url: "/test",
      method: "put",
      data: param,
    });
  },

  // 删除一条试卷信息
  deletetest(param = {}) {
    return request({
      url: "/test",
      method: "delete",
      data: param,
    });
  },
};

export default testApi;
