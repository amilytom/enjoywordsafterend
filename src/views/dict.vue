<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索字典名称"
        @clear="queryClearfresh"
        @input="querySubmit"
        @keyup.enter.native="querySubmit"
      ></el-input>

      <el-select
        v-model.trim="searchMark"
        class="mr10"
        placeholder="请选择"
        @change="markSwitch"
      >
        <el-option
          v-for="item in markOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
        >添加
      </el-button>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="dictData"
      border
      class="table"
    >
      <el-table-column label="字典编号" prop="did" sortable></el-table-column>
      <el-table-column label="字典标识" prop="mark"></el-table-column>
      <el-table-column label="字典名称" prop="dname"></el-table-column>
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

    <dict-dialog
      v-if="flag"
      ref="dictDialog"
      @submit-success="submitSuccess"
    ></dict-dialog>
  </div>
</template>

<script>
import dictApi from "../api/dictApi";
import dictDialog from "../dialog/dictDialog";

export default {
  components: {
    dictDialog,
  },
  data() {
    return {
      searchName: "",
      dictData: [],
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableLoading: false,
      flag: false,
      markOpt: [],
      searchMark: "",
    };
  },
  mounted() {
    this.getDataList();
    this.getMarkList();
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        dname: this.searchName,
        mark: this.searchMark,
      };
      dictApi
        .dictList(params)
        .then((res) => {
          //console.log(res);
          this.dictData = res.data.list;
          this.flag = true;
          this.count = parseInt(res.data.count);
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
        });
    },

    //获取mark类别做下拉菜单
    getMarkList() {
      let params = {
        dropList: true,
      };
      dictApi
        .dictList(params)
        .then((res) => {
          this.markOpt = [];
          let obj = {};
          res.data.list.forEach((item) => {
            if (!obj[item.mark]) {
              this.markOpt.push({
                label: item.mark,
                value: item.mark,
              });
              obj[item.mark] = true;
            }
          });
          console.log(this.markOpt);
        })
        .catch((err) => {
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

    markSwitch(val) {
      console.log(val);
      this.getDataList(true);
    },

    handleAdd() {
      this.$refs.dictDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.dictDialog.open(true, rowData);
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
            did: rowData.did,
          };
          dictApi
            .deletedict(params)
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
