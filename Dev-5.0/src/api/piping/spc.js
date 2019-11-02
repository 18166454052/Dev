import request from '@/utils/request'

export function cepSpcCreate(data) {
  return request({
    url: 'piping/gateway/cep/spc/add',
    method: 'post',
    data
  })
}
export function cepSpcUpdate(data) {
  return request({
    url: 'piping/gateway/cep/spc/update',
    method: 'post',
    data
  })
}
export function cepSpcDetail(params) {
  return request({
    url: 'piping/gateway/cep/spc/detail',
    method: 'post',
    params
  })
}
export function cepSpcDelete(params) {
  return request({
    url: 'piping/gateway/cep/spc/delete',
    method: 'post',
    params
  })
}
