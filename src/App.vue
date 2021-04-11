<template>
  <div id="app">
    <el-container style="height: 920px; border: 1px solid #eee">
      <el-aside width="300px">
        <el-row style="height: 920px;" class="tac">
          <el-col>
            <el-row v-if="userid" class="user" type="flex" justify="center" align="middle">
              <el-col @click.native="toSetting()">
                <el-avatar class="head-pic"> {{username}} </el-avatar>
              </el-col>
            </el-row>
            <el-row v-else class="login" type="flex" justify="center" align="middle">
              <el-button @click="toLogin">请登录</el-button>
            </el-row>
            <el-menu>
              <el-menu-item v-for="(item, index) in app" :key="index" @click="routerJump(item.router)" :class="color">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main>
          <el-col>
            <router-link></router-link>
            <router-view @logout="reusername" @login="getUserid"></router-view>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      userid: this.$store.state.user.userid,
      usertype: this.$store.state.user.usertype,
      audit: this.$store.state.user.audit,
      router: '',
      color: false,
      app: []
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      var self = this;
      if (this.$store.state.user.userid == '') {
        self.getApp('',0);
      } else {
        this.userid = this.$store.state.user.userid
        axios.post('http://localhost:9091/ppbs/user/getUserById', {
          userid: this.userid
        }).then(function(res){
          self.usertype = res.data.usertype;
          self.username = res.data.username;
          self.audit = res.data.audit;
          self.getApp(res.data.usertype,res.data.audit);
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    },
    getApp(usertype,audit) {
      if (audit === 0) {
        usertype = null
      }
      var self = this;
      axios.post('http://localhost:9091/ppbs/app/getAppByType', {
        type: usertype
      }).then(function(res){
        self.app = res.data;
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    routerJump(router) {
      this.$router.push('/'+router)
      this.color = !this.color;
    },
    toLogin() {
      this.$router.push('/login')
    },
    toSetting() {
      this.$router.push('/setting')
    },
    getUserid() {
      this.getUser()
    },
    reusername() {
      this.userid= ''
      this.username = ''
      this.getApp('',0)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
.user,.login {
  height: 100px;
}
.color span{
  background: lightblue;
}
</style>
