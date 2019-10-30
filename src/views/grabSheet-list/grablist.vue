<template>
	<div class="app-container">
		<div class="filter-container">
            <!-- <div class="demo-input-size">
				<el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="userId"  @keyup.enter.native="handleClick" clearable class="elInput" @clear="clearInput"></el-input>
				<el-button  style="margin-left: 10px;" type="primary"  icon="el-icon-search"  @click="handleClick">搜索</el-button>
			</div> -->

            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addGrab">添加抢单</el-button>
			<!--渲染数据 start-->
			<el-table :data="tableData" border style="width: 100%" class="taba" v-loading="loading" >
				<el-table-column prop="id" label="id" ></el-table-column>
				<el-table-column prop="contacts" label="联系人" ></el-table-column>
				<el-table-column prop="phone" label="手机"></el-table-column>
				<el-table-column prop="sex" label="性别" :formatter="sexStatus"></el-table-column>
				<el-table-column prop="shelfTime" label="上架时间"></el-table-column>
				<el-table-column prop="region" label="地区"></el-table-column>
				<el-table-column prop="budget" label="预算"></el-table-column>
				<el-table-column prop="apartment" label="户型"></el-table-column>
				<el-table-column prop="preOrderedProducts" label="预购产品"></el-table-column>
				<el-table-column prop="preorderTime" label="预购时间"></el-table-column>
                <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="editGrab(row)" >编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete"  @click="delGrab(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--渲染数据 end-->

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
import '../../../global.js'; //引入全局url
// import Tinymce from "/components/Tinymce"
// import Tinymce from 'components/Tinymce'
export default {
	name: "grabLists",
	data() {
		return {
            loading: true,
			pageIndex: 1,
			pageSize: 10,
			search: "",
			tableData: [],
			loading: true,
			pageTotal: 1,
            currentPage2: 1,
            userId: ''
		};
	},
	created() {
		
	},
	// 获取新闻数据
	mounted() {
		this.getInput();
		this.getInfo();
	},
	methods: {
        handleClick() {
            this.getInfo();
		},
		// 输入框点击清楚按钮
        clearInput() {
            this.search = this.searchInput;
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
		// 获取品牌列表
		getInfo() {

			let parmas = {
                userId: this.userId,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize,
			}
			this.loading = true;
			this.Axios.post(url + "/admin/applet/getgrabsheetlist", parmas)
				.then(res => {

					if (res.status == 200) {
						this.loading = false;
						const tableData = res.data.data.dataList;
						this.tableData = tableData;
						this.pageTotal = res.data.data.pageSize * res.data.data.totalPage;
					} else {
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
        sexStatus(row) {
            if(row.sex == 1) {
                return '男'
            } else {
                return '女'
            }
        },
        // 添加
       addGrab() {
           this.$router.replace('/grabList/editGrab');
       },
       // 修改
       editGrab(row) {
           this.$router.push({
		        path:'/grabList/editGrab',
		        query:{grabSheetId:row.id}
	      	})
       },
       // 删除
       delGrab(row) {
           this.$confirm("此操作将永久删除, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
                this.Axios.post(url + "/admin/applet/updateisdelstate",{id: row.id})
                    .then(res => {
                        if(res.data.code == 200) {
                            this.$message.success('删除成功');
                            this.pageIndex = 1;
                            this.getInfo();
                            this.currentPage2 = 1;
                        } else {
                            this.$message.error('删除失败')
                        }
                        // if(res.data.data.)
                    })
            }).catch(()=> {})
       },
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
