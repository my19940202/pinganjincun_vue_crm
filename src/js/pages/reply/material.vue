<template>
    <div class="reply-text">
        <div class="panel panel-default">
            <div class="panel-heading">
                素材回复
            </div>
            <div class="panel-body">

                <router-link to="/reply/material/create"><button type="button" class="btn btn-info btn-create pull-right">New</button></router-link>
                <div style="clear:both;margin-bottom:15px;"></div>
                <div class="panel panel-default" v-show="list.length" v-for="item in list">
                    <div class="panel-heading clearfix">
                        {{item.name}}
                    </div>
                    <div class="panel-body">
                        <span class="label label-default" v-for="key in item.association_key.split(',')">{{key}}</span>
                    </div>
                    <div class="panel-footer clearfix">
                        <p class="pull-left">{{typelist[item.type]}}</p>
                        <div class="btn-group pull-right">
                            <a class="btn btn-default btn-sm" @click="edit(item.id)"><i class="fa fa-edit"></i> 编辑</a>
                            <a class="btn btn-default btn-sm" @click="del(item.id)"><i class="fa fa-times"></i> 删除</a>
                        </div>
                    </div>
                </div>
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
                list: [],
                typelist: {
                    100: 'News',
                    200: 'Image',
                    300: 'Voice',
                    400: 'Video'
                }
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
                    url: '/wechat-material-reply-page-info',
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
                    url: '/wechat-material-reply-index-' + this.current,
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
            edit(id) {
                this.$router.push({ path:`/reply/material/edit/${id}`})
            },
            del(id) {
                var r=confirm("Confirm to delete?")
                if(r == true) {
                    this.$axios({
                        url: '/wechat-material-reply-destroy-'+id,
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

<style scoped>
    .btn-default {
        border-color: #ccc;
    }
    .label {
        margin-right: 10px;
    }
</style>

