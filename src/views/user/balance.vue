<template>
	<div class="app-container">
		<div class="filter-container">
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="id" label="日志id"></el-table-column>
				<el-table-column prop="nickName" label="用户昵称" ></el-table-column>
				<el-table-column prop="phone" label="手机号" ></el-table-column>
				<el-table-column prop="balanceLog" label="日志" ></el-table-column>
				<el-table-column prop="balanceValue" label="日志值" ></el-table-column>
				<el-table-column prop="createTime" label="创建日期" ></el-table-column>
			</el-table>

			<!--分页 start-->
			<div class="block">
				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
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
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import https from "../../../https.js"; // 注意用自己的路径
// import Tinymce from "/components/Tinymce"
// import Tinymce from 'components/Tinymce'
export default {
	name: "balance",
	data() {
		return {
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			loading: true,
			// textarea2: "",
			// textMap: {
			// 	update: "Edit",
			// 	create: "Create"
			// },
			// temp: {
			// 	newsContent: "",
			// 	newsImg: "",
			// 	newsQuote: "",
			// 	newsTitle: "",
			// 	newsTypeId: "",
			// 	url: ""
			// },
			// temp2: {
			// 	newsId: "",
			// 	newsContent: "",
			// 	newsImg: "",
			// 	newsQuote: "",
			// 	newsTitle: "",
			// 	newsTypeId: "",
			// 	url: ""
			// },
			// newsContent: "",
			// dialogStatus: "",
			// dialogFormVisible: false,
			// rules: {
			// 	newsTitle: [
			// 		{ required: true, message: "title is required", trigger: "blur" }
			// 	]
			// },
			//   pageSize: [10, 20, 30]
			pageTotal: 1,
			currentPage2: 1,

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
		// 修改当前页
		handleCurrentChange(val) {
			// console.log(`当前页: ${val}`);
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		getInfo() {
			
			var parmas = {
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}
			this.loading = true;
			this.Axios.post(url + "/admin/applet/getalluserbalancelog", parmas)
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
		resetTemp() {
			this.temp = {
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			};
		},
		resetTemp2() {
			this.temp2 = {
				newsId: "",
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			};
		},
		handleCreate() {
			this.resetTemp();
			this.dialogStatus = "create";
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs["dataForm"].clearValidate();
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
