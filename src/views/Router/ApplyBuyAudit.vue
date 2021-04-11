<template>
  <div>
    <h1>申购审核</h1>
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="ordername"
            label=项目名称
            width="100">
          </el-table-column>
          <el-table-column
            prop="username"
            label="申请人"
            width="100">
          </el-table-column>
          <el-table-column
            prop="technology"
            label=技术描述>
          </el-table-column>
          <el-table-column
            prop="minmoney"
            label="起拍价"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="文件名">
          </el-table-column>
          <el-table-column
            prop="date"
            label="申请时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="enddate"
            label="截至时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="state"
            label="审核状态"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="downloadFile(scope.$index, scope.row)">下载文件</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="audit(scope.$index, scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-dialog
          title="审核"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="审核意见" prop="msg">
              <el-input maxlength="100" type="textarea" v-model="msg" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="auditS">通 过</el-button>
            <el-button type="danger" @click="auditD">退 回</el-button>
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
  name: "ApplyBuyAudit",
  data() {
    return{
      tableData: [],
      dialogVisible: false,
      msg: '',
      auditid: '',
      orderid: ''
    }
  },
  created() {
    this.getAudit();
  },
  methods: {
    getAudit() {
      var self = this
      axios.post('http://localhost:9091/ppbs/order/queryAudit2ByAudittype',{
        audittype: '2',
        auditerid: this.$store.state.user.userid
      }).then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    downloadFile(index,row) {
      window.location.href='http://localhost:9091/ppbs/set/downloadFile/' + row.filename;
    },
    audit(index,row) {
      this.auditid = row.auditid
      this.orderid = row.orderid
      this.dialogVisible = !this.dialogVisible
    },
    auditS() {
      this.dialogVisible = false
      var self = this
      axios.post('http://localhost:9091/ppbs/audit/AuditType2',{
        msgtype: '1',
        msg: this.msg,
        auditid: this.auditid,
        auditerid: this.$store.state.user.userid,
        orderid: this.orderid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('审核成功');
          self.getAudit();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    auditD() {
      this.dialogVisible = false
      var self = this
      axios.post('http://localhost:9091/ppbs/audit/AuditType2',{
        msgtype: '0',
        msg: this.msg,
        auditid: this.auditid,
        auditerid: this.$store.state.user.userid,
        orderid: this.orderid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('审核成功');
          self.getAudit();
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
