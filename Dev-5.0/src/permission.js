import router from './router'
import store from './store'
import { Message } from 'element-ui'
import {
  getSessionId, removeSessionId
} from '@/utils/auth'
// import { checkSessionId } from  '@/api/user/login';

// permissiom judge function
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['', '/', '/login', '/404', '/logout', '/regist/:key'] // no redirect whitelist

// router.beforeEach((to, from, next) => {
//   store.commit('SET_TASK',false)
//   let routeName = { // 导航栏的链接的 name和 index
//     'Folder': '1-1',
//     'Spc': '1-2',
//     // 'Msa': '1-3',
//     // 'Gateway': '1-4',
//     'Home': '2-1',
//     // 'Bpy': '2-2',
//     // 'Cnc': '2-3',
//     // 'CncReal': '2-4',
//     // 'CncHistory': '2-5',
//     'Configuration': '3-1',
//     'Monitor': '3-7',
//     'Email': '3-8',
//     'Department': '3-9'
//   }
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   if (routeName[to.name]) {
//     store.commit('SET_ACTIVEINDEX', routeName[to.name])
//   }
//   if (!getSessionId()) {
//     if (to.path != '/login') {
//       next({ path: '/login' })
//       removeSessionId();
//       store.commit('RESET_USER');
//     }
//   }
//   next();
// /*
//   if (getSessionId()) { // determine if there has token
//     // has token
//      else {
//       if (!store.getters.role.length > 0) { // 判断当前用户是否已拉取完user_info信息
//         store.dispatch('GetUserInfo').then(res => { // 拉取user_info
//           next(to.path);
//         }).catch(() => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error('用户信息验证失败，请重新登录')
//             next({ path: '/login' })
//             removeSessionId();
//             store.commit('RESET_USER');
//           })
//         })
//       } else {
//         next();
//       }
//     }
//   } else {
//     // has no token
//     if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
//       next()
//     } else {
//       next('/login') // 否则全部重定向到登录页
//       removeSessionId();
//       store.commit('RESET_USER');
//     }
//   }*/
// })



/*
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    // if(to.path == '/login') {
    //   removeSessionId();
    //   store.commit('RESET_USER');
    // }
    next()
  } 
  else {
    if (getSessionId()) {
      if (!store.getters.role) {
        store.dispatch('GetUserInfo').then(() => {
          next()
        })
      }
      else {
        next()
      }
    } else {
      next('/login')
    } 
  }
})
*/

router.afterEach(() => {
})
