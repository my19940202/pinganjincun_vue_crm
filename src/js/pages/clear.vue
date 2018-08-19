
<template>
    <div class="reply-text">
        <div class="panel panel-default">
            <div class="panel-heading">
                重置缓存
            </div>
            <div class="panel-body">
                <button class="btn btn-info" @click="resetcache">重置缓存</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        mounted() {
            console.log('Component mounted.')
        },
        methods: {
            resetcache() {
                this.$axios({
                    url: '/wechat-cache-put-all',
                    method: 'get',
                }).then((res) => {
                    if(res.data.error_code) {
                        alert(res.data.error_msg)
                        return
                    }
                    alert('缓存已重置')
                })
            }
        }
    }
</script>

<style>

</style>

