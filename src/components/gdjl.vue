<template>
  <div class="gdjl">
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
          v-if="item.label == '下次联系'"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-select
          v-model="sxform[item.prop]"
          placeholder="请选择"
          v-else-if="item.label == '跟单进度'"
        >
          <el-option
            v-for="item in item.option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-model="sxform[item.prop]" v-else></el-input>
      </el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
        :width="item.label == '详情备注' ? '250' : ''"
      ></el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="bj(scope.row)"
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
    <el-dialog title="跟单编辑" :visible.sync="bjshow" width="73%">
      <bjmk :bjsj="bjsj" @bjwc="bjwc" status="跟单"></bjmk>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import bjmk from "../commonComponent/bjmk.vue";
export default {
  name: "gdjl",
  data() {
    return {
      sxform: {}, //筛选数据
      sxsjgs: [
        {
          label: "客户旺旺",
          prop: "wangwang"
        },
        {
          label: "跟单进度",
          prop: "process",
          option: [
            {
              value: "无意向",
              label: "无意向"
            },
            {
              value: "有意向",
              label: "有意向"
            },
            {
              value: "已下单",
              label: "已下单"
            }
          ]
        },
        {
          label: "下次联系",
          prop: "nextLinktime"
        }
      ],
      bjshow: false, //编辑弹窗显示
      total: 0, //总数
      page: 1, //当前页
      bjsj: "", //编辑数据

      value: "",
      columns: [
        {
          prop: "index",
          label: "序号"
        },
        {
          prop: "wangwang",
          label: "客户旺旺"
        },
        {
          prop: "followTime",
          label: "跟单时间"
        },
        {
          prop: "type",
          label: "跟单类型"
        },
        {
          prop: "process",
          label: "跟单进度"
        },

        {
          prop: "remark",
          label: "详情备注"
        },

        {
          prop: "nextLinktime",
          label: "下次联系"
        },
        {
          prop: "linkMan",
          label: "联系人"
        }
      ],

      tableData: [],
      status: "全部列表",
      currentpage: 0
    };
  },

  mounted() {
    this.cxgdjl();
  },
  components: {
    bjmk
  },
  computed: mapState(["zhqx", "ip"]),
  methods: {
    //查询
    search() {
      this.status = "查询状态";
      this.currentpage = 1;
      this.sxform.userId = this.zhqx.userId;
      this.sxform.limit = 7;
      this.sxform.page = this.page;
      var that = this;
      this.$axios
        .post(this.ip + "/order-follows/list", this.sxform)
        .then(function(response) {
          that.tableData = response.data.data.records;
          that.total = response.data.data.total;
          console.log(response);
          // that.$message({
          //   message: "查询成功",
          //   type: "success"
          // });
          // that.currentpage = 1;
          that.page = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询分页
    cxfy() {
      this.status = "查询状态";

      this.sxform.userId = this.zhqx.userId;
      this.sxform.limit = 7;
      this.sxform.page = this.page;
      var that = this;
      this.$axios
        .post(this.ip + "/order-follows/list", this.sxform)
        .then(function(response) {
          that.tableData = response.data.data.records;
          that.total = response.data.data.total;
          console.log(response);
          // that.$message({
          //   message: "查询成功",
          //   type: "success"
          // });
          // that.currentpage = 1;
          that.page = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑完成
    bjwc() {
      this.bjshow = false;

      this.cxgdjl();
    },
    //切换页
    handleCurrentChange(val) {
      this.page = val;

      this.status == "全部列表" ? this.cxgdjl() : this.cxfy();
    },
    //删除
    sc(row) {
      console.log(row);
      var that = this;
      this.$axios
        .delete(this.ip + "/order-follows/" + row.orderFollowId)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.cxgdjl();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //跟单列表
    cxgdjl() {
      var _this = this;
      this.$axios
        .post(this.ip + "/order-follows/list", {
          page: this.page,
          limit: 7,
          userId: this.zhqx.userId,
          nextLinktime: "",
          process: "",
          wangwang: ""
        })
        .then(function(response) {
          console.log(response);
          response.data.data.records.forEach((element, index) => {
            element.index = index;
          });
          _this.tableData = response.data.data.records;
          _this.total = response.data.data.total;
          _this.page = 1;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    bj(row) {
      this.bjshow = true;
      this.bjsj = row;
    }
  }
};
</script>
<style scoped>
.gdjl {
  padding: 20px;
}
.el-table--border {
  margin-top: 20px;
}
</style>
