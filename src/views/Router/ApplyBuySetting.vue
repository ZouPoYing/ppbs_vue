<template>
  <div>
    <h1>我的申购单</h1>
    <el-row type="flex">
      <el-col :span="18" pull="8">
        <el-button
          size="mini"
          type="primary"
          @click="add">新增</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="date"
            label="申请时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ordername"
            label="项目名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="technology"
            label="技术描述">
          </el-table-column>
          <el-table-column
            prop="minmoney"
            label="起拍价">
          </el-table-column>
          <el-table-column
            prop="enddate"
            label="竞拍截至时间">
          </el-table-column>
          <el-table-column
            prop="name"
            label="文件名">
          </el-table-column>
          <el-table-column
            prop="state"
            label="审核状态">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
            <el-form-item label="项目名称" prop="ordername">
              <el-input maxlength="20" type="text" v-model="orderForm.ordername"></el-input>
            </el-form-item>
            <el-form-item label="技术描述" prop="technology">
              <el-input maxlength="100" type="areatext" v-model="orderForm.technology" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="起拍价" prop="minmoney">
              <el-input maxlength="18" type="text" v-model="orderForm.minmoney"></el-input>
            </el-form-item>
            <el-form-item label="截至时间" prop="enddate">
              <el-date-picker
                v-model="orderForm.enddate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
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
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="isAdd" type="primary" @click="addOrder">新 增</el-button>
            <el-button v-else type="primary" @click="modifyOrder">修 改</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ApplyBuySetting",
  data() {
    return{
      tableData: [],
      orderForm: [],
      dialogVisible: false,
      fileid: '',
      title: '',
      isAdd: true,
      orderid: ''
    }
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getOrder', {
        committerid: self.$store.state.user.userid
      }).then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    indexMethod(index) {
      return index + 1;
    },
    add() {
      this.dialogVisible = !this.dialogVisible
      this.title = '新增'
      this.orderForm = []
      this.isAdd = true
      this.fileid = ''
    },
    addOrder() {
      this.dialogVisible = !this.dialogVisible
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/addOrder', {
        ordername: self.orderForm.ordername,
        technology: self.orderForm.technology,
        minmoney: self.orderForm.minmoney,
        enddate: self.orderForm.enddate,
        fileid: self.fileid,
        committerid: self.$store.state.user.userid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('添加成功');
          self.getOrder();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    handleRemove() {
      this.$message.success('文件移除成功');
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
    handleDelete(index,row) {
      this.$message.error('不能删除申购单，请联系管理员');
    },
    handleEdit(index,row) {
      var self = this
      self.orderid = row.orderid
      if (row.state !== '退回') {
        this.$message.error('您只能在被退回的情况下才能修改申购单');
      } else {
        self.title = '修改'
        self.dialogVisible = !self.dialogVisible
        self.orderForm = row
        self.isAdd = false
        self.fileid = ''
      }
    },
    modifyOrder() {
      var self = this
      axios.post('http://localhost:9091/ppbs/order/modifyOrder', {
        ordername: self.orderForm.ordername,
        technology: self.orderForm.technology,
        minmoney: self.orderForm.minmoney,
        enddate: self.orderForm.enddate,
        fileid: self.fileid,
        committerid: self.$store.state.user.userid,
        orderid: self.orderid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('修改成功');
          self.getOrder();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    }
  }
}
</script>

<style scoped>

</style>
