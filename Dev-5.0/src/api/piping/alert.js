import request from '@/utils/request'

export function cepAlertCreate(data) {
  return request({
    url: '1/cep/alert/create',
    method: 'post',
    data
  })
}
export function cepAlertDetail(data) {
  return request({
    url: '1/cep/alert/detail',
    method: 'post',
    data
  })
}
export function cepAlertUpdate(data) {
  return request({
    url: '1/cep/alert/update',
    method: 'post',
    data
  })
}
export function cepAlertDelete(data) {
  return request({
    url: '1/cep/alert/destroy',
    method: 'post',
    data
  })
}
export function cepAlertConfigDestroy(data) {
  return request({
    url: '1/cep/alertConfig/destroy',
    method: 'post',
    data
  })
}