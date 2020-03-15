<template>
  <div class="shgl">
    <el-select v-model="isProcess" placeholder="请选择" @change="change">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button type="primary" plain @click="xzsh">新增售后</el-button>
    <el-table :data="tableData" border style="width: 120%;margin-top:20px">
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item,index) in columns"
        :key="index"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-check" circle @click="cl(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="bj(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-delete" circle @click="sc(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="tcmz" :visible.sync="dialogVisible">
      <el-form ref="form" label-width="80px">
        <el-row>
          <el-col :span="8" v-for="(item,index) in zeshlb" :key="index">
            <el-form-item :label="item.label">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="form[item.prop]"
                v-if="item.label=='详细备注'"
                width="300"
              ></el-input>
              <el-autocomplete
                v-model="form[item.prop]"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect()"
                v-else-if="item.label=='购买产品'"
              ></el-autocomplete>
              <el-date-picker
                v-model="form[item.prop]"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-else-if="item.label=='反馈日期'||item.label=='结束日期'||item.label=='录入时间'"
              ></el-date-picker>

              <el-input v-model="form[item.prop]" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
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
  name: "shgl",
  data() {
    return {
      isProcess: "", //是否处理

      zeshlb: [],
      form: {},
      dialogVisible: false,
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "已解决"
        },
        {
          value: "1",
          label: "未解决"
        }
      ], //筛选选项
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
          prop: "purchaseProduct",
          label: "购买产品"
        },

        {
          prop: "subject",
          label: "反馈问题"
        },
        {
          prop: "linkMan",
          label: "反馈人员"
        },
        {
          prop: "feedbackTime",
          label: "反馈日期"
        },
        {
          prop: "processingPerson",
          label: "处理人"
        },

        {
          prop: "result",
          label: "处理结果"
        },
        {
          prop: "endTime",
          label: "结束日期"
        },
        {
          prop: "saleman",
          label: "业务员"
        },
        {
          prop: "addTime",
          label: "录入时间"
        },
        {
          prop: "remark",
          label: "详细备注"
        }
      ],
      restaurants: [], //产品列表

      tableData: [],
      page: 1, //当前页
      total: 0, //总数
      tcmz: "", //弹窗名字
      bjid: "" //编辑id
    };
  },
  computed: mapState(["zhqx","ip"]),
  mounted() {
    this.cpxllb();
    this.columns.forEach(element => {
      element.label !== "序号" && element.label !== "处理结果"
        ? this.zeshlb.push(element)
        : "";
    });
    this.shgllb();
  },
  methods: {
    //选项改变
    change(val) {
      this.page = 1;
      this.shgllb();
    },
    //新增售后按钮
    xzsh() {
      this.dialogVisible = true;
      this.tcmz = "新增售后";
    },
    //换页
    handleCurrentChange(val) {
      this.page = val;
      this.shgllb();
    },
    //处理
    cl(row) {
      console.log(row)
      var _this = this;
      row.isProcess == 0
        ? this.$notify({
            title: "",
            message: "该售后已解决",
            type: "warning"
          })
        : this.$axios
            .put(this.ip+"/after-sales/" + row.id, {
              isProcess: 0
            })
            .then(function(response) {
              console.log(response);
              _this.shgllb();
              _this.$message({
                message: "解决成功",
                type: "success"
              });
            })
            .catch(function(error) {
              console.log(error);
            });
    },
    //删除
    sc(row) {
      console.log(row);
      var that = this;
      this.$axios
        .delete(this.ip+"/after-sales/" + row.id)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.shgllb();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //请求售后管理列表
    shgllb() {
      var _this = this;
      _this.tableData = [];
      this.$axios
        .get(this.ip+"/after-sales", {
          params: {
            page: this.page,
            limit: 10,
            isProcess: this.isProcess,
            userid: this.zhqx.userId
          }
        })
        .then(function(response) {
          console.log(response);
          response.data.data.records.forEach((item, index) => {
            item.index = index;
            item.isProcess == 1
              ? (item.result = "未解决")
              : (item.result = "已解决");
            _this.tableData.push(item);
            _this.total = response.data.data.total;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },

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
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑
    bj(row) {
      this.dialogVisible = true;
      this.tcmz = "编辑售后";
      this.form = row;
      this.bjid = row.id;
    },

    //新增售后或者编辑售后确定
    onSubmit() {
      let that = this;
      this.form.id = this.zhqx.userId;
      this.form.isProcess = 1;
      console.log(this.form);
      this.tcmz == "新增售后"
        ? this.$axios
            .post(this.ip+"/after-sales", this.form)
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "新增售后成功",
                type: "success"
              });
              that.dialogVisible = false;

              that.shgllb();
            })
            .catch(function(error) {
              console.log(error);
            })
        : this.$axios
            .put(
              this.ip+"/after-sales/" + this.bjid,
              this.form
            )
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "编辑售后成功",
                type: "success"
              });
              that.dialogVisible = false;

              that.shgllb();
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
        console.log(state);
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) !=-1
        );
      };
    },
    handleSelect(val) {
      console.log(val);
    }
  }
};
</script>
<style scoped >
.shgl {
  padding: 20px;
}
.el-textarea {
  width: 150%;
}
</style>
