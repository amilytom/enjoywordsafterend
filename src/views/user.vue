<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        class="handle-input mr10"
        clearable
        placeholder="搜索用户名"
        @clear="queryClearfresh"
        @input="querySubmit"
        @keyup.enter.native="querySubmit"
      ></el-input>

      <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
      >添加
      </el-button
      >
    </div>

    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="userData"
      border
      class="table"
    >
      <el-table-column label="编号ID" prop="uid" sortable></el-table-column>
      <el-table-column label="用户名" prop="username" sortable>
      </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="学段" prop="stagename"></el-table-column>
      <el-table-column label="年级" prop="gradename"></el-table-column>
      <el-table-column label="学期" prop="termname"></el-table-column>
      <el-table-column label="创建时间" prop="createdAt"></el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="text"
            @click="handleEdit(scope.row)"
          >修改
          </el-button
          >
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

    <user-dialog
      v-if="flag"
      ref="userDialog"
      @submit-success="submitSuccess"
    ></user-dialog>
  </div>
</template>

<script>
import userApi from '../api/userApi';
import dictApi from '../api/dictApi';
import userDialog from '../dialog/userDialog';

export default {
  components: {
    userDialog
  },
  data() {
    return {
      userData: [],
      searchName: '',
      pageNum: 1,
      pageSize: 8,
      count: 0,
      tableLoading: false,
      flag: false
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    // 获取列表数据
    getUserData(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        username: this.searchName
      };
      userApi
        .getUserList(params)
        .then((res) => {
          this.userData = res.data.list;
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
      this.getUserData();
    },

    querySubmit() {
      this.pageNum = 1;
      this.getUserData(true);
    },

    // 删除搜索的内容刷新用户列表
    queryClearfresh() {
      this.pageNum = 1;
      this.getUserData();
    },

    handleAdd() {
      this.$refs.userDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.userDialog.open(true, rowData);
    },

    submitSuccess() {
      this.getUserData();
    },

    // 删除
    handleDelete(rowData) {
      this.$confirm('此操作将删除该用户, 是否继续?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            uid: rowData.uid
          };
          userApi
            .deleteUser(params)
            .then((res) => {
              console.log(res);
              this.$message.success('删除成功');
              this.getUserData();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    }
  }
};
</script>
