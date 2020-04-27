<template>
  <div class="khlb">
    <div class="san">
      <el-button type="primary" plain @click="gjss">高级搜索</el-button>
      <el-button type="primary" plain @click="xzkh">新增客户</el-button>
      <el-button type="primary" plain @click="qbkhlb">全部客户列表</el-button>
      <el-date-picker
        v-model="dcrq"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <p>导出类型:</p>
      <el-select v-model="dclx" placeholder="请选择">
        <el-option
          v-for="item2 in dclxs"
          :key="item2.value"
          :label="item2.label"
          :value="item2.value"
        ></el-option>
      </el-select>
      <a :href="dc()" v-if="zhqx.roleName == '管理员'">
        <el-button type="primary" plain>导出</el-button>
      </a>
      <el-upload
        class="upload-demo"
        action="http://39.108.180.151:10010/excel"
        multiple
      >
        <el-button plain type="danger" v-if="zhqx.roleName == '管理员'"
          >导入</el-button
        >
      </el-upload>
    </div>
    <el-table :data="tableData" style="width: 100%;margin-top:20px" border>
      <el-table-column
        align="center"
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in sjcolumns"
        :key="index"
        width="200"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text"   size="small">查看</el-button> -->

          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="tjdd(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="detail(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            circle
            @click="sc(scope.row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="bjkh(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      :current-page="dqy"
      :page-size="7"
    ></el-pagination>
    <el-dialog :title="tckbt" :visible.sync="dialogVisible" width="73%">
      <xzkh
        :tckbt="tckbt"
        :userId="zhqx.userId"
        :zh="zhqx.zh"
        @closecp="closecp"
        @gjssqd="gjssqd"
        :xqsj="xqsj"
        :nowTime="nowTime"
        :form="form"
      ></xzkh>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import sjcolumns from "./bgsj";
import xzkh from "./xzkh";
export default {
  name: "khlb",
  computed: mapState(["zhqx", "nowTime", "ip"]),
  components: {
    xzkh
  },
  mounted() {
    // console.log(this.nowTime);
    console.log(this.zhqx);
    this.getTime();
    this.khlb();

    sjcolumns.sjcolumns.forEach(item => {
      this.sjcolumns.push(item);
    });
    this.sjcolumns.forEach((item, index) => {
      item.label == "体重" ||
      item.label == "粉丝福利" ||
      item.label == "客户来源"
        ? this.sjcolumns.splice(index, 1)
        : "";
    });
  },
  data() {
    return {
      dclxs: [
        // {
        //   value: "全部",
        //   lable: "全部"
        // },
        {
          value: "微信老客户",
          lable: "微信老客户"
        },
        {
          value: "天猫客户",
          lable: "天猫客户"
        }
      ], //所有导出类型
      dclx: "", //导出类型
      dcrq: "", //导出日期
      status: "normal", //请求客户列表状态
      gjssbcxx: "", //上次保存的搜索选项
      dialogVisible: false,
      sjcolumns: [],
      tckbt: "", //弹出框标题
      tableData: [],
      total: 0,
      dqy: 1, //当前页
      xqsj: "", //详情数据
      form: "" //子组件数据
    };
  },
  methods: {
    ...mapMutations(["csxqdsj", "getTime"]),
    //导出
    dc() {
      console.log(this.dcrq);
      const [ks, js] = this.dcrq;
      console.log(ks + "-" + js);

      console.log(
        `${this.ip}/orders/exportExcel?userId=1` +
          "&beginTime=" +
          ks +
          "&endTime=" +
          js +
          "&type=" +
          this.dclx
      );

      if (this.dcrq) {
        return (
          `${this.ip}/orders/exportExcel?userId=1` +
          "&beginTime=" +
          ks +
          "&endTime=" +
          js +
          "&type=" +
          this.dclx
        );
      } else {
        return `${this.ip}/orders/exportExcel?userId=1`;
      }
    },
    // ...mapMutations({
    //   getTime: "getTime"
    // }),
    //删除
    sc(row) {
      var that = this;
      this.$axios
        .delete(this.ip + "/customers/" + row.id)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.qbkhlb();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加订单
    tjdd(row) {
      this.tckbt = "订单";
      this.xqsj = row;
      this.dialogVisible = true;
    },
    //点击详情
    detail(row) {
      this.tckbt = "详情";

      var _this = this;
      console.log(row);
      this.$axios
        .get(this.ip + "/customers/" + row.id, {
          params: {}
        })
        .then(function(response) {
          _this.xqsj = sjcolumns.sjcolumns;
          _this.xqsj.forEach(item => {
            const jdsj = response.data.data;
            jdsj.address =
              jdsj.xtrysf + jdsj.xtrycs + jdsj.xtryqy + jdsj.detail;
            for (var p in response.data.data) {
              item.prop == p
                ? (item.value =
                    response.data.data[p] == null ? "" : response.data.data[p])
                : "";
            }
          });

          _this.dialogVisible = true;
          _this.csxqdsj({ ..._this.xqsj });

          console.log(_this.xqsj);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //全部客户列表
    qbkhlb() {
      this.dqy = 1;
      this.khlb();
      this.status = "normal";
    },
    //当前页
    handleCurrentChange(val) {
      this.dqy = val;
      this.status == "normal"
        ? this.khlb()
        : this.gjssqd(this.gjssbcxx, this.dqy);
    },
    //关闭弹窗
    closecp() {
      this.dialogVisible = false;
      this.khlb();
    },
    //高级搜索结果
    gjssqd(val, page = 1) {
      let _this = this;
      this.gjssbcxx = val;
      val.userId = this.zhqx.userId;
      val.limit = 7;

      this.status = "search";
      val.page = page;
      console.log(val);
      this.$axios
        .post(this.ip + "/customers/search", val)
        .then(function(response) {
          console.log(response);
          _this.total = response.data.data.total;
          _this.tableData = response.data.data.records;
          _this.dialogVisible = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑客户
    bjkh(val) {
      console.log(val);
      this.xqsj = val;
      this.tckbt = "编辑客户";
      this.pdbt(this.tckbt);
      this.dialogVisible = true;
    },
    //判断标题
    pdbt(val) {
      if (val == "编辑客户") {
        console.log(val);

        this.form = this.xqsj;
        this.form.address = {};
        this.form.address.xtrysf = this.xqsj.xtrysf;
        this.form.address.xtrycs = this.xqsj.xtrycs;
        this.form.address.xtryqy = this.xqsj.xtryqy;

        console.log(this.form);
      } else {
        console.log(val);
        this.form = {
          address: {
            xtrysf: "",
            xtrycs: "",
            detail: ""
          }
        };
      }
    },
    //客户列表
    khlb() {
      var _this = this;
      this.$axios
        .get(this.ip + "/customers/queryCustomerList", {
          params: {
            limit: 7,
            page: this.dqy,
            roleId: this.zhqx.roleId,
            userId: this.zhqx.userId
          }
        })
        .then(function(response) {
          console.log(response);
          let sjjx = response.data.data.records;
          console.log(sjjx);
          for (let item of sjjx) {
            item.address =
              item.xtrysf + item.xtrycs + item.xtryqy + item.detail;
          }

          _this.tableData = sjjx;
          _this.total = response.data.data.total;
          console.log(_this.tableData);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    gjss() {
      this.dialogVisible = true;
      this.tckbt = "高级搜索";
      this.pdbt(this.tckbt);
    },
    xzkh() {
      this.dialogVisible = true;
      this.tckbt = "新增客户";
      this.pdbt(this.tckbt);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "common.scss";
.san {
  @include flexa(row, center, space-around);
  width: 1200px;
}
</style>
