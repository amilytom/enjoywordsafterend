<template>
  <div class="dialog-box">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="passDialogVisible"
      class="box-modal"
      title="修改密码"
    >
      <el-form
        ref="changePassword"
        :model="changePassword"
        :rules="changePasswordRules"
        label-width="80px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model.trim="changePassword.password"
            placeholder="请输入新密码"
            size="small"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model.trim="changePassword.confirmPassword"
            placeholder="请输入确认密码"
            size="small"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="passDialogVisible = false">取 消</el-button>
        <el-button
          :loading="btnLoading"
          type="primary"
          @click="changePasswordSubmit"
          >保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from "../api/userApi";
import Cookie from "js-cookie";
import valiadteRule from "@/utils/validateRule";

export default {
  data() {
    return {
      changePassword: {
        password: "",
        confirmPassword: "",
      },
      changePasswordRules: {
        password: [
          {
            required: true,
            trigger: "blur",
            message: "新密码不能为空",
          },
        ],
        confirmPassword: [
          {
            required: true,
            trigger: "blur",
            message: "重复密码不能为空",
          },
          {
            validator: valiadteRule.validateConfirm(this, "changePassword"),
            trigger: "blur",
          },
        ],
      },
      passDialogVisible: false,
      btnLoading: false,
    };
  },
  methods: {
    open() {
      this.passDialogVisible = true;
    },
    changePasswordSubmit() {
      this.btnLoading = true;
      this.$refs.changePassword.validate((valid) => {
        if (valid) {
          let params = {
            uid: Cookie.get("uid"),
            password: this.changePassword.password,
          };
          console.log(params);
          userApi
            .editUserPwd(params)
            .then((res) => {
              this.$message.success("密码修改成功");
              this.btnLoading = false;
              this.passDialogVisible = false;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$message.warning("请正确填写表单内容");
          this.passDialogVisible = false;
          return false;
        }
      });
    },
  },
};
</script>
