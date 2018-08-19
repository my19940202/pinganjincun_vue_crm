import Vue from 'vue';
import axios from 'axios';
import App from './orderEntry.vue';
import router from './order-router';
import 'bootstrap/dist/css/bootstrap.min.css';

window.Vue = require('vue');
Vue.prototype.$axios = axios;

const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
