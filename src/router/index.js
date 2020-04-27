import Vue from "vue";
import Router from "vue-router";
import dljm from "@/components/dljm";
import sy from "@/components/sy";
import fz from "@/components/fz";
import cy from "@/components/cy";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "dljm",
      component: dljm
    },
    {
      path: "/sy",
      name: "sy",
      component: sy
    },
    {
      path: "/fz",
      name: "fz",
      component: fz
    },
    {
      path: "/cy",
      name: "cy",
      component: cy
    }
  ]
});
