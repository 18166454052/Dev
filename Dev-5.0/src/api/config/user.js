import request from '@/utils/request'

export function addUser(data) { //
  return request({
    url: 'tb/user/admin/add',
    method: 'post',
    data
  })
}

export function userList(params) { //
  return request({
    url: 'tb/user/editor/list',
    method: 'post',
    params
  })
}
export function userDetail(params) { //
  return request({
    url: 'tb/user/admin/detail',
    method: 'post',
    params
  })
}
export function updateUser(data) { //
  return request({
    url: 'tb/user/admin/update',
    method: 'post',
    data
  })
}
export function deleteUser(params) { //
  return request({
    url: 'tb/user/admin/delete',
    method: 'post',
    params
  })
}





export function userSpcList(data) { //
  return request({
    url: 'user/spcUserList',
    method: 'post',
    data
  })
}
export function getAllRoles(data) { //
  return request({
    url: 'user/getAllRoles',
    method: 'post',
    data
  })
}

export function userInfo(data) { //
  return request({
    url: 'auth/getInfo',
    method: 'post',
    data
  })
}



export function addSpc(data) { //
  return request({
    url: 'user/addUserSpc',
    method: 'post',
    data
  })
}
export function updateSpc(data) { //
  return request({
    url: 'user/updateUserSpc',
    method: 'post',
    data
  })
}
export function deleteSpc(data) { //
  return request({
    url: 'user/deleteUserSpc',
    method: 'post',
    data
  })
}
export function getSpc(data) { //
  return request({
    url: 'user/findUserSpc',
    method: 'post',
    data
  })
}

