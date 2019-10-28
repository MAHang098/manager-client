<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 搜索框 start -->
			<div class="demo-input-size">
				<el-input placeholder="请输入姓名或手机" prefix-icon="el-icon-search" v-model="searchInput"  @keyup.enter.native="handleClick" clearable class="elInput"></el-input>
				<el-select v-model="stateValue" placeholder="审核状态" clearable @change="selectAudit(stateValue)">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
				</el-select>
				<el-button  style="margin-left: 10px;" type="primary"  icon="el-icon-search"  @click="handleClick">搜索</el-button>
			</div>
			<!-- 搜索框 end -->
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="tpRecommendId" label="id" width="140"></el-table-column>
				<el-table-column prop="name" label="客户姓名" width="140"></el-table-column>
				<el-table-column prop="tpRecommendPhone" label="客户手机" width="140"></el-table-column>
				
				<el-table-column prop="type" label="需求来源" width="140" :formatter="requireState"></el-table-column>
				<el-table-column prop="intention" label="客户欲购买的产品" width="140"></el-table-column>
				<el-table-column prop="nickname" label="用户姓名" min-width="140"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="140"></el-table-column>
				<el-table-column prop="state" label="审核状态" width="140" :formatter="auditState"></el-table-column>
                <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页 start-->
			<!--<el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>-->
			<div class="block">
                <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="100" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
			</div>
            <!-- 修改订单弹框  -->
			
			<el-dialog :visible.sync="dialogFormVisible">
				<el-form ref="dataForm" label-position="left" :model="temp" label-width="100px" style="width: 400px; margin-left:50px;">
					<el-form-item label="状态" prop="title">
						<!-- <el-input v-model="temp.state" /> -->
						<el-select v-model="temp.state" placeholder="请选择">
							<el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="返现金额" prop="title">
						<el-input v-model="temp.cost" />
					</el-form-item>
					
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="sendData()">确认</el-button>
				</div>
			</el-dialog>
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
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import https from "../../../https.js"; // 注意用自己的路径

export default {
	name: "Recommand",
	data() {
		return {
			loading: true,
			searchInput: '',
			states: [
				{
					value: '1',
					label: '待处理'
				},
				{
					value: '2',
					label: '处理中'
				},
				{
					value: '3',
					label: '有需求'
				},
				{
					value: '4',
					label: '无需求'
				},
				{
					value: '5',
					label: '签约成功'
				},
				{
					value: '6',
					label: '签约失败'
				}
			],
			options: [
				{
					value: '1',
					label: '待处理'
				}, 
				{
					value: '2',
					label: '处理中'
				}, 
				{
					value: '3',
					label: '有需求'
				}, 
				{
					value: '4',
					label: '无需求'
				}, 
				{
					value: '5',
					label: '签约成功'
				},
				{
					value: '6',
					label: '签约失败'
				}
			],
        	stateValue: '',
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			state: "",
			pageTotal: null,
            currentPage2: 1,
            tpRecommendId: '',
            dialogFormVisible: false,
            temp: {
				state: "",
				cost: ""
			},

		};
	},
	// 获取新闻数据
	mounted() {
		this.getInfo();
		this.getInput();
	},
	methods: {
		selectAudit(val) {
			this.stateValue = val;
			this.getInfo();
		},
		// 键盘回车事件/搜索
		handleClick() {
			this.search = this.searchInput;
			this.getInfo();
		},
		// 修改每页条数
		handleSizeChange(val) {
			// console.log(`每页 ${val} 条`);
			this.pageSize = `${val}`;
			this.getInfo()
		},
		// 修改当前页
		handleCurrentChange(val) {
			// console.log(`当前页: ${val}`);
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		auditState(row) {
			if(row.state == 1) {
				return '待处理'
			} else if(row.state == 2) {
				return '处理中'
			} else if(row.state == 3) {
				return '有需求'
			} else if(row.state == 4) {
				return '无需求'
			} else if(row.state == 5) {
				return '签约成功'
			} else {
				return '签约失败'
			}
		},
		requireState(row) {
			if(row.type == 1) {
				return '推荐客户'
			} else {
				return '推荐订单'
			}
		},
		getInfo() {
			var parmas = {
				state: this.stateValue,
				search: this.search,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.loading = true;
			this.Axios.post(url + "/admin/applet/getuserrecommendbystate", parmas)
				.then(res => {
					if (res.status == 200) {
						this.loading = false;
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
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
            this.tpRecommendId = row.tpRecommendId
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        sendData(){
			var parmas = {
				state: this.temp.state,
                tpRecommendId: this.tpRecommendId,
                cost: this.temp.cost
			}
			this.Axios.post(url + "admin/applet/updateuserrecommendstate", parmas)
				.then(res => {
					

					if (res.status == 200) {
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
        }
		
	}
};
</script>

<style>
	.block {
		margin-top: 20px;
	}
	.elInput {
		width: 180px;
		margin-bottom: 10px;
	}
</style>
