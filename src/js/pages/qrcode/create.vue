<template>
    <div class="reply-text-create container">
        <div class="form-group">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">二维码添加</div>
                    <div class="panel-body">
                        <form>
                            <!--<div class="form-group">
                                <button type="button" class="btn btn-primary" @click="submit">Submit</button>
                                <button type="button" class="btn btn-light" @click="cancel">Cancel</button>
                            </div>-->
                            <div class="form-group">
                                <label for="scene_name">场景名称</label>
                                <input type="text" class="form-control" id="scene_name" v-model="scene_name" placeholder="">
                            </div>
                            <div class="form-group">
                                <label for="association_key">关联关键字 </label>
                                <input type="text" class="form-control" id="association_key" v-model="association_key" placeholder="">
                            </div>
                            <div class="form-group">
                                <label for="scene_str">场景字符串 </label>
                                <input type="text" class="form-control" id="scene_str" v-model="scene_str" placeholder="">
                            </div>
                            <button type="button" class="btn btn-primary" @click="submit">Submit</button>
                            <button type="button" class="btn btn-light" @click="cancel">Cancel</button>
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
                scene_name: '',
                association_key: '',
                scene_str: ''
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods: {
            submit() {
                this.$axios({
                    url: '/wechat-qr-code-store',
                    method: 'post',
                    data: {
                        scene_name: this.scene_name,
                        association_key: this.association_key,
                        scene_str: this.scene_str
                    },
                }).then((res) => {
                    if(res.data.error_code) {
                        alert(res.data.error_msg)
                        return
                    }
                    this.$router.push('/qrcode')
                })
            },
            cancel() {
                this.$router.push('/qrcode')
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

