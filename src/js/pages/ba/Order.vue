<template>
    <el-container>
        <el-header class="m-el-header">
            <el-breadcrumb separator="">
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
                <el-breadcrumb-item class="pull-right">
                    
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main>
            <el-form
                style="margin-bottom: 10px;"
                class="filter-form"
                :inline="true"
                label-position="right"
                ref="filterRefForm"
                label-width="150px"
                :model="filterForm">
                <el-row style="min-width:1000px;width:100%;padding:5px;background: #ddf1f6;">
                    <el-form-item>
                        <div>订单日期范围</div>
                        <el-date-picker
                            v-model="orderDate"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <div>订单号</div>
                        <el-input v-model="filterForm.orderNo"></el-input>
                    </el-form-item>
                    <el-form-item class="wider-select">
                        <div>订单状态</div>
                        <el-select v-model="filterForm.state" placeholder="请选择">
                            <el-option
                                v-for="item in stateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item>
                        <div>订单类型</div>
                        <el-select v-model="filterForm.type" placeholder="请选择">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div style="height: 40px;"> </div>
                        <el-button type="primary" @click="filterTable()" >确认</el-button>
                    </el-form-item>
                </el-row>
                <el-row style="min-width:1000px;width:100%;padding:5px;background: #ddf1f6;">
                    <el-form-item>
                        <div>运单号</div>
                        <el-input v-model="filterForm.expressCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div>产品名称</div>
                        <el-select v-model="filterForm.product_name" placeholder="请选择">
                            <el-option
                                v-for="item in productList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div>收件人</div>
                        <el-input v-model="filterForm.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="mobile">
                        <div>手机号</div>
                        <el-input type="tel" maxlength="11" v-model="filterForm.mobile"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-row style="min-width:1000px;width:100%;">
                <span class="pull-left">
                    符合条件的共有{{total.total || 0}}条
                </span>
                <span class="pull-right">
                    <el-button size="mini" type="primary" @click="exportItem()">导出未发货订单</el-button>
                    <el-button size="mini" type="primary" @click="switchOrderState('close')">关闭</el-button>
                    <el-button size="mini" type="primary" @click="switchOrderState('send')">已发货</el-button>
                    <el-button size="mini" type="primary" @click="switchOrderState('complete')">已完成</el-button>
                </span>
            </el-row>
            <el-row>
                <el-table
                    stripe
                    ref="order"
                    :data="orderData"
                    tooltip-effect="dark"
                    v-loading="loading"
                    :highlight-current-row="true"
                    @sort-change="sortOrderTable"
                    style="min-width:1000px;width:100%;margin-top: 20px;"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column 
                        width="170"
                        sortable="custom"
                        prop="order_no" label="订单号">
                        <template slot-scope="scope">
                            <span style="cursor:pointer;text-decoration: underline;" @click="editOrder(scope.row.id)">{{scope.row.order_no}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="120"
                        sortable="custom"
                         prop="order_date" label="订单日期">
                    </el-table-column>
                    <el-table-column
                        width="200"
                        sortable="custom"
                         prop="product_name" label="产品名称">
                    </el-table-column>
                    <el-table-column
                        width="140"
                        sortable="custom"
                         prop="type" label="订单类型">
                    </el-table-column>
                    <el-table-column
                        width="140"
                        sortable="custom" prop="state" label="订单状态">
                    </el-table-column>
                    <el-table-column
                        prop="express_code"
                        width="280"
                        sortable="custom"
                        label="运单号">
                        <template slot-scope="scope">
                            <div v-show="orderData[scope.$index].editable">
                                 <select v-model="expressInfo[scope.$index].company"
                                    placeholder="请选择">
                                    <option
                                        v-for="item in expressOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label"
                                        >{{item.label}}</option>
                                </select>
                                <el-input style="width: 130px;"
                                    size="mini"
                                    placeholder="请输入运单号"  v-model="expressInfo[scope.$index].code"></el-input>
                                <el-button class="pull-right" type="primary" size="mini" @click="updateExpressInfo(scope.$index, scope.row.id)">确认</el-button>
                            </div>
                            <div v-show="!orderData[scope.$index].editable">
                                {{getExpressInfo(scope)}}
                                <el-button class="pull-right" type="primary" size="mini" @click="switchUpdate(scope.$index)">修改</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <el-pagination
                    class="pull-right"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageIdx"
                    :page-size="total.per_page"
                    layout="total, prev, pager, next"
                    :total="total.total">
                </el-pagination>
            </el-row>
            <el-dialog
                title="订单信息"
                v-loading="dialogLoading"
                :visible.sync="dialog"
                width="60%">
                <el-row>
                    <el-form
                        class="dialog-form"
                        label-position="right"
                        label-width="150px"
                        ref="editForm"
                        :v-model="orderItem">
                        <el-form-item label="订单号">
                            <span>{{orderItem.order_no}}</span>
                        </el-form-item>
                        <el-form-item label="订单人姓名" prop="name">
                            <input type="text" v-model="orderItem.name" />
                        </el-form-item>
                        <el-form-item label="发货地址" prop="address">
                            <el-input v-model="orderItem.address"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <input type="tel" maxlength="11" v-model="orderItem.mobile" />
                        </el-form-item>
                        <el-form-item label="省市区">
                            <div class="address">
                                <el-select
                                    prop="province"
                                    v-model="orderItem.province" placeholder="省">
                                    <el-option
                                    v-for="item in addressObj.province"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select
                                    prop="city"
                                    v-model="orderItem.city"
                                    style="margin-left: 10px;"
                                    placeholder="市">
                                    <el-option
                                    v-for="item in addressObj.city"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select
                                    v-model="orderItem.district"
                                    style="margin-left: 10px;"
                                    placeholder="区">
                                    <el-option
                                    v-for="item in addressObj.district"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="运单号">
                            <el-select v-model="orderItem.express_company" placeholder="请选择">
                                <el-option
                                    v-for="item in expressOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-input v-model="orderItem.express_code"></el-input>
                        </el-form-item>
                        <el-form-item label="订单日期">
                            <span>{{orderItem.order_date}}</span>
                        </el-form-item>
                        <el-form-item label="兑换码">
                            <span>{{orderItem.redeemCode}}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="updateItem()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<script>
import {typeOptions, stateOptions, expressOptions, districts, expressUrl} from './../../config/address.js';
import {genDateStr, getTomorrow} from './../../util/util';
export default {
    name: 'Order',
    data() {
        let me = this;
        let paramValidate = (rule, value, callback) => {
            let reg = /^[a-zA-Z]{2}/g;

        };
        let mobileValidate = (rule, value, callback) => {
            let reg = /[^0-9]+/g;
            if (reg.test(value)) {
                this.filterMobileValid = false;
                callback(new Error('手机号要全为数值'));
            }
            if (value.length > 11) {
                this.filterMobileValid = false;
                callback(new Error('不能超11位'));
            }
        };

        return {
            api: {
                list: 'http://localhost:3000/order-list',
                total: 'http://localhost:3000/order-page-info',
                show: 'http://localhost:3000/order-show-',
                upate: 'http://localhost:3000/order-update-',
                export: 'http://localhost:3000/order-export',
                product: 'http://localhost:3000/product-data',
                express: 'http://localhost:3000/order-update-express?',
                // order
                state: {
                    close: 'http://localhost:3000/order-update-close',
                    send: 'http://localhost:3000/order-update-send',
                    complete: 'http://localhost:3000/order-update-complete'
                }
            },
            editable: true,
            addressObjFlag: 0,
            addressObj: {
                city: null,
                province: me.filterAddress(0),
                district: null
            },
            loading: true,
            typeOptions: typeOptions,
            stateOptions: stateOptions,
            expressOptions: expressOptions,
            orderDate: [],
            productList: [],
            orderItem: {},
            filterForm: {
                name: '',
                state: 100,
                orderNo: '',
                type: 100,
                sortName: 1,
                mobile: '',
                direction: 0,
                expressCode: '',
                startDate: '2018-07-01',
                endDate: genDateStr(1)
            },
            pageIdx: 1,
            multipleSelection: [],
            orderData: [],
            total: {},
            dialog: false,
            dialogLoading: true,
            dialogId: null,
            expressInfo: [],
            filterMobileValid: true,
            rules: {
                address: [
                    {required: true, message: '收货地址不能为空', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '收件人姓名不能为空', trigger: 'blur'}
                ],
                mobile: [
                    {validator: paramValidate, trigger: 'blur'}
                ]
            },
            filterRules: {
                mobile: [
                    {required: true, message: '手机号不能为空', trigger: 'blur'}
                ]
            }
        };
    },
    watch: {
        'orderItem.province': function(id) {
            if (this.addressObjFlag < 2) {
                this.addressObjFlag++;
                return;
            }
            this.addressObj.city = this.filterAddress(id);
            this.orderItem.district = null;
            this.orderItem.city = null;
        },
        'orderItem.city': function(id) {
            if (this.addressObjFlag < 2) {
                this.addressObjFlag++;
                return;
            }
            this.addressObj.district = this.filterAddress(id);
            this.orderItem.district = null;
        },
        orderItem: function(val,oldVla) {
            this.$refs['editForm'].resetFields();
        }
    },
    created() {
        let me = this;
        me.reqOrders();
        me.reqPagination();
        me.getProductList();
    },
    methods: {
        genExpressUrl(company) {
            let result = '';
            if (company.indexOf('EMS') === -1) {
                result = expressUrl.ems;
            } else {
                result = expressUrl.shufen;
            }
            return result;
        },
        handleExpress() {

        },
        getIdName(id) {
            let result = '-';
            if (id !== '') {
                for (let idx = 0; idx < districts.length; idx++) {
                    if (districts[idx].id === id) {
                        result = districts[idx].name;
                        break;
                    }
                }
            }
            return result;
        },
        updateExpressInfo(idx, productId) {
            let me = this;
            let url = `${me.api.express}${productId}`;
            me.$axios.post(url, {
                express_company: me.expressInfo[idx].company,
                express_code: me.expressInfo[idx].code
            })
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    me.$message.success('运单更新成功');
                    let tmp = this.orderData.concat([]);
                    tmp[idx].express_code = this.expressInfo[idx].code;
                    tmp[idx].express_company = this.expressInfo[idx].company;
                    tmp[idx].editable = !tmp[idx].editable;
                    this.orderData = tmp;
                }
            })
            .catch(error => {
                me.$message.error('更新失败 稍后重试');
            });
        },
        getExpressInfo(scope) {
            let result = '';
            if (scope
                && scope.row) {
                result = `${scope.row.express_company}:${scope.row.express_code}`;
            }
            return result;
        },
        switchUpdate(idx) {
            let tmp = this.orderData.concat([]);
            tmp[idx].editable = !tmp[idx].editable;
            this.orderData = tmp;
        },
        sortOrderTable(target) {
            let me = this;
            let sortMap = {
                order_no: 1,//(订单号)
                order_date: 2,//(订单日期)
                product_name: 3,//(产品名称);
                type: 4,//(订单类型);
                state: 5,//(订单状态);
                express_code: 6//(运单号）
            };
            me.filterForm.sortName = sortMap[target.prop];
            if (target.order === 'ascending') {
                me.filterForm.direction = 1;
            }
            else {
                me.filterForm.direction = 0;
            }
            me.reqOrders();
            return;
        },
        editOrder(id) {
            let me = this;
            me.addressObjFlag = 0;
            me.dialogId = id;
            let url = `${me.api.show}${id}`;
            me.dialog = true;
            me.$axios.get(url)
            .then(res => {
                if (res.data.data) {
                    me.orderItem = res.data.data;
                    me.dialogLoading = false;
                }
            });
        },
        filterAddress(pid) {
            let result = [];
            districts.forEach(element => {
                if (element.pId === pid) {
                    result.push(element);
                }
            });
            return result;
        },
        filterTable() {
            let me = this;
            if (!me.filterMobileValid) {
                me.filterMobileValid = true;
                return;
            }
            me.loading = true;
            if (me.orderDate && me.orderDate.length === 2) {
                me.filterForm.startDate = me.orderDate[0];
                me.filterForm.endDate = getTomorrow(me.orderDate[1]);
            }
            this.reqOrders();
            this.reqPagination();   
        },
        handleCurrentChange(id) {
            this.pageIdx = id;
            this.reqOrders();
        },
        handleTypeChange() {
            this.reqOrders();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        reqPagination() {
            let me = this;
            this.$axios.get(me.api.total, me.genPaginReqData())
            .then(res => {
                if (res.data) {
                    me.total = res.data;
                }
            });
        },
        getProductList() {
            let me = this;
            me.$axios.get(me.api.product)
            .then(res => {
                if (res.data) {
                    me.productList = res.data.data;
                    // 塞入全部选项
                    me.productList.unshift({
                        id: 100,
                        name: '全部'
                    });
                }
            });
        },
        genOrderReqData() {
            let me = this;
            let result = {
                'start_date': me.filterForm.startDate,
                'end_date': me.filterForm.endDate,
                'order_no': me.filterForm.orderNo,
                state: me.filterForm.state,
                'express_code': me.filterForm.expressCode,
                'product_name': me.filterForm.product_name || 100,
                name: me.filterForm.name,
                mobile: me.filterForm.mobile,
                type: me.filterForm.type,
                currentPage: me.pageIdx,
                sortName: me.filterForm.sortName || 2,
                direction: me.filterForm.direction || 0
            };
            return result;
        },
        genPaginReqData() {
            let me = this;
            return {
                'start_date': me.filterForm.startDate,
                'end_date': me.filterForm.endDate,
                'order_no': me.filterForm.orderNo,
                state: me.filterForm.state,
                'express_code': me.filterForm.expressCode,
                'product_name': 100,
                name: me.filterForm.name,
                mobile: me.filterForm.mobile,
                type: me.filterForm.type
            };
        },
        reqOrders() {
            let me = this;
            this.$axios.get(me.api.list, me.genOrderReqData())
            .then(res => {
                if (res.data) {
                    me.orderData = res.data.data;
                    me.dealOrderData();
                }
                me.loading = false;
            });
        },
        dealOrderData() {
            let me = this;
            // 遍历表单数据 设置快递编辑的状态
            let idx = 0;
            me.orderData = me.orderData.map(val => {
                // 快递表有数据
                if (val.express_company || val.express_code) {
                    val.editable = false;
                    this.expressInfo[idx] = {
                        code: val.express_code,
                        company: val.express_company
                    };
                }
                else {
                    val.editable = true;
                    this.expressInfo[idx] = {
                        code: '',
                        company: ''
                    };
                }
                idx++;
                return val;
            });
        },
        updateItem() {
            let me = this;
            if (me.orderItem.name === '') {
                this.$message.error('姓名不能为空');
                return;
            }
            if (me.orderItem.mobile === '') {
                this.$message.error('手机号不能为空');
                return;
            }
            if (me.orderItem.mobile.length !== 11) {
                this.$message.error('手机号码格式不正确');
                return;
            }
            if (!(/^1[0-9]{10}/g).test(me.orderItem.mobile)) {
                this.$message.error('手机号码格式不正确');
                return;
            }
            let data = {
                name: me.orderItem.name,
                address: me.orderItem.address,
                mobile: me.orderItem.mobile,
                city: me.getIdName(me.orderItem.city),
                province: me.getIdName(me.orderItem.province),
                district: me.getIdName(me.orderItem.district),
                'express_company': me.orderItem.express_company,
                'express_code': me.orderItem.express_code
            };
            let url = `${me.api.upate}${me.dialogId}`
            this.$axios.post(url, data)
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    me.$message.success('修改成功');
                }
                else {
                    me.$message.error('修改失败');
                }
            });
        },
        switchOrderState(operation) {
            let me = this;
            let url = me.api.state[operation];
            if (me.multipleSelection.length !== 1) {
                let words = '';
                if (me.multipleSelection.length === 0) {
                    me.$message.error('请选择要操作的记录');
                    return;
                }
            }
            if (operation === 'send') {
                for (let index = 0; index < me.multipleSelection.length; index++) {
                    const element = me.multipleSelection[index];
                    if (!!!element.express_company || !!!element.express_code) {
                        me.$message.error('无运单号的记录无法发货，请补充运单号');
                        return;
                    }
                }
            }
            let ids = me.getSelectId(me.multipleSelection).join(',');
            me.$axios.post(url, {
                id: ids
            })
            .then(res => {
                if (res.data && res.data.error_msg === 'ok') {
                    me.$message.success('修改成功');
                    me.reqOrders();
                }
                else {
                    me.$message.error('操作失败 稍后重试');
                }
            })
            .catch(error => {
                me.$message.error('操作失败 稍后重试');
            });
        },
        getSelectId(arr) {
            let result = [];
            arr.forEach(val => {
                result.push(val.id);
            });
            return result;
        },
        exportItem() {
            let me = this;
            let data = {
                'start_date': me.filterForm.startDate,
                'end_date': me.filterForm.endDate,
                'order_no': me.filterForm.orderNo,
                // 未发货订单
                state: 1,
                'express_code': me.filterForm.expressCode,
                'product_name': me.filterForm.product_name || '100',
                name: me.filterForm.name || '',
                mobile: me.filterForm.mobile || '',
                type: me.filterForm.type || 100,
                sortName: 1,
                direction: 2
            };
            let url = Object.keys(data).map(key => key + '=' + data[key]).join('&');
            window.open(`${me.api.export}?${url}`);
        }
    }
};
</script>

<style>
.filter-form input {
    width: 130px;
}
.filter-form .wider-select,
.filter-form .wider-select input {
    width: 140px;
}
.dialog-form {
    width: 80%;
}
.address select {
    width: 100px;
}
.select {
    width: 100px;
    height: 40px;
}
.dialog-form .el-select {
    width: 120px;
}
.el-table__row td {
    height: 30px;
}
</style>
