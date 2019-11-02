import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import * as filters from './filters' // global filters
import {
  hasPermission,
  hasMenus
} from './utils/hasPermission'
import { getUserRole } from './utils/auth'
// 全局的常量
require('echarts/theme/shine')
Vue.prototype.hasPerm = hasPermission
Vue.prototype.hasMenu = hasMenus
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
import VCharts from 'v-charts'
Vue.use(VCharts)
// import VeLine from 'v-charts/lib/line'
// import VeRing from 'v-charts/lib/ring'
// import VeHistogram from 'v-charts/lib/histogram'
// Vue.component(VeLine.name, VeLine)
// Vue.component(VeRing.name, VeRing)
// Vue.component(VeHistogram.name, VeHistogram)

// import VueSocketio from 'vue-socket.io'
// Vue.use(VueSocketio, 'http://192.168.1.104:9090')
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.$Bus = new Vue()
Vue.prototype.$Role = getUserRole()
Vue.prototype.$Height = function() {
  let winHeight
  if (window.innerHeight) {
    winHeight = window.innerHeight
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight
  }
  return winHeight
}
Vue.prototype.$checkName = function(rule, value, callback) {
  if (value.indexOf('_') >= 0) {
    callback(new Error('节点名称不能包含下划线_'))
  } else {
    callback()
  }
}

/* 代码编辑 */
import 'codemirror/lib/codemirror.css'
/* */
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

store.commit('SET_USER_ROLE', getUserRole()) // 刷新重新获取roleName
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
