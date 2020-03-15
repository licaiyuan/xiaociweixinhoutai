<template>
  <div class="fz">
    <el-button type="primary" plain @click="tjzh">添加账号</el-button>
    <el-button type="primary" plain @click="tjbm">添加部门</el-button>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="  margin-top: 20px;">
      <el-tab-pane label="成员" name="first">
        <el-table :data="cybg" border style="width: 100%">
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="roleName" label="职位"></el-table-column>
          <el-table-column prop="groupName" label="部门"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="sccy(scope.row)" type="text" size="small">删除</el-button>
              <el-button type="text" size="small" @click="bjcy(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="cytoatl"
          @current-change="cyfy"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="部门" name="second">
        <el-table :data="bmbg" border style="width: 100%">
          <el-table-column prop="groupName" label="部门名字"></el-table-column>
          <el-table-column prop="groupLeader" label="部门主管"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="bmsc(scope.row)" type="text" size="small">删除</el-button>
              <el-button type="text" size="small" @click="bjbm(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination> -->
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="bta" :visible.sync="tjcya">
      <el-form :model="formInline" class="demo-form-inline" v-if="bta=='添加账号'||bta=='编辑账号'">
        <el-form-item label=" 账号">
          <el-input v-model="formInline.username" placeholder="请输入账号"></el-input>
        </el-form-item>
    
        <el-form-item label=" 密码">
          <el-input v-model="formInline.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label=" 职位">
          <el-select v-model="formInline.roleId" placeholder="请选择">
            <el-option
              v-for="item in qxzw"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 部门" v-if="formInline.roleId=='2'||formInline.roleId=='3'">
          <el-select v-model="formInline.groupId" placeholder="请选择">
            <el-option
              v-for="item in bmbg"
              :key="item.id"
              :label="item.groupName"
              :value="item.groupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="tjzhqd" v-if="bta=='添加账号'">添加账号确定</el-button>
          <el-button type="primary" plain @click="tjzhqd" v-else>编辑账号确定</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="bm" class="demo-form-inline" v-else-if="bta=='添加部门'||'编辑部门'">
        <el-form-item label=" 部门">
          <el-input v-model="bm.name" placeholder="部门"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" plain @click="tjbmqd" v-if="bta=='添加部门'">添加部门确定</el-button>
          <el-button type="primary" plain @click="bjbmqd" v-else>编辑部门确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { mapGetters } from "vuex";
export default {
  name: "fz",
  components: {},
  computed: mapState(["ip"]),
  data() {
    return {
      cytoatl: 0, //成员总条数
      url: "",
      bta: "",
      cybg: [],
      bmbg: [],
      activeName: "first",
      tjcya: false,
      // tjbma: false,
      formInline: {
        username: "",
    
        password: "",
        roleId: "",
        groupId: ""
      },
      groupId2: "",
      bm: {
        name: ""
      },
      cypage: 1,
      qxzw: [
        {
          value: 1,
          label: "管理员"
        },
        {
          value: 2,
          label: "主管"
        },
        {
          value: 3,
          label: "业务员"
        }
      ],
     
    };
  },
  mounted() {
    this.qqzhlb();
  },
  methods: {
    //成员分页
    cyfy(val) {
      // console.log(val);
      this.cypage = val;
      this.qqzhlb();
    },
    //请求成员列表
    qqzhlb() {
      var _this = this;
      this.$axios
        .get(this.ip+"/sys-users", {
          params: {
            limit: 10,
            page: this.cypage
          }
        })
        .then(function(response) {
          console.log(response);
          _this.cybg = response.data.data.records;
          _this.cytoatl = parseInt(response.data.data.total);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //编辑部门确定
    bjbmqd(row) {
      var that = this;
      this.$axios
        .put(this.ip+"/groups/" + this.groupId2, {
          groupName: this.bm.name
        })
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "编辑成功",
            type: "success"
          });
          that.tjcya = false;
          that.qqbmxl();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加部门确定
    tjbmqd() {
      var that = this;
      this.$axios
        .post(this.ip+"/groups", {
          groupName: this.bm.name
        })
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "添加部门成功",
            type: "success"
          });
          that.tjcya = false;
          that.qqbmxl()
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //添加账号确定
    tjzhqd() {
      var that = this;
      that.bta == "添加账号"
        ? this.$axios
            .post(this.ip+"/sys-users", this.formInline)
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "添加账号成功",
                type: "success"
              });
              that.qqzhlb();
              that.tjcya = false;
            })
            .catch(function(error) {
              console.log(error);
            }) 
    
        : this.$axios
            .put(this.ip+"/sys-users", this.formInline)
            .then(function(response) {
              console.log(response);
              that.$message({
                message: "编辑账号成功",
                type: "success"
              });
              that.tjcya = false;
            })
            .catch(function(error) {
              console.log(error);
            });
    },
    //部门编辑
    bjbm(row) {
      console.log(row);
      this.tjcya = true;
      this.bta = "编辑部门";
      this.bm.name = row.groupName;
      this.groupId2 = row.groupId;
    },
    //编辑成员
    bjcy(row) {
      console.log(row);
      this.tjcya = true;
      this.bta = "编辑账号";
      // this.formInline.username = row.username;
      // this.formInline.password = row.password;
      this.formInline = row;
      this.formInline.id = this.formInline.userId;
      this.qqbmxl();
    },
    //成员删除
    sccy(row) {
      console.log(row);
      this.cypage = 1;
      var that = this;
      this.$axios
        .delete(this.ip+"/sys-users/" + row.userId)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.qqzhlb();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //部门删除
    bmsc(row) {
      var that = this;
      this.$axios
        .delete(this.ip+"/groups/" + row.groupId)
        .then(function(response) {
          console.log(response);
          that.$message({
            message: "删除成功",
            type: "success"
          });
          // that.tjcya = false;
          that.qqbmxl();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //请求部门和成员列表
    handleClick(tab, event) {
      let _this = this;
      if (tab.label == "部门") {
        this.url =this.ip+ "/groups";
      } else {
        this.qqzhlb();
      }
      this.$axios
        .get(this.url, {})
        .then(function(response) {
          console.log(response);
          if (tab.label == "部门") {
            console.log(response.data.data);

            response.data.data.forEach(item => {
              var gzg = "";
              item.groupLeader.forEach((item2, index) => {
                if (item.groupLeader.length - 1 == index) {
                  gzg += item2;
                } else {
                  gzg += item2 + ",";
                }
              });
              item.groupLeader = gzg;
            });
            _this.bmbg = response.data.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //请求部门
    qqbmxl() {
      let _this = this;
      this.$axios
        .get(this.ip+"/groups", {})
        .then(function(response) {
          console.log(response);

          _this.bmbg = response.data.data;
          // console.log(_this.bmbg)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //添加账号按钮
    tjzh() {
      this.tjcya = true;
      this.bta = "添加账号";
      this.qqbmxl();
    },
    tjbm() {
      this.tjcya = true;
      this.bta = "添加部门";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss">
.demo-form-inline {
  .el-input {
    width: 60%;
  }
}
.el-pagination {
  margin: 0 auto;
  width: 20%;
  padding: 23px 5px;
}
</style>
