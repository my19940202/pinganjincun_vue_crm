<template>
    <div class="wrapper">
        <div class="middle-form">
            <img src="./../../img/h5/success.png">
            <h3>兑换成功</h3>
            <p>发货后，您将会收到公众号</p>
            <p>通知，请留意查看发货信息</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CodeSuccess',
    data() {
        return {};
    }
};
</script>
<style lang="scss">
.wrapper {
    background-image: url(./../../img/h5/success_header.jpg),url(./../../img/h5/success_footer.jpg);
    background-position: center top, center bottom;
    background-size: contain, contain;
    background-repeat: no-repeat, no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}
.middle-form {
    text-align: center;
    width: 600px;
    height: 300px;
    color: #99694b;
    h3 {
        font-size: 40px;
    }
    p {
        font-size: 32px;
        margin-bottom: 5px;
    }
    img {
        width: 128px;
        height: 128px;
        margin-bottom: 20px;
    }
}
</style>
