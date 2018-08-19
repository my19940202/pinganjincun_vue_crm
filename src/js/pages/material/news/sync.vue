<template>
    <div class="fans">
        <div class="panel panel-default">
            <div class="panel-heading">图文同步</div>
            <div class="panel-body table-responsive">
                <button type="button" class="btn btn-info btn-create pull-right" @click="sync">新增同步</button>
                <table class="table" v-show="list.length">
                    <thead>
                    <tr>
                        <th scope="col">等待时间</th>
                        <th scope="col">状态</th>
                        <th scope="col">创建时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.wait}}s</td>
                        <td>{{item.status_name}}</td>
                        <td>{{item.created_at}}</td>
                    </tr>
                    </tbody>
                </table>
                <v-pagination :total="total" :current-page='current'  v-show="list.length" :display="per_page" @pagechange="pagechange"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import pagination from '../../../components/pagination'
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
                    url: '/wechat-sync-news-page-info',
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
                    url: '/wechat-sync-news-index-' + this.current,
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
            },
            sync() {
                let self = this;
                var r=confirm("Confirm to Sync material data?")
                if(r == true) {
                    this.$axios({
                        url: '/wechat-sync-news-store',
                        method: 'post',
                    }).then((res) => {
                        if(res.data.error_code) {
                        alert(res.data.error_msg)
                        return
                    }
                    self.getpages();
                    setTimeout(function(){
                        self.getpages();
                        },10000)
                    })
                }

            }
        }
    }
</script>

<style scoped>
    .fans img {
        width: 20px;
    }
</style>

