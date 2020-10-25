<template>
  <div class="container">
    <div class="handle-box">
      <el-select
        v-model.trim="searchStage"
        class="mr10"
        placeholder="请选择学段"
        @change="stageSwitch"
      >
        <el-option
          v-for="item in stageOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model.trim="searchGrade"
        class="mr10"
        placeholder="请选择年级"
        @change="gradeSwitch"
      >
        <el-option
          v-for="item in gradeOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model.trim="searchTerm"
        class="mr10"
        placeholder="请选择学期"
        @change="termSwitch"
      >
        <el-option
          v-for="item in termOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="tableData"
      border
      class="table"
    >
      <el-table-column label="班级ID" prop="cid" sortable></el-table-column>
      <el-table-column label="学段" prop="stage"></el-table-column>
      <el-table-column label="年级" prop="grade"></el-table-column>
      <el-table-column label="学段" prop="term"></el-table-column>
      <el-table-column label="班级名称" prop="cname"></el-table-column>
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
import classApi from "../api/classApi";
import dictApi from "../api/dictApi";

export default {
  data() {
    return {
      searchStage: "",
      stageOpt: [],
      searchGrade: "",
      gradeOpt: [],
      searchTerm: "",
      termOpt: [],
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
    this.getMarkList();
  },
  methods: {
    // 获取列表数据
    getDataList(search) {
      this.tableLoading = true;
      let params = {
        page: search ? 1 : this.pageNum,
        rows: this.pageSize,
        stage: this.searchStage,
        grade: this.searchGrade,
        term: this.searchTerm,
      };
      classApi
        .classList(params)
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

    //获取mark类别做下拉菜单
    getMarkList() {
      let params = {
        dropList: true,
      };
      dictApi
        .dictList(params)
        .then((res) => {
          this.stageOpt = [];
          this.gradeOpt = [];
          this.termOpt = [];
          let obj = {};
          res.data.list.forEach((item) => {
            if (item.mark === "stage") {
              this.stageOpt.push({
                label: item.dname,
                value: item.did,
              });
            }
            if (item.mark === "grade") {
              this.gradeArr.push({
                label: item.dname,
                value: item.did,
              });
            }
            if (item.mark === "term") {
              this.termOpt.push({
                label: item.dname,
                value: item.did,
              });
            }
          });
          this.gradeOpt = this.gradeArr;
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

    stageSwitch(val) {
      //console.log(val);
      if (val === 1) {
        this.gradeOpt = this.gradeArr;
      } else {
        this.gradeOpt = this.gradeArr.slice(3, 6);
      }
      this.getDataList(true);
    },

    gradeSwitch(val) {
      //console.log(val);
      this.getDataList(true);
    },

    termSwitch(val) {
      //console.log(val);
      this.getDataList(true);
    },
  },
};
</script>
