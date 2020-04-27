<template>
  <div class="xtsy">
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="客户列表" name="khlb">
     
      </el-tab-pane>
      <el-tab-pane label="高级搜索" name="gjss" >高级搜索</el-tab-pane>
      <el-tab-pane label="新增客户" name="xzkh">新增客户</el-tab-pane>
    </el-tabs> -->
    <khlb></khlb>
  </div>
</template>

<script>
import khlb from "./khlb.vue";
export default {
  name: "xtsy",
  components: {
    khlb
  },
  data() {
    return {
      activeName: "khlb"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: white;
  position: relative;
}
</style>
