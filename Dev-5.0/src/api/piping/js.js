import request from '@/utils/request'

export function cepJsCreate(data) { //
  return request({
    url: 'piping/gateway/cep/js/add',
    method: 'post',
    data
  })
}
export function cepJsUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/js/update',
    method: 'post',
    data
  })
}
export function cepJsDelete(params) { //
  return request({
    url: 'piping/gateway/cep/js/delete',
    method: 'post',
    params
  })
}
export function cepJsDetail(params) { //
  return request({
    url: 'piping/gateway/cep/js/detail',
    method: 'post',
    params
  })
}
export function cepJsTemplate(params) { //
  return request({
    url: 'piping/gateway/cep/js/template',
    method: 'post',
    params
  })
}
