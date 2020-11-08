<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索记录"
        @clear="queryClearfresh"
        @input="querySubmit"
      ></el-input>

      <el-input
        v-model.trim="searchQuestion"
        class="handle-input mr10"
        clearable
        placeholder="搜索题目"
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
      <el-table-column label="ID" prop="tid" sortable></el-table-column>
      <el-table-column label="标签" prop="label"></el-table-column>
      <el-table-column label="题目" prop="question"></el-table-column>
      <el-table-column label="正确答案" prop="answer"></el-table-column>
      <el-table-column label="用户解答" prop="respon"></el-table-column>
      <el-table-column label="是否正确" prop="isright">
        <template slot-scope="scope">
          {{ obtain(scope.row.isright) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt"></el-table-column>
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

    <test-dialog
      v-if="flag"
      ref="testDialog"
      @submit-success="submitSuccess"
    ></test-dialog>
  </div>
</template>

<script>
import testApi from "../api/testApi";
import testDialog from "../dialog/testDialog";

export default {
  components: {
    testDialog,
  },
  data() {
    return {
      searchName: "",
      searchQuestion: "",
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
        label: this.searchName,
        question: this.searchQuestion,
      };
      testApi
        .testList(params)
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

    obtain(val) {
      switch (val) {
        case "":
          return "";
          break;
        case 0:
          return "错误";
          break;
        case 1:
          return "正确";
          break;
        default:
          return "";
      }
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
      this.$refs.testDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.testDialog.open(true, rowData);
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
            tid: rowData.tid,
          };
          testApi
            .deletetest(params)
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
