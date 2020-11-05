<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchWord"
        class="handle-input mr10"
        clearable
        placeholder="搜索单词"
        @clear="queryClearfresh"
        @input="querySubmit"
      ></el-input>

      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索释义"
        @clear="queryClearfresh"
        @input="querySubmit"
      ></el-input>

      <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
        >添加
      </el-button>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="tableData"
      border
      class="table"
    >
      <el-table-column label="ID" prop="mid" sortable></el-table-column>
      <el-table-column label="单词" prop="word"></el-table-column>
      <el-table-column label="词性" prop="posname"></el-table-column>
      <el-table-column label="缩写" prop="pos"></el-table-column>
      <el-table-column label="释义" prop="mean"></el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.row)"
            >修改
          </el-button>
          <el-button
            class="red"
            icon="el-icon-delete"
            type="text"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
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

    <mean-dialog
      v-if="flag"
      ref="meanDialog"
      @submit-success="submitSuccess"
    ></mean-dialog>
  </div>
</template>

<script>
import meanApi from "../api/meanApi";
import meanDialog from "../dialog/meanDialog";
import axios from "axios";

export default {
  components: {
    meanDialog,
  },
  data() {
    return {
      searchWord: "",
      searchName: "",
      tableData: [],
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableLoading: false,
      flag: false,
    };
  },
  computed: {},
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
        mean: this.searchName,
        word: this.searchWord,
      };
      meanApi
        .meanList(params)
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

    handleAdd() {
      this.$refs.meanDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.meanDialog.open(true, rowData);
    },

    submitSuccess() {
      this.getDataList();
    },

    // 删除
    handleDelete(rowData) {
      this.$confirm("此操作将删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            mid: rowData.mid,
          };
          meanApi
            .deletemean(params)
            .then((res) => {
              console.log(res);
              this.$message.success("删除成功");
              this.getDataList();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
};
</script>
