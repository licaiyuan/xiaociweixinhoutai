<template>
  <div class="hello">
    <div class="szpl">
      <p>后台管理中心欢迎您</p>
      <el-input v-model="zh" placeholder="请输入账号"></el-input>
      <el-input v-model="mm" placeholder="请输入密码" type="password"></el-input>
      <el-button type="primary" @click="dl">登录</el-button>
    </div>
    <img src="/static/dlkbjt.png" class="dlkbjt" />
  </div>
</template>

<script>
// import desp from './desp.vue'
import { mapState, mapMutations } from "vuex";
export default {
  name: "dljm",
  data() {
    return {
      zh: "",
      mm: ""
    };
  },
  computed: mapState(["ip"]),
  components: {
    // desp
  },
  mounted() {},
  methods: {
    ...mapMutations({
      dlvuex: "dlvuex"
    }),
    dl() {
     
      var _this = this;
      this.$axios
        .post(this.ip + "/login", {
          username: this.zh,
          password: this.mm
        })
        .then(function(response) {
          // console.log(response);
          console.log(response.data.data);
          response.data.data.zh = _this.zh;
          _this.dlvuex(response.data.data);
          response.data.code == 20000
            ? _this.$message({
                message: "登录成功",
                type: "success"
              }) &&
              _this.$router.push("/sy") &&
              sessionStorage.setItem("zhqx", JSON.stringify(response.data.data))
            : _this.$message.error("账号密码错误");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dlkbjt {
  width: 1536px;
  height: 815px;
}
.szpl {
  p {
    font-size: 30px;
  }
  width: 300px;

  display: flex;
  flex-direction: column;

  line-height: 62px;
  position: absolute;

  top: 300px;
  left: 435px;
}
.hello {
  background: url(/static/ztbjt.png) no-repeat center 0px;
  background-position: center 0;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
