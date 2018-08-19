<template>
    <div class="wrapper">
        <div class="top-poster">
            <span>兑换礼品</span>
        </div>
        <div class="middle-form">
            <div class="form-group">
                <label>输入兑换码</label>
                <input type="text" class="form-control shadow" placeholder="请输入兑换码" v-model="form.code">
            </div>
            <div class="form-group">
                <label>输入验证码</label>
                <div class="form-inline-item">
                    <div class="left-input">
                        <input placeholder="请输入验证码" type="text" class="form-control shadow" v-model="form.captcha">
                    </div>
                    <div class="right-captcha">
                        <div>
                            <img :src="captchaImgUrl"  @click="refresh" alt="验证码" />
                        </div>
                        <div style="margin-top: 5px;">点击上图可刷新验证码</div>
                    </div>
                </div>
            </div>
            <div class="form-group" style="text-align: center;">
                <button type="submit" @click="captchaVerify" class="btn shadow">确认</button>
            </div>
        </div>
        <div class="bottom-bar"></div>
        <div v-show="tipMask" class="mask">
            <div class="mask-body mask-tip">
                <p>{{tipContent}}</p>
                <button class="btn" @click="callback">确认</button>
                <div class="close"  @click="tipMask = false">x</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CodeForm',
    created() {
        this.captchaImgUrl = this.api.captchaImg;
    },
    data() {
        return {
            callback: () => {},
            captchaImgUrl: '',
            tipMask: false,
            tipContent: '',
            api: {
                code: '/campaign/code/verify',
                captcha: '/campaign/captcha/verify',
                captchaImg: 'https://pajc.nurunci.com/campaign/captcha'
            },
            form: {
                code: '',
                captcha: ''
            }
        };
    },
    watch: {
        // 文字的大写设置
        'form.code': function(val) {
            val = val.toUpperCase();
            this.form.code = val;
        }
    },
    methods: {
        showAlert(msg, cbk) {
            let me = this;
            if (msg !== '') {
                this.tipMask = true;
                this.tipContent = msg;
            }
            if (cbk) {
                this.callback = cbk;
            }
            else {
                this.callback = () => {
                    me.tipMask = false;
                };
            }
        },
        refresh() {
            let freshCode = Math.floor(Math.random() * 10000).toString(36);
            this.captchaImgUrl = `${this.api.captchaImg}?refresh=${freshCode}`;
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
                }
                else {
                    me.showAlert('验证码错误，请点击刷新验证码后重试');
                }
            })
            .catch(error => {
                me.showAlert('验证异常，请重试');
            });
        },
        codeVerify() {
            let me = this;
            me.$axios.post(me.api.code, {
                captcha: me.form.captcha,
                code: me.form.code
            })
            .then(res => {
                if (res.data.error_msg === 'ok') {
                    me.showAlert('兑换成功', () => {
                        me.$router.push('/order');
                    });
                }
                else if (res.data.error_msg === 'date overdue') {
                    me.showAlert('兑换码不在有效兑换时间范围');
                }
                else if (res.data.error_msg === 'invalid openid') {
                    me.showAlert('微信授权异常请重新授权');
                }
                else if (res.data.error_msg === 'invalid code') {
                    me.showAlert('无效兑换码，请更换兑换码');
                }
                else {
                    me.showAlert('服务异常刷新重试');
                }
            })
            .catch(error => {
                me.showAlert('服务异常刷新重试');
            });
        }
    }
};
</script>
<style lang="scss">
.wrapper {
    background-image: url(./../../img/h5/header.png);
    background-position: center top;
    background-size: contain;
    background-repeat: no-repeat;
    .top-poster {
        height: 130px;
        line-height: 130px;
        text-align: center;
        font-size: 25px;
        color: #fff;
        font-weight: bold;
        span {
            border-bottom: 3px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 10px;
        }
    }
}
.middle-form {
    width: 600px;
    height: 300px;
    margin: 173px auto 0 auto;
    .form-group {
        float: left;
        width: 100%;
        margin-bottom: 80px;
        .left-input {
            width: 360px;
            height: 85px;
            float: left;
        }
        .right-captcha {
            width: 210px;
            height: 120px;
            float: right;
            color: #a6a6ad;
            font-size: 20px;
        }
    }
}

.bottom-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;
    height: 40px;
    width: 100%;
    background-color: #99694b;
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
                width: 30px;
                height: 30px;
                line-height: 30px;
                font-size: 50px; 
            }
        }
    }
</style>
