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
      <el-table-column label="ID" prop="id" sortable></el-table-column>
      <el-table-column label="单词" prop="word"></el-table-column>
      <el-table-column label="词性" prop="posname"></el-table-column>
      <el-table-column label="例子" prop="example"></el-table-column>
      <el-table-column label="拼音" prop="voice">
        <template slot-scope="scope">
          <img
            :src="playpic"
            width="20px"
            @mouseout="pauseVoice($event, scope.row.word)"
            @mouseover="playVoice($event, scope.row.word)"
          />
          <audio
            :ref="scope.row.word"
            :src="obtainVoice(scope.row.voice)"
          ></audio>
        </template>
      </el-table-column>
      <el-table-column label="翻译" prop="translation"></el-table-column>
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

    <case-dialog
      v-if="flag"
      ref="caseDialog"
      @submit-success="submitSuccess"
    ></case-dialog>
  </div>
</template>

<script>
import caseApi from "../api/caseApi";
import caseDialog from "../dialog/caseDialog";
import axios from "axios";

export default {
  components: {
    caseDialog,
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
      voicePic: require("../assets/img/voice.gif"),
      voiceplay: require("../assets/img/voiceplay.gif"),
      playpic: require("../assets/img/voice.gif"),
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
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        translation: this.searchName,
        word: this.searchWord,
      };
      caseApi
        .caseList(params)
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

    obtainVoice(val) {
      return this.Global.base_url + val;
    },
    playVoice(event, val) {
      event.target.src = this.voiceplay;
      this.$refs[val].play();
    },

    pauseVoice(event, val) {
      event.target.src = this.voicePic;
      this.$refs[val].pause();
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
      this.$refs.caseDialog.open(false);
    },

    handleEdit(rowData) {
      this.$refs.caseDialog.open(true, rowData);
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
            id: rowData.id,
          };
          caseApi
            .deletecase(params)
            .then((res) => {
              let voiceArr = rowData.voice.split("/");
              let voicename = voiceArr[voiceArr.length - 1];
              let delparams = {
                filename: voicename,
              };
              console.log(delparams);
              axios({
                method: "delete",
                url: this.delUrl,
                data: delparams, // 请求参数放在请求体
              })
                .then((res) => {
                  if (res.data.code === 10000) {
                    this.$message.success("文件删除成功");
                  } else {
                    this.$message.warning("上传的文件未成功删除");
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
