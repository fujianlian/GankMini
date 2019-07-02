import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'
import Base from './base'

var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
fly.config.baseURL = 'https://gank.io/api/'
Vue.prototype.$http = fly

Vue.use(MpvueRouterPatch)
Vue.use(Base)
Vue.config.productionTip = false

wx.cloud.init({
  env: 'ganker-trcpu',
  traceUser: true
})

const app = new Vue({
  mpType: 'app',
  ...App
})
app.$mount()
