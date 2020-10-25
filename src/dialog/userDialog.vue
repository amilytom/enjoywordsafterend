<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑用户' : '新增用户'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="用户名称：" prop="username">
        <el-input
          v-model.trim="addForm.username"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="用户密码：" prop="password">
        <el-input
          v-model.trim="addForm.password"
          placeholder="请输入用户密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名：" prop="name">
        <el-input
          v-model.trim="addForm.name"
          placeholder="请输入用户姓名"
        ></el-input>
      </el-form-item>
      <el-form-item class="ban" label="用户班级：">
        <el-select
          v-model="addForm.stage"
          placeholder="学段"
          @change="stageLinkGrade"
        >
          <el-option
            v-for="(item, index) in stageOpt"
            :key="index"
            :label="item.dname"
            :value="item.did"
          >
          </el-option>
        </el-select>
        <el-select v-model="addForm.grade" placeholder="年级">
          <el-option
            v-for="(item, index) in gradeOpt"
            :key="index"
            :label="item.dname"
            :value="item.did"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户学期：" prop="term">
        <el-select v-model="addForm.term" placeholder="学期">
          <el-option
            v-for="(item, index) in termOpt"
            :key="index"
            :label="item.dname"
            :value="item.did"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="addUsersubmit"
        >确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import userApi from "../api/userApi";
import dictApi from "../api/dictApi";

export default {
  name: "userDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        username: "",
        password: "",
        name: "",
        stage: "",
        grade: "",
        term: "",
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: "用户账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "用户密码不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "用户姓名不能为空",
            trigger: "blur",
          },
          {
            max: 8,
            message: "用户姓名长度不能大于8个字符",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      stageOpt: [],
      gradeArr: [],
      gradeOpt: [],
      termOpt: [],
      uid: "",
      curUserData: {},
    };
  },
  mounted() {},
  methods: {
    // 打开弹窗，第一个参数是否为编辑，第二参数传入的表单参数
    open(isEdit, rowData = {}) {
      this.isEdit = isEdit;
      this.dialogVisible = true;
      this.uid = rowData.uid;
      this.$nextTick(() => {
        // 每次打开弹窗执行重置表单方法，为避免首次报错，在弹窗dom加载后才执行
        // resetFields()方法需要每个el-form-item带prop才可以重置。
        this.$refs.addForm.resetFields();
        this.resetForm();

        this.getStage();
        this.getGrade();
        this.getTerm();
        // 如果市编辑状态需要在重置表单后，将传入的数据进行表单赋值
        if (isEdit) {
          this.assignmentAddForm(rowData);
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      console.log(rowData);
      this.addForm = {
        username: rowData.username,
        name: rowData.name,
        stage: rowData.stage,
        grade: rowData.grade,
        term: rowData.term,
      };
      this.addForm.uid = rowData.uid;
      this.$delete(this.addForm, "password");
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
    },

    getStage() {
      let params = {
        mark: "stage",
      };
      dictApi
        .dictList(params)
        .then((res) => {
          //console.log(res);
          this.stageOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getGrade() {
      let params = {
        mark: "grade",
      };
      dictApi
        .dictList(params)
        .then((res) => {
          this.gradeArr = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getTerm() {
      let params = {
        mark: "term",
      };
      dictApi
        .dictList(params)
        .then((res) => {
          this.termOpt = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    stageLinkGrade(val) {
      if (val === 1) {
        this.gradeOpt = this.gradeArr;
        console.log(this.gradeOpt);
      } else {
        this.gradeOpt = this.gradeArr.slice(3, 6);
        console.log(this.gradeOpt);
      }
    },

    // 提交新增或修改
    addUsersubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.addUser();
          } else {
            this.editUser();
          }
        } else {
          this.$message.warning("请正确填写表单内容");
          return false;
        }
      });
    },

    // 新增用户
    addUser() {
      this.btnLoading = true;
      let params = this.addForm;
      userApi
        .insertUser(params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("创建成功");
            this.dialogVisible = false;
            this.$emit("submit-success");
            this.btnLoading = false;
          } else {
            console.log(res);
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },

    // 编辑用户
    editUser() {
      this.btnLoading = true;
      let params = this.addForm;
      userApi
        .editUser(params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("修改成功");
            this.dialogVisible = false;
            this.$emit("submit-success");
            this.btnLoading = false;
          } else {
            console.log(res);
            this.btnLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },

    //重置表单数据
    resetForm() {
      this.addForm.stage = "";
      this.addForm.grade = "";
      this.addForm.term = "";
    },
  },
};
</script>
