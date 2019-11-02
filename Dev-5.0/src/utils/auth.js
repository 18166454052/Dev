import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
//
// export function getToken() {
//   return Cookies.get(TokenKey)
// }
//
// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }
//
// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

const sessionId = 'token'
const loginName = 'LOGIN_NAME'
const active = 'ACTIVE'
const managementType = 'MANAGEMENT_TYPE'
const userId = 'userId'
const userRole = 'USER_ROLE' // 2：管理员，3：编辑者，4：浏览者
const username = 'USERNAME'
const logintime = 'LOGIN_TIME'

export function getUsername() {
  return Cookies.get(username)
}
export function setUsername(name) {
  return Cookies.set(username, name)
}
export function getLoginTime() {
  return Cookies.get(logintime)
}
export function setLoginTime(time) {
  return Cookies.set(logintime, time)
}
/* session */
export function getSessionId() {
  return Cookies.get(sessionId)
}
export function setSessionId(token) {
  return Cookies.set(sessionId, token, { expires: 1 })
}
export function removeSessionId() {
  return Cookies.remove(sessionId)
}
/* login userId */
export function getUserId() {
  return Cookies.get(userId)
}
export function setUserId(userid) {
  return Cookies.set(userId, userid, { expires: 1 })
}
export function removeLoginName() {
  return Cookies.remove(loginName)
}
// USER ROLE
export function getUserRole() {
  return Cookies.get(userRole)
}
export function setUserRole(role) {
  return Cookies.set(userRole, role, { expires: 1 })
}
export function removeUserRole() {
  return Cookies.remove(userRole)
}
/* UID */
export function getActive() {
  return Cookies.get(active)
}
export function setActive(Active) {
  return Cookies.set(active, Active)
}

/*  management type  */
export function getManagementType() {
  return Cookies.get(managementType)
}
export function setManagementType(type) {
  return Cookies.set(managementType, type)
}
export function removeManagementType() {
  return Cookies.remove(managementType)
}
