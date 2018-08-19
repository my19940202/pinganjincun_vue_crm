<template>
    <el-container>
        <el-header class="m-el-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>生成订单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main>
            <el-form
                :class="[showForm ? 'show' : 'hide']"
                ref="codeForm"
                label-position="right"
                label-width="80px"
                :model="redeem">
                <el-form-item
                    prop="code"
                    :rules="rules.parameter"
                    label="兑换码">
                    <el-input v-model="redeem.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitCode()">生成订单</el-button>
                </el-form-item>
            </el-form>

            <el-row :class="[!showForm ? 'show' : 'hide']">
                <el-row class="img-display" style="margin-bottom: 20px;">
                    <img v-if="imgs.img1" width="180" :src="imgs.img1" alt="" />
                    <img v-if="imgs.img2" width="180" :src="imgs.img2" alt="" />
                </el-row>
                <el-row style="margin: 20px 0;">
                    {{imgs.name}}
                </el-row>
                <el-form
                    ref="orderForm"
                    label-position="right"
                    label-width="150px"
                    :model="order">
                    <el-form-item
                        prop="name"
                        :rules="orderRules.name"
                        label="收件人姓名 (必填)">
                        <el-input v-model="order.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        prop="mobile"
                        :rules="orderRules.mobile"
                        label="手机号码 (必填)">
                        <el-input v-model.number="order.mobile"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="公司名称 (选填)">
                        <el-input v-model="order.company"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="省市区 (必填)">
                        <el-select
                            prop="province"
                            :rules="orderRules.city"
                            v-model="order.province" placeholder="省">
                            <el-option
                            v-for="item in addressObj.province"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            prop="city"
                            :rules="orderRules.city"
                            v-model="order.city"
                            style="margin-left: 10px;"
                            placeholder="市">
                            <el-option
                            v-for="item in addressObj.city"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select
                            v-model="order.district"
                            style="margin-left: 10px;"
                            placeholder="区">
                            <el-option
                            v-for="item in addressObj.district"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        prop="address"
                        :rules="orderRules.address"
                        label="详细地址 (必填)">
                        <el-input v-model="order.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitOrder()">提交订单</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import {districts} from './../../config/address.js';
export default {
    name: 'CreateOrder',
    created() {
    },
    watch: {
        'order.province': function(id) {
            this.addressObj.city = this.filterAddress(id);
            this.order.district = null;
            this.order.city = null;
        },
        'order.city': function(id) {
            this.addressObj.district = this.filterAddress(id);
            this.order.district = null;
        }
    },
    data() {
        let me = this;
        return {
            redeem: {
                code: null
            },
            order: {
                name: '',
                mobile: '',
                phone: '',
                company: '',
                address: '',
                city: '',
                province: '',
                district: ''
            },
            addressObj: {
                city: null,
                province: me.filterAddress(0),
                district: null
            },
            api: {
                submit: '/co/verify-Code',
                create: '/co/order-store',
                img: '/co/product-img'
            },
            imgs: {},
            showForm: true,
            rules: {
                code: [
                    {required: true, message: '兑换码不能为空'}
                ]
            },
            orderRules: {
                name: [
                    {required: true, message: '收件人不能为空'}
                ],
                mobile: [
                    {required: true, message: '手机号不能为空'},
                    {type: 'number', message: '手机号只能为数字'}
                ],
                address: [
                    {required: true, message: '收货地址不能为空'}
                ],
                city: [
                    {required: true, message: '不能为空'}
                ]
            }
        };
    },
    methods: {
        getIdName(id) {
            let result = '';
            if (id !== '') {
                for (let idx = 0; idx < districts.length; idx++) {
                    if (districts[idx].id === id) {
                        result = districts[idx].name;
                        break;
                    }
                }
            }
            return result;
        },
        filterAddress(pid) {
            let result = [];
            districts.forEach(element => {
                if (element.pId === pid) {
                    result.push(element);
                }
            });
            return result;
        },
        submitCode() {
            let me = this;
            me.$refs['codeForm'].validate(valid => {
                if (valid) {
                    me.verifyOrder();
                }
                else {
                    me.$message.error('表单请填写完整');
                }
            });
        },
        submitOrder() {
            let me = this;
            me.$refs['orderForm'].validate(valid => {
                if (valid) {
                    me.createOrder();
                }
                else {
                    me.$message.error('表单请填写完整');
                }
            });
        },
        createOrder() {
            let me = this;
            me.order.province = me.getIdName(me.order.province);
            me.order.city = me.getIdName(me.order.city);
            me.order.district = me.getIdName(me.order.district) || '-';
            me.$axios.post(me.api.create, me.order)
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    let msg = {
                        message: '提交成功',
                        type: 'success'
                    };
                    me.$message(msg);
                    setTimeout(() => {
                        me.$router.push('/order');
                    }, 1000);
                } else {
                    me.$message.error(res.data.error_msg);
                }
            })
            .catch(error => {
                me.$message.error('提交失败');
            });
        },
        verifyOrder() {
            let me = this;
            me.$axios.post(me.api.submit, me.redeem)
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    let msg = {
                        message: '兑换成功',
                        type: 'success'
                    };
                    me.$message(msg);
                    me.getProductImg();
                    setTimeout(() => {
                        me.showForm = false;
                    }, 1000);
                } else {
                    me.$message.error('兑换码异常(可能已兑换或不在兑换时间范围)');
                }
            })
            .catch(error => {
                me.$message.error('服务异常，刷新重试');
            });
        },
        getProductImg() {
            let me = this;
            me.$axios.get(me.api.img)
            .then(res => {
                if (res.data && res.data.img1) {
                    me.imgs = res.data;
                }
            });
        }

    }
};
</script>

<style>
.el-form {
    width: 500px;
}
.el-form .el-select {
    width: 100px;
}
</style>
