import request from '@/utils/request'

export function roleList(data) { //
  return request({
    url: 'user/listRole',
    method: 'post',
    data
  })
}
export function permissionList(data) { //
  return request({
    url: 'user/listAllPermission',
    method: 'post',
    data
  })
}
export function addRole(data) { //
  return request({
    url: 'user/addRole',
    method: 'post',
    data
  })
}
export function updateRole(data) { //
  return request({
    url: 'user/updateRole',
    method: 'post',
    data
  })
}
export function deleteRole(data) { //
  return request({
    url: 'user/deleteRole',
    method: 'post',
    data
  })
}
