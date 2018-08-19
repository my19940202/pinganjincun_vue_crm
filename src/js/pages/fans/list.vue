<template>
    <div class="fans">
        <div class="panel panel-default">
            <div class="panel-heading">粉丝列表</div>
            <div class="panel-body table-responsive">
                <table class="table" v-show="list.length">
                    <thead>
                    <tr>
                        <th scope="col">昵称</th>
                        <th scope="col">Openid</th>
                        <th scope="col">性别</th>
                        <th scope="col">国家-省-市</th>
                        <th scope="col">头像</th>
                        <th scope="col">关注</th>
                        <th scope="col">关注时间</th>
                        <th scope="col">取消关注时间</th>
                        <!--th scope="col"></th-->
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.nickname}}</td>
                        <td :title="item.openid">{{item.openid}}</td>
                        <td>{{item.sex}}</td>
                        <td>{{item.country}} - {{item.province}} - {{item.city}}</td>
                        <td><img :src="item.headimgurl" alt=""></td>
                        <td>{{item.subscribe?'已关注':'取消关注'}}</td>
                        <td>{{item.subscribe_time_at}}</td>
                        <td>{{item.unsubscribe_time_at}}</td>
                        <!--td class="text-right"><button type="button" class="btn btn-info" @click="view(item.id)">View</button></td-->
                    </tr>
                    </tbody>
                </table>
                <v-pagination :total="total" :current-page='current'  v-show="list.length" :display="per_page" @pagechange="pagechange"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import pagination from '../../components/pagination'
    export default {
        data() {
            return {
                pages: 0,
                per_page: 0,
                total: 0,
                current: 1,
                list: []
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.getpages();
        },
        components: {
            'v-pagination': pagination,
        },
        methods: {
            getpages() {
                this.$axios({
                    url: '/wechat-user-page-info',
                    method: 'get',
                }).then((res) => {
                    this.pages = res.data.pages;
                    this.per_page = res.data.per_page;
                    this.total = res.data.total;
                    this.getlist();
                })
            },
            getlist() {
                this.$parent.current = this.current
                this.$axios({
                    url: '/wechat-user-index-' + this.current,
                    method: 'get',
                }).then((res) => {
                    this.list = res.data.data
                    window.scrollTo(0,0)
                })
            },
            pagechange:function(currentPage){
                this.current = currentPage
                this.getlist()
                console.log(currentPage);
            },
            view(id) {
                this.$router.push({ path:`/fans/${id}`})
            }
        }
    }
</script>

<style scoped>
    .fans img {
        width: 20px;
    }
</style>

