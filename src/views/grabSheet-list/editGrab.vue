<template>
    
	<div  class="tinymce-container" >
		<el-form  ref="formData" :rules="formRule" label-position="left" :model="formData" label-width="120px">
            <el-row :gutter="100">
                <el-col :span="8">
                    <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="formData.contacts" />
                    </el-form-item>
                </el-col>
               <el-col :span="8">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="formData.phone" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="性别" prop="sex">
                        <!-- <el-input v-model="formData.sex" /> -->
                        <el-select v-model="formData.sex">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="8">
                    <el-form-item label="上架时间" prop="shelfTime">
                        <el-date-picker type="date" placeholder="选择上架时间" v-model="formData.shelfTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
               <el-col :span="8">
                    <el-form-item label="地区" prop="region">
                        <el-input v-model="formData.region" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预算" prop="budget">
                        <el-input v-model="formData.budget" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="8">
                    <el-form-item label="户型" prop="apartment">
                        <el-input v-model="formData.apartment" />
                    </el-form-item>
                </el-col>
               <el-col :span="8">
                    <el-form-item label="预购产品" prop="preOrderedProducts">
                        <el-input v-model="formData.preOrderedProducts" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="预购时间" prop="preorderTime">
                        <el-date-picker type="date" placeholder="选择预购时间" v-model="formData.preorderTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="100">
                <el-col :span="8">
                    <el-form-item label="意向品牌" prop="intentionBrand">
                        <el-input v-model="formData.intentionBrand" />
                    </el-form-item>
                </el-col>
               <el-col :span="8">
                    <el-form-item label="装修风格" prop="decorationStyle">
                        <el-input v-model="formData.decorationStyle" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="formData.remarks" />
                    </el-form-item>
                </el-col>
            </el-row>
		</el-form>
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="submitForm('formData')">提交</el-button>
	</div>
</template>

<script>

import '../../../global.js'; //引入全局url
export default {
	name: "addGrab",	
	data() {
		return {
			formData: {},
			formRule: {
				contacts: [{ required: true, message: '请输入联系人', trigger: 'blur' }] ,
				phone:  [{ required: true, message: '请输入手机号', trigger: 'blur' }],
				sex:  [{ required: true, message: '请输入性别', trigger: 'change' }],
				shelfTime:  [{ required: true, message: '请选择上架时间', trigger: 'blur' }],
				region:  [{ required: true, message: '请输入地区', trigger: 'blur' }],
				budget:  [{ required: true, message: '请输入预算', trigger: 'blur' }],
				apartment:  [{ required: true, message: '请输入户型', trigger: 'blur' }],
				preOrderedProducts:  [{ required: true, message: '请输入预购产品', trigger: 'blur' }],
				preorderTime:  [{  required: true, message: '请输入预购时间', trigger: 'blur' }],
				intentionBrand:  [{ required: true, message: '请输入意向品牌', trigger: 'blur' }],
				decorationStyle:  [{ required: true, message: '请输入装修风格', trigger: 'blur' }],
				remarks:  [{ required: true, message: '请输入备注', trigger: 'blur' }]
            },
            queryId: ''
		};
	},
	mounted() {
        let id = this.$route.query.grabSheetId;
        if(id) {
            this.queryId = id;
            this.fetchData(id);
        }
	},
	methods: {
        // 请求抢单详情
        fetchData(id) {
            this.Axios.post(url+"/admin/applet/getgrabsheetbyid",{grabSheetId: id})
                .then(res => {
                    if(res.data.code == 200) {
                        let data = res.data.data;
                        this.formData = {
                            contacts: data.contacts,
                            phone: data.phone,
                            sex: data.sex.toString(),
                            shelfTime: this.resolvingDate(data.shelfTime),
                            region: data.region,
                            budget: data.budget,
                            apartment: data.apartment,
                            preOrderedProducts: data.preOrderedProducts,
                            preorderTime: this.resolvingDate(data.preorderTime),
                            intentionBrand: data.intentionBrand,
                            decorationStyle: data.decorationStyle,
                            remarks: data.remarks
                        }
                    }
                    // if(res.data.data.)
                })
        },
        // 日期格式转换
        resolvingDate(date){
                //date是传入的时间
            let d = eval(new Date(date));
            let month = (d.getMonth() + 1) < 10 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1);
            let day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
            let hours = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
            let min = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
            let sec = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();

            let times=d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;
            
            if(typeof times == 'string' && this.queryId) {
                times=d.getFullYear() + '-' + month + '-' + day + ' 00:00:00' ;
                return  times;
            }
            return times;
        },

		submitForm() {
           
            this.$refs['formData'].validate((valid) => {
                if (!valid) {
                    this.$message.error('必填项不能为空!');
                    return false;
                }
                let params = this.formData;
               params.preorderTime = this.resolvingDate(this.formData.preorderTime);
                params.shelfTime = this.resolvingDate(this.formData.shelfTime);
                // 编辑抢单
                if(this.queryId) {
                    params.grabSheetId = this.queryId;
                    this.Axios.post(url + "/admin/applet/updategrabsheet",params)
                        .then(res => {
                            console.log(res.data.code);
                            if(res.data.code == 200) {
                                this.$notify({
                                  	title: 'Success',
                                  	message: '添加成功',
                                  	type: 'success',
                                  	duration: 1000
                                });
                                this.$router.push('./grabList');
                            }
                        })
                } else {
                    // 添加抢单
                    
                    this.Axios.post(url + "/admin/applet/addgrabsheet",params)
                        .then(res => {
                            if(res.data.code == 200) {
                                this.$notify({
                                  	title: 'Success',
                                  	message: '添加成功',
                                  	type: 'success',
                                  	duration: 1000
                                });
                                this.$router.push('./grabList');
                            }
                            // if(res.data.data.)
                        })
                }
            })
        },
        // 日期格式转换
        fromDate(date) {
            let d = new Date(date);
            let time = d
            return date
        },
	}
};
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