<template>
    <div class="reply-text-create">
        <div class="form-group">
            <div class="col-sm-12">
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
                            <div class="form-group">
                                <label class="col-xs-12 col-sm-3 col-md-2 control-label">类型</label>
                                <div class="col-sm-6 col-md-8 col-xs-12">
                                    <select name="" id="" v-model="type">
                                        <option value="100">News</option>
                                        <option value="200">Image</option>
                                        <option value="300">Voice</option>
                                        <option value="400">Video</option>
                                    </select>
                                </div>

                            </div>
                            <div class="form-group">
                                <label class="col-xs-12 col-sm-3 col-md-2 control-label">Media Id</label>
                                <div class="col-sm-6 col-md-8 col-xs-12">
                                    <input type="text" v-model="media_id">
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-12">
                <input name="submit" type="button" @click="submit" value="Submit" class="btn btn-primary">
                <button type="button" class="btn btn-light" @click="cancel">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                association_key: '',
                type:'',
                media_id: '',
                is_valid: 1,
                info: {}
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.fetch(this.$route.params.id)
        },
        methods: {
            fetch(id) {
                this.$axios({
                    url: '/wechat-material-reply-show-' + this.$route.params.id,
                    method: 'get',
                }).then((res) => {
                    this.info = res.data.data;
                    this.name = this.info.name;
                    this.type = this.info.type;
                    this.media_id = this.info.media_id;
                    this.association_key = this.info.association_key;
                    this.content = this.info.content;
                    this.is_valid = this.info.is_valid;
                })
            },
            submit() {
                this.$axios({
                    url: ('/wechat-material-reply-update-' + this.$route.params.id),
                    method: 'post',
                    data: {
                        id: this.$route.params.id,
                        name: this.name,
                        type: this.type,
                        media_id: this.media_id,
                        association_key: this.association_key,
                        content: this.content,
                        is_valid: this.is_valid
                    }
                }).then((res) => {
                    if(res.data.error_code) {
                        alert(res.data.error_msg)
                        return
                    }
                    this.$router.push('/reply/material/')
                 })
            },
            cancel() {
                this.$router.push('/reply/material/')
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

