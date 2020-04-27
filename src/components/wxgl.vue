<template>
  <div>
    <div class="sspyh">
      <p>微信号或旺旺号搜索:</p>
      <el-input
        v-model="wxhww"
        placeholder="请输入内容"
        style="width: 300px;"
        @input="nrgb"
      ></el-input>
    </div>
    <div class="sspyh">
      <p>添加微信号:</p>
      <el-input
        v-model="tjdwxh"
        placeholder="请输入添加的微信号"
        style="width: 300px;"
      ></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="addwxh"></el-button>
    </div>
    <div class="hzp">
      <p>筛选类型:</p>
      <el-select v-model="sxlx" placeholder="请选择" @change="sxgbsj">
        <el-option
          v-for="item in sxlxs"
          :key="item.name"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <p>筛选日期:</p>
      <el-date-picker
        type="daterange"
        v-model="khrq"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="khrqgb"
      ></el-date-picker>
      <p style="margin-left:10px">所有客户人数:{{ wwsyrs }}人</p>
      <a :href="dc()" v-if="zhqx.roleName == '管理员'" style="margin-left:20px">
        <el-button type="primary" plain>导出筛选的客户</el-button>
      </a>
    </div>
    <el-drawer title="重复旺旺号详情" :visible.sync="drawer" direction="rtl">
      <bgmk
        style="width: 100%;height: 800px;width: ov;overflow: auto;"
        :datas="sjhzscfww"
        :tablecolumn="tablecolumncfww"
        sy="wm"
        :pagesize="1000"
      ></bgmk>
    </el-drawer>
    <bgmk
      :datas="sjhzs"
      :tablecolumn="tablecolumn"
      @ck="ck"
      @lr="lr"
      @hy="hywx"
      @wxsc="wxsc"
      :pagesize="7"
      sy="wm"
    ></bgmk>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%">
      <bgmk
        :datas="sjhzsww"
        :tablecolumn="tablecolumnkh"
        sy="lm"
        v-if="title == '查看客户'"
        @hy="hyww"
        @gbtjzt="gbtjzt"
        @sc="scww"
        :pagesize="7"
      ></bgmk>
      <div v-else>
        <div class="hzp" v-if="zhqx.roleName == '管理员'">
          <p>店铺名单：</p>
          <div v-for="(item, index) in dps">
            <el-tag
              type="success"
              @close="handleClose(item)"
              closable
              style="margin-left:10px"
              >{{ item.storeName }}</el-tag
            >
          </div>

          <el-input
            placeholder="请输入店铺"
            style="width:200px;margin-left:10px"
            v-model="srdp"
          ></el-input>
          <el-button type="primary" @click="adddp" style="margin-left:10px"
            >添加店铺</el-button
          >
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="手动录入" name="first" class="szp">
            <div class="hzp">
              <p>录入旺旺号名单：</p>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleCloseww(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ 添加旺旺号
              </el-button>
            </div>
            <div class="hzp">
              <p>店铺：</p>
              <el-select v-model="xzdp" placeholder="请选择">
                <el-option
                  v-for="item in dps"
                  :key="item.storeName"
                  :label="item.storeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="hzp">
              <p>添加状态：</p>
              <el-radio v-model="radio" label="1">已添加</el-radio>
              <el-radio v-model="radio" label="0">未添加</el-radio>
            </div>
            <el-button type="primary" @click="qdsdlr">手动录入</el-button>
          </el-tab-pane>
          <el-tab-pane label="表格录入" name="second" class="szp">
            <div class="hzp">
              <p>店铺：</p>
              <el-select v-model="xzdp" placeholder="请选择">
                <el-option
                  v-for="item in dps"
                  :key="item.storeName"
                  :label="item.storeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div class="hzp">
              <p>添加状态：</p>
              <el-radio v-model="radio" label="1">已添加</el-radio>
              <el-radio v-model="radio" label="0">未添加</el-radio>
            </div>
            <div class="hzp">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-change="gbdwj"
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </div>
            <el-button
              size="small"
              type="primary"
              style="margin-top:10px"
              @click="wjqdlr"
              >文件录入</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getqq, postqq, putqq, deleteqq } from "./serve";
import axios from "axios";
import bgmk from "../commonComponent/bgmk.vue";
import { Loading } from "element-ui";
export default {
  name: "wxgl",
  beforeMount() {},
  components: { bgmk },
  mounted() {
    this.wxlbqq();
    this.qqsywwrs();
  },
  computed: mapState(["ip", "zhqx"]),
  created() {},
  methods: {
    ...mapMutations({
      dlvuex: "dlvuex"
    }),
    //删选改变事件
    sxgbsj(val) {
      console.log(val);
      this.qqsywwrs();
    },
    //导出
    dc() {
      console.log(`${this.ip}/excel/exportWangWang?status=${this.sxlx}`);
      return `${this.ip}/excel/exportWangWang?status=${this.sxlx}`;
    },
    //客户日期改变
    khrqgb(val) {
      const [ks, js] = val;

      [this.ks, this.js] = val;
      console.log(this.ks);
      console.log(this.js);
      this.qqsywwrs();
    },
    //删除微信号
    wxsc(val) {
      console.log(val);
      if (this.zhqx.roleName == "管理员") {
        deleteqq(val["id"], "wechat-manager").then(val => {
          console.log(val);
          this.$message({
            message: "删除微信成功",
            type: "success"
          });
          this.qqsywwrs();
          this.wxlbqq();
        });
      } else {
        this.$message.error("该账号不是管理员");
      }
    },
    //添加微信号
    addwxh() {
      postqq(
        { userId: this.zhqx["userId"], wechatNo: this.tjdwxh },
        "wechat-manager"
      ).then(val => {
        console.log(val);
        this.$message({
          message: "添加微信成功",
          type: "success"
        });
        this.wxlbqq();
      });
    },
    //请求所有旺旺人数
    qqsywwrs() {
      getqq(
        { type: 0, beginTime: this.ks, endTime: this.js, status: this.sxlx },
        "wechat-manager/queryCount"
      ).then(({ data }) => {
        this.wwsyrs = data["data"];
      });
    },
    //搜索旺旺或者
    nrgb(val) {
      console.log(val);
      this.pageNoww = 1;
      this.wxhww = val;
      this.wxlbqq();
    },
    //删除旺旺
    async scww(val) {
      console.log(val);
      if (this.zhqx.roleName == "管理员") {
        await deleteqq(val.id, "wangwangs").then(res => {
          console.log(res);
          this.wwlbqq();
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.qqsywwrs();
        });
      } else {
        this.$message.error("该账户不是管理员，没有删除权限");
      }
    },
    //文件确定录入
    wjqdlr() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let _this = this;
      let formData = new FormData();
      //   formData.append("storeId", this.xzdp);
      //   formData.append("wechatId", this.wechatId);
      formData.append("file", this.xzdwj);
      axios({
        method: "post",
        url:
          this.ip +
          `/excel/createWangWang?storeId=${this.xzdp}&wechatId=${this.wechatId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(function(res) {
        console.log(res);
        _this.dialogVisible = false;
        _this.$message({
          message: "文件录入成功",
          type: "success"
        });

        loading.close();
        _this.qqsywwrs();
        _this.sjhzscfww = { total: 0, records: res["data"].data };
        res["data"].data.length != 0 ? (_this.drawer = true) : "";
      });
    },
    //改变添加状态请求旺旺
    gbtjzt(val) {
      this.status = val;
      this.pageNoww = 1;
      this.wwlbqq();
    },
    //表格上传的一系列方法
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    gbdwj(file, fileList) {
      this.xzdwj = file["raw"];
      console.log(file["raw"]);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //旺旺换页
    hyww(val) {
      console.log(val);
      this.pageNoww = val;
      this.wwlbqq();
    },
    //微信换页
    hywx(val) {
      console.log(val);
      this.pageNo = val;
      this.wxlbqq();
    },
    //确定手动录入
    async qdsdlr() {
      let res = await postqq(
        {
          wangwangs: this.dynamicTags,
          status: this.radio,
          storeId: this.xzdp,
          wechatId: this.wechatId
        },
        "wangwangs"
      );
      this.dialogVisible = false;
      this.$message({
        message: "手动录入成功",
        type: "success"
      });
      this.qqsywwrs();
      this.sjhzscfww = { total: 0, records: res["data"].data };
      res["data"].data.length != 0 ? (this.drawer = true) : "";

      console.log(res["data"].data);
    },
    //手动添加旺旺的一系列方法
    handleCloseww(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      console.log(this.dynamicTags);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
      console.log(this.dynamicTags);
    },
    //店铺请求
    dpqq() {
      getqq({}, "stores").then(
        ({
          data: {
            data: { records }
          }
        }) => {
          this.dps = records;
          console.log(records);
        }
      );
    },
    //删除店铺
    handleClose(tag) {
      console.log(tag);
      deleteqq(tag["id"], "stores").then(val => {
        console.log(val);
        this.dpqq();
      });
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //添加店铺
    adddp() {
      postqq({ storeName: this.srdp }, "stores").then(val => {
        console.log(val);
        this.dpqq();
      });

      this.srdp = "";
    },
    //添加旺旺
    // addww() {
    //   this.sdllbd.push("");
    //   this.sdllbd[this.sdllbd.length - 2] = this.srdww;
    //   this.srdww = "";
    //   console.log(this.sdllbd);
    // },
    //tab点击
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //查看客户
    ck(msg) {
      console.log(msg);
      this.title = "查看客户";
      this.dialogVisible = true;
      this.wechatId = msg["id"];
      this.wwlbqq();
    },
    //录入
    lr({ id }) {
      console.log(id);

      this.wechatId = id;
      this.title = "录入";
      this.dialogVisible = true;
      this.dpqq();
    },
    //开单微信列表
    wxlbqq() {
      getqq(
        {
          pageNo: this.pageNo,
          size: 7,
          wangwang: this.wxhww
          // userId: 1
        },
        "wechat-manager"
      ).then(
        ({
          data: {
            data: { records, total }
          }
        }) => {
          this.$nextTick(() => {
            this.sjhzs = { total: total, records: records };
          });
        }
      );
    },
    //旺旺客户列表请求
    wwlbqq() {
      getqq(
        {
          pageNo: this.pageNoww,
          pageSize: 7,
          wechatId: this.wechatId,
          status: this.status,
          wangwang: this.wxhww
        },
        "wechat-manager/getWangWangDetail"
      ).then(
        ({
          data: {
            data: { records, total }
          }
        }) => {
          records.forEach(item => {
            switch (item.status) {
              case 0:
                item.status = "未添加";
                break;
              case 1:
                item.status = "已添加";
                break;
            }
          });
          this.$nextTick(() => {
            this.sjhzsww = { total: total, records: records };
          });
        }
      );
    }
  },
  data() {
    return {
      ks: "", //开始时间
      js: "", //结束时间
      sxlxs: [
        { name: "已添加", value: 1 },
        { name: "未添加", value: 0 }
      ], //筛选的所有类型
      sxlx: "", //筛选到的类型
      sjhzscfww: "", //重复旺旺数据
      khrq: "", //客户日期
      drawer: false, //抽屉显示
      tjdwxh: "", //添加的微信号
      wwsyrs: "", //旺旺所有人数
      wxhww: "", //微信或者旺旺搜索
      xzdwj: "", //选择的文件
      status: "", //请求列表的旺旺状态
      fileList: [], //文件列表
      wechatId: "", //开单微信id
      dynamicTags: [], //手动录入旺旺号列表
      inputVisible: false,
      inputValue: "", //输入的旺旺号
      radio: "1", //添加状态
      xzdp: "", //选择的店铺
      dps: [], //店铺
      //   srdww: "", //输入的旺旺号
      srdp: "", //输入的店铺
      //   sdllbd: [""], //手动录入旺旺号列表
      title: "", //弹窗标题
      pageNo: 1, //微信列表page
      pageNoww: 1, //旺旺列表page
      dialogVisible: false,
      activeName: "first", //激活的
      sjhzs: {},
      sjhzsww: {}, //旺旺数据
      tablecolumn: {
        pt: [{ lable: "微信号", prop: "wechatNo" }],
        gj: [
          { name: "查看", method: "ck" },
          { name: "录入", method: "lr" },
          { name: "删除", method: "wxsc" }
        ]
      }, //微信列表表格模板
      tablecolumnkh: {
        pt: [
          { lable: "旺旺号", prop: "wangwang" },
          { lable: "店铺", prop: "storeName" },
          { lable: "状态", prop: "status" },
          { lable: "时间", prop: "addTime" }
        ],
        gj: [{ name: "删除", method: "sc" }]
      }, //旺旺列表模板
      tablecolumncfww: {
        pt: [
          { lable: "旺旺号", prop: "wangwang" },
          { lable: "店铺", prop: "storeName" },
          { lable: "微信号", prop: "wechatNo" }
        ]
      } ////重复旺旺列表模板
    };
  }
};
</script>

<style scope lang="scss">
@import "common.scss";
.hzp {
  @include flexa;
}
.szp {
  @include flexa(column, center, flex-start, wrap);
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  width: 130px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.sspyh {
  @include flexa;
}
</style>
