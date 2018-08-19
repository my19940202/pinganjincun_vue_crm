<template>
    <div class="wrapper">
        <div class="top-poster">
            <span>查询订单</span>
        </div>
        <div class="middle-form">
            <div class="title">
                <span v-if="orderList.length === 0">
                    您的订单为空
                </span>
                <span v-if="orderList.length > 0">您的订单</span>
            </div>
            <div
                v-for="(item, index) in orderList"
                :key="index"
                @click="showDetail(index)"
                class="item shadow">
                <div class="item-img">
                    <img :src="item.product_img" alt="产品图片">
                </div>
                <div class="item-text">
                    <div>商品名称：{{item.product_name}} </div>
                    <div>快递单号：{{item.express_code}} </div>
                    <div>兑换时间：{{item.order_date}} </div>
                    <div>订单状态：{{item.state}} </div>
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
export default {
    name: 'List',
    data() {
        return {
            tipMask: false,
            tipContent: '',
            api: {
                list: '/campaign/order/show'
            },
            detailShow: false,
            orderList: []
        };
    },
    created() {
        this.reqOrderList();
    },
    methods: {
        showAlert(msg) {
            this.tipMask = true;
            this.tipContent = msg;
        },
        showDetail(id) {
            let me = this;
            localStorage.setItem('productDetail', JSON.stringify(me.orderList[id]));
            me.$router.push('/detail');
        },
        
        reqOrderList() {
            let me = this;
            me.$axios.post(me.api.list, {})
            .then(res => {
                if (res.data.data) {
                    me.orderList = res.data.data;
                }
                else {
                    me.showAlert('暂无订单');
                }
            });
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
    .btn {
        width: 280px;
        height: 75px;
        font-size: 25px;
        color: #fff;
        background-color: #ea5404;
    }
}
</style>
