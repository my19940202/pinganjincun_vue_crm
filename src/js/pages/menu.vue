<template>
    <div class="menu">
        <div class="panel panel-default">
            <div class="panel-heading">自定义菜单</div>
            <div class="panel-body">
                <div class="app">
                    <div class="app-preview">
                        <div class="app-header">平安津村</div>
                        <div class="app-content">
                            <div v-if="!menu.length" class="no-menu"> + 添加菜单</div>
                            <ul class="menus" v-if="menu.length">
                                <li v-for="(item,index) in menu"><p draggable="true" @dragstart="dragstart([index,0,1])"  @dragover="dragover" @dragleave="dragleave" @dragenter="dragenter" @dragend="dragend"  @drop="drop([index,0,1])" @click="editmenu(index)">{{item.name}}</p>
                                    <div class="sub-menu">
                                        <ul>
                                            <li v-for='(subitem,subindex) in item.sub_button' draggable="true" @dragstart="dragstart([index,subindex,0])"  @dragover="dragover" @dragleave="dragleave" @dragenter="dragenter" @dragend="dragend"  @drop="drop([index,subindex,0])" :title="subitem.name"  @click="editsubmenu(index, subindex)">
                                                {{subitem.name}}
                                            </li>
                                            <li v-if="item.sub_button.length<5" class="add_submenu" @click="addsubmenu(index)">+</li>
                                        </ul>
                                    </div>
                                </li>
                                <li v-if="menu.length<3" class="add_menu" @click="addmenu">+</li>
                            </ul>
                        </div>
                    </div>
                    <div class="app-side" v-if="!(menuEditing.isMainMenu == 'init')">
                        <div class="panel panel-default">
                            <div class="card">
                                <div class="nav-region">
                                    <div class="first-nav">
                                        <h3 class="pull-left">菜单设置</h3>
                                        <a href="#" @click="delMenu()" class="pull-right">删除菜单</a>
                                        <div class="alert">
                                            <div class="form-group">
                                                <label class="control-label col-2">菜单名称</label>
                                                <div class="col-10">
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" name="" id="title" v-model="menuEditing.name">
                                                    </div>
                                                    <p v-if="menuEditing.isMainMenu"  class="help-block">字数不超过4个汉字或8个字母</p>
                                                    <p v-if="!menuEditing.isMainMenu"  class="help-block">字数不超过8个汉字或16个字母</p>
                                                </div>
                                            </div>
                                           <div class="form-group" v-show="!menuEditing.isMainMenu || menuEditing.isSingleMainMenu">
                                            <label class="control-label col-2">菜单动作</label>
                                            <div class="col-10 menu-action">
                                                                <span>
                                                                    <label class="radio-inline">
                                                                        <input type="radio" name="ipt" :checked="menuEditing.type=='view'" value="view" v-model="menuEditing.type"> 链接
                                                                    </label>
                                                                    <label class="radio-inline">
                                                                        <input type="radio" name="ipt" :checked="!(menuEditing.type=='view')" value="click" v-model="menuEditing.type"> 触发关键字
                                                                    </label>

                                                                </span>
                                                <div  v-show="menuEditing.type=='view'">
                                                    <hr>
                                                    <div class="input-group" style="width: 100%;" >
                                                        <input class="form-control" id="ipt-url" type="text" v-model="menuEditing.url">
                                                    </div>
                                                    <span class="help-block">指定点击此菜单时要跳转的链接（注：链接需加http://）</span>

                                                </div>
                                                <div v-show="menuEditing.type=='click'" style="position:relative;">
                                                    <hr>
                                                    <div class="input-group" style="width: 100%;">
                                                        <input class="form-control" id="ipt-forward" type="text" v-model="menuEditing.key" >
                                                    </div>
                                                    <div id="key-result" style="width:100%;position:absolute;top:55px;left:0px;display:none;z-index:10000">
                                                        <ul class="dropdown-menu" style="display:block;width:88%;"></ul>
                                                    </div>
                                                    <span class="help-block">指定点击此菜单时要执行的操作, 你可以在这里输入关键字, 那么点击这个菜单时就就相当于发送这个内容至微信系统</span>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" @click="save">保存</button>
                <button  class="btn btn-primary" @click="publish">发布</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                menu: [],
                menuEditing: {
                    name: '',
                    isMainMenu: 'init'
                },
                menuEditingIdx: []
            }
        },
        mounted() {
            console.log('Component mounted.')
            this.getlist();
        },
        /*watch: {
            menu:{
                handler:function(val,oldval){
                    console.log(val)
                },
                deep:true//对象内部的属性监听，也叫深度监听
            },
        },*/
        methods: {
            getlist() {
                this.$axios({
                    url: '/wechat-menu-show',
                    method: 'get',
                }).then((res) => {
                    if(!res.data.data.id) return;
                    this.menu  = res.data.data.menu_info
                })
            },
            addsubmenu(idx) {
                let temp = {type: "", name: ""}
                this.$set(this.menu[idx]['sub_button'],this.menu[idx]['sub_button'].length,temp)
                this.menuEditing = this.menu[idx]['sub_button'][this.menu[idx]['sub_button'].length-1]
                this.menuEditing.isMainMenu = false;
                this.menuEditingIdx = [idx,this.menu[idx]['sub_button'].length-1]
            },
            addmenu() {
                let temp = {'name':'',sub_button:[]}
                this.$set(this.menu,this.menu.length,temp)
                this.menuEditing = this.menu[this.menu.length-1]
                this.menuEditing.isMainMenu = true;
                this.menuEditingIdx = [this.menu.length-1]
                this.menuEditing.isSingleMainMenu = true
            },
            editmenu(idx) {

                this.menuEditing = this.menu[idx]
                this.menuEditing.isMainMenu = true;
                this.menuEditingIdx = [idx]
                if(this.menu[idx].sub_button.length == 0) {
                    this.menuEditing.isSingleMainMenu = true
                } else {
                    this.menuEditing.isSingleMainMenu = false
                }

            },
            editsubmenu(idx,subidx) {
                this.menuEditing = this.menu[idx]['sub_button'][subidx]
                this.menuEditing.isMainMenu = false;
                this.menuEditingIdx = [idx,subidx]
            },
            delMenu() {
                var r=confirm("确认删除菜单?")
                if (r==true)
                {
                    if(this.menuEditingIdx.length == 1){
                        //主菜单
                        this.menu.splice(this.menuEditingIdx[0],1)
                    }else {
                        //子菜单
                        this.menu[this.menuEditingIdx[0]]['sub_button'].splice(this.menuEditingIdx[1],1)
                    }
                    this.menuEditing.isMainMenu = "init"
                    //this.$set(this.menu[idx]['sub_button'],this.menu[idx]['sub_button'].length,temp)
                }
            },
            save() {
                this.$axios({
                    url: '/wechat-menu-store',
                    method: 'post',
                    data: {'menu_info': JSON.stringify(this.menu)}
                }).then((res) => {
                    if(!res.data.error_code) {
                        this.getlist();
                        alert('保存成功')
                        return;
                    }
                    alert(res.data.error_msg)
                })
            },
            publish() {
                var r=confirm("Confirm to publish?")
                if(r == true) {
                    this.$axios({
                        url: '/wechat-menu-update',
                        method: 'post'
                    }).then((res) => {
                        if(!res.data.error_code) {
                            alert('发布成功')
                            return;
                        }
                        alert(res.data.error_msg)
                    })
                }
            },
            dragstart([idx,subidx,isMain]) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("isMain", isMain);
                event.dataTransfer.setData("idx", idx);
                event.dataTransfer.setData("subidx", subidx);
                event.dataTransfer.setDragImage(event.target, 0, 0);
            },
            dragend(event) {
                event.preventDefault();
            },
            dragover(event) {
                event.preventDefault();
            },
            dragenter(event) {
                event.target.style.background = '#efefef'
            },
            dragleave(event) {
                event.target.style.background = 'none'
            },
            drop([idx,subidx,isMain]) {
                event.preventDefault();
                let dtIsMain = event.dataTransfer.getData("isMain");
                let dtIdx = event.dataTransfer.getData("idx");
                let dtSubIdx = event.dataTransfer.getData("subidx");
                event.target.style.background = 'none'
                if(dtIsMain != isMain) return;
                if(isMain){
                    this.menu.splice( idx, 1, ...this.menu.splice(dtIdx, 1, this.menu[idx]))
                    return
                }
                if(idx == dtIdx){
                    //同列
                    this.menu[idx]["sub_button"].splice( subidx, 1, ...this.menu[idx]["sub_button"].splice(dtSubIdx, 1, this.menu[idx]["sub_button"][subidx]))
                } else {
                    this.menu[idx]["sub_button"].splice( subidx, 1, ...this.menu[dtIdx]["sub_button"].splice(dtSubIdx, 1, this.menu[idx]["sub_button"][subidx]))
                }

            }

        }
    }
</script>

<style>
    #account table td{
        word-break: break-all;
    }
    .btn-create {
        margin-bottom: 20px ;
    }
    .app {
        min-height: 420px;
        margin-top: 20px;
        min-width: 970px;
        position: relative;
        padding-bottom: 100px;
        overflow: hidden;
    }
    .app-preview {
        width: 320px;
        height:480px;
        border: 1px solid #ccc;
        position: relative;
        float: left;
    }
    .app-header {
        width: 100%;
        height: 64px;
        background: url(../../img/bg_mobile_head.png) no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
        padding-top: 30px;
        text-align: center;
        color: #fff;
    }
    .app-content {
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;
        border-top: 1px solid #ccc;
        background: url(../../img/bg_mobile_foot.png) no-repeat;
    }
    .no-menu {
        width: 100%;
        text-align: center;
        line-height: 50px;
    }
    .menus {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        padding-left: 45px;
    }
    .menus > li{
        height: 50px;
        line-height: 50px;
        list-style:none;
        border-right: 1px solid #ccc;
        flex-grow: 1;
        text-align: center;
        position: relative;

    }
    .menus > li:last-child {
        border-right: 0;
    }
    .menus li {
        list-style: none;
    }
    .menus > li p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sub-menu {
        position: absolute;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 80%;
        bottom: 60px;
        left: 10%;
    }
    .sub-menu ul{
        margin: 0;
        padding: 0;
    }
    .sub-menu li {
        width: 100%;
        height: 40px;
        line-height:40px;;
        border-bottom: 1px solid #ccc;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .app-side {
        float: left;
        margin: 71px 0 0 0;
    }
    .app {
        font-size: 14px;
    }
    .app-side>div {
        position: relative;
        padding-bottom: 20px;
        width: 600px;
        margin-left: 20px;
    }
    .app .panel {
        border: none;
        box-shadow: none;
    }
    .app .app-side h3{
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .app .app-side .alert{
        background: #f8f8f8;
        width: 100%;
        margin-bottom: 0;
        overflow: hidden;
    }
    .app .form-group {margin-bottom: 15px;overflow: hidden;}
    .app .app-side{margin:71px 0 0 0;}
    .app .app-side .panel-body{padding:12px 10px;}
    .app .app-side>div{position:relative; padding-bottom:20px; width:600px; margin-left:20px;}
    .app .app-side .card{padding:20px; margin:0 20px 20px 0; border:1px solid #ddd; background:#FFF;}
    .app .app-side .arrow-left,.app .app-side .arrow-left:after{width: 0; height: 0; border-style: solid; border-width: 8px 10px 8px 0; border-color: transparent #d1d1d1 transparent transparent; position: absolute; left: -10px; top: 19px;}
    .app .app-side .arrow-left:after{content: ""; border-right-color: #f8f8f8; left: 1px; top: -8px;}
    .app .app-side .card .divider{margin:15px 0; padding-right:30px; width:95%;border-top:1px solid #DDD;}
    .app .app-side .card .btns{display:none;}
    .app .app-side .card:hover .btns{display:block;}
    .app .col-2, .app .col-10 {float: left;}
    .app .menu-action .radio-inline {
        width: 32.5%;
        padding: 5px 0 5px 20px;
        margin-left: 0;
    }
    .menu .btn {
        margin-right: 10px;
    }

</style>

