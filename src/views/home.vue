<template>
  <div>
    <h1>首页</h1>
    <el-row v-if="this.$store.state.user.userid">
      <h2>欢迎您：{{username}}</h2>
      <h2>审核状态：{{audit}}</h2>
      <h2>用户类型：{{usertype}}</h2>
      <el-button v-if="audit==='未审核'" @click="toAudit">去审核</el-button>
    </el-row>
    <el-row v-else>
      <h2>暂无用户信息，请先登录</h2>
      <el-button @click="toLogin">请登录</el-button>
    </el-row>
    <el-row  type="flex" justify="center">
      <el-col :span="6" v-if="hasMsg1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资格审核申请消息</span>
          </div>
          <div v-for="item in msg1" :key="index" class="text item">
            <el-row type="flex">
              <el-col :span="20">
                <span>{{item.msg}}</span>
              </el-col>
              <el-col :span="4">
                <el-button @click="read(item.msgid)" size="mini" type="danger">已读</el-button>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="12">
                {{item.state}}
              </el-col>
              <el-col :span="12">
                {{item.date}}
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-if="hasMsg2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>申购审核消息</span>
          </div>
          <div v-for="item in msg2" :key="index" class="text item">
            <el-row type="flex">
              <el-col :span="20">
                <span>{{item.msg}}</span>
              </el-col>
              <el-col :span="4">
                <el-button @click="read(item.msgid)" size="mini" type="danger">已读</el-button>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="12">
                {{item.state}}
              </el-col>
              <el-col :span="12">
                {{item.date}}
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      username: this.$store.state.user.username,
      usertype: this.$store.state.user.usertype,
      audit: this.$store.state.user.audit,
      hasMsg1: true,
      hasMsg2: true,
      msg1: [],
      msg2: []
    }
  },
  created() {
    this.getUser();
    this.getMsg1();
    this.getMsg2();
  },
  methods: {
    getUser() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/user/getUserById', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.usertype = res.data.usertype===0?'管理员':res.data.usertype===1?'申购用户':'供应商用户';
        self.username = res.data.username;
        self.audit = res.data.audit===0?'未审核':'已审核';
        self.changeMsg1(res.data.usertype);
        self.changeMsg2(res.data.usertype);
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getMsg1() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/msg/queryMsg1', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.msg1 = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getMsg2() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/msg/queryMsg2', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.msg2 = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    read(msgid) {
      var self = this;
      axios.post('http://localhost:9091/ppbs/msg/UpdateMsgUse', {
        msgid: msgid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success("消息已读");
          self.getMsg1();
          self.getMsg2();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    changeMsg1(usertype) {
      if (usertype === 0) {
        this.hasMsg1 = false
      } else {
        this.hasMsg1 = true
      }
    },
    changeMsg2(usertype) {
      if (usertype === 1) {
        this.hasMsg2 = true
      } else {
        this.hasMsg2 = false
      }
    },
    toLogin() {
      this.$router.push('/login')
    },
    toAudit() {
      this.$router.push('/qualiAuditApply')
    }
  }
}
</script>

<style scoped>

</style>
