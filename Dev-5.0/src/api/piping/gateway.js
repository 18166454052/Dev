import request from '@/utils/request'

export function gatewayCreate(data) {
  return request({
    url: 'piping/gateway/add',
    method: 'post',
    data
  })
}
export function gatewayUpdate(data) {
  return request({
    url: 'piping/gateway/update',
    method: 'post',
    data
  })
}
export function gatewayDetail(params) {
  return request({
    url: 'piping/gateway/detail',
    method: 'post',
    params
  })
}
export function gatewayDelete(params) {
  return request({
    url: 'piping/gateway/delete',
    method: 'post',
    params
  })
}
export function gatewayList(params) {
  return request({
    url: 'piping/gateway/list',
    method: 'post',
    params
  })
}
