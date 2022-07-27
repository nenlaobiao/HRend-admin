import Vue from 'vue'
// 引入第三方库、让不同浏览器渲染时保持样式一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 语言国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 全局公共样式
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import component from '@/components'
import '@/permission' // permission control
import * as obj from '@/directives'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.use(component)
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * MockJs 仅在开发时使用、上线前请删除
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
// 控制台生产提示
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
