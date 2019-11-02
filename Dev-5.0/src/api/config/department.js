import request from '@/utils/request'

export function add(data) { //
  return request({
    url: 'tb/department/add',
    method: 'post',
    data
  })
}
export function update(data) { //
  return request({
    url: 'tb/department/update',
    method: 'post',
    data
  })
}
export function detail(params) { //
  return request({
    url: 'tb/department/detail',
    method: 'post',
    params
  })
}
export function del(params) { //
  return request({
    url: 'tb/department/delete',
    method: 'post',
    params
  })
}
export function list(params) { //
  return request({
    url: 'tb/department/list',
    method: 'post',
    params
  })
}

export function getChildren(params) { //
  return request({
    url: 'tb/department/getChildren',
    method: 'post',
    params
  })
}
