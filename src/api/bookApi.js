import request from "@/utils/request";

const bookApi = {
  // 获取教材列表（分页）
  bookList(param = {}) {
    return request({
      url: "/book",
      method: "get",
      params: param,
    });
  },

  // 获取一条教材信息
  getbookById(bid) {
    return request({
      url: "/book/" + bid,
      method: "get",
    });
  },

  // 添加一条教材信息
  insertbook(param = {}) {
    return request({
      url: "/book",
      method: "post",
      data: param,
    });
  },

  // 更改一条教材信息
  editbook(param = {}) {
    return request({
      url: "/book",
      method: "put",
      data: param,
    });
  },

  // 删除一条教材信息
  deletebook(param = {}) {
    return request({
      url: "/book",
      method: "delete",
      data: param,
    });
  },
};

export default bookApi;
