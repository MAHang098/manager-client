<template>
	<div class="app-container">
		<div class="filter-container">
			<!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addNews">添加新闻</el-button>-->
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<!--<el-table-column prop="newsId" label="ID" width="40"></el-table-column>-->
				<!--<Tinymce newsId='ID'></Tinymce>-->
				<el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
				<el-table-column prop="realName" label="真实名字" width="100"></el-table-column>
				<el-table-column prop="businessCardPic" label="名片照片" width="220">
					<template scope="scope">
						<img :src="scope.row.businessCardPic" width="100" height="150" class="head_pic" @click="handlePreview(scope.row)" />
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="昵称"></el-table-column>
				<el-table-column prop="companyName" label="公司名"> </el-table-column>
				<el-table-column prop="businessCardSubmitTime" label="提交时间"></el-table-column>
				<el-table-column prop="businessCardRewardStatus" label="奖励状态" :formatter="rewardState"></el-table-column>
				<el-table-column prop="businessCardCheckStatus" label="审核状态" :formatter="auditState"></el-table-column>
				<el-table-column label="状态修改" align="center" width="180" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>

		
			<!--分页 start-->
			<div class="block">

				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
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
import '../../../global.js'; //引入全局url
// import Tinymce from "/components/Tinymce"
// import Tinymce from 'components/Tinymce'
export default {
	name: "identityAudit",
	data() {
		return {
			dialogVisible: false,
			state: "",
			loading: true,
			states: [
				{
					value: '1',
					label: '待审核'
				},
				{
					value: '2',
					label: '已审核'
				},
				{
					value: '3',
					label: '审核不通过'
				}
			],
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			temp: {
				state: ""
			},
			dialogFormVisible: false,
			
			pageTotal: 1,
			currentPage2: 1,
			dialogImageUrl: ''
		};
	},
	// 获取新闻数据
	mounted() {
		this.getInfo();
		this.getInput();
	},
	methods: {
		// 修改每页条数
		handleSizeChange(val) {
			// console.log(`每页 ${val} 条`);
			this.pageSize = `${val}`;
			this.getInfo()
		},
		//放大图片
		handlePreview(row) {
			this.dialogImageUrl = row.businessCardPic;
			this.dialogVisible = true;
		},
		// 修改当前页
		handleCurrentChange(val) {
			// console.log(`当前页: ${val}`);
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		// 奖励状态
		rewardState(row) {
			return row.businessCardRewardStatus === '1' ? '已领取' : '未领取'
		},
		// 审核状态
		auditState(row) {
			if(row.businessCardCheckStatus == 1) {
				return '待审核'
			} else if(row.businessCardCheckStatus == 2) {
				return '已审核'
			} else {
				return '审核不通过'
			}
		},
		getInfo() {
			
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.Axios.post(url + "/admin/applet/getusernamecard", parmas)
				.then(res => {
					// console.log(res);
					// console.log(res.status);
					// console.log(res.data.data.dataList);
					// 

					if (res.status == 200) {
						this.loading = false;
						const tableData = res.data.data.dataList;
						//   console.log(tableData);
						this.tableData = tableData;
						//   console.log(tableData);
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;

					} else {
						console.log(res.code);
						if (res.code == 400) {
							console.log("请求异常");
						} else if (res.code == 401) {
							console.log("参数为空");
						} else if (res.code == 402) {
							console.log("对象已存在");
						} else if (res.code == 403) {
							console.log("电话号码已存在");
						} else if (res.code == 404) {
							console.log("对象不存在(查询对象时用)");
						} else if (res.code == 405) {
							console.log("短信、邮件、消息发送失败");
						} else if (res.code == 406) {
							console.log("预期相反最终结果");
						} else if (res.code == 407) {
							console.log("验证、认证失败");
						} else if (res.code == 408) {
							console.log("参数错误");
						} else if (res.code == 411) {
							console.log("数据为空||结果为空||对象为空 (查询结果数据时用)");
						} else if (res.code == 421) {
							console.log("token过期或者无效");
						} else if (res.code == 422) {
							console.log("系统错误");
						}
					}
				});
		},
		getInput() {
			const item = this.textarea2;
		},
		handleUpdate(row) {
            console.log(row.userId)
            this.userId = row.userId
            this.dialogFormVisible = true
            // this.$nextTick(() => {
            //     this.$refs['dataForm'].clearValidate()
            // })
		},
		sendData(){
            console.log(this.userId)
            console.log(this.temp.state)
            
			var parmas = {
				state: this.temp.state,
                userId: this.userId
			}
			this.Axios.post(url + "/admin/applet/updateusernamecardstate", parmas)
				.then(res => {
					// console.log(res);
					

					if (res.status == 200) {
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
						this.getInfo()

					} else {
						console.log(res.code);
						if (res.code == 400) {
							console.log("请求异常");
						} else if (res.code == 401) {
							console.log("参数为空");
						} else if (res.code == 402) {
							console.log("对象已存在");
						} else if (res.code == 403) {
							console.log("电话号码已存在");
						} else if (res.code == 404) {
							console.log("对象不存在(查询对象时用)");
						} else if (res.code == 405) {
							console.log("短信、邮件、消息发送失败");
						} else if (res.code == 406) {
							console.log("预期相反最终结果");
						} else if (res.code == 407) {
							console.log("验证、认证失败");
						} else if (res.code == 408) {
							console.log("参数错误");
						} else if (res.code == 411) {
							console.log("数据为空||结果为空||对象为空 (查询结果数据时用)");
						} else if (res.code == 421) {
							console.log("token过期或者无效");
						} else if (res.code == 422) {
							console.log("系统错误");
						}
					}
				});
        },
	
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
</style>
