<template>
	<div class="app-container">
		<div class="filter-container">
            <div class="demo-input-size">
				<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchInput"  @keyup.enter.native="handleClick" clearable class="elInput" @clear="clearInput"></el-input>
				<el-button  style="margin-left: 10px;" type="primary"  icon="el-icon-search"  @click="handleClick">搜索</el-button>
			</div>
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading">
				<el-table-column prop="tpUserId" label="ID"></el-table-column>
				<el-table-column prop="nickname" label="昵称" ></el-table-column>
				<el-table-column prop="head" label="用户头像" width="200">
                    <template scope="scope">
						<img :src="scope.row.head" width="120" height="80" class="head_pic" />
						<!-- <img :src="scope.row.head" width="120" height="80" class="head_pic" @click="handlePreview(scope.row)" />
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog> -->
					</template>
                </el-table-column>
				<el-table-column prop="phone" label="手机号" ></el-table-column>
				<el-table-column prop="realName" label="真实姓名" ></el-table-column>
				<el-table-column prop="level" label="用户级别" :formatter="userLevel"></el-table-column>
				<el-table-column prop="memberStatus" label="会员状态" :formatter="memberStatus"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" ></el-table-column>
			</el-table>
			<!--渲染数据 end-->

			<!--分页 start-->
			<div class="block">
				<el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="pageTotal">
				</el-pagination>
			</div>
			<!--分页 end-->
		</div>
	</div>
</template>


<script>
import { fetchList, fetchPv, createArticle, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import https from "../../../https.js"; // 注意用自己的路径
// import Tinymce from "/components/Tinymce"
// import Tinymce from 'components/Tinymce'
export default {
	name: "userAdmin",
	data() {
		return {
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			loading: true,
			pageTotal: 1,
            currentPage2: 1,
            searchInput: '',
            dialogImageUrl: '',
            dialogVisible: false
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
			this.search = this.searchInput;
			this.getInfo();
        },
        clearInput() {
            this.search = this.searchInput;
            // console.log(this.searchInput)
            // this.search = this.searchInput;
			this.getInfo();
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
			this.dialogImageUrl = row.head;
			this.dialogVisible = true;
		},
		getInfo() {
			var parmas = {
				newsType: this.newsType,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
				search: this.search
			}
			this.Axios.post(url + "/admin/applet/getuserlisttoadmin", parmas)
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
        userLevel(res) {
            if(res.level == 1) {
                return '青铜'
            } else if(res.level == 2) {
                return '铂金'
            } else if(res.level == 3) {
                return '黄金'
            } else {
                return '白金'
            }
        },
        memberStatus(res) {
            if(res.memberStatus == 1) {
                return '不是会员'
            } else {
                return '是会员'
            }
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
    .el-table .cell {
        text-align: center
    }
</style>
