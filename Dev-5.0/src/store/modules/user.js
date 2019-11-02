import { login, logout } from '@/api/user/login'
import { removeSessionId, setSessionId, setUserId, setUserRole, setUsername, setLoginTime } from '@/utils/auth'
import { userInfo } from '@/api/config/user'
import store from '../../store'
import router from '../../router'
import {parseTime} from '@/utils/nowtime.js'
const user = {
  state: {
    nickname: '',
    userId: '',
    userRole: 4 // 默认
  },

  mutations: {
    SET_USER: (state, userInfo) => {
      state.nickname = userInfo.nickname
      state.userId = userInfo.userId
      state.userRole = userInfo.userRole
    },
    RESET_USER: (state) => {
      state.nickname = '' ;
      state.userId = '' ;
      state.userRole = '' ;
    },
    SET_USER_ROLE: (state, userRole) => {
      if (userRole) {
        state.userRole = userRole
      }
      else {
        state.userRole = 4 
      }
     
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code == 200) {
            console.log('登录');
            console.log(response.data);
            setSessionId(response.data.accessToken)
            setUserId(response.data.userId)
            setUserRole(response.data.userRole)
            setUsername(response.data.username)
            setLoginTime(parseTime())
            commit('SET_USER_ROLE', response.data.userRole)

          }
          resolve(response)
        }).catch(function(error) {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        userInfo().then(res => {
         
          commit('SET_USER', res.data)
          // cookie保存登录状态,仅靠vuex保存的话,页面刷新就会丢失登录状态
          setSessionId() 
          // 生成路由
          // let userPermission = res.data ;
          // store.dispatch('GenerateRoutes', userPermission).then(() => {
          //   // 生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
          //   router.addRoutes( store.getters.addRouters)
          // })
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {

      return new Promise((resolve, reject) => {
        logout().then(function(response) {
          
          if(response.code==200) {
            removeSessionId();
            commit('RESET_USER')
            resolve(response);
          }else{
            reject(response);
          } 
        }).catch(function(err){
            reject(err)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_SESSION', '')
        removeSessionId();
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        // setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
