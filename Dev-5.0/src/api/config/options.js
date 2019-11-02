import request from '@/utils/request'

export function menuAdd(data) { //
  return request({
    url: 'user/menuAdd',
    method: 'post',
    data
  })
}
export function menuDelete(data) { //
  return request({
    url: 'user/menuDelete',
    method: 'post',
    data
  })
}
export function menuUpdate(data) { //
  return request({
    url: 'user/menuUpdate',
    method: 'post',
    data
  })
}
export function menuDetail(data) { //
  return request({
    url: 'user/menuDetail',
    method: 'post',
    data
  })
}
export function menuList(data) { //
  return request({
    url: 'user/menuList',
    method: 'post',
    data
  })
}