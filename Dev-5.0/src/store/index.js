import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import getters from './getters'
import management from './modules/management'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    user,
    management
  },
  getters
})

export default store
