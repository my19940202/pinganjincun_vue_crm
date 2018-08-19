<template>
    <div class="reply-system">
        <div class="panel panel-default">
            <div class="panel-heading">
                系统回复
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="col-xs-12 col-sm-3 col-md-2 control-label">欢迎信息关键字:</label>
                    <div class="col-sm-9 col-xs-12" style="position:relative">
                        <input type="text" name="followkey" maxlength="300" title="最多可输入300个字符" class="form-control" id="welcomeinput" v-model="welcome_key" placeholder="可根据关键字直接关联指定的回复规则" autocomplete="off">

                        <div class="help-block">设置用户添加公众帐号好友时，发送的欢迎信息。</div>
                        <div class="help-block">
                            指定用户添加公众帐号好友时，发送的欢迎信息, 你可以在这里输入关键字, 那么用户添加公众号好友时就相当于发送这个内容至系统<br>
                            这个过程是程序模拟的, 比如这里添加关键字: 欢迎关注, 那么用户添加公众号好友时, 系统相当于接受了粉丝用户的消息, 内容为"欢迎关注"
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-xs-12 col-sm-3 col-md-2 control-label">默认回复关键字:</label>
                    <div class="col-sm-9 col-xs-12">
                        <input type="text" name="defaultkey" maxlength="300" title="最多可输入300个字符" class="form-control" id="defaultinput" v-model="auto_reply_key" placeholder="可根据关键字直接关联指定的回复规则">
                        <div class="help-block">当系统不知道该如何回复粉丝的消息时，默认发送的内容。</div>
                        <div class="help-block">
                            指定系统不知道该如何回复粉丝的消息时，发送的默认信息, 你可以在这里输入关键字, 那么系统不知道该如何回复粉丝的消息时就相当于发送这个内容至系统<br>
                            这个过程是程序模拟的, 比如这里添加关键字: ￥@%&amp;%#@*;, 系统不知道该如何回复粉丝的消息, 系统相当于接受了粉丝用户的消息, 内容为"￥@%&amp;%#@*"
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="form-group">
            <div class="col-sm-12">
                <input name="submit" type="button" value="提交" @click="submit" class="btn btn-primary col-lg-1">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                welcome_key: '',
                auto_reply_key: ''
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.init();
        },
        methods: {
            init() {
                this.$axios({
                    url: '/wechat-system-reply-show',
                    method: 'get',
                }).then((res) => {
                    if(!res.data.data.id) return;
                    this.welcome_key = res.data.data.welcome_key
                    this.auto_reply_key = res.data.data.auto_reply_key
                })
            },
            submit() {
                this.$axios({
                    url: '/wechat-system-reply-update',
                    method: 'post',
                    data: {
                        welcome_key: this.welcome_key,
                        auto_reply_key: this.auto_reply_key
                    }
                }).then((res) => {
                    if(!res.data.error_code) {
                        this.init();
                        alert('保存成功')
                        return;
                    }
                    alert(res.data.error_msg)
                })
            },

        }
    }
</script>

<style>

</style>

