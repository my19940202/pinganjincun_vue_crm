<template>
    <router-view></router-view>
</template>
<script>
import {getCookie} from './../util/util';
export default {
    data() {
        return {};
    },
    created() {
        // 微信授权验证
        let auth = getCookie('pajc_auth');
        let pageUrl = encodeURIComponent(window.location.href);
        let safeUrl = `https://pajc.nurunci.com/wechat/base/safe?return_url=${pageUrl}`;
        if (parseInt(auth, 10) !== 1 && process.env.NODE_ENV !== 'development') {
            window.location.href = safeUrl;
        }
    }
};
</script>
<style lang="scss">
body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    font-size: 23px;
    background-color: #e8e8e8;
}
.wrapper {
    position: absolute;
    top: 0;
    height: 100%;   
    width: 640px;
    background-image: url(./../../img/h5/header.png);
    background-position: center top;
    background-repeat: no-repeat;
    .shadow {
        box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 6px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    }
    .middle-form {
        width: 600px;
        margin: 140px auto 0 auto;
        .title {
            color: #99694b;
            font-size: 25px;
            padding-bottom: 25px;
        }
        .item {
            color: #b2b2b8;
            width: 600px;
            padding: 20px;
            height: auto;
            margin-bottom: 25px;
            border-radius: 10px;
            background: #f8f8f8;
            display: flex;
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
        .detail-item {
            width: 600px;
            padding: 20px;
            height: auto;
            margin-bottom: 25px;
            border-radius: 10px;
            background: #f8f8f8;
        }
    }
    
}
</style>
