<template>
    <div class="fans-view container">
        <div class="form-group">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">用户信息</div>
                    <div class="panel-body">
                        <form>
                            <button type="button" class="btn btn-light" @click="cancel">Back</button>
                            <div class="form-group">
                                <label>nickname</label>
                                <p class="form-control">{{info.nickname}}</p>
                            </div>
                            <div class="form-group">
                                <label>openid</label>
                                <p class="form-control">{{info.openid}}</p>
                            </div>
                            <div class="form-group">
                                <label>sex</label>
                                <p class="form-control">{{info.sex}}</p>
                            </div>
                            <div class="form-group">
                                <label>所在地</label>
                                <p class="form-control">{{info.country}} - {{info.province}} - {{info.city}}</p>
                            </div>
                            <div class="form-group">
                                <label>subscribe</label>
                                <p class="form-control">{{info.subscribe}}</p>
                            </div>
                            <div class="form-group">
                                <label>language</label>
                                <p class="form-control">{{info.language}}</p>
                            </div>
                            <div class="form-group">
                                <label>headimgurl</label>
                                <p class="form-control">{{info.headimgurl}}</p>
                            </div>
                            <div class="form-group">
                                <label>subscribe_time</label>
                                <p class="form-control">{{info.subscribe_time}}</p>
                            </div>
                            <div class="form-group">
                                <label>subscribe_time_at</label>
                                <p class="form-control">{{info.subscribe_time_at}}</p>
                            </div>
                            <div class="form-group">
                                <label>unsubscribe_time_at</label>
                                <p class="form-control">{{info.unsubscribe_time_at}}</p>
                            </div>
                            <div class="form-group">
                                <label>unionid</label>
                                <p class="form-control">{{info.unionid}}</p>
                            </div>
                            <div class="form-group">
                                <label>remark</label>
                                <p class="form-control">{{info.remark}}</p>
                            </div>
                            <button type="button" class="btn btn-light" @click="cancel">Back</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                info: {},
                is_valid: 1
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.fetch(this.$route.params.id)
        },
        methods: {
            fetch(id) {
                this.$axios({
                    url: '/wechat-user-index-' + (this.$parent.current || 0),
                    method: 'get',
                }).then((res) => {
                    this.info = res.data.data.find((n) => n.id == id);
                })
            },
            cancel() {
                this.$router.push('/fans')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fans-view img {
        height: 100px;
    }
</style>

