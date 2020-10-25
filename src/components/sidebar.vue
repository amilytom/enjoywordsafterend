<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes"
      active-text-color="#20a0ff"
      background-color="#324157"
      class="sidebar-el-menu"
      router
      text-color="#bfcbd9"
      unique-opened
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :key="item.index" :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i
              ><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :key="subItem.index"
                :index="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="subItem.index" :index="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :key="item.index" :index="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "el-icon-s-home",
          index: "intro",
          title: "系统首页",
        },
        {
          icon: "el-icon-user-solid",
          index: "user",
          title: "用户管理",
        },
        {
          icon: "el-icon-star-on",
          index: "dict",
          title: "字典管理",
        },
        {
          icon: "el-icon-s-flag",
          index: "class",
          title: "班级管理",
        },
        {
          icon: "el-icon-picture",
          index: "book",
          title: "教材管理",
        },
        {
          icon: "el-icon-star-on",
          index: "word",
          title: "单词管理",
        },
        {
          icon: "el-icon-s-flag",
          index: "speech",
          title: "词性管理",
        },
        {
          icon: "el-icon-picture",
          index: "mean",
          title: "释义管理",
        },
        {
          icon: "el-icon-user-solid",
          index: "case",
          title: "例句管理",
        },
        {
          icon: "el-icon-star-on",
          index: "train",
          title: "练习管理",
        },
        {
          icon: "el-icon-s-flag",
          index: "test",
          title: "试卷管理",
        },
        {
          icon: "el-icon-picture",
          index: "mistake",
          title: "错题管理",
        },
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    // bus.$on('collapse', msg => {
    //     this.collapse = msg;
    // })
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
