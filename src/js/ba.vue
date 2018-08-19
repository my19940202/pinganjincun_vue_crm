<template>
    <el-container style="height: 100%;">
        <el-aside class="index-aside">
            <div class="top-logo">
                <a href="/ba/dashboard" style="margin-top: 20px;">
                    <img width="150" height="30" src="/images/logo.png" />
                </a>
            </div>
            <el-menu
                style="margin-top: 20px;"
                :router="true"
                text-color="#333"
                active-text-color="#007bff">
                <el-menu-item index="/product">
                    <i class="el-icon-setting"></i>产品管理
                </el-menu-item>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-setting"></i>兑换码管理
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/createRedeem">
                            生成兑换码
                        </el-menu-item>
                        <el-menu-item index="/manageRedeem">
                            兑换码管理
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="/order">
                    <span slot="title">
                        <i class="el-icon-setting"></i>订单管理
                    </span>
                </el-menu-item>
                <el-menu-item index="/createOrder">
                    <i class="el-icon-setting"></i>生成新订单
                </el-menu-item>
            </el-menu>
            <div class="info">
                <span class="pull-left">{{name}}</span>
                <span class="pull-right" @click="logOut">注销</span>
            </div>
        </el-aside>
        <router-view></router-view>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            name: window.ba_name || $('#app #navbarDropdown').text().trim(),
            logoutUrl: window.ba_logout_url || '/ba/logout'
        };
    },
    beforeCreate() {
        if (window.location.href.indexOf('login') === -1) {
            $('#app nav').hide();
        }
    },
    methods: {
        logOut() {
            let me = this;
            document.getElementById('logout-form').submit();
        }
    }
}
</script>
<style lang="scss">
body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    overflow: scroll;
    overflow-y: hidden;
}
#dashboard {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    .index-aside {
        padding-top: 30px;
        position: relative;
        width: 200px!important;
        background-color: rgb(238, 241, 246);
        .info {
            width: 100%;
            padding: 0 10px;
            height: 30px;
            line-height: 30px;
            position: absolute;
            left: 0;
            bottom: 0;
            .pull-right {
                text-decoration: underline;
                color:#3A83FD;
                cursor: pointer;
            }
        }
    }
    .top-logo {
        width: 100%;
        height: 30px;
        text-align: center;
    }
    .m-el-header {
        margin-top: 30px;
    }
}
#dashboard main {
    padding: 0 20px;
    width: 100%;
    height: 100%;
}
#dashboard nav {
    margin-bottom: 0;
}

.el-submenu [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
}

.el-menu a {
    text-decoration: none;
    color: #333;
}
.el-button a {
    text-decoration: none;
    color: #fff;
}

.el-menu-item [class^=fa] {
    vertical-align: baseline;
    text-align: center;
}

.el-header .el-breadcrumb {
    line-height: 60px;
}

.el-date-editor .el-range-separator {
    padding: 0;
}

</style>
