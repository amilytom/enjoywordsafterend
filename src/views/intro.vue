<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-card class="mgb20" shadow="hover" style="height: 252px">
          <div class="user-info">
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：<span>{{ lastLoginAt }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import timeFormat from "@/utils/timeFormat";

export default {
  data() {
    return {
      name: Cookies.get("name"),
      lastLoginAt: timeFormat.timestampToDate(Cookies.get("lastLoginAt")),
    };
  },
  computed: {},
  methods: {},
};
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}
</style>
