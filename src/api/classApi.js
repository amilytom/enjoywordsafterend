import request from "@/utils/request";

const classApi = {
  // 获取班级列表（分页）
  classList(param = {}) {
    return request({
      url: "/class",
      method: "get",
      params: param,
    });
  },

  // 获取一条班级信息
  getclassById(cid) {
    return request({
      url: "/class/" + cid,
      method: "get",
    });
  },

  // 添加一条信息
  insertclass(param = {}) {
    return request({
      url: "/class",
      method: "post",
      data: param,
    });
  },

  // 更改一条班级信息
  editclass(param = {}) {
    return request({
      url: "/class",
      method: "put",
      data: param,
    });
  },

  // 删除一条班级信息
  deleteclass(param = {}) {
    return request({
      url: "/class",
      method: "delete",
      data: param,
    });
  },
};

export default classApi;
