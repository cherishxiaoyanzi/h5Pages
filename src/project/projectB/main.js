import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import inject from '../../inject/index'
import api from './api/index'

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.use(inject)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
