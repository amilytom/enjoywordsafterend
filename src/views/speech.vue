<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索词性"
        @clear="queryClearfresh"
        @input="querySubmit"
      ></el-input>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="tableData"
      border
      class="table"
    >
      <el-table-column label="ID" prop="pid" sortable></el-table-column>
      <el-table-column label="名称" prop="posname"></el-table-column>
      <el-table-column label="词性" prop="speech"></el-table-column>
      <el-table-column label="缩写" prop="pos"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="count"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import speechApi from "../api/speechApi";

export default {
  data() {
    return {
      searchName: "",
      tableData: [],
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableLoading: false,
      flag: false,
      gradeArr: [],
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        posname: this.searchName,
      };
      speechApi
        .speechList(params)
        .then((res) => {
          //console.log(res);
          this.tableData = res.data.list;
          this.flag = true;
          this.count = parseInt(res.data.count);
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
        });
    },

    // 分页导航
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDataList();
    },

    querySubmit() {
      this.getDataList(true);
    },

    // 删除搜索的内容刷新用户列表
    queryClearfresh() {
      this.getDataList(true);
    },
  },
};
</script>
