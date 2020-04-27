<template>
  <div class="xzkh">
    <el-form
      ref="form"
      :model="form"
      label-width="85px"
      label-position="right"
      v-if="tckbt == '新增客户' || tckbt == '高级搜索' || tckbt == '编辑客户'"
    >
      <el-row>
        <el-col
          :span="item.label == '地址' ? 20 : 7"
          v-for="(item, index) in items.sjcolumns"
          :key="index"
        >
          <el-form-item :label="item.label" label-width="100px">
            <el-select
              v-model="form[item.prop]"
              placeholder="请选择"
              v-if="item.label == '粉丝级别' || item.label == '拍单类型'"
            >
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <el-autocomplete
              v-model="form[item.prop]"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect()"
              v-else-if="item.label=='产品名称'"
            ></el-autocomplete>-->
            <div v-else-if="item.label == '性别'">
              <el-radio v-model="form[item.prop]" label="男">男</el-radio>
              <el-radio v-model="form[item.prop]" label="女">女</el-radio>
            </div>
            <div v-else-if="item.label == '地址'" class="dz">
              <Distpicker
                :province="form[item.prop].xtrysf"
                :city="form[item.prop].xtrycs"
                :area="form[item.prop].xtryqy"
                @province="onChangeProvince"
                @city="onChangeCity"
                @area="onChangearea"
              ></Distpicker>
              <el-input v-model="form.detail"></el-input>
            </div>
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-else-if="item.label == '购买时间'"
            ></el-date-picker>
            <el-input
              v-model="form[item.prop]"
              v-else-if="
                item.label == '购买金额(元)' ||
                  item.label == '消耗时间(天)' ||
                  item.label == '数量'
              "
              min="0"
              type="number"
            ></el-input>
            <el-input v-model="form[item.prop]" v-else></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="onSubmit" class="qdan">确定</el-button>
    </el-form>

    <el-form
      ref="gjslform"
      :model="tjddform"
      label-width="100px"
      label-position="right"
      v-else-if="tckbt == '订单'"
    >
      <el-row>
        <el-col :span="7" v-for="(item, index) in ddsj" :key="index">
          <el-form-item :label="item.label">
            <el-date-picker
              v-model="tjddform[item.prop]"
              type="date"
              placeholder="选择日期"
              v-if="item.label == '下单日期'"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <!-- <el-autocomplete
              v-model="tjddform[item.prop]"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect()"
              v-else-if="item.label=='产品名称'"
            ></el-autocomplete>-->
            <el-input
              v-model="tjddform[item.prop]"
              v-else-if="
                item.label == '金额(元）' ||
                  item.label == '消耗时间(天)' ||
                  item.label == '数量'
              "
              min="0"
              type="number"
            ></el-input>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="tjddform[item.prop]"
              v-else-if="item.label == '备注'"
              width="300"
            ></el-input>
            <el-select
              v-model="tjddform[item.prop]"
              placeholder="请选择"
              v-else-if="item.label == '拍货类型'"
            >
              <el-option
                v-for="item2 in item.options"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value"
              ></el-option>
            </el-select>
            <el-input v-model="tjddform[item.prop]" v-else></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-button type="primary" @click="tjdqqd" class="qdan">确定</el-button>
    </el-form>
    <div v-else class="xqcss">
      <el-row>
        <el-col :span="8" v-for="(item, index) in csxqdsja" :key="index">
          <p>{{ item.label }}：{{ item.value }}</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Distpicker from "v-distpicker";
import { mapState, mapMutations } from "vuex";
import sjcolumns from "./bgsj";
import { putqqdg } from "./serve";
export default {
  name: "xzkh",
  components: { Distpicker },
  props: {
    tckbt: {},
    userId: {},
    xqsj: "",
    nowTime: {},
    zh: {},
    form: {}
  },
  watch: {
    xqsj: {
      handler: function(val, oldVal) {
        console.log(val);
        // this.pdtckbt(this.tckbt);
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    csxqdsja: {
      handler: function(newVal, oldval) {
        console.log(newVal);
        // this.csxqdsja = newVal;
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }

    // tckbt(newVal, oldVal) {
    //   this.pdtckbt(newVal);
    // }
  },
  data() {
    return {
      // form: {},
      tjddform: {}, //添加订单表单
      ddsj: [], //订单头部
      gjslform: {
        wangwang: "",
        followTime: "",
        wechatNo: "",
        billing_person: ""
      },

      gjsl: [
        {
          label: "客户旺旺",
          prop: "wangwang"
        },
        {
          label: "跟单时间",
          prop: "followTime"
        },
        {
          label: "开单微信号",
          prop: "wechatNo"
        },
        {
          label: "开单人员",
          prop: "billing_person"
        }
      ],

      items: [],
      restaurants: [],

      timeout: null
    };
  },
  computed: mapState(["ip", "csxqdsja"]),
  mounted() {
    // sjcolumns.sjcolumns.forEach(item => {
    //   this.form[item.prop] = "";
    // });
    // this.pdtckbt(this.tckbt);

    console.log(this.csxqdsja);
    console.log(this.xqsj);

    this.items = sjcolumns;
    sjcolumns.ddglsj.forEach(item => {
      item.label != "序号" &&
      item.label !== "交单日期" &&
      item.label !== "客户旺旺" &&
      item.label !== "业务员" &&
      item.label !== "处理结果"
        ? this.ddsj.push(item)
        : "";
    });
    this.ddsj.unshift({
      prop: "useTime",
      label: "消耗时间(天)"
    });
    // this.cpxllb();
  },
  methods: {
    //判断弹出框标题是编辑还是新增
    pdtckbt(val) {
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
    onChangeProvince(data) {
      this.form.address.xtrysf = data.value;
    },
    onChangeCity(data) {
      this.form.address.xtrycs = data.value;
    },
    onChangearea(data) {
      console.log(data);
      this.form.address.xtryqy = data.value;
    },
    //添加订单确定
    tjdqqd() {
      var that = this;
      this.tjddform.salemanName = this.xqsj.billingPerson;
      this.tjddform.wangwang = this.xqsj.wangwang;
      this.tjddform.customerId = this.xqsj.id;
      this.tjddform.updateTime = this.nowTime;
      this.tjddform.userId = this.userId;

      this.$axios
        .post(this.ip + "/orders", this.tjddform)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "新增订单成功",
            type: "success"
          });
          that.$emit("closecp", {});
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //高级搜索确定
    gjssqd(val) {
      this.$emit("gjssqd", val);
      this.gjslform = {
        wangwang: "",
        followTime: "",
        wechatNo: "",
        billing_person: ""
      };
    },
    //请求产品下拉列表
    cpxllb() {
      var _this = this;
      this.$axios
        .get(this.ip + "/products", {
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
    //新增客户确定
    onSubmit() {
      var that = this;
      this.form.userId = this.userId;

      // this.form.userId = this.userId;
      this.form.billingPerson = this.zh;
      if (this.tckbt == "新增客户") {
        this.form.updateTime = this.nowTime;
        this.$axios
          .post(this.ip + "/customers", this.form)
          .then(function(response) {
            console.log(response);
            that.$message({
              message: "新增客户成功",
              type: "success"
            });
            that.$emit("closecp", {});
          })
          .catch(function(error) {
            console.log(error);
          });
        // 2;
        console.log(this.form);
      } else if (this.tckbt == "编辑客户") {
        putqqdg(this.form.id, "customers", this.form).then(val => {
          console.log(val);
          this.$message({
            message: "编辑客户成功",
            type: "success"
          });
          this.$emit("closecp", {});
        });
      } else {
        this.gjssqd(this.form);
      }
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
    }
    // createStateFilter(queryString) {
    //   return state => {
    //     console.log(state);
    //     return (
    //       state.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
    //     );
    //   };
    // },
    // handleSelect(val) {
    //   console.log(val);
    // }
  }
};
</script>

<style scoped>
.el-col-7 {
  margin-left: 17px;
}
.el-input {
  width: 80%;
}
.el-form-item__label {
  width: 100px !important;
}
.dz {
  display: flex;
}
.distpicker-address-wrapper {
  display: flex;
}
.qdan {
  margin-left: 41%;
  width: 184px;
}
</style>
