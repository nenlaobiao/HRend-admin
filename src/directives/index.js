import store from '@/store'
export const imgerror = {
  // inserted (el, binding) {
  //   // el.src=binding.values
  //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  // },

  update (el, binding) {
    if (!store.getters.avatar || store.getters.avatar === ' ') {
      // el.src=binding.values
      el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
