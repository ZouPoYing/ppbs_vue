<template>
  <div>
    <h1>资格审核申请</h1>
    <div v-if="hasQuali">
      <el-row v-if="hasFile" type="flex" justify="center">
        <el-col :span="8">
          <h1>请先下载资格审核申请文件模板，仔细阅读并认真填写</h1>
          <el-button type="primary" @click="downloadFile">下载{{file.name}}</el-button>
        </el-col>
      </el-row>
      <el-row v-else type="flex" justify="center">
        <el-col :span="8">
          <h1>无法获取配置文件，请查看权限或联系管理员</h1>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="所属企业或单位" prop="company">
              <el-input minlength="1" maxlength="20" type="text" v-model="ruleForm.company"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="企业或单位地址" prop="address">
              <el-input minlength="1" maxlength="50" type="text" v-model="ruleForm.address"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="上传审核文件">
              <el-upload
                class="upload-demo"
                ref="upload"
                action
                :limit="1"
                :http-request="handleUploadForm"
                :on-remove="handleRemove"
                :auto-upload="true">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传word/pdf文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交审核</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <h1>您的申请正在审核或已通过审核，所以您不能再申请了</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "qualiAuditApply",
  data() {
    return{
      ruleForm: {
        company: '',
        address: ''
      },
      file: {
        filename: '',
        name: ''
      },
      hasFile: false,
      hasQuali: false,
      fileid: '',
      auditid: ''
    }
  },
  created() {
    this.checkAuditType1();
    this.getSetFile();
  },
  methods: {
    checkAuditType1() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/audit/checkAuditType1',{
        userid: this.$store.state.user.userid
      }).then(function(res){
        if (res.data.success) {
          self.hasQuali = true
          self.auditid = res.data.auditid
          self.ruleForm.company = res.data.company
          self.ruleForm.address = res.data.address
        } else {
          self.hasQuali = false
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getSetFile() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/set/getSetFile',{
        userid: this.$store.state.user.userid
      }).then(function(res){
        if (res.data.success) {
          self.file.filename = res.data.filename;
          self.file.name = res.data.name;
          self.hasFile = true
        } else {
          self.$message.error('获取配置文件错误，请联系管理员');
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    downloadFile() {
      window.location.href='http://localhost:9091/ppbs/set/downloadFile/' + this.file.filename;
    },
    handleRemove() {
      self.$message.success('文件移除成功');
    },
    handleUploadForm(param) {
      var self = this
      let formData = new FormData();
      formData.append('userid', this.$store.state.user.userid)
      formData.append('file', param.file)
      axios.post('http://localhost:9091/ppbs/set/upload',formData).then(function(res){
        self.$message.success('文件上传成功');
        self.fileid = res.data;
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    submitForm() {
      var self = this;
      if (self.auditid === '' || self.auditid === undefined) {
        axios.post('http://localhost:9091/ppbs/audit/addAuditType1', {
          audittype: '1',
          committerid: self.$store.state.user.userid,
          fileid: self.fileid,
          company: self.ruleForm.company,
          address: self.ruleForm.address
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('资格审核申请成功');
            self.checkAuditType1();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      } else {
        axios.post('http://localhost:9091/ppbs/audit/modifyAuditType1', {
          auditid: self.auditid,
          committerid: self.$store.state.user.userid,
          fileid: self.fileid,
          company: self.ruleForm.company,
          address: self.ruleForm.address
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('资格审核申请成功');
            self.checkAuditType1();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    }
  }
}
</script>

<style scoped>
.el-col {
  margin-bottom: 20px;
}
</style>
