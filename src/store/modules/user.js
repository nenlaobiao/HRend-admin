import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, setTime } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken (state, data) {
    state.token = data
  },
  setUserInfo (state, data) {
    state.userInfo = data
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data)
      console.log(res)
      setToken(res)
      setTime(Date.now())
      context.commit('setToken', res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...res1 })
  },
  logout (context) {
    setToken('')
    context.commit('setToken', '')
    context.commit('setUserInfo', '')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

