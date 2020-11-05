<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索教材名称"
        @clear="queryClearfresh"
        @input="querySubmit"
        @keyup.enter.native="querySubmit"
      ></el-input>

      <el-select
        v-model.trim="searchClassId"
        class="mr10"
        placeholder="请选择班级"
        @change="classSwitch"
      >
        <el-option
          v-for="item in classOpt"
          :key="item.cid"
          :label="item.cname"
          :value="item.cid"
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
      <el-table-column label="编号ID" prop="bid" sortable></el-table-column>
      <el-table-column label="教材名称" prop="bname"></el-table-column>
      <el-table-column label="班级名称" prop="cname"></el-table-column>
      <el-table-column label="教材封面" prop="cover">
        <template slot-scope="scope">
          <img :src="obtainCover(scope.row.cover)" width="120px" />
        </template>
      </el-table-column>
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

    <book-dialog
      v-if="flag"
      ref="bookDialog"
      @submit-success="submitSuccess"
    ></book-dialog>
  </div>
</template>

<script>
import bookApi from "../api/bookApi";
import classApi from "../api/classApi";
import bookDialog from "../dialog/bookDialog";
import axios from "axios";

export default {
  components: {
    bookDialog,
  },
  data() {
    return {
      searchName: "",
      searchClassId: "",
      classOpt: [],
      tableData: [],
      pageNum: 1,
      pageSize: 3,
      count: 0,
      tableLoading: false,
      flag: false,
    };
  },
  computed: {
    delUrl() {
      // 获取设置的代理网址
      return this.Global.base_url + "/delfile";
    },
  },
  mounted() {
    this.getDataList();
    this.getClassList();
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        bname: this.searchName,
        classid: this.searchClassId,
      };
      bookApi
        .bookList(params)
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

    // 返回图片地址
    obtainCover(val) {
      return this.Global.base_url + val;
    },

    //获取mark类别做下拉菜单
    getClassList() {
      let params = {
        dropList: true,
      };
      classApi
        .classList(params)
        .then((res) => {
          //console.log(res);
          this.classOpt = res.data.list;
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

    classSwitch(val) {
      console.log(val);
      this.getDataList(true);
    },

    handleAdd() {
      this.$refs.bookDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.bookDialog.open(true, rowData);
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
            bid: rowData.bid,
          };
          bookApi
            .deletebook(params)
            .then((res) => {
              let coverArr = rowData.cover.split("/");
              let pic = coverArr[coverArr.length - 1];
              let delparams = {
                filename: pic,
              };
              console.log(delparams);
              axios({
                method: "delete",
                url: this.delUrl,
                data: delparams, // 请求参数放在请求体
              })
                .then((res) => {
                  if (res.data.code === 10000) {
                    this.$message.success("图片删除成功");
                  } else {
                    this.$message.warning("上传的图片未成功删除");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
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
