<template>
  <div>
    <div class="pyh" v-show="sy == 'lm'">
      <p>是否添加:</p>
      <el-select v-model="tjzt" placeholder="请选择" @change="gbtjzt">
        <el-option
          v-for="item in optionstj"
          :key="item.name"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <p style="margin-left:20px">人数:{{ datas["total"] }}</p>
    </div>
    <el-table :data="datas['records']" border style="width: 100%">
      <el-table-column
        v-for="(item, index) in tablecolumn['pt']"
        :prop="item.prop"
        :label="item.lable"
        :key="index"
        v-if="item.prop !== 'status'"
        :width="item.prop == 'addTime' || item.prop == 'storeName' ? 180 : ''"
      >
      </el-table-column>
      <el-table-column label="状态" v-if="sy == 'lm'">
        <template slot-scope="scope" v-if="scope.row.status != undefined">
          <el-select
            v-model="scope.row.status"
            placeholder="请选择"
            @change="xgww(scope.row)"
          >
            <el-option
              v-for="item2 in wwxgztxx"
              :key="item2.value"
              :label="item2.name"
              :value="item2.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        v-if="tablecolumn['gj'] !== undefined"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row, item.method)"
            type="text"
            size="small"
            v-for="(item, index) in tablecolumn['gj']"
            :key="index"
            >{{ item.name }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="datas.total"
      :page-size="pagesize"
      @current-change="hy"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { putqqdg } from "../components/serve";
export default {
  name: "bgmk",
  beforeMount() {},
  props: ["datas", "tablecolumn", "sy", "pagesize"],
  mounted() {
    console.log(this.datas);
    console.log(this.tablecolumn);
    console.log(this.tablecolumn["gj"]);
    console.log(this.sy);
  },
  computed: mapState(["ip", "zhqx"]),
  methods: {
    ...mapMutations({
      dlvuex: "dlvuex"
    }),
    //修改旺旺
    async xgww(val) {
      console.log(val);
      let id = val.id;
      delete val.id;
      delete val.addTime;
      putqqdg(id, "wangwangs", val);
    },
    //改变添加状态
    gbtjzt(val) {
      console.log(val);
      this.$emit("gbtjzt", val);
    },
    handleClick(row, method) {
      console.log(row);
      this.$emit(method, row);
      console.log(method);
    },
    //分页换页
    hy(val) {
      this.$emit("hy", val);
    }
    //查看客户
  },
  watch: {
    datas(newName, oldName) {
      this.datas = newName;
      console.log(this.datas);
    },
    tablecolumn(newName, oldName) {
      this.tablecolumn = newName;
      console.log(this.tablecolumn);
    }
  },
  data() {
    return {
      wwxgztxx: [
        { name: "已添加", value: 1 },
        { name: "未添加", value: 0 }
      ], //添加选项,
      optionsdp: [],
      optionstj: [
        { name: "全部", value: "" },
        { name: "已添加", value: 1 },
        { name: "未添加", value: 0 }
      ], //添加选项,
      tjzt: "" //添加状态
    };
  }
};
</script>

<style lang="scss">
@import "../components/common.scss";
.pyh {
  @include flexa;
}
</style>
