<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑试题' : '新增试题'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="标签记录：" prop="labelid">
        <el-select
          v-model="addForm.labelid"
          :loading="loading"
          :remote-method="remoteMethod"
          filterable
          placeholder="请查询标签记录"
          remote
          reserve-keyword
          style="width: 100%"
        >
          <el-option
            v-for="item in LabelOpt"
            :key="item.eid"
            :label="item.label"
            :value="item.eid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题目：" prop="question">
        <el-input
          v-model.trim="addForm.question"
          :rows="2"
          placeholder="请输入题目"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="正确答案：" prop="answer">
        <el-input
          v-model.trim="addForm.answer"
          :rows="2"
          placeholder="请输入正确答案"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述：" prop="description">
        <el-input
          v-model.trim="addForm.description"
          :rows="2"
          placeholder="请输入题目描述"
          type="textarea"
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
import trainApi from "../api/trainApi";
import testApi from "../api/testApi";
import Cookies from "js-cookie";

export default {
  name: "bookDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        labelid: "",
        question: "",
        answer: "",
        isright: "",
        description: "",
      },
      addFormRules: {
        labelid: [
          {
            required: true,
            message: "标签不能为空",
            trigger: "blur",
          },
        ],
        question: [
          {
            required: true,
            message: "题目不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      editUserval: [],
      tid: 0,
      loading: false,
      LabelOpt: [],
    };
  },
  computed: {},
  mounted() {},
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
          this.LabelOpt = [];
          let params = rowData.labelid;
          trainApi
            .gettrainById(params)
            .then((res) => {
              //console.log(res);
              this.LabelOpt.push(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      //console.log(rowData);
      this.addForm = {
        labelid: rowData.labelid,
        question: rowData.question,
        answer: rowData.answer,
        isright: rowData.isright,
        description: rowData.description,
      };
      this.tid = rowData.tid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let params = {
          page: 1,
          rows: 20,
          username: query,
        };
        trainApi
          .trainList(params)
          .then((res) => {
            //console.log(res);
            this.loading = false;
            if (res.data.count > 0) {
              this.LabelOpt = res.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.userOptions = [];
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
      testApi
        .inserttest(params)
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
      this.addForm.tid = this.tid;
      this.addForm.isover = 0;
      let params = this.addForm;
      testApi
        .edittest(params)
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
