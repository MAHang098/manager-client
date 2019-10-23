<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 搜索框 start -->
			<div class="demo-input-size">
				<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInput"  @keyup.enter.native="handleClick" clearable class="elInput"></el-input>
				<el-button  style="margin-left: 10px;" type="primary"  icon="el-icon-search"  @click="handleClick">搜索</el-button>
			</div>
			<!-- 搜索框 end -->

			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addNews">添加新闻</el-button>
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="newsId" label="ID" width="60"></el-table-column>
				<!--<Tinymce newsId='ID'></Tinymce>-->
				<!--<el-table-column prop="newsContent" label="新闻内容" width="340"></el-table-column>-->
				<el-table-column prop="newsImg" label="新闻大图" width="200">
					<!-- 显示图片 -->
					<template scope="scope">
						<img :src="scope.row.newsImg" width="180" height="80" class="head_pic" @click="handlePreview" />
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="scope.row.newsImg" alt="">
						</el-dialog>
					</template>
				</el-table-column>
				
				<el-table-column prop="newsQuote" label="新闻简介" ></el-table-column>
				<el-table-column prop="newsTitle" label="新闻标题"></el-table-column>
				<el-table-column label="新闻地址">
					<template slot-scope="scope">
						<a v-if="scope.row.url == ''" :href="scope.row.url"  target="_blank" class="buttonText" >
							{{scope.row.url}}
						</a>
						<a v-else :href="scope.row.url"  target="_blank" class="buttonText" >
							{{(scope.row.url.split('//'))[0] + '//' +  (scope.row.url.split('/'))[2] }}
						</a>
					</template>
				</el-table-column>

				<!-- 删除功能 -->
				<el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)" >编辑</el-button>
						<el-button v-if="row.status!='deleted'" size="mini" type="danger" icon="el-icon-delete"  @click="delNews(row)">删除</el-button>
					</template>
				</el-table-column>
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
	name: "complex-table",
	data() {
		return {
			dialogImageUrl: "",
			dialogVisible: false,
			newsType: "applet_news",
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			loading: true,
			centerDialogVisible: false,
			textarea2: "",
			textMap: {
				update: "Edit",
				create: "Create"
			},
			temp: {
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			},
			temp2: {
				newsId: "",
				newsContent: "",
				newsImg: "",
				newsQuote: "",
				newsTitle: "",
				newsTypeId: "",
				url: ""
			},
			newsContent: "",
			dialogStatus: "",
			dialogFormVisible: false,
			rules: {
				newsTitle: [
					{ required: true, message: "title is required", trigger: "blur" }
				]
			},
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
		// 键盘回车事件/搜索
		handleClick() {
			this.search = this.input1;
			this.getInfo();
		},
		
		// 修改每页条数
		handleSizeChange(val) {
			// console.log(`每页 ${val} 条`);
			this.pageSize = `${val}`;
			this.getInfo()
		},
		handlePreview(file) {
			console.log(file);
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 修改当前页
		handleCurrentChange(val) {
			// console.log(`当前页: ${val}`);
			this.pageIndex = `${val}`;
			this.getInfo()
		},
		getInfo() {
			const url = "https://www.zhongjubang.com/test/";
			
			var parmas = {
				newsType: this.newsType,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				search: this.search
			}
			this.Axios.post(url + "/controller/offcialweb/getoffcialwebnews", parmas)
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
		delNews(row) {
			this.$confirm("此操作将永久删除, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				const url = "http://www.zhongjubang.com/test/";

				this.Axios.post(url + "/admin/offcial/delnews", {
					newsId: row.newsId
				}).then(res => {
					if (res.status == 200) {
						this.$message.success('删除成功');
						this.centerDialogVisible = false
						this.pageIndex = 1;
						this.getInfo();
						this.currentPage2 = 1;
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
			}).catch(()=>{});
		},
		handleUpdate(row) {
			this.$router.push({
		        path:'/table/editNews',
		        query:{newsId:row.newsId}
	      	})
		},
		gotoCreate() {
			this.$router.replace('/table/inline-edit-table')
		},
		addNews() {
			this.$router.push({
		        path:'/table/addNews',
		        query:{newsType: '2'}
	      	})
		}
	}
};
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
