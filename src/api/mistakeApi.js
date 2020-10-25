import request from "@/utils/request";

const mistakeApi = {
  // 获取错题列表（分页）
  mistakeList(param = {}) {
    return request({
      url: "/mistake",
      method: "get",
      params: param,
    });
  },

  // 获取一条错题信息
  getmistakeById(mid) {
    return request({
      url: "/mistake/" + mid,
      method: "get",
    });
  },

  // 添加一条错题信息
  insertmistake(param = {}) {
    return request({
      url: "/mistake",
      method: "post",
      data: param,
    });
  },

  // 更改一条错题信息
  editmistake(param = {}) {
    return request({
      url: "/mistake",
      method: "put",
      data: param,
    });
  },

  // 删除一条错题信息
  deletemistake(param = {}) {
    return request({
      url: "/mistake",
      method: "delete",
      data: param,
    });
  },
};

export default mistakeApi;
