<template>
    <el-container>
        <el-header class="m-el-header">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>兑换码</el-breadcrumb-item>
                <el-breadcrumb-item>生成兑换</el-breadcrumb-item>
            </el-breadcrumb>
        </el-header>
        <el-main>
            <el-form
                ref="redeemForm"
                label-position="right"
                label-width="130px"
                :rules="rules"
                :model="redeem">
                <el-form-item
                    prop="product_id"
                    label="需要兑换的产品">
                    <el-select v-model="redeem.product_id" filterable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="parameter"
                    label="兑换码参数">
                    <el-input v-model="redeem.parameter" placeholder="(填⼊入2位数，A-Z)"></el-input>
                </el-form-item>
                <el-form-item
                    label="生成数量"
                    prop="redeem_amount">
                    <el-input type="tel" min="1" v-model.number="redeem.redeem_amount"></el-input>
                </el-form-item>
                <el-form-item
                    prop="redeem_batch"
                    label="批次名称">
                    <el-input v-model="redeem.redeem_batch"></el-input>
                </el-form-item>
                <el-form-item label="兑换码有效期">
                    <el-date-picker
                        v-model="redeemDate"
                        type="daterange"
                        :picker-options="pickerFromNow"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(true)">生成兑换码</el-button>
                </el-form-item>
            </el-form> 
            <el-dialog
                title="提示"
                :visible.sync="dialog"
                width="50%"
                v-loading="dialogLoding"
                element-loading-text="兑换码生成中"
                @open="openDialog"
                :before-close="handleDialog">
                <el-row style="text-align: center;">
                    <span>已⽣成{{redeem.redeem_amount}}个兑换码</span><br/><br/>
                    <el-button size="medium" type="primary">
                        <a :href="'/ba/redeem-info-export-' + exportId">导出下载</a>
                    </el-button>
                    <router-link to="/manageRedeem">
                        <el-button size="medium" type="primary">管理兑换码
                        </el-button>
                    </router-link>
                </el-row>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<script>
export default {
    name: 'createRedeem',
    created() {
        let me = this;
        me.$axios.get(me.api.list)
        .then(res => {
            if (res.data.data) {
                me.options = res.data.data;
            }
        });
    },
    watch: {
        'redeem.parameter': function(val) {
            val = val.toUpperCase();
            this.redeem.parameter = val;
        }
    },
    data() {
        let paramValidate = (rule, value, callback) => {
            let reg = /^[a-zA-Z]{2}/g;
            if (value === '') {
                callback(new Error('参数不能为空'));
            } else if (value.length > 2) {
                callback(new Error('参数只能为两位字母'));
            } else if (!value.match(reg)) {
                callback(new Error('参数只能为两位字母'));
            } else if (value.match(reg) && value.match(reg).length !== 1) {
                callback(new Error('参数只能为两位字母'));
            } else {
                callback();
            }
        };
        let amountValidate = (rule, value, callback) => {
            let tmpVal = value.toString();
            if (tmpVal === '') {
                callback(new Error('生成数量不能为空'));
            }
            else if (tmpVal.match(/[^0-9]/g)) {
                callback(new Error('生成数量只能为整数'));
            }
            else if (tmpVal.indexOf('.') !== -1) {
                callback(new Error(' 生成数量只能为整数'));
            }
            else {
                callback();
            }
        };

        return {
            //  时间选择范围限制
            pickerFromNow: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            dialogLoding: false,
            options: [],
            api: {
                create: '/ba/redeem-info-create',
                list: '/ba/product-data'

            },
            dialog: false,
            exportId: null,
            redeemDate: null,
            redeem: {
                'product_id': null,
                parameter: null,
                'redeem_amount': null,
                'redeem_batch': null,
                'start_date': null,
                'end_date': null
            },
            rules: {
                'product_id': [
                    {required: true, message: '产品不能为空'}
                ],
                'redeem_amount': [
                    {required: true, message: '生成数量不能为空'},
                    {validator: amountValidate, trigger: 'blur'}
                ],
                'redeem_batch': [
                    {required: true, message: '批次名称不能为空'}
                ],
                parameter: [
                    {required: true, message: '参数不能为空'},
                    {validator: paramValidate, trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        submitForm() {
            let me = this;
            let msg = {
                message: '提交失败请重试',
                type: 'error'
            };
            me.$refs['redeemForm'].validate(valid => {
                if (valid) {
                    if (me.redeemDate.length === 2) {
                        me.redeem['start_date'] = me.redeemDate[0];
                        me.redeem['end_date'] = me.redeemDate[1];
                    }
                    me.$axios.post(me.api.create, me.redeem)
                    .then(res => {
                        if (res.data && res.data.id) {
                            msg = {
                                message: '提交成功',
                                type: 'success'
                            };
                            me.exportId = res.data.id;
                            // modal展现
                            setTimeout(() => {
                                me.dialog = true;
                            }, 1000);
                            setTimeout(() => {
                                me.dialogLoding = false;
                            }, 5000);

                        }
                        else if (res.data.error_msg === 'parameter already existed') {
                            msg.message = '兑换码参数重复,请更换';
                        }
                        me.$message(msg);
                    })
                    .catch(error => {
                        me.$message(msg);
                    });
                }
                else {
                    me.$message.error('表单请填写完整');
                }
            });
        },
        handleDialog(param) {
            this.dialog = false;
        },
        openDialog(param) {
            this.dialogLoding = true;
        }
    }
};
</script>
<style>
.el-form {
    width: 500px;
}
.el-form input {
    width: 200px;
}
</style>
