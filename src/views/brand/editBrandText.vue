<template>
    
	<div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
		<el-form  ref="dataForm" :rules="rules" label-position="left" :model="temp" label-width="120px" style="margin-left:50px;">
			<el-form-item label="品牌详情" prop="brandDetails">
				<textarea :id="tinymceId" class="tinymce-textarea" />
				<div class="editor-custom-btn-container">
					<editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
				</div>
			</el-form-item>
			<el-form-item label="品牌图" prop="brandImg">
				<el-upload
				action="http://www.zhongjubang.com/api/upload"
				list-type="picture-card" class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				:on-preview="handlePreview"
				:on-remove="handleRemove" :before-remove="beforeRemove" :on-progress="getfileName" :multiple="false" :on-success="uploadSuccess" :limit="1" 
				:on-exceed="handleExceed" :file-list="fileList" :before-upload="beforeAvatarUpload">
				<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="fileImageUrl" alt="">
				</el-dialog>
			</el-form-item>
            <el-form-item label="品牌图标" prop="brandIcon">
				<el-upload
				action="http://www.zhongjubang.com/api/upload"
				list-type="picture-card" class="upload-demo" accept="image/jpeg,image/jpg,image/png" 
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemoveLog" :before-remove="beforeRemove" :on-progress="getlogfileName" :multiple="false" :on-success="uploadSuccessLog" :limit="1" 
				:on-exceed="handleExceed" :file-list="logfileList" :before-upload="beforeAvatarUpload">
				<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="filelogImageUrl" alt="">
				</el-dialog>
			</el-form-item>
			<el-form-item label="品牌喜欢人数" prop="brandLike">
				<el-input v-model="temp.brandLike" />
			</el-form-item>
			<el-form-item label="品牌人" prop="brandName">
				<el-input v-model="temp.brandName" />
			</el-form-item>
			<el-form-item label="品牌分成" prop="brandRoyalty">
				<el-input v-model="temp.brandRoyalty" />
			</el-form-item>
			<el-form-item label="品牌类型id" prop="brandTypeId">
				<el-select v-model="temp.brandTypeId" placeholder="请选择品牌类型"  :loading="brandLoading">
					<el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
            <el-form-item label="排序序号" prop="sn">
				<el-input v-model="temp.sn" />
			</el-form-item>
		</el-form>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="updateData">编辑品牌</el-button>
	</div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "../../components/Tinymce/components/EditorImage";
import plugins from "../../components/Tinymce/plugins";
import toolbar from "../../components/Tinymce/toolbar";
import load from "../../components/Tinymce/dynamicLoadScript";
// import { fetchList } from "@/api/article";
import axios from 'axios';

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
	"https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";

export default {
	name: "editBrandText",
	components: { editorImage },
	props: {
		id: {
			type: String,
			default: function() {
				return (
					"vue-tinymce-" +
					+new Date() +
					((Math.random() * 1000).toFixed(0) + "")
				);
			}
		},
		value: {
			type: String,
			default: ""
		},
		toolbar: {
			type: Array,
			required: false,
			default() {
				return [];
			}
		},
		menubar: {
			type: String,
			default: "file edit insert view format table"
		},
		height: {
			type: [Number, String],
			required: false,
			default: 360
		},
		width: {
			type: [Number, String],
			required: false,
			default: "auto"
		}
	},
	
	
	data() {
		return {
			fileList: [],  // 品牌图数组
			logfileList: [], // 品牌图标数组
			brandId: '',  // 品牌id
			hasChange: false,
			hasInit: false,
			tinymceId: this.id,
			fullscreen: false,
			
			languageTypeList: {
				en: "en",
				zh: "zh_CN",
				es: "es_MX",
				ja: "ja"
			},
			form: {
				newsTypeId: "",
				newsTitle: ""
			},
			fileImageUrl: "", // 品牌图
			filelogImageUrl: "", // 品牌图标
			dialogVisible: false,
			dialogFormVisible: false,
			
			temp: {
				brandIcon: "",
				brandImg: "",
				brandDetails: "",
				brandLike: "",
				brandName: "",
				brandRoyalty: "",
				brandTypeId: "",
				sn: ""
			},
			rules: {
				brandLike: [{ required: true, message: '请输入品牌喜欢人数', trigger: 'blur' }] ,
				brandName:  [{ required: true, message: '请输入品牌人', trigger: 'blur' }],
				brandRoyalty:  [{ required: true, message: '请输入品牌分成', trigger: 'blur' }],
				brandTypeId:  [{ required: true, message: '请输入品牌类型id', trigger: 'blur' }],
				sn:  [{ required: true, message: '请输入排序序号', trigger: 'blur' }]
			},
			brandLoading: false,
			options: []
		};
	},
	created() {
		this.dialogFormVisible = true;
		this.getParams();
	},
	computed: {
		containerWidth() {
			const width = this.width;
			if (/^[\d]+(\.[\d]+)?$/.test(width)) {
				// matches `100`, `'100'`
				return `${width}px`;
			}
			return width;
		}
	},
	watch: {
		value(val) {
			if (!this.hasChange && this.hasInit) {
				this.$nextTick(() =>
					window.tinymce.get(this.tinymceId).setContent(val || "")
				);
			}
		}
	},
	mounted() {
		this.init();
		this.getbrandtypelist();
	},
	activated() {
		if (window.tinymce) {
			this.initTinymce();
		}
		this.fileList = [];
		this.logfileList = [];
		// 获取编辑详情
		let detailData = this.$route.params.data;
		this.brandId = detailData.id;
		console.log(detailData)
		this.temp = {
			brandIcon: detailData.brandIcon,
			brandImg: detailData.brandImg,
			brandDetails: detailData.brandDetails,
			brandLike: detailData.brandLike,
			brandName: detailData.brandName,
			brandRoyalty: detailData.brandRoyalty,
			brandTypeId: detailData.brandTypeId,
			sn: detailData.sn
		}
		// 品牌图
		if( detailData.brandImg) {
			let fileObj = {
				name: detailData.brandImg.split("/").pop(),
				url: detailData.brandImg
			}
			this.fileList.push(fileObj);
		}
		//品牌图标
		if( detailData.brandIcon) {
			let logObj = {
				name: detailData.brandIcon.split("/").pop(),
				url: detailData.brandIcon
			}
			this.logfileList.push(logObj);
		}
	
	},
	deactivated() {
		this.destroyTinymce();
	},
	destroyed() {
		this.destroyTinymce();
	},
	methods: {
		// 搜索品牌类型id
		getbrandtypelist() {
			this.brandLoading = true;
			this.Axios.post(url + 'admin/applet/getbrandtypelist')
				.then(res => {
					// console.log(res);
					this.brandLoading = false;
					if(res.data.code == 200) {
						let data = res.data.data;
						this.options = data;
					}
				})
		},
		getParams: function() {
			// 取到路由带过来的参数
			var routerParams = this.$route.query.nameId
			// 将数据放在当前组件的数据内
			this.textareText = routerParams
			// this.temp.newsId = routerParams
		},
        // 品牌图
		getfileName(file, fileList) {
			// this.fileList.name = fileList.name
		},
        // 品牌图标
        getlogfileName(file, fileList) {
            // this.logfileList.name = fileList.name
        },
		// 品牌图上传成功
		uploadSuccess(response, file, fileList) {
			// console.log(file)
			if(response.code == 200) {
				let obj = {
					name: response.data.fileName,
					url:  response.data.fileUrl
				}
				this.fileList.push(obj);
				
			}
			// this.fileImageUrl = file.url;
			// console.log(this.fileList)
		},
		// 品牌图标上传成功
		uploadSuccessLog(response, file, fileList) {
			if(response.code == 200) {
				let obj = {
					name: response.data.fileName,
					url:  response.data.fileUrl
				}
				this.logfileList.push(obj)
			}
			this.filelogImageUrl = file.url;
		},
		handleChange(file, fileList) {
        	this.fileList = fileList.slice(-3);
      	},
		// 移除品牌图
		handleRemove(file, fileList) {
			this.fileList.forEach((item, index) => {
				if(file.name == this.fileList[index].name && file.url == this.fileList[index].url) {
					this.fileList.splice(index, 1);
				}
			})
		},
		// 移除品牌图标
		handleRemoveLog(file, fileList) {
			this.logfileList = [];
		},
		// 放大品牌图
		handlePreview(file) {
			this.fileImageUrl = file.url;
        	this.dialogVisible = true;
		},
		// 放大品牌图标
		handlePictureCardPreview(file) {
			this.filelogImageUrl = file.url;
        	this.dialogVisible = true;
		},
		handleExceed(files, fileList) {
			this.$message.warning('只能上传一张图片')
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${file.name}？`);
		},
		// 设置上传图片格式
		beforeAvatarUpload(file) {
			var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type)
			if (!testmsg) {
				this.$message.error('上传图片格式不对!')
				return
			}
		},
		init() {
			// dynamic load tinymce from cdn
			load(tinymceCDN, err => {
				if (err) {
					this.$message.error(err.message);
					return;
				}
				this.initTinymce();
			});
           
		},
		
		// 提交
		updateData() {
			this.$refs["dataForm"].validate(valid => {
				if (valid) {
					// this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
				
					
					// 判断新闻内容是否为空
					if(this.value == '') {
						 this.$message.error('请填写品牌详情');
						 return;
					}
					if(this.fileList.length == 0) {
						this.$message.error('请上传品牌图');
						return;
					}
					if(this.logfileList.length == 0) {
						this.$message.error('请上传品牌图标');
						return;
					}
                    var params = {
                        brandDetails: this.value,
                        brandIcon: this.logfileList[0].name,
						brandImg: this.fileList[0].name,
						brandLike: this.temp.brandLike,
						brandName: this.temp.brandName,
						brandRoyalty: this.temp.brandRoyalty,
						brandTypeId: this.temp.brandTypeId,
						sn: this.temp.sn,
						brandId: this.brandId
                    }
					this.dialogFormVisible = true;
					this.Axios.post(url + "/admin/applet/updatebrand",params)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message.success(res.data.message);
									this.$notify({
						              	title: 'Success',
						              	message: '修改成功',
						              	type: 'success',
						              	duration: 1000
						            });
                                    this.$router.push('./brand');

                            
                            }
                        });
				} else {
					console.log(this.dataForm);
				}
			});
		},
		initTinymce() {
			const _this = this;
			window.tinymce.init({
				selector: `#${this.tinymceId}`,
				language: this.languageTypeList["zh"],
				height: this.height,
				body_class: "panel-body ",
				object_resizing: false,
				toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
				menubar: this.menubar,
				plugins: plugins,
				end_container_on_empty_block: true,
				powerpaste_word_import: "clean",
				code_dialog_height: 450,
				code_dialog_width: 1000,
				advlist_bullet_styles: "square",
				advlist_number_styles: "default",
				imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
				default_link_target: "_blank",
				link_title: false,
				nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
				init_instance_callback: editor => {
					if (_this.value) {
						editor.setContent(_this.value);
					}
					_this.hasInit = true;
					editor.on("NodeChange Change KeyUp SetContent", () => {
						this.hasChange = true;
						this.$emit("input", editor.getContent());
					});
				},
				setup(editor) {
					editor.on("FullscreenStateChanged", e => {
						_this.fullscreen = e.state;
					});
				}
				// 整合七牛上传
				// images_dataimg_filter(img) {
				//   setTimeout(() => {
				//     const $image = $(img);
				//     $image.removeAttr('width');
				//     $image.removeAttr('height');
				//     if ($image[0].height && $image[0].width) {
				//       $image.attr('data-wscntype', 'image');
				//       $image.attr('data-wscnh', $image[0].height);
				//       $image.attr('data-wscnw', $image[0].width);
				//       $image.addClass('wscnph');
				//     }
				//   }, 0);
				//   return img
				// },
				// images_upload_handler(blobInfo, success, failure, progress) {
				//   progress(0);
				//   const token = _this.$store.getters.token;
				//   getToken(token).then(response => {
				//     const url = response.data.qiniu_url;
				//     const formData = new FormData();
				//     formData.append('token', response.data.qiniu_token);
				//     formData.append('key', response.data.qiniu_key);
				//     formData.append('file', blobInfo.blob(), url);
				//     upload(formData).then(() => {
				//       success(url);
				//       progress(100);
				//     })
				//   }).catch(err => {
				//     failure('出现未知问题，刷新页面，或者联系程序员')
				//     console.log(err);
				//   });
				// },
			});
		},
		destroyTinymce() {
			const tinymce = window.tinymce.get(this.tinymceId);
			if (this.fullscreen) {
				tinymce.execCommand("mceFullScreen");
			}

			if (tinymce) {
				tinymce.destroy();
			}
		},
		setContent(value) {
			window.tinymce.get(this.tinymceId).setContent(value);
		},
		getContent() {
			window.tinymce.get(this.tinymceId).getContent();
		},
		imageSuccessCBK(arr) {
			const _this = this;
			arr.forEach(v => {
				window.tinymce
					.get(_this.tinymceId)
					.insertContent(`<img class="wscnph" src="${v.url}" >`);
			});
		}
	}
};
</script>

<style scoped>
.tinymce-container {
	position: relative;
	line-height: normal;
}

.tinymce-container>>>.mce-fullscreen {
	z-index: 10000;
}

.tinymce-textarea {
	visibility: hidden;
	z-index: -1;
}

.editor-custom-btn-container {
	position: absolute;
	right: 4px;
	top: 4px;
	/*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
	z-index: 10000;
	position: fixed;
}

.editor-upload-btn {
	display: inline-block;
}
</style>