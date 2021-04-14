<template>
  <div>
    <h1>评价</h1>
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
            prop="enddate"
            label="竞拍截至时间">
          </el-table-column>
          <el-table-column
            prop="username"
            label="供应商姓名">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="evaluate(scope.$index, scope.row)">评 价</el-button>
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
            <el-button type="success" @click="ev">评 价</el-button>
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
  name: "Evaluate",
  data() {
    return{
      tableData: [],
      orderForm: [],
      dialogVisible: false,
      orderid: '',
      msg: ''
    }
  },
  created() {
    this.getEvaluate();
  },
  methods: {
    getEvaluate() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getEvaluate', {
        committerid: self.$store.state.user.userid
      }).then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    evaluate(index,row) {
      this.dialogVisible = !this.dialogVisible
      this.orderid = row.orderid
    },
    ev() {
      this.dialogVisible = !this.dialogVisible
      var self = this
      axios.post('http://localhost:9091/ppbs/audit/AuditType5',{
        msg: this.msg,
        userid: this.$store.state.user.userid,
        orderid: this.orderid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('评价成功');
          self.getEvaluate();
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
