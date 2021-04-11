<template>
  <div>
    <h1>资格审核配置</h1>
    <el-row type="flex">
      <el-col :span="18" pull="5">
        <el-button
          size="mini"
          type="primary"
          @click="add">新增</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="date"
            label="修改日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="usertype"
            label="用户类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="filename"
            label="文件名">
          </el-table-column>
          <el-table-column
            prop="px"
            label="排序">
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
          title="新增"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
            <el-form-item label="文件名" prop="filename">
              <el-input maxlength="10" type="text" v-model="setForm.filename"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="usertype">
              <el-radio-group v-model="setForm.usertype">
                <el-radio label="1" border>申购用户</el-radio>
                <el-radio label="2" border>供应商用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input maxlength="3" type="text" @blur="regSort" v-model="setForm.px"></el-input>
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
            <el-button type="primary" @click="addSet">确 定</el-button>
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
  name: "QualiAuditSetting",
  data() {
    return {
      tableData: [],
      setForm: [],
      dialogVisible: false,
      fileid: ''
    }
  },
  created() {
    this.getSet();
  },
  methods: {
    getSet() {
      var self = this
      axios.post('http://localhost:9091/ppbs/set/listSet').then(function(res){
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
    },
    addSet() {
      var self = this;
      axios.post('http://localhost:9091/ppbs/set/addSet', {
        filename: self.setForm.filename,
        usertype: self.setForm.usertype,
        px: self.setForm.px,
        fileid: self.fileid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('配置成功');
          self.getSet();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
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
    regSort() {
      var reg = /^[+]{0,1}(\d+)$/
      if (!reg.test(this.setForm.px)) {
        this.$message.error('排序格式不正确');
      }
    }
  }
}
</script>

<style scoped>

</style>
