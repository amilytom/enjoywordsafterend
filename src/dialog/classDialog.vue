<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="isEdit ? '编辑班级' : '新增班级'"
    :visible.sync="dialogVisible"
    class="user-modal"
  >
    <el-form
      ref="addForm"
      :model="addForm"
      :rules="addFormRules"
      label-width="100px"
    >
      <el-form-item label="字典标识：" prop="stage">
        <el-input
          v-model.trim="addForm.mark"
          placeholder="请输入字典标识"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典名称：" prop="grade">
        <el-input
          v-model.trim="addForm.dname"
          placeholder="请输入字典名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典名称：" prop="term">
        <el-input
          v-model.trim="addForm.dname"
          placeholder="请输入字典名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="字典名称：" prop="term">
        <el-input
          v-model.trim="addForm.dname"
          placeholder="请输入字典名称"
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
import dictApi from "../api/dictApi";

export default {
  name: "classDialog",
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        mark: "",
        dname: "",
      },
      addFormRules: {
        mark: [
          {
            required: true,
            message: "字典标识不能为空",
            trigger: "blur",
          },
        ],
        dname: [
          {
            required: true,
            message: "字典名称不能为空",
            trigger: "blur",
          },
        ],
      },
      btnLoading: false,
      id: 0,
    };
  },
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
        }
      });
    },

    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      //console.log(rowData);
      this.addForm = {
        mark: rowData.mark,
        dname: rowData.dname,
      };
      this.id = rowData.did;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
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
      dictApi
        .insertdict(params)
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

    // 编辑
    editProject() {
      this.btnLoading = true;
      this.addForm.did = this.id;
      let params = this.addForm;
      dictApi
        .editdict(params)
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
  },
};
</script>
