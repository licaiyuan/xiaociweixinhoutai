<template>
  <div class="bjmk">
    <el-form ref="form" :model="bjsj" label-width="100px" label-position="right">
      <el-row>
        <el-col :span="7" v-for="(item,index) in xhdsj" :key="index">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="bjsj[item.prop]"
              type="date"
              placeholder="选择日期"
              v-if="item.label=='下单日期'||item.label=='交单日期'||item.label=='下次联系'"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-autocomplete
              v-model="bjsj[item.prop]"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect()"
              v-else-if="item.label=='产品名称'"
            ></el-autocomplete>
            <el-select
              v-model="bjsj[item.prop]"
              placeholder="请选择"
              v-else-if="item.label=='跟单进度'||item.label=='跟单类型'"
            >
              <el-option
                v-for="item in item.option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="bjsj[item.prop]"
              v-else-if="item.label=='金额(元）'||item.label=='消耗时间(天)'||item.label=='数量'"
              min="0"
              type="number"
            ></el-input>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="bjsj[item.prop]"
              v-else-if="item.label=='备注'||item.label=='详情备注'"
              width="300"
            ></el-input>
            <el-input v-model="bjsj[item.prop]" v-else></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-button type="primary" @click="bjqd">确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ddglsj from "../components/bgsj";
export default {
  name: "bjmk",
  components: {},
  computed: mapState(['ip']),
  props: {
    bjsj: {},
    status: {}
  },
  data() {
    return {
      xhdsj: []
    };
  },
  mounted() {
    console.log(this.bjsj);
    this.status == "订单"
      ? ddglsj.ddglsj.forEach(item => {
          item.label != "序号" &&
          item.label != "客户旺旺" &&
          item.label != "业务员" &&
          item.label != "处理结果"
            ? this.xhdsj.push(item)
            : "";
        })
      : ddglsj.gdjlsj.forEach(item => {
          item.label != "联系人" ? this.xhdsj.push(item) : "";
        });
  },
  methods: {
    //编辑确定
    bjqd() {
      var that = this;
      delete this.bjsj.isProcess;
      this.status == "订单"
        ? this.$axios
            .put(
              this.ip+"/orders/" + this.bjsj.id,
              this.bjsj
            )
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "编辑成功",
                type: "success"
              });
              that.$emit("bjwc", {});
            })
            .catch(function(error) {
              console.log(error);
            })
        : this.$axios
            .put(
              this.ip+"/order-follows/" +
                this.bjsj.orderFollowId,
              this.bjsj
            )
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "编辑成功",
                type: "success"
              });
              that.$emit("bjwc", {});
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
          state.value.toLowerCase().indexOf(queryString.toLowerCase())!=-1
        );
      };
    },
    handleSelect(val) {
      console.log(val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss">
</style>
