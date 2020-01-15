<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="demo-input-size">
        <el-input v-model="userId" placeholder="请输入内容" prefix-icon="el-icon-search" clearable class="elInput" @keyup.enter.native="handleClick" @clear="clearInput" />
        <el-button style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleClick">搜索</el-button>
      </div>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addTopic">添加话题类型</el-button>
      <!--渲染数据 start-->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" class="taba">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="talkThemeType" label="话题类型名" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column
          label="操作"
          align="center"
          width="240"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="editTopic(row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delTopic(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--渲染数据 end-->

      <!--分页 start-->
      <div class="block">
        <el-pagination
          background
          :current-page.sync="currentPage2"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!--分页 end-->
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import https from '../../../https.js' // 注意用自己的路径
export default {
  name: 'TopicTypeList',
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      search: '',
      tableData: [],
      loading: true,
      pageTotal: 1,
      currentPage2: 1,
      userId: ''
    }
  },
  // 获取新闻数据
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取话题列表
    getInfo() {
      const parmas = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.loading = true
      this.Axios.post(
        url + 'controller/contentcontroller/getTalkThemeTypeList',
        parmas
      ).then(res => {
        if (res.status == 200) {
          this.loading = false
          this.tableData = res.data.data.dataList
          this.pageTotal = res.data.data.pageSize * res.data.data.totalPage
        } else {
        }
      })
    },
    // 回车事件
    handleClick() {
      this.getInfo()
    },
    // 输入框点击清楚按钮
    clearInput() {
      this.search = this.searchInput
      this.getInfo()
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = `${val}`
      this.getInfo()
    },
    // 修改当前页
    handleCurrentChange(val) {
      this.pageIndex = `${val}`
      this.getInfo()
    },
    // 编辑话题类型
    editTopic(row) {
      this.$router.push({
        path: '/topicType/edit',
        query: { name: row.talkThemeType, id: row.id }
      })
    },
    // 添加话题类型
    addTopic() {
      this.$router.replace('/topicType/edit')
    },
    // 删除话题类型
    delTopic(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Axios.post(url + 'controller/contentcontroller/delupdatetalkthemetype', { talkThemeTypeId: row.id })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success('删除成功')
              this.pageIndex = 1
              this.getInfo()
              this.currentPage2 = 1
            } else {
              this.$message.error('删除失败')
            }
            // if(res.data.data.)
          })
      }).catch(() => {})
    }
  }
}
</script>

<style>
.block {
  margin-top: 20px;
}
.elInput {
  width: 160px;
  margin-bottom: 10px;
}
</style>
