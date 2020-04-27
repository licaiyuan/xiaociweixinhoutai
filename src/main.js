// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import store from "./store.js";
import promise from "es6-promise";
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
promise.polyfill();
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  store,

  template: "<App/>"
});
