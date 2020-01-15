<template>

  <div class="tinymce-container">
    <el-form ref="formData" :rules="formRule" label-position="left" :model="formData" label-width="120px">
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="话题名" prop="talkTheme">
            <el-input v-model="formData.talkTheme" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="话题类型" prop="talkThemeTypeId">
            <el-autocomplete
              v-model="formData.talkThemeType"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearchAsyncs"
              placeholder="搜索话题类型"
              @select="handleSelect"
            >
              <template slot-scope="props">
                <div class="name">
                  {{ props.item.talkThemeType }}
                </div>
              </template>
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="话题图片" prop="talkThemeImg">
            <el-upload
              action="http://www.zhongjubang.com/api/upload"
              list-type="picture-card"
              class="upload-demo"
              accept="image/jpeg,image/jpg,image/png"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :multiple="false"
              :on-success="uploadSuccess"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="submitForm('formData')">提交</el-button>
  </div>
</template>

<script>

import https from '../../../https.js'
export default {
  name: 'EditTopic',
  data() {
    return {
      formData: {},
      formRule: {
        idtalkTheme: [{ required: true, message: '话题名', trigger: 'blur' }]
      },
      queryId: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    }
  },
  created() {
    const id = this.$route.query.id
    console.log(id)
    if (id) {
      	this.queryId = id
     	  this.formData = {
        	talkTheme: this.$route.query.name,
        talkThemeType: this.$route.query.talkThemeType,
        talkThemeTypeId: this.$route.query.topicId
      }
    }
    console.log(this.$route.query.img)
    if (this.$route.query.img && this.$route.query.img != 'undefined') {
      const obj = {
        name: this.$route.query.img,
        url: 'http://www.zhongjubang.com/api/upload/' + this.$route.query.img
      }
      this.fileList.push(obj)
    }
  },
  methods: {

    querySearchAsyncs(queryString, cb) {
      const params = {
        pageIndex: 1,
        pageSize: 20,
        search: queryString
      }

      this.Axios.post(url + '/controller/contentcontroller/getTalkThemeTypeList', params)
        .then(res => {
          if (res.data.code == 200) {
            const data = res.data.data.dataList
            cb(data)
          }
        })
    },
    // 选择话题类型
    handleSelect(item) {
      this.formData = {
        talkThemeType: item.talkThemeType,
        talkThemeTypeId: item.id,
        talkTheme: this.formData.talkTheme
      }
    },
    submitForm() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          this.$message.error('必填项不能为空!')
          return false
        }
        const params = this.formData
        params.talkThemeImg = this.fileList.name
        // 编辑话题
        if (this.queryId) {
          params.talkThemeId = this.queryId
          this.Axios.post(url + 'controller/contentcontroller/updatetalktheme', params)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  	title: 'Success',
                  	message: '修改成功',
                  	type: 'success',
                  	duration: 1000
                })
                // this.$router.push({
                // 	path: './index'
                // });
                this.$router.push({
                  path: '/topic/index'
                })
                this.formData = {}
                this.fileList = []
                this.queryId = ''
              }
            })
        } else {
          // 添加话题

          this.Axios.post(url + 'controller/contentcontroller/addtalktheme', params)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  	title: 'Success',
                  	message: '添加成功',
                  	type: 'success',
                  	duration: 1000
                })
                // this.$router.push('./index');
                this.$router.push({
                  path: '/topic/index'
                })
                this.formData = {}
                this.fileList = []
              }
              // if(res.data.data.)
            })
        }
      })
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.fileList.name = response.data.fileName
      }
    },
    // 上传图片的限制
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一张图片')
    },
    // 移除图片提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 移除图片
    handleRemove(file) {
      this.fileList = []
    },
    // 预览图片
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

    .tinymce-container {
        background: #fff;
        box-sizing: border-box;
        padding: 15px 10px;
        margin: 10px;
    }
    .el-select {
        width: 100%;
    }
</style>
