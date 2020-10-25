<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">{{ title }}</div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="ms-content"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-s-custom"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            placeholder="password"
            type="password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button
            :loading="loginLoading"
            type="primary"
            @click="submitForm('ruleForm')"
            >登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      title: "快乐记单词后台管理系统",
      ruleForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loginLoading: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          let userInfo = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
          };
          this.$store
            .dispatch("login", userInfo)
            .then((res) => {
              //console.log(res);
              this.loginLoading = false;
              if (res.data.token) {
                this.$message.success("登陆成功");
                this.$router.push("/intro");
              } else {
                this.$message.warning(res.msg);
                this.loginLoading = false;
              }
            })
            .catch((err) => {
              console.log(err);
              this.loginLoading = false;
              this.$message.warning(err.msg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/login-bg.png) no-repeat 65% 60% #3b5724;
  background-size: 50%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>
