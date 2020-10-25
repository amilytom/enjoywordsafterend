<template>
  <div class="wrapper">
    <head-com></head-com>
    <side-bar></side-bar>
    <div class="content-box">
      <tags-com></tags-com>
      <div class="content">
        <transition mode="out-in" name="move">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import headCom from "./header.vue";
import sideBar from "./sidebar.vue";
import tagsCom from "./tags.vue";
import bus from "../utils/bus";

export default {
  data() {
    return {
      tagsList: [],
      collapse: true,
    };
  },
  components: {
    headCom,
    sideBar,
    tagsCom,
  },
  created() {
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.content-box {
  position: absolute;
  left: 250px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding-bottom: 30px;
  -webkit-transition: left 0.3s ease-in-out;
  transition: left 0.3s ease-in-out;
  background: #f0f0f0;
}

.content {
  width: auto;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
