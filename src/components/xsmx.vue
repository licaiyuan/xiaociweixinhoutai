<template>
  <div class="xxmx">
    <div v-show="zhqx.roleName == '管理员'">
      <el-date-picker
        v-model="xsmxsjzd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="xsmxsjdzd"
      ></el-date-picker>
      总金额: {{ zjdjezd }}元
    </div>
    <el-table :data="tableData" border style="width: 100%," class="bg">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      >
      </el-table-column>
      <el-table-column label="人数" width="150" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.customerCount"
            placeholder="请输入人数"
            v-if="zhqx.roleName == '管理员'"
            type="Number"
            @change="
              val => {
                xgrs({ value: val, userid: scope.row.userId });
              }
            "
          ></el-input>
          <p v-else>{{ scope.row.customerCount }}人</p>
        </template>
      </el-table-column>
      <el-table-column label="明细" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="xq(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="mxtotal"
      @current-change="mxhandleCurrentChange"
    ></el-pagination>
    <el-dialog title="详情" :visible.sync="dialogVisible">
      <el-date-picker
        v-model="xsmxsj"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="xsmxsjd"
      ></el-date-picker>
      总金额: {{ zjdje }}元
      <el-table :data="xqqqsj" style="width: 100%;margin-top:20px" border>
        <el-table-column
          align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in xqqqsjgs"
          :key="index"
        ></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="xqtotal"
        @current-change="xqhandleCurrentChange"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getqq, putqq } from "./serve.js";
export default {
  name: "xxmx",
  computed: mapState(["zhqx", "ip"]),
  data() {
    return {
      zjdje: "", //这阶段金额
      xsmxsj: "", //销售明细时间
      xsmxsjzd: "", //总的明细时间
      zjdjezd: "", //总的计算金额
      mxtotal: 0, //明细订单总数量
      xqtotal: 0, //详情订单总数量
      xqqqsjgs: [
        {
          label: "客户旺旺",
          prop: "wangwang"
        },
        {
          label: "订单时间",
          prop: "orderTime"
        },
        {
          label: "产品名称",
          prop: "productName"
        },

        {
          label: "数量",
          prop: "count"
        },
        {
          label: "金额",
          prop: "money"
        }
      ], //详情请求数据格式
      xqqqsj: [], //详情请求数据
      dialogVisible: false, //弹窗显示
      columns: [
        // {
        //   prop: "mc",
        //   label: "名次"
        // },
        {
          prop: "groupName",
          label: "部门",
          width: 500
        },
        {
          prop: "username",
          label: "姓名"
        },

        {
          prop: "count",
          label: "订单数量"
        },
        {
          prop: "money",
          label: "订单金额"
        }
      ],

      tableData: [],
      page: 1, //当前页
      xqdqy: 1, //详情当前页
      rowuserId: "", //点击详情的id
      row: ""
    };
  },
  mounted() {
    this.zhqx.roleName == "管理员"
      ? this.columns.unshift({
          prop: "mc",
          label: "名次"
        })
      : "";
    this.xsmxlb();
  },
  methods: {
    //修改人数
    async xgrs({ value, userid } = {}) {
      let data = await putqq(
        { count: parseInt(value), userId: userid },
        "sys-users/updateCustomerCount"
      );
      console.log(data);
    },
    //总的订单金额计算
    xsmxsjdzd() {
      let [ks, js] = this.xsmxsjzd;
      let csdsj = {};
      this.xsmxsjzd != "" ? (csdsj.beginTime = ks) && (csdsj.endTime = js) : "";
      getqq(csdsj, "orders/getTotalMoney").then(({ data: { data } }) => {
        this.zjdjezd = data;
      });
    },
    //销售明细时间段
    xsmxsjd(val) {
      console.log(val);
      this.xq(this.row);
    },

    //明细换页
    mxhandleCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.xsmxlb();
    },
    //详情换页
    xqhandleCurrentChange(val) {
      console.log(val);
      this.xqdqy = val;
      this.xq({ userId: this.rowuserId });
    },
    //销售明细列表
    xsmxlb() {
      let csdsj = {
        page: this.page,
        limit: 10,
        userId: this.zhqx.userId
        // beginTime:
      };

      var _this = this;
      this.$axios
        .get(this.ip + "/orders/saleDetails", {
          params: csdsj
        })
        .then(function(response) {
          console.log(response);

          _this.tableData = response.data.data.records;
          response.data.data.records.forEach((item, index) => {
            item.mc = index + 1;
          });
          console.log(response);
          let {
            data: {
              data: { total }
            }
          } = response;
          console.log(total);
          _this.mxtotal = total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    xq(row) {
      let _this = this;
      // this.xqdqy = 1;
      this.row = row;
      console.log(row);
      this.rowuserId = row.userId;
      let [ks, js] = this.xsmxsj;
      let csdsj = {
        limit: 10,
        page: this.xqdqy,

        userId: this.rowuserId
        // beginTime:
      };
      this.xsmxsj != "" ? (csdsj.beginTime = ks) && (csdsj.endTime = js) : "";

      // row.userId
      this.dialogVisible = true;
      this.$axios
        .get(this.ip + "/orders/queryOrderDetail", {
          params: csdsj
        })
        .then(function(response) {
          console.log(response);
          _this.xqqqsj = response.data.data.pageRecords.records;
          _this.xqtotal = response.data.data.pageRecords.total;
          _this.zjdje = response.data.data.totalMoney;
          _this.xqdqy = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.xxmx {
  padding: 20px;
}
.bg {
  margin-top: 15px !important;
}
</style>
