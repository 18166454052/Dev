import request from '@/utils/request'

export function cepTableCreate(data) { //
  return request({
    url: 'piping/gateway/cep/table/add',
    method: 'post',
    data
  })
}
export function cepTableUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/table/update',
    method: 'post',
    data
  })
}
export function cepTableDelete(params) { //
  return request({
    url: 'piping/gateway/cep/table/delete',
    method: 'post',
    params
  })
}
export function cepTableDetail(params) { //
  return request({
    url: 'piping/gateway/cep/table/detail',
    method: 'post',
    params
  })
}
//   columns
export function cepTableColumnCreate(data) { //
  return request({
    url: 'piping/gateway/cep/table/column/add',
    method: 'post',
    data
  })
}
export function cepTableColumnDelete(params) { //
  return request({
    url: 'piping/gateway/cep/table/column/delete',
    method: 'post',
    params
  })
}
/* *************************************************************** */
export function cepTableStats(data) { //
  return request({
    url: '1/cep/table/stats_show',
    method: 'post',
    data
  })
}
