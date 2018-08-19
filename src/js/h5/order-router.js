
import Vue from 'vue';
import Router from 'vue-router';
// 引入组件
import List from './orderList.vue';
import Detail from './orderDetail.vue';

Vue.use(Router);
export default new Router({
    base: '/',
    routes: [
        {
            path: '/',
            component: List
        },
        {
            path: '/detail',
            component: Detail
        }
    ]
});
