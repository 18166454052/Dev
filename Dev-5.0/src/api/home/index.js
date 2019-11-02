import request from '@/utils/request'

/* 收藏 */
export function collectionCreate(data) {
  return request({
    url: 'tb/user/collection/viewer/add',
    method: 'post',
    data
  })
}
export function collectionUpdate(data) {
  return request({
    url: 'tb/user/collection/viewer/update',
    method: 'post',
    data
  })
}
export function collectionDelete(params) {
  return request({
    url: 'tb/user/collection/viewer/delete',
    method: 'post',
    params
  })
}
export function collectionList(params) {
  return request({
    url: 'tb/user/collection/viewer/list',
    method: 'post',
    params
  })
}
/* 浏览记录 */
export function viewAdd(data) {
  return request({
    url: 'tb/user/view/viewer/add',
    method: 'post',
    data
  })
}
export function viewUpdate(data) {
  return request({
    url: 'tb/user/view/viewer/update',
    method: 'post',
    data
  })
}
export function viewDelete(params) {
  return request({
    url: 'tb/user/view/viewer/delete',
    method: 'post',
    params
  })
}
export function viewList(params) {
  return request({
    url: 'tb/user/view/viewer/list',
    method: 'post',
    params
  })
}
