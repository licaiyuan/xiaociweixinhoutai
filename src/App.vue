<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  beforeMount() {
    var value = JSON.parse(sessionStorage.getItem("zhqx"));
    this.dlvuex(value);
    console.log(value);
  },
  mounted() {
    // var value = JSON.parse(sessionStorage.getItem("zhqx"));
    // this.dlvuex(value);
    // console.log(value);
  },
  methods: {
    ...mapMutations({
      dlvuex: "dlvuex"
    })
  }
};
</script>

<style>
.el-icon-close:before {
  color: white;
}
.el-dialog__body {
  padding: 72px 20px;
}
.el-dialog__title {
  font-size: 19px;
  color: white;
}
.el-dialog__header {
  text-align: center;
  background-color: #5c9eff;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;

  height: 920px;
  overflow: hidden;
}
html {
  height: 100%;
}
body {
  height: 100%;
}
.el-pagination {
    width: 400px;
    margin: 20px auto;
}
</style>
