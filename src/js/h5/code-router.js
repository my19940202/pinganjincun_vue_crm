
import Vue from 'vue';
import Router from 'vue-router';
// 引入组件
import CodeForm from './codeForm.vue';
import OrderForm from './codeOrder.vue';
import CodeSuccess from './codeSuccess.vue';

Vue.use(Router);
export default new Router({
    base: '/',
    routes: [
        {
            path: '/',
            component: CodeForm
        },
        {
            path: '/order',
            component: OrderForm
        },
        {
            path: '/success',
            component: CodeSuccess
        }
    ]
});
