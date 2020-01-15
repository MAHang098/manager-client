<template>

  <div class="tinymce-container">
    <el-form ref="formData" :rules="formRule" label-position="left" :model="formData" label-width="120px">
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form-item label="话题类型名" prop="talkThemeType">
            <el-input v-model="formData.talkThemeType" />
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
  name: 'EditTopicType',
  data() {
    return {
      formData: {},
      formRule: {
        talkThemeType: [{ required: true, message: '话题名', trigger: 'blur' }]
      },
      queryId: ''
    }
  },
  mounted() {
    const id = this.$route.query.id
    this.formData = {
      talkThemeType: this.$route.query.name
    }
    if (id) {
      this.queryId = id
    }
  },
  methods: {
    submitForm() {
      this.$refs['formData'].validate((valid) => {
        if (!valid) {
          this.$message.error('必填项不能为空!')
          return false
        }
        const params = this.formData
        // 编辑抢单
        if (this.queryId) {
          params.talkThemeTypeId = this.queryId
          this.Axios.post(url + 'controller/contentcontroller/updatetalkthemetype', params)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  	title: 'Success',
                  	message: '添加成功',
                  	type: 'success',
                  	duration: 1000
                })
                this.$router.push('./index')
              }
            })
        } else {
          // 添加抢单

          this.Axios.post(url + 'controller/contentcontroller/addtalkthemetype', params)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  	title: 'Success',
                  	message: '添加成功',
                  	type: 'success',
                  	duration: 1000
                })
                this.$router.push('./index')
              }
              // if(res.data.data.)
            })
        }
      })
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
