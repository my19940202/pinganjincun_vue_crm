<template>
    <div class="reply-text">
        <div class="panel panel-default">
            <div class="panel-heading">
                图文回复
            </div>
            <div class="panel-body">
                <router-link to="/reply/news/create"><button type="button" class="btn btn-info btn-create pull-right">New</button></router-link>
                <table class="table" v-show="list.length">
                    <thead>
                    <tr>
                        <th scope="col">规则名称</th>
                        <th scope="col">触发关键词</th>
                        <th scope="col">valid</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.name}}</td>
                        <td>{{item.association_key}}</td>
                        <td>{{item.is_valid}}</td>
                        <td class="text-right"><button type="button" class="btn btn-info" @click="edit(item.id)">Edit</button> <button type="button" class="btn btn-danger" @click="del(item.id)">Delete</button></td>
                    </tr>
                    </tbody>
                </table>
                <v-pagination :total="total" :current-page='current' v-show="list.length" :display="per_page" @pagechange="pagechange"></v-pagination>
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
                current: 0,
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
                    url: '/wechat-news-reply-page-info',
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
                    url: '/wechat-news-reply-index-' + this.current,
                    method: 'get',
                }).then((res) => {
                    this.list = res.data.data
            })
            },
            pagechange:function(currentPage){
                this.current = currentPage
                this.getlist()
                console.log(currentPage);

            },
            edit(id) {
                this.$router.push({ path:`/reply/news/edit/${id}`})
            },
            del(id) {
                var r=confirm("Confirm to delete?")
                if(r == true) {
                    this.$axios({
                        url: '/wechat-news-reply-destroy-'+id,
                        method: 'post'
                    }).then((res) => {
                        if(res.data.error_code) {
                        alert(res.data.error_msg)
                        return
                    }
                    this.getlist()
                })
                }
            }

        }
    }
</script>

<style>

</style>

