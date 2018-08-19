<template>
    <div class="wrapper">
        <div class="top-poster">
            <span>查询订单</span>
        </div>
        <div class="middle-form">
            <div class="title">订单详情</div>
            <div class="detail">
                <div class="detail-header">
                    <div class="item-img">
                        <img :src="detail.product_img" alt="产品图片">
                    </div>
                    <div class="item-text">
                        <div>商品名称：{{detail.product_name}} </div>
                        <br/><br/>
                        <div>
                            订单单号：{{detail.order_no}}
                        </div>
                    </div>
                </div>
                <div class="detail-body">
                    <p><span>收件人姓名:</span>{{detail.name}}</p>
                    <p><span>收货地址:</span>{{detail.address}}</p>
                    <p><span>手机号码:</span>{{detail.mobile}}</p>
                    <p><span>订单日期:</span>{{detail.order_date}}</p>
                    <p><span>订单状态:</span>{{detail.state}}</p>
                    <p><span>运 单 号:</span>
                        <a :href="genExpressUrl(detail.express_company)">
                            {{detail.express_code}}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {expressUrl} from './../config/address';
export default {
    name: 'Detail',
    data() {
        return {
            detail: JSON.parse(localStorage.getItem('productDetail'))
        };
    },
    created() {
    },
    methods: {
        genExpressUrl(company) {
            let result = '';
            if (!!company) {
                if (company.indexOf('EMS') !== -1) {
                    result = expressUrl.ems;
                } else {
                    result = expressUrl.shufen;
                }
            }
            return result;
        }
    }
};
</script>
<style lang="scss">
    .top-poster {
        width: 100%;
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
    .middle-form {
        width: 600px;
        margin: 140px auto 0 auto;
        .title {
            color: #99694b;
            font-size: 25px;
            padding-bottom: 25px;
        }
        
        .detail {
            width: 600px;
            padding: 20px;
            height: auto;
            margin-bottom: 25px;
            border-radius: 10px;
            background: #f8f8f8;
            color: #b2b2b8;
            .detail-header {
                display: flex;
            }
            .detail-body {
                margin-top: 60px;
                p {
                    span {
                        padding-right: 30px;
                    }
                }
            }
            .item-img {
                width: 130px;
                height: 130px;
                flex-grow: 0;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .item-text {
                margin-left: 57px;
                width: auto;
                height: auto;
                flex-grow: 1;
            }
        }
    }

</style>
