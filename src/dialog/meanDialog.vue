<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑释义' : '新增释义'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="英文单词：" prop="wordid">
        <el-select
          v-model="addForm.wordid"
          :loading="loading"
          :remote-method="remoteMethod"
          filterable
          placeholder="请输入英文单词"
          remote
          reserve-keyword
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.word"
            :value="item.wid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单词词性：" prop="posid">
        <el-select
          v-model.trim="addForm.posid"
          class="mr10"
          placeholder="请选择词性"
        >
          <el-option
            v-for="item in speechOpt"
            :key="item.cid"
            :label="item.posname"
            :value="item.pid"
          >
            <span style="float: left">{{ item.pos }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.posname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单词释义：" prop="mean">
        <el-input
          v-model.trim="addForm.mean"
          placeholder="请输入单词释义"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="addSubmit"
        >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import wordApi from "../api/wordApi";
import meanApi from "../api/meanApi";
import speechApi from "../api/speechApi";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        wordid: "",
        posid: "",
        mean: "",
      },
      addFormRules: {
        wordid: [
          {
            required: true,
            message: "单词ID不能为空",
            trigger: "blur",
          },
        ],
        posid: [
          {
            required: true,
            message: "词性ID不能为空",
            trigger: "blur",
          },
        ],
        mean: [
          {
            required: true,
            message: "释义不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      editUserval: [],
      speechOpt: [],
      mid: 0,
      loading: false,
      options: [],
    };
  },
  computed: {},
  mounted() {
    this.getSpeechList();
  },
  methods: {
    // 打开弹窗，第一个参数是否为编辑，第二参数传入的表单参数
    open(isEdit, rowData = {}) {
      this.isEdit = isEdit;
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 每次打开弹窗执行重置表单方法，为避免首次报错，在弹窗dom加载后才执行
        // resetFields()方法需要每个el-form-item带prop才可以重置。
        this.$refs.addForm.resetFields();
        // 如果市编辑状态需要在重置表单后，将传入的数据进行表单赋值
        if (isEdit) {
          this.assignmentAddForm(rowData);
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      //console.log(rowData);
      this.addForm = {
        wordid: rowData.wordid,
        posid: rowData.posid,
        mean: rowData.mean,
      };
      this.mid = rowData.mid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    //获取class类别做下拉菜单
    getSpeechList() {
      let params = {
        dropList: true,
      };
      speechApi
        .speechList(params)
        .then((res) => {
          //console.log(res);
          this.speechOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let params = {
          page: 1,
          rows: 20,
          word: query,
        };
        wordApi
          .wordList(params)
          .then((res) => {
            //console.log(res);
            this.loading = false;
            if (res.data.count > 0) {
              this.options = res.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.options = [];
      }
    },

    // 提交新增或修改
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.addProject();
          } else {
            this.editProject();
          }
        } else {
          this.$message.warning("请正确填写表单内容");
          return false;
        }
      });
    },

    // 新增
    addProject() {
      this.btnLoading = true;
      let params = this.addForm;
      console.log(this.addForm);
      meanApi
        .insertmean(params)
        .then((res) => {
          this.$message.success("创建成功");
          this.dialogVisible = false;
          this.$emit("submit-success");
          this.btnLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },

    // 编辑
    editProject() {
      this.btnLoading = true;
      this.addForm.mid = this.mid;
      let params = this.addForm;
      meanApi
        .editmean(params)
        .then((res) => {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.$emit("submit-success");
          this.btnLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },
  },
};
</script>
