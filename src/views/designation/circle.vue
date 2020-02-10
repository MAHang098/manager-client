<template>
	<div class="app-container">
    
		<div class="filter-container">
			<!-- 搜索框 start -->
			<div class="demo-input-size">
				<el-select v-model="state" placeholder="请选择状态">
          <el-option 
            v-for="item in outState" 
            :key="item.value" 
            :label="item.label" 
            :value="item.value"
            v-model="item.value"
            @keyup.enter.native="handleClick">
          </el-option>
        </el-select>
				<el-button  style="margin-left: 10px;margin-bottom: 10px;" type="primary"  icon="el-icon-search"  @click="handleClick">搜索</el-button>
			</div>
			<!-- 搜索框 end -->
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="id" label="居圈达人id" width="100"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>

				<el-table-column prop="idCardJust" label="身份证正面" width="220">
					<template scope="scope">
						<img :src="scope.row.idCardJust" width="100" height="150" class="head_pic" @click="handlePreview(scope.row)" />
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</template>
				</el-table-column>
				<el-table-column prop="idCardBack" label="身份证反面" width="220">
					<template scope="scope">
						<img :src="scope.row.idCardBack" width="100" height="150" class="head_pic" @click="handlePreview1(scope.row)" />
						<el-dialog :visible.sync="dialogVisible1">
							<img width="100%" :src="dialogImageUrl1" alt="">
						</el-dialog>
					</template>
				</el-table-column>
				<el-table-column prop="pname" label="推荐人姓名" width="100"></el-table-column>
				<el-table-column prop="phone" label="手机号"> </el-table-column>
				<el-table-column prop="email" label="邮箱"></el-table-column>
				<el-table-column prop="gcircleNickeName" label="G圈用户名"></el-table-column>
				<el-table-column prop="state" label="审核状态" :formatter="auditState"></el-table-column>
				<el-table-column label="状态修改" align="center" width="180" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页 start-->
			<div class="block">

				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="100" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
			</div>
			<!--分页 end-->

			<!-- 修改实名状态  -->
			
			<el-dialog :visible.sync="dialogFormVisible">
				<el-form ref="dataForm" label-position="left" :model="temp" label-width="100px" style="width: 400px; margin-left:50px;">
					<el-form-item label="状态" prop="title">
						<!-- <el-input v-model="temp.state" /> -->
						<el-select v-model="temp.state" placeholder="请选择">
							<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="sendData()">确认</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>


<script>
import {
	fetchList,
	fetchPv,
	createArticle,
	updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import https from "../../../https.js"; // 注意用自己的路径
import axios from 'axios';
const defaultListQuery = {
    shopId: null,
    pageIndex: 1,
    pageSize: 5,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
export default {
	name: "Identify",
	data() {
		return {
      listQuery: Object.assign({}, defaultListQuery),
			state: "",
			goodsExamineIdchange: "",
			dialogVisible: false,
			dialogVisible1: false,
			dialogImageUrl: '',
			dialogImageUrl1: '',
			loading: true,
			dialogFormVisible: false,
			temp: {
				state: ""
			},
			loading: true,
			states: [
				{
					value: '1',
					label: '审核通过'
				},
				{
					value: '2',
					label: '审核失败	'
				}
			],
      
      outState: [
				{
					value: '0',
					label: '待审核'
				},
				{
					value: '1',
					label: '审核成功'
				},
				{
					value: '2',
					label: '审核失败'
				}
			],
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			goodsExamineId: "",
			goodsName: "",
			tableData: [],
			userId: '',
			
			pageTotal: null,
			currentPage2: 1,
    //   url: "https://www.zhongjubang.com/test/"
		};
	},
	// 获取新闻数据
	mounted() {
		this.getInfo();
		this.getInput();
	},
	methods: {
    // 键盘回车事件/搜索
		handleClick() {
			// this.search = this.searchInput;
      		console.log(this.state)
			this.getInfo();
		},
		// 输入框点击清楚按钮
    clearInput() {
      this.search = this.searchInput;
      // this.getInfo();
    },
		// 修改每页条数
		handleSizeChange(val) {
			this.pageSize = `${val}`;
			this.getInfo()
		},
		// 修改当前页
		handleCurrentChange(val) {
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		// 图片模态框的显示
		handlePreview(row) {
			this.dialogImageUrl = row.idCardJust;
			this.dialogVisible = true;
		},
		handlePreview1(row) {
			this.dialogImageUrl1 = row.idCardBack;
			this.dialogVisible1 = true;
		},
		// 审核状态
		auditState(row) {
			if(row.state == 0) {
				return '待审核'
			} else if(row.state == 1) {
				return '审核通过'
			} else {
				return '审核未通过'
			}
		},
		
    // 审核前的数据获取
		getInfo() {
			// this.state = this.state.toString()
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				state: this.state
			}
			this.loading = true;
			this.Axios.post(this.url + "controller/appadmincontroller/getappusergcircledarenlist", parmas)
				.then(res => {
					this.loading = false;
					if (res.data.code == 200) {
            // for(var i = 0;i<res.data.data.dataList.length;i++){
            //   res.data.data.dataList[i].topImgList = JSON.parse(res.data.data.dataList[i].topImgList)
            //   console.log(res.data.data.dataList[i].topImgList[0].url)
            // }
            // console.log(res.data.data.dataList)
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;

					} else {
							console.log("请求异常");
					}
				});
		},
    // 审核后的数据获取
		getchangeInfo() {
			
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.loading = true;
			this.Axios.post(this.url + "controller/appadmincontroller/getappusergcircledarenlist", parmas)
				.then(res => {
					this.loading = false;
					if (res.data.code == 200) {
            
            			console.log(res.data.data.dataList)
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;

					} else {
							console.log("请求异常");
					}
				});
		},
		handleUpdate(row) {
            if(row.state==0){
              console.log(row.id)
              this.goodsExamineIdchange = row.id
              this.dialogFormVisible = true
            }else{
              
              this.$notify({
                  message: '只有在等待审核状态才能修改!',
                  duration: 2000
              })
            }
            
            // this.$nextTick(() => {
            //     this.$refs['dataForm'].clearValidate()
            // })
		},
		sendData(){
            console.log(this.goodsExamineIdchange)
            console.log(this.temp.state)
            this.temp.state = parseInt(this.temp.state)
			var parmas = {
				state: this.temp.state,
        		appUserGcircleDarenId: this.goodsExamineIdchange
			}
			this.Axios.post(this.url + "controller/appadmincontroller/updateappusergcircledarenstate", parmas)
				.then(res => {
					

					if (res.data.code == 200) {
						// const tableData = res.data.data.dataList;
						// this.tableData = tableData;
                        // this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;
                        console.log('修改成功')
						this.dialogFormVisible = false
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
						this.getchangeInfo()

					} else {
						console.log("请求异常");
					}
				});
        },
		getInput() {
			const item = this.textarea2;
		},
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
  .elInput {
		width: 210px;
		margin-bottom: 10px;
	}
</style>
