import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import inject from '../../inject/index'
import api from './api/index'
import {Icon, Toast} from 'vant';
import 'vant/lib/index.css';
import './assets/style/reset.css';
import VConsole from 'vconsole'
console.log('process.env.NODE_ENV111', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production'){
  new VConsole()
}

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$toast = Toast
Vue.use(inject)
Vue.use(Icon)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
