
<template>
    <el-container>
        <el-header class="m-el-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/product'}">产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>产品编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main v-loading="loading">
            <el-form
                label-position="right"
                label-width="100px"
                ref="productForm"
                :model="product">
                <el-row style="margin-bottom: 10px;">图片上传目前限制两张</el-row>
                <el-upload
                    style="margin-bottom: 20px;"
                    :limit="2"
                    action="/ba/product-create"
                    :headers="token"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :before-remove="imgRemove"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-exceed="limitMessage"
                    :file-list="productImgs">
                    <i class="el-icon-plus"></i>
                </el-upload>

                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" height="100%" :src="dialogImageUrl" alt="预览图片">
                </el-dialog>
                <el-form-item
                    prop="name"
                    :rules="productRules.name"
                    label="名称">
                    <el-input v-model="product.name"></el-input>
                </el-form-item>
                <el-form-item
                    prop="introduce"
                    label="产品介绍"
                    :rules="productRules.introduce"
                    >
                    <el-input type="textarea" v-model="product.introduce"></el-input>
                </el-form-item>
                <el-form-item
                    prop="product_stock"
                    label="产品货存"
                    :rules="productRules.product_stock"
                    >
                    <el-input auto-complete="off" type="tel" v-model.number="product.product_stock"></el-input>
                </el-form-item>
                <el-form-item
                    prop="product_price"
                    :rules="productRules.product_price"
                    label="产品价格">
                    <el-input auto-complete="off" type="tel" v-model.number="product.product_price"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit()">提交</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import {ajaxSetupCSRF} from './../../util/util.js';
export default {
    name: 'ProductEdit',
    created() {
        let me = this;
        me.id = me.$route.query.id;
        me.isCreate = !!me.$route.path.match('create');        
        me.imgNum = 0;
    },
    data() {
        let stockValidate = (rule, value, callback) => {
            if (!!value) {
                let tmpVal = value.toString();
                if (tmpVal.match(/[^0-9]/g)) {
                    callback(new Error('库存只能为整数'));
                }
                else if (tmpVal.indexOf('.') !== -1) {
                    callback(new Error('库存只能为整数'));
                }
                else {
                    callback();
                }
            }
            else {
                callback();
            }
        };
        return {
            // upload 的预览窗
            dialogImageUrl: '',
            dialogVisible: false,
            productImgs: [],
            imgNum: 0,
            id: null,
            fileArr: [],
            isCreate: false,
            api: '/ba/product-show-',
            updateApi: '/ba/product-update-',
            createApi: '/ba/product-create',
            deleteApi: '/ba/product-img-delete',
            item: {},
            loading: false,
            token: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            product: {
                name: null,
                img1: null,
                img2: null,
                introduce: null,
                'product_price': null,
                'product_stock': null
            },
            productRules: {
                name: [{required: true, message: '产品名称不能为空'}],
                introduce: [
                    {required: true, message: '产品介绍不能为空'}
                ],
                'product_price': [
                    {required: true, message: '产品价格不能为空'},
                    {type: 'number', message: '产品价格必须为数字值'}
                ],
                'product_stock': [
                    {validator: stockValidate, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        getProduct() {
            let me = this;
            let url = `${me.api}${me.id}`;
            me.$axios.get(url)
            .then(res => {
                me.product = res.data.data;
                me.product.product_price = parseFloat(me.product.product_price, 10);
                if (me.product.img1 && me.product.img1.indexOf('https') !== -1) {
                    me.productImgs.push({
                        name: '',
                        url: me.product.img1
                    });
                }
                if (me.product.img2 && me.product.img2.indexOf('https') !== -1) {
                    me.productImgs.push({
                        name: '',
                        url: me.product.img2
                    });
                }
            })
            .catch(error => {
                me.$message.error('数据请求失败');
            });
        },
        imgRemove(file, fileList) {
            let me = this;
            me.imgNum--;
        },
        limitMessage() {
            this.$message.error('上传图片限制两张');
        },
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('图片大小不能超过2MB!');
            }
            this.imgNum++;
            return isLt2M;
        },
        submit() {
            let me = this;
            me.$refs['productForm'].validate(valid => {
                if (valid) {
                    me.createProduct();
                } else {
                    this.$message.error('表单请填写完整');
                }
            });
        },
        uploadSuccess(res, file, fileList) {
            this.fileArr = fileList;
        },
        generateFormData() {
            let me = this;
            let form = new FormData();
            Object.keys(me.product).forEach(key => {
                if (key.indexOf('img') === -1) {
                    form.append(key, me.product[key]);
                }
            });

            if (me.fileArr.length > 0) {
                if (me.fileArr[0]) {
                    form.append('img1', me.fileArr[0].raw);
                }
                else {
                    form.append('img1', '');
                }
                if (me.fileArr[1]) {
                    form.append('img2', me.fileArr[1].raw);
                }
                else {
                    form.append('img2', '');
                }
            }
            return form;
        },
        createProduct() {
            let me = this;
            if (me.fileArr.length === 0) {
                me.$message.error('请上传至少一张图片');
                return;
            }
            let settings = {
                async: true,
                url: me.createApi,
                method: 'POST',
                processData: false,
                contentType: false,
                mimeType: 'multipart/form-data',
                data: me.generateFormData()
            };
            me.postRequest(settings);
        },
        updateProduct() {
            let me = this;
            let settings = {
                async: true,
                url: `${me.updateApi}${me.id}`,
                method: 'POST',
                processData: false,
                contentType: false,
                mimeType: 'multipart/form-data',
                data: me.generateFormData()
            };
            me.postRequest(settings);
        },
        postRequest(settings) {
            let me = this;
            me.loading = true;
            let msg = {
                message: '提交失败请重试',
                type: 'error'
            };
            ajaxSetupCSRF();
            $.ajax(settings)
            .done(res => {
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }
                if (res.error_msg === 'ok') {
                    msg = {
                        message: '提交成功',
                        type: 'success'
                    };
                    setTimeout(() => {
                        me.$router.push('/product');
                    }, 1000);
                }
                if (res.error_msg.match('invalid img')) {
                    msg.message = '图片异常，检查是否有两张图片';
                }
                me.loading = false;
                me.$message(msg);
            })
            .fail(() => {
                me.loading = false;
                me.$message(msg);
            });
        }
    }
};
</script>

<style lang='css'>
input[type="file"] {
    display: none;
}
.el-form {
    width: 500px;
}
.el-form textarea {
    height: 200px;
}
</style>
