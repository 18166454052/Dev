import request from '@/utils/request'

export function cepStreamCreate(data) { //
  return request({
    url: 'piping/gateway/cep/stream/add',
    method: 'post',
    data
  })
}
export function cepStreamDelete(params) { //
  return request({
    url: 'piping/gateway/cep/stream/delete',
    method: 'post',
    params
  })
}
export function cepStreamDetail(params) { //
  return request({
    url: 'piping/gateway/cep/stream/detail',
    method: 'post',
    params
  })
}
export function cepStreamUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/stream/update',
    method: 'post',
    data
  })
}
export function cepStreamTemplate(data) { //
  return request({
    url: 'piping/gateway/cep/stream/template',
    method: 'post',
    data
  })
}
export function cepStreamColumnDetail(params) { //
  return request({
    url: 'piping/gateway/cep/stream/column/detailByCepStreamId',
    method: 'post',
    params
  })
}
export function cepStreamColumnCreate(data) { //
  return request({
    url: 'piping/gateway/cep/stream/column/add',
    method: 'post',
    data
  })
}
export function cepStreamColumnUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/stream/column/update',
    method: 'post',
    data
  })
}
export function cepStreamColumnDelete(params) { //
  return request({
    url: 'piping/gateway/cep/stream/column/delete',
    method: 'post',
    params
  })
}
export function cepStreamStats(data) {
  return request({
    url: '1/cep/stream/stats_show',
    method: 'post',
    data
  })
}
export function cepStreamColumnList(params) { //
  return request({
    url: 'piping/gateway/cep/stream/column/list',
    method: 'post',
    params
  })
}
