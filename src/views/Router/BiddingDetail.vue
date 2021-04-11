<template>
  <div>
    <h1>竞拍详情</h1>
    <el-row type="flex" justify="center">
      <el-col :span="12" class="order">
        项目名：{{orderForm.ordername}}
      </el-col>
      <el-col :span="12" class="order">
        技术描述：{{orderForm.technology}}
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12" class="order">
        竞拍发起时间：{{orderForm.date}}
      </el-col>
      <el-col :span="12" class="order">
        竞拍截至时间：{{orderForm.enddate}}
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12" class="order">
        起拍价：{{orderForm.minmoney}}
      </el-col>
      <el-col :span="12" class="order">
        文件下载：<el-button type="primary" @click="downloadFile()">下载{{}}</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="12" class="order" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);height: 80px;" >
        <div style="margin-top: 20px;">
          距离竞拍结束还剩下：
          <el-tag>{{day}}</el-tag>天
          <el-tag>{{hour}}</el-tag>小时
          <el-tag>{{minute}}</el-tag>分
          <el-tag>{{second}}</el-tag>秒
        </div>
      </el-col>
      <el-col :span="12" class="order" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);height: 80px;" >
        <div style="margin-top: 20px;">
          当前最高报价：
          <el-tag>{{orderForm.maxmoney}}</el-tag>元
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>申购方信息</span>
          </div>
          <div v-for="item in applicantInfo" :key="index" class="text item">
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方姓名：{{item.username}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方电话：{{item.telephone}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方邮箱：{{item.email}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方单位：{{item.company}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方单位地址：{{item.address}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col class="applicantInfo">
                申购方资格审核时间：{{item.date}}
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col>
                <el-button type="primary" @click="downloadFile(item.filename)">下载{{item.name}}</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>竞价方信息</span>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-table
          :data="tableData"
          style="width: 100%">
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
            label=竞拍时间>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-dialog
          title="报价"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
            <el-form-item label="报价" prop="money">
              <el-input maxlength="10" type="text" v-model="money"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addBidding">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
        </el-dialog>
      </el-col>
    </el-row>
    <el-button style="position: fixed;bottom: 60px;right: 50px; z-index: 100;" @click="offer" type="primary">报价</el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BiddingDetail",
  data() {
    return{
      orderid: this.$route.query.orderid,
      orderForm: {},
      applicantInfo: [],
      tableData: [],
      day: '',
      hour: '',
      minute: '',
      second: '',
      money: '',
      dialogVisible: false
    }
  },
  created() {
    this.getOrder();
    this.getApplicant();
    this.getOfferByOrderid();
  },
  mounted() {
    setInterval(this.time, 1000);
  },
  methods: {
    getOrder() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getOrderByOrderid',{
        orderid: self.orderid
      }).then(function(res){
        self.orderForm = res.data
        self.time();
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getApplicant() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/order/getApplicant',{
        orderid: self.orderid
      }).then(function(res){
        self.applicantInfo = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getOfferByOrderid() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/offer/getOfferByOrderid',{
        orderid: self.orderid
      }).then(function(res){
        self.tableData = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    downloadFile(filename) {
      window.location.href='http://localhost:9091/ppbs/set/downloadFile/' + filename;
    },
    time() {
      var nowtime = new Date();
      var date = new Date(this.orderForm.enddate).getTime() - nowtime.getTime();   //时间差的毫秒数
      this.day = Math.floor(date/(24*3600*1000));
      //计算出小时数
      var leave1 = date % (24*3600*1000)    //计算天数后剩余的毫秒数
      this.hour = Math.floor(leave1/(3600*1000))
      //计算相差分钟数
      var leave2 = leave1 % (3600*1000)        //计算小时数后剩余的毫秒数
      this.minute = Math.floor(leave2/(60*1000))
      //计算相差秒数
      var leave3 = leave2 % (60*1000)      //计算分钟数后剩余的毫秒数
      this.second = Math.round(leave3/1000)
      setInterval(this.time(), 1000);
    },
    offer() {
      this.dialogVisible = !this.dialogVisible
    },
    addBidding() {
      var self = this
      this.dialogVisible = !this.dialogVisible
      if (this.money <= this.orderForm.minmoney) {
        this.$message.error('报价不能低于起拍价');
      } else if (this.money < this.orderForm.maxmoney) {
        this.$confirm('报价低于最高价，你可能竞拍失败，还要继续报价吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('http://localhost:9091/ppbs/offer/addOffer',{
            orderid: self.orderid,
            userid: self.$store.state.user.userid,
            money: self.money,
            type: '0'
          }).then(function(res){
            if (res.data.success) {
              self.$message.success('报价成功');
              self.getOfferByOrderid();
            } else {
              self.$message.error(res.data.msg);
            }
          }).catch(function(err){
            self.$message.error(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消报价'
          });
        });
      } else {
        axios.post('http://localhost:9091/ppbs/offer/addOffer',{
          orderid: self.orderid,
          userid: self.$store.state.user.userid,
          money: self.money,
          type: '1'
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('报价成功');
            self.getOfferByOrderid();
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
.order {
  margin: 20px;
}
.applicantInfo {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 30px;
  margin: 5px;
}
</style>
