<template>
    <el-container>
        <el-aside class="redeem-aside">
            <el-input v-model="keyword" placeholder="请输入内容"></el-input>
            <div
                v-for="(item, idx) in filteredInfo"
                class="aside-panel "
                :class="{active:idx === 0}"
                :key="idx">
                <div class="info-top">
                    <el-tooltip class="item" effect="dark" content="点击查看该批次兑换码" placement="top-start">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="reviewRedeemCode(item.id, idx)">{{item.redeem_batch}}
                        </el-button>
                    </el-tooltip>
                </div>
                <div>产品名称: {{item.product_name}}</div>
                <div>
                    <span class="pull-left">
                        {{item.start_date}} ~ {{item.end_date}}
                    </span>
                    <span class="pull-right">
                        <a href="javascript:;" @click="deleteConfirm(() => {handleDeleteBatch(item.id)})">删除</a> 
                        <a :href="exportApi + item.id">导出</a>
                    </span>
                </div>
            </div>
        </el-aside>
        <el-container style="background-color: #eef1f6;">
            <el-header class="m-el-header">
                <el-breadcrumb separator="">
                    <el-breadcrumb-item>
                        兑换码
                        <span class="el-breadcrumb__separator">/</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>兑换码管理</el-breadcrumb-item>
                    <el-breadcrumb-item style="float: right;">
                        已兑换: {{total.invalid}} | 未兑换: {{total.valid}} | 已作废: {{total.delete}} | 兑换码总数:{{total.total}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-main>
                <el-row class="redeem-table-header">
                    <span>
                        <el-input
                        v-model="redeemSearch"
                        @change="handleRedeemSearch"
                        placeholder="输入兑换码,回车查询"></el-input>
                    </span>
                    <span>
                        <el-button type="danger" @click="deleteConfirm(handleDelete)">作废</el-button>
                    </span>
                </el-row>
                <el-table
                    stripe
                    ref="multipleTable"
                    v-loading="loading"
                    :data="redeemCodeList"
                    tooltip-effect="dark"
                    style="width: 100%;margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column 
                        fixed="left"
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="redeem_code" label="兑换码">
                    </el-table-column>
                    <el-table-column prop="istate" label="兑换状态" >
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
                        <h5>确认是否删除</h5>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialog = false">取消</el-button>
                        <el-button type="primary" @click="targetDeleteFunc">确认</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'manageRedeem',
    created() {
        this.reqInfoList();
    },
    data() {
        return {
            targetDeleteFunc: () => {},
            dialog: false,
            loading: true,
            infoApi: '/ba/redeem-info-list',
            codeApi: '/ba/redeem-code-list',
            totalApi: '/ba/redeem-code-state-',
            deleteApi: '/ba/redeem-code-destroy',
            exportApi: '/ba/redeem-info-export-',
            deleteBatchApi: '/ba/redeem-info-destroy-',
            paginationApi: '/ba/redeem-code-page-info',
            keyword: '',
            infoList: [],
            redeemCodeList: [],
            redeemSearch: '',
            total: {},
            redeemId: null,
            multipleSelection: [],
            pageIdx: 1,
            pagination: {
                total: null,
                'per_page': 10,
                pages: null
            }
        };
    },
    computed: {
        filteredInfo() {
            let me = this;
            let result = me.infoList.filter(function (item) {
                return item.redeem_batch.indexOf(me.keyword) !== -1;
            });
            return result;
        }
    },
    methods: {
        deleteConfirm(targetDelete) {
            this.dialog = true;
            this.targetDeleteFunc = targetDelete;
        },
        reviewRedeemCode(id, idx) {
            if (!id) {
                id = this.redeemId;
            }
            else {
                this.redeemId = id;
            }
            let data = {
                'redeem_id': id,
                code: '',
                currentPage: 1
            };
            this.highLighter(idx);
            this.reqRedeemCodeList(data);
            this.reqTotal(id);
            this.reqCodeListTotal();
        },
        highLighter(activeIdx) {
            activeIdx = activeIdx || 0;
            let bars = $('.redeem-aside .aside-panel');
            if (!bars.length) return;
            for (let idx = 0; idx < bars.length; idx++) {
                if (idx === activeIdx) {
                    $(bars[idx]).addClass('active');
                } else {
                    $(bars[idx]).removeClass('active');
                }
            }
        },
        reqInfoList() {
            let me = this;
            this.$axios.get(me.infoApi)
            .then(res => {
                if (res.data) {
                    me.infoList = res.data.data;
                    // 初始化 请求codeList
                    if (me.infoList.length > 0) {
                        me.reviewRedeemCode(me.infoList[0].id);
                    }
                }
            })
            .catch(error => {
                me.$message.error('数据请求失败');
            });
        },
        reqTotal(id) {
            let me = this;
            this.$axios.get(me.totalApi + id.toString())
            .then(res => {
                if (res.data) {
                    me.total = res.data;
                }
            })
            .catch(error => {
                me.$message.error('数据请求失败');
            });
        },
        reqCodeListTotal() {
            let me = this;
            this.$axios.post(me.paginationApi, {
                'redeem_id': me.redeemId,
                code: ''
            })
            .then(res => {
                if (res.data) {
                    me.pagination = res.data;
                }
            })
            .catch(error => {
                me.$message.error('数据请求失败');
            });
        },
        reqRedeemCodeList(data) {
            let me = this;
            this.$axios.post(me.codeApi, data)
            .then(res => {
                if (res.data) {
                    me.loading = false;
                    me.redeemCodeList = res.data.data;
                }
            })
            .catch(error => {
                me.$message.error("数据请求失败");
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleDelete() {
            let me = this;
            let ids = me.getSelectId(me.multipleSelection).join(',');
            if (ids !== '') {
                me.$axios.post(me.deleteApi, {
                    id: ids
                })
                .then(res => {
                    if (res.data.error_msg === 'ok') {
                        me.$message.success('删除成功');
                        me.reviewRedeemCode();
                        me.dialog = false;
                    }
                    else {
                        me.$message.error('删除失败');
                    }
                })
                .catch(error => {
                    me.$message.error('删除失败');
                });
            }
            else {
                me.$message.error('没有选中任何记录');
            }
        },
        handleDeleteBatch(id) {
            let me = this;
            me.$axios.post(`${me.deleteBatchApi}${id}`)
            .then(res => {
                if (res.data.error_msg === 'ok') {
                    me.$message.success('批次删除成功');
                    me.dialog = false;
                    me.reqInfoList();
                }
                if (res.data.error_msg === 'delete fail') {
                    me.$message.error('该兑换码尚在有效期，无法删除');
                    me.dialog = false;
                }
            })
            .catch(error => {
                me.$message.error('批次删除失败,请重试');
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
            let data = {
                'redeem_id': this.redeemId,
                code: '',
                currentPage: id
            };
            this.reqRedeemCodeList(data);
        },
        handleRedeemSearch() {
            let me = this;
            let data = {
                'redeem_id': me.redeemId,
                code: me.redeemSearch,
                currentPage: 1
            };
            me.reqRedeemCodeList(data);
        }
    }
};
</script>
<style>
.redeem-aside {
    padding: 10px;
    width: 250px;
    background-color: #fff;
}
.redeem-aside input {
    width: 100%;
}
.aside-panel {
    width: 100%;
    border-bottom: 1px solid #eeeeee;
    padding: 5px 0;
}
.active {
    background-color: rgb(230, 230, 240);
}
.aside-panel div {
    width: 100%;
    height: 30px;
    line-height: 30px;
}
.aside-panel .info-top button {
    max-width: 97%;
    padding-left: 5px;
    padding-right: 5px;
    overflow: hidden;
}
.aside-panel .info-top span {
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.redeem-table-header {
    margin-bottom: 20px;
    line-height: 40px;
}
.redeem-table-header span:first-child {
    float: left;
}
.redeem-table-header span:last-child {
    float: right;
}
</style>
