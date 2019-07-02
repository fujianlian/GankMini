import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false

const app = new Vue({
  mpType: 'app',
  ...App
})
app.$mount()
