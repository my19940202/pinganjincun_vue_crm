<template>
    <div class="reply-text-create">
        <div class="panel panel-default">
            <div class="panel-heading">添加回复规则</div>
            <ul class="list-group">
                <li class="list-group-item">
                    <div class="form-group">
                        <label class="col-xs-12 col-sm-3 col-md-2 control-label">回复规则名称</label>
                        <div class="col-sm-6 col-md-8 col-xs-12">
                            <input type="text" class="form-control" placeholder="请输入回复规则的名称" name="ReplyRuleName" v-model="name">
                                <span class="help-block">
                                    您可以给这条规则起一个名字, 方便下次修改和查看. <br>
                                </span>
                        </div>
                    </div>
                    <div class="form-group adv-setting ng-hide" ng-show="reply.advSetting">
                        <label class="col-xs-12 col-sm-3 col-md-2 control-label">状态</label>
                        <div class="col-sm-9">
                            <label class="radio-inline">
                                <input id="Status0" name="Status" v-model="is_valid" type="radio" value="1">启用
                            </label>
                            <label class="radio-inline">
                                <input id="Status1" name="Status" v-model="is_valid" type="radio" value="0">禁用
                            </label>
                            <span class="help-block">您可以临时禁用这条回复.</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-xs-12 col-sm-3 col-md-2 control-label">触发关键字</label>
                        <div class="col-sm-6 col-md-8 col-xs-12">
                            <input type="text" name="TiggerKey" class="form-control keyword" placeholder="请输入触发关键字" v-model="association_key" id="keywordinput" data-type="keyword">
                            <span class="help-block"></span>
                                <span class="help-block">
                                    当用户的对话内容符合以上的关键字定义时，会触发这个回复定义。多个关键字请使用逗号隔开。 <br>
                                    <!-- <strong class="text-danger">选择高级触发: 将会提供一系列的高级触发方式供专业用户使用(注意: 如果你不了解, 请不要使用). </strong> -->
                                </span>
                        </div>

                    </div>
                </li>
            </ul>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                回复内容
            </div>
            <div class="panel-body">
                <textarea class="form-control content " name="message"  placeholder="添加要回复的内容" v-model="content" id="applyContent" rows="4" onkeyup="if (this.value.split('\n').length>4) this.rows=this.value.split('\n').length;"></textarea>
            </div>

        </div>
        <div class="form-group">
            <input name="submit" type="button" @click="submit" value="提交" class="btn btn-primary col-lg-1">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                association_key: '',
                content: '',
                is_valid: 1,
                submiting: false,
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods: {
            submit() {
                if(this.submiting) return;
                this.submiting = true;
                this.$axios({
                    url: '/wechat-text-reply-store',
                    method: 'post',
                    data: {
                        name: this.name,
                        association_key: this.association_key,
                        content: this.content,
                        is_valid: this.is_valid
                    }
                }).then((res) => {
                    this.submiting = false;
                    if(res.data.error_code) {
                    alert(res.data.error_msg)
                    return
                }
                this.$router.push('/reply/text/')
            })
            },
            cancel() {
                this.$router.push('/reply/text/')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn-light {
        margin-left: 10px;
    }
    .form-group {
        overflow: hidden;
    }
    .content {
        margin: 20px;
    }
</style>

