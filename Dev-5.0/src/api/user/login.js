import request from '@/utils/request'

// export function login(data) { // project_id
//   return request({
//     url: 'rae/user/login',
//     method: 'post',
//     data
//   })
// }
export function login(params) {
  return request({
    url: 'tb/user/viewer/login',
    method: 'post',
    params
  })
}
export function update(data) {
  return request({
    url: 'tb/user/viewer/update',
    method: 'post',
    data
  })
}
export function detail(params) {
  return request({
    url: 'tb/user/viewer/detail',
    method: 'post',
    params
  })
}
export function refresh(data) {
  return request({
    url: 'tb/user/admin/refresh',
    method: 'post',
    data
  })
}
export function logout() {
  return request({
    url: 'tb/user/viewer/logout',
    method: 'post'
  })
}

