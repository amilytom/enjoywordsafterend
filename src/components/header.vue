<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">{{ title }}</div>
    <div class="header-right">
      <div class="header-user-con">
        <i class="el-icon-s-custom"></i>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <span>{{ name }}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 修改密码 -->
    <pass-dialog ref="passDialog"></pass-dialog>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import passDialog from "../dialog/passDialog";

export default {
  components: {
    passDialog,
  },
  data() {
    return {
      title: "快乐记单词后台管理系统",
      name: Cookies.get("name"),
    };
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginOut") {
        this.logout();
      } else {
        this.setPass();
      }
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$message.success("退出登录");
          this.$router.push({ path: "/login" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setPass() {
      this.$refs.passDialog.open();
    },
  },
};
</script>

<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #242f42;
  border-bottom: 1px solid #111;
}

.collapse-btn {
  float: left;
  padding: 0 10px 0 21px;
  cursor: pointer;
  line-height: 70px;
  font-size: 28px;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 68px;
}

.header-right {
  float: right;
  padding-right: 30px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.user-name {
  margin-left: 10px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-link span {
  font-size: 16px;
}
</style>
