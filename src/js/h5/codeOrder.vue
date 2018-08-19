<template>
    <div class="wrapper">
        <div class="header">
            <div class="img">
                <img :src="imgs.img1 || imgs.img2" alt="产品图片">
            </div>
            <div class="text">
                <div>请您填写收货信息。产品稍后将<br/>尽快寄出，请您耐心等候</div>
                <div>(以下*为必填选项)</div>
            </div>
        </div>
        <div class="order-form">
            <div class="form-group">
                <label>*收件人姓名</label>
                <input type="text" class="form-control shadow" placeholder="请输入收件人姓名" v-model="form.name">
            </div>
            <div class="form-group">
                <label>*手机号码</label>
                <input type="tel" class="form-control shadow" placeholder="请输入手机号码" v-model="form.mobile">
            </div>
            <div class="form-group">
                <label>座机号码</label>
                <input type="text" class="form-control shadow" placeholder="请输入座机号码" v-model="form.phone">
            </div>
            <div class="form-group">
                <label>*省市区</label>
                <div class="form-inline">
                    <select
                        placeholder="请选择"
                        class="custom-select custom-select-lg mb-3"
                        @change="provinceChange"  v-model="form.province">
                        <option
                            v-for="item in addressObj.province"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">{{item.name}}</option>
                    </select>
                    <select
                        placeholder="请选择"
                        class="custom-select custom-select-lg mb-3" @change="cityChange" v-model="form.city">
                        <option
                            v-for="item in addressObj.city"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">{{item.name}}</option>
                    </select>
                    <select
                        placeholder="请选择"
                        class="custom-select custom-select-lg mb-3" v-model="form.district">
                        <option
                            v-for="item in addressObj.district"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">{{item.name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>公司名称</label>
                <input type="text" class="form-control shadow" placeholder="请输入公司名称" v-model="form.company">
            </div>
            <div class="form-group">
                <label>*收货地址</label>
                <input type="text" class="form-control shadow" placeholder="请输入收货地址" v-model="form.address">
            </div>
            <div class="form-group" style="text-align: center;">
                <button type="submit" @click="submitOrder" class="btn shadow">确认</button>
            </div>
        </div>
        <div v-show="showMask" class="mask">
            <div class="mask-body">
                <div class="title">请确认收货信息</div>
                <div class="content">
                    <p>收件人姓名: {{formData.name}}</p>
                    <p>手机号码: {{formData.mobile}}</p>
                    <p>座机号码: {{formData.phone}}</p>
                    <p>省市区: {{formData.province}} {{formData.city}} {{formData.district}}</p>
                    <p>公司名称: {{formData.company}}</p>
                    <p>收货地址: {{formData.address}}</p>
                </div>
                <div class="btns">
                    <button type="button" class="btn btn-sm" @click="showMask=false;">取消</button>
                    <button type="button" class="btn btn-sm" @click="orderRequest">确认</button>
                </div>
            </div>
        </div>
        <div v-show="tipMask" class="mask">
            <div class="mask-body mask-tip">
                <p>{{tipContent}}</p>
                <button class="btn" @click="tipMask = false">确认</button>
                <div class="close"  @click="tipMask = false">x</div>
            </div>
        </div>
    </div>
</template>

<script>
import {districts} from './../config/address.js';
import {Modal} from './Modal.vue';
export default {
    name: 'CodeForm',
    created() {
        this.getProductImg();
        this.getAddress();
    },
    data() {
        let me = this;
        return {
            tipMask: false,
            tipContent: '',
            pageLoading: true,
            formData: {},
            showMask: false,
            imgs: {},
            api: {
                img: '/campaign/product/img',
                address: '/campaign/user/address',
                create: '/campaign/order/create'
            },
            addressObj: {
                // 初始值设置
                city: [{id: -1, name: '请选择'}],
                province: me.filterAddress(0),
                district: [{id: -1, name: '请选择'}]
            },
            form: {
                name: '',
                mobile: '',
                phone: '',
                company: '',
                address: '',
                city: '-1',
                province: '-1',
                district: '-1'
            }
        };
    },
    methods: {
        provinceChange() {
            if (!this.pageLoading) {
                this.form.district = null;
                this.form.city = null;
            }
            this.addressObj.city = this.filterAddress(this.form.province);

        },
        cityChange() {
            if (!this.pageLoading) {
                this.form.district = null;
            }
            this.addressObj.district = this.filterAddress(this.form.city);
        },
        showAlert(msg) {
            this.tipMask = true;
            this.tipContent = msg;
        },
        getNameById(id) {
            let result = '-';
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
        getIdByName(name) {
            let result = -1;
            if (name !== '') {
                for (let idx = 0; idx < districts.length; idx++) {
                    if (districts[idx].name === name) {
                        result = districts[idx].id;
                        break;
                    }
                }
            }
            return result;
        },
        getAddress() {
            let me = this;
            me.$axios.get(me.api.address)
            .then(res => {
                // res.data = {
                //     id: 0
                // }
                if (res.data && res.data.address !== ''
                    && res.data.province !== '') {
                    me.form = res.data.data;
                    me.form.province = me.getIdByName(me.form.province);
                    // 特殊情况处理 直辖市id找错的情况
                    if (me.form.province > 600008300) {
                        me.form.province = me.form.province % 10;
                    }
                    me.addressObj.city = this.filterAddress(this.form.province);
                    me.form.city = me.getIdByName(me.form.city);
                    me.addressObj.district = this.filterAddress(this.form.city);
                    me.form.district = me.getIdByName(me.form.district);
                    setTimeout(() => {
                        me.pageLoading = false;
                    }, 1000);
                } else {
                    me.pageLoading = false;
                }
            })
            .catch(error => {
                me.pageLoading = false;
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
        },
        filterAddress(pid) {
            let result = [{id: -1, name: '请选择'}];
            districts.forEach(element => {
                if (element.pId === pid) {
                    result.push(element);
                }
            });
            return result;
        },
        captchaVerify() {
            let me = this;
            // code 先通过再去submit
            me.$axios.post(me.api.captcha, {
                captcha: me.form.captcha
            })
            .then(res => {
                if (res.data.error_msg === 'ok') {
                    me.codeVerify();
                } else {
                    me.showAlert('验证码错误请重试');
                }
            })
            .catch(error => {
                me.showAlert('验证异常，请重试');
            });
        },
        submitOrder() {
            let me = this;
            let valid = false;
            // 表单错误提示
            if (me.form.name === '') {
                me.showAlert('请补充收件人姓名')
                return;
            }
            if (me.form.mobile === '') {
                me.showAlert('请补充手机号码');
                return;
            }
            if (!(/^((1[3-8][0-9])+\d{8})$/).test(me.form.mobile)) {
                me.showAlert('手机号码格式不正确');
                return;
            }
            if (me.form.mobile.length !== 11) {
                me.showAlert('手机号码格式不正确');
                return;
            }
            if (me.form.province === '') {
                me.showAlert('请选择省市区');
                return;
            }
            if (me.form.address === '') {
                me.showAlert('收货地址不能为空');
                return;
            }
            // 深拷贝
            me.formData = JSON.parse(JSON.stringify(me.form));
            me.formData.province = me.getNameById(me.form.province);
            me.formData.city = me.getNameById(me.form.city);
            me.formData.district = me.getNameById(me.form.district);
            me.showMask = true;
        },
        orderRequest() {
            let me = this;
            let msg = '';
            me.$axios.post(me.api.create, me.formData)
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    me.$router.push('/success');
                } else {
                    if (res.data.error_msg === 'invalid openid') {
                        msg = '微信授权异常';
                    }
                    if (res.data.error_msg === 'invalid redeem_id') {
                        msg = '兑换码异常';
                    }
                    me.showAlert(msg);
                }
            })
            .catch(error => {
                me.showAlert('提交失败');
            });
        }
    }
};
</script>
<style lang="scss">
.wrapper {
    display: block!important;
    background-image: none;
    .header {
        width: 100%;
        height: 260px;
        background: #ea5404;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        .img {
            width: 150px;
            height: 150px;
            margin: 50px 0 0 50px;
            background: #fff;
            flex-grow: 0;
            img {
                width: 150px;
                height: 150px;
            }
        }
        .text {
            margin: 50px 0 0 20px;
            height: 150px;
            flex-grow: 1;
            color: #fff;
            div {
                width: 360px;
            }
            div:first-child {
                margin-top: 30px;
                font-size: 25px;
                border-bottom: 3px solid rgba(255, 255, 255, 0.3);
                padding-bottom: 10px;
            }
            div:last-child {
                padding-top: 10px;
                font-size: 18px;
            }
        }
    }
    .order-form {
        width: 600px;
        margin: 0 auto;
    }
    .form-group:first-child {
        margin-top: 30px;
    }
    .form-group {
        margin-bottom: 30px;
    }
    .form-inline {
        select {
            width: 190px;
            height: 80px;
            margin-right: 15px;
            background: url("./../../img/h5/arrow.png") no-repeat scroll right center #fff !important;

        }
        select:last-child {
            margin-right: 0px;
        }
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        .mask-body {
            width: 450px;
            padding: 50px 25px 25px 25px;
            font-size: 25px;
            height: auto;
            color: #717171;
            background-color: #d2d2d2;
            border-radius: 20px;
            .title {
                font-size: 36px;
                text-align: center;
            }
            .content {
                padding: 30px 50px;
            }
            .btns {
                text-align: center;
                button {
                    border-radius: 10px;
                    width: 180px;
                }
            }
        }
        .mask-tip {
            position: relative;
            padding: 80px 25px;
            text-align: center;
            color: #97694F;
            .btn {
                margin-top: 80px;
            }
            .close {
                position: absolute;
                color: #ea5404;
                top: 20px;
                right: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                font-size: 50px; 
            }
        }
    }
}
</style>
