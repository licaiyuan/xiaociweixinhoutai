<template>
  <div class="sy">
    <el-row>
      <el-col :span="3">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <img class="dhtp" src="/static/sy.png" />
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <img class="dhtp" src="/static/gdjl.png" />
            <span slot="title">跟单记录</span>
          </el-menu-item>

          <el-menu-item index="3">
            <img class="dhtp" src="/static/shgl.png" />
            <span slot="title">售后管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <img class="dhtp" src="/static/xsmx.png" />
            <span slot="title">销售明细</span>
          </el-menu-item>
          <el-menu-item index="5">
            <img class="dhtp" src="/static/ddgl.png" />
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="8">
            <img class="dhtp" src="/static/wxgl.png" />
            <span slot="title">微信管理</span>
          </el-menu-item>
          <!-- <el-menu-item index="6" v-if="zhqx.roleName=='管理员'">
            <img class="dhtp" src="/static/ylmx.png" />
            <span slot="title">盈利明细</span>
          </el-menu-item> -->
        </el-menu>
      </el-col>
      <el-col :span="21">
        <div class="dbtx">
          <img
            src="/static/xz.png"
            style="    width: 48px;
    height: 38px;"
            @click="fz"
            v-if="zhqx.roleName == '管理员'"
          />
          <!-- <el-dropdown>
            <span class="el-dropdown-link">
              <img src="/static/tx.png" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-s-tools">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-back" @click="dc">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </div>
        <div class="bjs">
          <div v-if="key2 == 1">
            <xtsy></xtsy>
          </div>
          <div v-else-if="key2 == 2">
            <gdjl></gdjl>
          </div>
          <div v-else-if="key2 == 3">
            <shgl></shgl>
          </div>
          <div v-else-if="key2 == 4">
            <xsmx></xsmx>
          </div>
          <div v-else-if="key2 == 5">
            <ddgl></ddgl>
          </div>
          <div v-else-if="key2 == 6">
            <ylmx></ylmx>
          </div>
          <div v-else-if="key2 == 7">
            <fz></fz>
          </div>
          <div v-else-if="key2 == 8">
            <wxgl></wxgl  >
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import xtsy from "./xtsy.vue";
import gdjl from "./gdjl.vue";
import shgl from "./shgl.vue";
import xsmx from "./xsmx.vue";
import ddgl from "./ddgl.vue";
import ylmx from "./ylmx.vue";
import fz from "./fz.vue";
import wxgl from "./wxgl.vue";
export default {
  name: "sy",
  components: {
    xtsy,
    gdjl,
    shgl,
    xsmx,
    ddgl,
    ylmx,
    fz,
    wxgl
  },
  data() {
    return {
      key2: "1",
      activeIndex: "1"
    };
  },
  mounted() {
    console.log(sessionStorage.getItem("activeIndex"));
    this.activeIndex =
      sessionStorage.getItem("activeIndex") != null
        ? sessionStorage.getItem("activeIndex")
        : "1";
    this.key2 =
      sessionStorage.getItem("activeIndex") != null
        ? sessionStorage.getItem("activeIndex")
        : "1";
  },
  computed: mapState(["zhqx"]),
  methods: {
    //登出
    dc() {
      // this.$router.push("/");
      this.$router.go(-1);
    },
    handleSelect(key, keyPath) {
      this.key2 = key;
      sessionStorage.setItem("activeIndex", key);

      console.log(this.key2);
    },
    fz() {
      // this.$router.push("/fz");
      this.key2 = "7";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dhtp {
  width: 16px;
  height: 16px;
  position: relative;
  bottom: 2px;
}
.bjs {
  background-color: #f1f5f9;
  padding: 55px 20px;
  height: 100%;
}
.el-menu-item {
  font-size: 16px;
  color: #c6dbfa;
}
.el-menu-item :hover {
  background: #7caff8;
}
.el-menu-item.is-active {
  color: white;
  background: #7caff8;
}
.el-row,
.el-col-3 {
  height: 100%;
}
.el-col-21 {
  height: 100%;
  overflow: auto;
}
.sy {
  height: 100%;
}
.el-menu {
  height: 100%;
  width: 13%;
  position: fixed;
  background-color: #5c9eff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.dbtx {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}
</style>
