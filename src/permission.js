import router from '@/router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '404']
router.beforeEach((to, from, next) => {
  Nprogress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      Nprogress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        store.dispatch('user/getInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  Nprogress.done()
})
