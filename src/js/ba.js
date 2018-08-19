
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import './../css/index.css';
import axios from 'axios';
import router from './router-ba';
import App from './ba.vue';
require('./bootstrap');

window.Vue = require('vue');
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
axios.interceptors.request.use(config => {
    config.headers['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');
    return config;
});

const app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
});
