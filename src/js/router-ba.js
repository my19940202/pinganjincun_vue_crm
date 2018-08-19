
import Vue from 'vue';
import Router from 'vue-router';
// 引入组件
import Product from './pages/ba/Product.vue';
import ProductEdit from './pages/ba/ProductEdit.vue';
import ProductCreate from './pages/ba/ProductCreate.vue';
import createRedeem from './pages/ba/createRedeem.vue';
import manageRedeem from './pages/ba/manageRedeem.vue';
import Order from './pages/ba/Order.vue';
import CreateOrder from './pages/ba/CreateOrder.vue';
import Test from './pages/ba/Test.vue';
import Welcome from './pages/ba/Welcome.vue';

Vue.use(Router);
export default new Router({
    base: '/',
    routes: [
        {
            path: '/',
            component: Welcome
        },
        {
            path: '/product',
            component: Product
        },
        {
            path: '/product/edit',
            component: ProductEdit
        },
        {
            path: '/product/create',
            component: ProductCreate
        },
        {
            path: '/createRedeem',
            component: createRedeem
        },
        {
            path: '/manageRedeem',
            component: manageRedeem
        },
        {
            path: '/order',
            component: Order
        },
        {
            path: '/createOrder',
            component: CreateOrder
        },
        {
            path: '/test',
            component: Test
        }
    ]
});
