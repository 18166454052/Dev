import request from '@/utils/request'

export function folderCreate(data) {
  return request({
    url: 'tb/folder/editor/add',
    method: 'post',
    data
  })
}
export function folderUpdate(data) {
  return request({
    url: 'tb/folder/editor/update',
    method: 'post',
    data
  })
}
export function folderDelete(params) {
  return request({
    url: 'tb/folder/editor/delete',
    method: 'post',
    params
  })
}
export function folderList(params) {
  return request({
    url: 'tb/folder/viewer/list',
    method: 'post',
    params
  })
}
export function folderDetail(params) {
  return request({
    url: 'tb/folder/viewer/detail',
    method: 'post',
    params
  })
}
export function folderTasks(params) { // 获取 folder下的所有列表
  return request({
    url: 'tb/folder/viewer/tasks',
    method: 'post',
    params
  })
}

/* folder  role  废弃 */

export function folderRoleCreate(data) { // folder  配置角色
  return request({
    url: 'tb/permission/role/folder/add',
    method: 'post',
    data
  })
}
export function folderRoleUpdate(data) { // folder  配置角色
  return request({
    url: 'tb/permission/role/folder/update',
    method: 'post',
    data
  })
}
export function folderRoleDelete(params) { // folder
  return request({
    url: 'tb/permission/role/folder/delete',
    method: 'post',
    params
  })
}
export function folderRoleList(params) { // folder
  return request({
    url: 'tb/permission/role/folder/list',
    method: 'post',
    params
  })
}

/* folder  user */
export function folderUserCreate(data) { // folder 配置用户
  return request({
    url: 'tb/permission/user/folder/editor/add',
    method: 'post',
    data
  })
}
export function folderUserUpdate(data) { // folder 配置用户
  return request({
    url: 'tb/permission/user/folder/editor/update',
    method: 'post',
    data
  })
}
export function folderUserList(params) { // folder-user
  return request({
    url: 'tb/permission/user/folder/viewer/list',
    method: 'post',
    params
  })
}
export function folderUserDelete(params) { // folder-user
  return request({
    url: 'tb/permission/user/folder/editor/delete',
    method: 'post',
    params
  })
}

