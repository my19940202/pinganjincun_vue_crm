<template>
    <router-view></router-view>
</template>
<script>
import {getCookie} from './../util/util';
export default {
    name: 'App',
    created() {
        // 微信授权验证
        let auth = getCookie('pajc_auth');
        let pageUrl = encodeURIComponent(window.location.href);
        let safeUrl = `https://pajc.nurunci.com/wechat/base/safe?return_url=${pageUrl}`;
        if (parseInt(auth, 10) !== 1) {
            window.location.href = safeUrl;
        }
    },
    data() {
        return {};
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
    label {
        color: #99694b;
    }
    .btn {
        width: 280px;
        height: 75px;
        font-size: 25px;
        color: #fff;
        background-color: #ea5404;
    }
    .shadow {
        box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 6px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    }
    input {
        height: 85px;
        font-size: 28px;
    }
    .form-inline-item {
        font-size: 0;
        input {
            width: 360px;
            height: 85px;
            display: inline;
        }
        img {
            width: 210px;
            height: 80px;
        }
    }
    .form-group {
        margin-bottom: 80px;
    }
    .form-group:last-child {
        margin-bottom: 0;
    }
}
</style>
