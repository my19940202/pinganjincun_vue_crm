<template>
    <div class="qrcode">
        <div class="panel panel-default">
            <div class="panel-heading">二维码管理</div>
            <div class="panel-body table-responsive">
                <router-link to="/qrcode/create"><button type="button" class="btn btn-info btn-create pull-right">New</button></router-link>
                <table class="table" v-show="list.length">
                    <thead>
                    <tr>
                        <th scope="col">场景名称</th>
                        <th scope="col">关联关键字</th>
                        <th scope="col" class="scene_str">场景字符串</th>
                        <th scope="col">二维码</th>
                        <th scope="col">url</th>
                        <th scope="col">生成时间</th>
                        <th scope="col">关注量</th>
                        <th scope="col">扫描量</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td>{{item.scene_name}}</td>
                        <td>{{item.association_key}}</td>
                        <td>{{item.scene_str}}</td>
                        <td><a :href="item.show_url" target="_blank">查看</a></td>
                        <td><a :href="item.url" target="_blank">查看</a></td>
                        <td>{{item.created_at_str}}</td>
                        <td>{{item.subscribe_count}}</td>
                        <td>{{item.scan_count}}</td>
                        <td class="text-right"><button type="button" class="btn btn-danger" @click="del(item.id)">Delete</button></td>
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
                    url: '/wechat-qr-code-page-info',
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
                    url: '/wechat-qr-code-index-' + this.current,
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
            del(id) {
                var r=confirm("Confirm to delete?")
                if(r == true) {
                    this.$axios({
                        url: '/wechat-qr-code-destroy-'+id,
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
    .qrcode table {
        table-layout: fixed;
    }
    .qrcode table td{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .scene_str {
        width: 130px;
    }
</style>

