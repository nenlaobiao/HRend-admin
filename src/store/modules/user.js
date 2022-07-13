import { login } from '@/api/user'
const state = {
  token: null
}
const mutations = {
  setToken (state, data) {
    state.token = data
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data, context)
      console.log(res)
      context.commit('setToken', res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

