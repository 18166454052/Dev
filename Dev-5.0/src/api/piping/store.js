import request from '@/utils/request'

export function cepStoreCreate(data) {
  return request({
    url: 'piping/gateway/cep/store/add',
    method: 'post',
    data
  })
}
export function cepStoreDetail(params) {
  return request({
    url: 'piping/gateway/cep/store/detail',
    method: 'post',
    params
  })
}
export function cepStoreUpdate(data) {
  return request({
    url: 'piping/gateway/cep/store/update',
    method: 'post',
    data
  })
}
export function cepStoreDelete(params) {
  return request({
    url: 'piping/gateway/cep/store/delete',
    method: 'post',
    params
  })
}
export function cepStoreTemplate(data) {
  return request({
    url: 'piping/gateway/cep/store/template',
    method: 'post',
    data
  })
}
// rdbms
export function cepStoreRdbmsCreate(data) {
  return request({
    url: 'piping/gateway/cep/store/rdbms/add',
    method: 'post',
    data
  })
}
export function cepStoreRdbmsUpdate(data) {
  return request({
    url: 'piping/gateway/cep/store/rdbms/update',
    method: 'post',
    data
  })
}
export function cepStoreRdbmsDetail(params) {
  return request({
    url: '/piping/gateway/cep/store/rdbms/detailByCepStoreId',
    method: 'post',
    params
  })
}
// hbase

export function cepStoreHbaseCreate(data) {
  return request({
    url: 'piping/gateway/cep/store/hbase/add',
    method: 'post',
    data
  })
}
export function cepStoreHbaseUpdate(data) {
  return request({
    url: 'piping/gateway/cep/store/hbase/update',
    method: 'post',
    data
  })
}
export function cepStoreHbaseDetail(params) {
  return request({
    url: 'piping/gateway/cep/store/hbase/detailByCepStoreId',
    method: 'post',
    params
  })
}
