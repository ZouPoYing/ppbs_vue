<template>
  <div>
    <h1>竞价厅</h1>
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
            label="发起时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ordername"
            label="项目名"
            width="100">
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
            label="最高价">
          </el-table-column>
          <el-table-column
            prop="enddate"
            label="竞拍截至时间">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleView(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BiddingRoom",
  data() {
    return{
      tableData: [],
    }
  },
  created() {
    this.getBiddingList();
  },
  methods: {
    getBiddingList() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getBiddingList').then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    handleView(index,row) {
      this.$router.push({
        path: '/biddingDetail',
        query: {
          orderid: row.orderid
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
