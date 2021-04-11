<template>
  <div>
    <h1>注册</h1>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="用户类型" prop="usertype">
            <el-radio-group v-model="ruleForm.usertype">
              <el-radio label="1" border>申购用户</el-radio>
              <el-radio label="2" border>供应商用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-link @click="toLogin" :underline="false">立即登录</el-link>
            <el-link @click="toForgetPassword" :underline="false">忘记密码</el-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Regist",
  data () {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validateUsertype = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择用户类型'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        usertype: '1'
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        usertype: [
          { validator: validateUsertype, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      var self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('http://localhost:9091/ppbs/user/regist',{
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            usertype: this.ruleForm.usertype
          }).then(function (res) {
            if (res.data.success) {
              self.$message.success('登录成功，即将跳转登录界面');
              setTimeout(() => {
                self.$router.push('/login')
              }, 1000)
            } else {
              self.$message.error(res.data.msg);
            }
          }).catch(function(err){
            self.$message.error(err);
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    toLogin() {
      this.$router.push('/login')
    },
    toForgetPassword() {
      this.$router.push('/forgetPassword')
    }
  }
}
</script>

<style scoped>

</style>
