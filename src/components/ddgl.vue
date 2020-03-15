<template>
  <div class="ddgl">
    <el-form
      ref="sxform"
      :model="sxform"
      label-width="100px"
      label-position="right"
      :inline="true"
    >
      <el-form-item
        :label="item.label"
        v-for="(item, index) in sxsjgs"
        :key="index"
      >
        <el-date-picker
          v-model="sxform[item.prop]"
          v-if="item.label == '下单时间'"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="ksjssj"
        ></el-date-picker>
        <el-input v-model="sxform[item.prop]" v-else></el-input>
      </el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form>
    <div class="tjlr">
      统计利润
      <el-date-picker
        v-model="tjlr"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="kstjlr"
      ></el-date-picker>
      {{ tjlr2 }}元
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
        :width="item.label == '备注' ? '300' : ''"
      ></el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-check"
            circle
            @click="cl(scope.row)"
            v-if="zhqx.roleName == '管理员' && scope.row.isProcess == '未解决'"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="bj(scope.row)"
            v-if="scope.row.isProcess == '未解决' || zhqx.roleName == '管理员'"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            circle
            @click="sc(scope.row)"
            v-if="zhqx.roleName == '管理员'"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
    ></el-pagination>

    <el-dialog title="订单编辑" :visible.sync="bjshow" width="73%">
      <bjmk :bjsj="bjsj" @bjwc="bjwc" status="订单"></bjmk>
    </el-dialog>
  </div>
</template>

<script>
import ddglsj from "./bgsj";
import bjmk from "../commonComponent/bjmk.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "ddgl",
  data() {
    return {
      tjlr: "",
      tjlr2: 0, //统计利润金额
      currentpage: 1,
      sxform: {}, //搜索数据
      sxsjgs: [
        {
          label: "客户旺旺",
          prop: "wangwang"
        },
        {
          label: "订单编号",
          prop: "orderNo"
        },
        {
          label: "下单时间",
          prop: "orderTime"
        }
      ], //搜索的数据格式
      columns: [],

      tableData: [],
      dqy: 1, //当前页
      total: 0, //z总数
      bjshow: false, //编辑弹窗显示
      bjsj: "", //编辑数据
      status: "" //查询状态
    };
  },
  computed: mapState(["zhqx", "ip"]),
  mounted() {
    console.log(ddglsj);
    this.qqqbdd();
    ddglsj.ddglsj.forEach((item, index) => {
      item.prop == "profit" && this.zhqx.roleName !== "管理员"
        ? ddglsj.ddglsj.splice(index, 1)
        : "";
    });
    this.columns = ddglsj.ddglsj;
  },
  components: {
    bjmk
  },
  methods: {
    //统计陆润
    kstjlr(val) {
      console.log(val);
      var that = this;
      this.$axios
        .get(this.ip + "/orders/queyrTotalProfit", {
          params: {
            beginTime: val[0],
            endTime: val[1]
          }
        })
        .then(function(response) {
          console.log(response);
          that.tjlr2 = response.data.data;
          that.$message({
            message: "统计成功",
            type: "success"
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //订单处理
    cl(row) {
      console.log(row);
      row.isProcess = 0;
      var that = this;
      this.$axios
        .put(this.ip + "/orders/" + row.id, row)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "处理成功",
            type: "success"
          });
          that.qqqbdd();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //时间改变
    ksjssj(val) {},
    //分页查询
    fxcx() {
      // console.log(this.sxform.orderTime);
      let _this = this;
      // this.sxform
      this.status = "查询中";
      this.$axios
        .get(this.ip + "/orders", {
          params: {
            limit: 10,
            page: this.dqy,
            orderNo: this.sxform.orderNo,
            wangwang: this.sxform.wangwang,
            orderTime1:
              this.sxform.orderTime == undefined
                ? ""
                : this.sxform.orderTime[0],
            orderTime2:
              this.sxform.orderTime == undefined
                ? ""
                : this.sxform.orderTime[1],
            userId: this.zhqx.userId
          }
        })
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data.data.records;
          response.data.data.records.forEach((element, index) => {
            element.index = index;
            element.isProcess == 1
              ? (element.isProcess = "未解决")
              : (element.isProcess = "已解决");
          });
          _this.total = response.data.data.total;
          console.log(_this.bmbg);
          _this.dqy = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询
    search() {
      this.currentpage = 1;
      // console.log(this.sxform.orderTime);
      let _this = this;
      // this.sxform
      this.status = "查询中";
      this.$axios
        .get(this.ip + "/orders", {
          params: {
            limit: 10,
            page: this.dqy,
            orderNo: this.sxform.orderNo,
            wangwang: this.sxform.wangwang,
            orderTime1:
              this.sxform.orderTime == undefined
                ? ""
                : this.sxform.orderTime[0],
            orderTime2:
              this.sxform.orderTime == undefined
                ? ""
                : this.sxform.orderTime[1],
            userId: this.zhqx.userId
          }
        })
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data.data.records;
          response.data.data.records.forEach((element, index) => {
            element.index = index;
            element.isProcess == 1
              ? (element.isProcess = "未解决")
              : (element.isProcess = "已解决");
          });
          _this.total = response.data.data.total;
          console.log(_this.bmbg);
          _this.dqy = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑完成
    bjwc() {
      this.bjshow = false;
      this.qqqbdd();
    },
    //删除
    sc(row) {
      console.log(row);
      var that = this;
      this.$axios
        .delete(this.ip + "/orders/" + row.id)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.qqqbdd();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //切换页
    handleCurrentChange(val) {
      console.log(val);
      console.log(this.status);
      this.dqy = val;
      this.status == "查询中" ? this.fxcx() : this.qqqbdd();
    },
    //请求全部订单
    qqqbdd() {
      var _this = this;
      this.$axios
        .get(this.ip + "/orders", {
          params: {
            limit: 10,
            page: this.dqy,

            userId: this.zhqx.userId
          }
        })
        .then(function(response) {
          console.log(response);
          _this.tableData = response.data.data.records;
          response.data.data.records.forEach((element, index) => {
            element.index = index;
            element.isProcess == 1
              ? (element.isProcess = "未解决")
              : (element.isProcess = "已解决");
          });
          _this.total = response.data.data.total;
          _this.dqy = 1;
          // console.log(_this.bmbg)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑
    bj(row) {
      this.bjshow = true;
      this.bjsj = row;
    }
  }
};
</script>
<style scoped>
.ddgl {
  padding: 20px;
}
.el-table--border {
  margin-top: 20px;
}
.tjlr {
  font-size: 14px;
  margin-left: 31px;
}
</style>
