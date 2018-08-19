<template>
    <el-container>
        <el-header class="m-el-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/product' }">产品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-row style="text-align: right;margin-bottom: 10px;">
            <router-link to="/product/create">
                <el-button type="primary">新建</el-button>
            </router-link>
            <el-tooltip class="item" effect="dark" content="每次复制只能选择一个源，复制出1个新产品。" placement="top-start">
                <el-button type="primary" @click="handleCopy">复制</el-button>
            </el-tooltip>
            <el-button type="danger" @click="showDialog">删除</el-button>
        </el-row>
        <el-main>
            <el-row>
                <el-table
                    stripe
                    ref="multipleTable"
                    v-loading="loading"
                    :data="table.data"
                    tooltip-effect="dark"
                    style="width: 100%;margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column 
                        fixed="left"
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="name" label="产品名称"  width="180">
                    </el-table-column>
                    <el-table-column label="缩略图" width="100">
                        <template slot-scope="scope">
                            <img :src="getImgUrl(scope.row)" width="80" height="80" alt="产品图片" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="introduce" label="产品介绍" width="400">
                        <template slot-scope="scope">
                            <div class="two_line">{{scope.row.introduce}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product_price" label="产品价格">
                    </el-table-column>
                    <el-table-column prop="product_stock" label="存货" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column 
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <span>
                                <router-link
                                    :to="{path: '/product/edit', query: {id: scope.row.id}}">
                                    <el-button  size="small" type="primary" icon="el-icon-edit"></el-button>
                                </router-link>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block pull-right">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageIdx"
                        :page-size="pagination.per_page"
                        layout="total, prev, pager, next"
                        :total="pagination.total">
                    </el-pagination>
                </div>
                <el-dialog
                    title="提示"
                    :visible.sync="dialog"
                    width="60%">
                    <div style="width: 100%; text-align:center;">
                        <h5>确认是否删除产品 (提示:已生成订单或兑换码的商品无法删除)</h5>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialog = false">取消</el-button>
                        <el-button type="primary" @click="handleDelete">确认</el-button>
                    </span>
                </el-dialog>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'Product',
    created() {
        let me = this;
        me.pageIdx = 1;
        me.gettableData();
    },
    data() {
        return {
            loading: true,
            defaultImg: 'https://api.vtrois.com/image/80x80',
            deleteApi: '/ba/product-destroy',
            copyApi: '/ba/product-copy-',
            pageInfoApi: '/ba/product-page-info',
            table: {
                data: []
            },
            pagination: {
                total: 10,
                'per_page': 10,
                pages: 1
            },
            dialog: false,
            multipleSelection: []
        };
    },
    methods: {
        getImgUrl(item) {
            return item.img1 || item.img2 || this.defaultImg;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        gettableData(pageIdx) {
            let me = this;
            me.$axios.get(`/ba/product-list-${me.pageIdx}`)
            .then(res => {
                me.table.data = res.data.data;
                me.loading = false;
            });

            // 分页相关
            me.$axios.get(me.pageInfoApi)
            .then(res => {
                me.pagination = res.data;
            });
        },
        showDialog() {
            let me = this;
            if (me.multipleSelection.length === 0) {
                me.$message.error('请选择要删除的记录');
                return;
            } else {
                me.dialog = true;
            }
        },
        handleDelete() {
            let me = this;
            let selectedIds = me.getSelectId(me.multipleSelection);
            let reqData = {
                id: selectedIds.join(',')
            };
            let msg = {
                message: '删除失败请重试',
                type: 'error'
            };

            me.$axios.post(me.deleteApi, reqData)
            .then(res => {
                if (res.data.error_msg === 'ok') {
                    msg = {
                        message: '删除成功',
                        type: 'success'
                    };
                } else if (res.data.error_code === 200) {
                    msg = {
                        message: '删除失败, 已生成订单或兑换码的商品无法删除',
                        type: 'error'
                    };
                }
                me.dialog = false;
                me.$message(msg);
                me.gettableData();
            })
            .catch(error => {
                me.$message.error(msg);
            });
        },
        handleCopy() {
            let me = this;
            let msg = {
                message: '复制失败请重试',
                type: 'error'
            };
            if (me.multipleSelection.length !== 1) {
                let words = '';
                if (me.multipleSelection.length === 0) {
                    words = '请选择要复制的记录';
                }
                if (me.multipleSelection.length > 1) {
                    words = '每次限制复制一条记录';
                }
                me.$message.error(words);
                return;
            }
            let url = `${me.copyApi}${me.multipleSelection[0].id}`;
            
            me.$axios.get(url)
            .then(res => {
                if (res.data.error_msg === 'ok') {
                    msg = {
                        message: '复制成功',
                        type: 'success'
                    };
                }
                me.$message(msg);
                me.gettableData();
            })
            .catch(error => {
                me.$message(msg);
            });
        },
        getSelectId(arr) {
            let result = [];
            arr.forEach(val => {
                result.push(val.id);
            });
            return result;
        },
        handleCurrentChange(id) {
            this.pageIdx = id;
            this.gettableData(id);
        }
    }
};
</script>

<style>
.el-table {
    margin-top: 10px;
}
.two_line {
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    width: 380px;
    padding: 0 20px;
    height: 70px;
    overflow: hidden;
}
</style>
