<template>
  <div>
    <h1>选择供应商</h1>
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
            prop="maxmoney"
            label="最低价">
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
            prop="action"
            label="操作"
            width="280">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="choiceBidders(scope.$index, scope.row)">供应商详情</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="downloadFile(scope.$index, scope.row)">下载文件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row v-if="isChoice" type="flex" justify="center"
            style="position: fixed;top: 200px;right: 400px;width: 1000px; z-index: 100;">
      <el-col :span="18" shadow="always">
        <el-table
          border="true"
          :data="Bidders"
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="username"
            label=申购方姓名>
          </el-table-column>
          <el-table-column
            prop="money"
            label="竞拍价">
          </el-table-column>
          <el-table-column
            prop="date"
            label=竞拍时间
            width="180">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            width="280">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="choice(scope.$index, scope.row)">选择供应商</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-dialog
          title="陈述选择理由"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择理由" prop="msg">
              <el-input maxlength="100" type="textarea" v-model="reasonMsg" show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="reason">发 送</el-button>
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
  name: "ChoiceSupplier",
  data() {
    return{
      tableData: [],
      Bidders: [],
      reasonMsg: '',
      orderid: '',
      supplierid: '',
      isChoice: false,
      dialogVisible: false
    }
  },
  created() {
    this.getMyTimeOutOrder();
  },
  methods: {
    getMyTimeOutOrder() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getMyTimeOutOrder', {
        userid: self.$store.state.user.userid
      }).then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    downloadFile(index,row) {
      if (row.filename==='无') {
        this.$message.error('无文件可下载');
      } else {
        window.location.href='http://localhost:9091/ppbs/set/downloadFile/' + row.filename;
      }
    },
    choiceBidders(index,row) {
      this.isChoice = !this.isChoice
      this.getOfferByOrderid(row.orderid);
      this.orderid = row.orderid;
    },
    getOfferByOrderid(orderid) {
      var self = this;
      axios.post('http://localhost:9091/ppbs/offer/queryOneOfferByOrderid',{
        orderid: orderid
      }).then(function(res){
        self.Bidders = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    choice(index,row) {
      this.supplierid = row.userid;
      var self = this;
      if (index===0) {
        axios.post('http://localhost:9091/ppbs/order/endOrder',{
          orderid: this.orderid,
          supplierid: this.supplierid
        }).then(function(res){
          if (res.data.success) {
            self.getMyTimeOutOrder();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialogVisible = false
        self.isChoice = false
      } else {
        self.dialogVisible = true
      }
    },
    reason() {
      var self = this
      axios.post('http://localhost:9091/ppbs/audit/addAudit3',{
        orderid: this.orderid,
        supplierid: this.supplierid,
        reason: this.reasonMsg,
        userid: this.$store.state.user.userid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('选择供应商成功');
          self.getMyTimeOutOrder();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
      self.dialogVisible = false
      self.isChoice = false
    }
  }
}
</script>

<style scoped>

</style>
