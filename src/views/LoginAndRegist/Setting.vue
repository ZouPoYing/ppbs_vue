<template>
  <div>
    <h1>设置</h1>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input maxlength="10" :disabled="disabled" type="text" v-model="username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input maxlength="10" :disabled="disabled" type="text" v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input maxlength="16" minlength="4" :disabled="disabled" type="password" v-model="password"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="telephone">
            <el-input maxlength="11" :disabled="disabled" type="text" v-model="telephone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input maxlength="16" :disabled="disabled" type="text" v-model="email"></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="usertype">
            <el-input :disabled="true" type="text" v-model="usertype"></el-input>
          </el-form-item>
          <el-form-item label="是否审核" prop="audit">
            <el-input :disabled="true" type="text" v-model="audit"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="date">
            <el-input :disabled="true" type="text" v-model="date"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUser">修改</el-button>
            <el-button type="danger" @click="LogOut">退出登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "setting",
  data() {
    return {
      disabled: true,
      username: '',
      name: '',
      password: '',
      telephone: '',
      email: '',
      usertype: '',
      audit: '',
      date: ''
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/user/getUserById', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.username = res.data.username;
        self.name = res.data.name;
        self.password = res.data.password;
        self.telephone = res.data.telephone;
        self.email = res.data.email;
        self.usertype = res.data.usertype===0?'管理员':res.data.usertype===1?'申购用户':'供应商用户';
        self.audit = res.data.audit===0?'未审核':'已审核';
        self.date = res.data.date;
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    updateUser() {
      this.disabled = !this.disabled;
      if (!this.disabled) {
        return
      }
      var self = this
      axios.post('http://localhost:9091/ppbs/user/updateUser', {
        userid: this.$store.state.user.userid,
        username: self.username,
        name: self.name,
        password: self.password,
        telephone: self.telephone,
        email: self.email
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('修改成功');
          self.username = res.data.username;
          self.name = res.data.name;
          self.password = res.data.password;
          self.telephone = res.data.telephone;
          self.email = res.data.email;
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    LogOut() {
      this.$store.commit('clearUserCache');
      this.$emit('logout');
      this.$message.success('注销成功，即将跳转登录页');
      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
