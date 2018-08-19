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
                <hr>
                <el-row>
                    <input ref="img1" id="img1" type="file" @change="imgUploaded" />
                    <input ref="img2" id="img2" type="file" @change="imgUploaded" />
                    <el-col :span="12" class="simple-upload">
                        <p>图片一</p>
                        <el-row>
                            <img v-show="img.img1Load" :src="img.img1" @error="img.img1Load = false" @load="img.img1Load = true"/>
                            <p v-show="!img.img1Load">图片为空</p>
                        </el-row>
                        <el-row style="margin: 10px 0;">
                            <el-button @click="startImgUload(1)" type="primary">上传</el-button>
                            <el-button @click="removeImg(1)" type="danger">删除</el-button>
                        </el-row>   
                    </el-col>
                    <el-col :span="12" class="simple-upload">
                        <p>图片二</p>
                        <el-row>
                            <img v-show="img.img2Load" :src="img.img2" @error="img.img2Load = false" @load="img.img2Load = true"/>
                            <p v-show="!img.img2Load">图片为空</p>
                        </el-row>
                        <el-row style="margin: 10px 0;">
                            <el-button @click="startImgUload(2)" type="primary">上传</el-button>
                            <el-button @click="removeImg(2)" type="danger">删除</el-button>
                        </el-row>    
                    </el-col>
                </el-row>

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
        me.getProduct();
        me.imgNum = 2;
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
            img: {
                img1: '',
                img2: '',
                img1Load: false,
                img2Load: false,
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
        imgUploaded(e) {
            let targetDom = e.target;
            let idx = targetDom.id.replace('img', '');
            let file = targetDom.files;
            this.reads(file[0], idx);
        },
        removeImg(idx) {
            this.img[`img${idx}`] = '';
        },
        reads(fil, idx) {
            let me = this;
            let reader = new FileReader();
            reader.readAsDataURL(fil);
            reader.onload = () => {
                me.img[`img${idx}`] = reader.result;
            };
        },
        startImgUload(index) {
            this.$refs[`img${index}`].click();
        },
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
                me.img.img1 = me.product.img1;
                me.img.img2 = me.product.img2;
            })
            .catch(error => {
                me.$message.error('数据请求失败');
            });
        },
        limitMessage() {
            this.$message.error('上传图片限制两张');
        },
        deleteImg(deleteImgName) {
            let me = this;
            me.$axios.post(me.deleteApi, {
                id: me.product.id,
                'img_name': deleteImgName
            });
        },
        submit() {
            let me = this;
            me.$refs['productForm'].validate(valid => {
                if (valid) {
                    me.updateProduct();
                } else {
                    this.$message.error('请检查表单');
                }
            });
        },
        isValidImgUrl(url) {
            let result = false;
            if (!!url.match(/^https/g) || !!url.match(/^data/g)) {
                result = true;
            }
            return result;
        },
        generateFormData() {
            let me = this;
            let form = new FormData();
            let file = null;
            let imgUrl = '';
            Object.keys(me.product).forEach(key => {
                if (key.indexOf('img') === -1) {
                    form.append(key, me.product[key]);
                }
            });

            if (me.img.img1 === '') {
                // 原始有图片的情况 就删除图片
                if (me.isValidImgUrl(me.product.img1)) {
                    imgUrl = me.product.img1.split('productInfo/')[1];
                    me.deleteImg(imgUrl);
                }
            }
            else {
                file = this.$refs['img1'].files[0];
                form.append('img1', file);
            }

            if (me.img.img2 === '') {
                if (me.isValidImgUrl(me.product.img2)) {
                    imgUrl = me.product.img2.split('productInfo/')[1];
                    me.deleteImg(imgUrl);
                }
            }
            else {
                file = this.$refs['img2'].files[0];
                form.append('img2', file);
            }

            return form;
        },
        updateProduct() {
            let me = this;
            if (!me.isValidImgUrl(me.img.img1) && !me.isValidImgUrl(me.img.img2)) {
                this.$message.error('至少需要一张图片');
                return;
            }
            let formData = this.generateFormData();
            let settings = {
                async: true,
                url: `${me.updateApi}${me.id}`,
                method: 'POST',
                processData: false,
                contentType: false,
                mimeType: 'multipart/form-data',
                data: formData
            };
            me.postRequest(settings);
            
        },
        getImgState() {
            let tmp = [1,1];
            if (!this.product.img1.match(/^http/g)) {
                tmp[0] = 0;
            }
            if (!this.product.img2.match(/^http/g)) {
                tmp[1] = 0;
            }
            return tmp[0] + tmp[1];
        },
        getNullImg() {
            if (!this.product.img1.match(/^http/g)) {
                return 'img1';
            }
            if (!this.product.img2.match(/^http/g)) {
                return 'img2';
            }
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
                    msg.message = '检查是否有两张图片';
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
.simple-upload img {
    width: 200px;
    height: 200px;
}
</style>
