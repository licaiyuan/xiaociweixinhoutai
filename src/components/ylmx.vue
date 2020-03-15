<template>
  <div class="ylmx">
    <div class="smyh">
      <el-button type="primary" @click="xzcp">新增产品</el-button>
      <el-date-picker
        v-model="sxsj"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="ksjssj"
      ></el-date-picker>
      <div class="cpmcss">
        产品名称：
        <el-autocomplete
          v-model="cpmc"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-top:20px">
      <el-table-column
        v-for="(item,index) in columns "
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" circle @click="sc(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增产品" :visible.sync="xzcpshow">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="产品名称">
          <el-input v-model="form.productName"></el-input>
        </el-form-item>
        <el-form-item label="成本价(元)">
          <el-input v-model="form.costPrice"></el-input>
        </el-form-item>
        <el-button type="primary" @click="qdcp">确定产品</el-button>
      </el-form>
    </el-dialog>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "ylmx",
  computed: mapState(["ip"]),
  data() {
    return {
      cpmc: "", //产品名称
      restaurants: [],
      sxsj: "",
      xzcpshow: false, //新增产品弹窗
      total: 0,
      currentPage: 1, //当前页数
      form: {
        productName: "",
        costPrice: ""
      },
      endTime: "", //搜索结束时间
      startTime: "", //搜索开始时间
      columns: [
        {
          prop: "productName",
          label: "产品名称"
        },
        {
          prop: "saleMoney",
          label: "销售总价"
        },
        {
          prop: "count",
          label: "销售数量"
        },
        {
          prop: "costPrice",
          label: "成本价"
        },
        {
          prop: "ylje",
          label: "盈利金额"
        }
      ],

      tableData: []
    };
  },
  mounted() {
    this.cplb();
    this.cpxllb();
  },
  methods: {
    //请求产品下拉列表
    cpxllb() {
      var _this = this;
      this.$axios
        .get(this.ip+"/products", {
          params: {}
        })
        .then(function(response) {
          console.log(response);
          response.data.data.records.forEach(element => {
            // console.log(element);
            _this.restaurants.push({ value: element.productName });
          });
          console.log(_this.restaurants);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        // console.log(state);
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
        );
      };
    },
    //请求具体盈利明细
    handleSelect(val) {
      console.log(val);
      var _this = this;
      this.$axios
        .get(this.ip+"/products", {
          params: {
            productName: val.value,
            flag: 1
          }
        })
        .then(function(response) {
          console.log(response);
          var a = response.data.data;
          a.records.forEach(element => {
            element.ylje =
              element.saleMoney - element.costPrice * element.count < 0
                ? 0
                : element.saleMoney - element.costPrice * element.count;
          });
          _this.tableData = a.records;
          _this.total = a.total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //删除
    sc(row) {
      var that = this;
      this.$axios
        .delete(this.ip+"/products/" + row.id)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          that.cplb();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.cplb();
    },
    //确定产品
    qdcp() {
      let that = this;
      this.$axios
        .post(this.ip+"/products", this.form)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "添加产品成功",
            type: "success"
          });
          that.xzcpshow = false;
          that.cplb();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //新增产品
    xzcp() {
      this.xzcpshow = true;
    },
    //时间段改变
    ksjssj(val) {
      console.log(val);
      this.startTime = val[0];
      this.endTime = val[1];
      this.currentPage = 1;
      this.cplb();
    },
    //产品列表
    cplb() {
      var _this = this;
      this.$axios
        .get(this.ip+"/products", {
          params: {
            startTime: this.startTime,
            endTime: this.endTime,
            flag: 1,
            limit: 10,
            page: this.currentPage
          }
        })
        .then(function(response) {
          console.log(response);
          var a = response.data.data;
          a.records.forEach(element => {
            element.ylje =
              element.saleMoney - element.costPrice * element.count < 0
                ? 0
                : element.saleMoney - element.costPrice * element.count;
          });
          for (var i = 0; i < a.records.length; i++) {
            //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
            for (var j = i; j < a.records.length; j++) {
              if (a.records[i].ylje < a.records[j].ylje) {
                //如果arr[j]大就把此时的值赋值给最大值变量max
                var maxStr = a.records[j];
                a.records[j] = a.records[i];
                a.records[i] = maxStr;
              }
            }
          }

          _this.tableData = a.records;
          _this.total = a.total;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.smyh {
  display: flex;
  .cpmcss {
    margin-left: 20px;
  }
}
.ylmx {
  padding: 20px;
}
.el-range-editor.el-input__inner {
  margin-left: 20px;
}
</style>
