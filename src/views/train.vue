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

      <el-select
        v-model.trim="searchForum"
        class="mr10"
        placeholder="请选择类别"
        @change="forumSwitch"
      >
        <el-option
          v-for="item in forumOpt"
          :key="item.did"
          :label="item.dname"
          :value="item.did"
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
      :data="tableData"
      border
      class="table"
    >
      <el-table-column label="ID" prop="eid" sortable></el-table-column>
      <el-table-column label="标签" prop="label"></el-table-column>
      <el-table-column label="类别" prop="dname"></el-table-column>
      <el-table-column label="分数" prop="score"></el-table-column>
      <el-table-column label="正确" prop="right"></el-table-column>
      <el-table-column label="错误" prop="wrong"></el-table-column>
      <el-table-column label="状态" prop="isover">
        <template slot-scope="scope">
          {{ scope.row.isover === 1 ? "完成" : "未完" }}
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

    <train-dialog
      v-if="flag"
      ref="trainDialog"
      @submit-success="submitSuccess"
    ></train-dialog>
  </div>
</template>

<script>
import trainApi from "../api/trainApi";
import dictApi from "../api/dictApi";
import trainDialog from "../dialog/trainDialog";

export default {
  components: {
    trainDialog,
  },
  data() {
    return {
      searchName: "",
      searchForum: "",
      tableData: [],
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableLoading: false,
      flag: false,
      forumOpt: [],
    };
  },
  computed: {},
  mounted() {
    this.getDataList();
    this.getForumList();
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        label: this.searchName,
        mark: this.searchForum,
      };
      trainApi
        .trainList(params)
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

    getForumList() {
      let params = {
        mark: "forum",
        dropList: true,
      };
      dictApi
        .dictList(params)
        .then((res) => {
          //console.log(res);
          this.forumOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    forumSwitch(val) {
      //console.log(val);
      this.getDataList(true);
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
      this.$refs.trainDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.trainDialog.open(true, rowData);
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
            eid: rowData.eid,
          };
          trainApi
            .deletetrain(params)
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
