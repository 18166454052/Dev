import request from '@/utils/request'
// source
export function cepSourceCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/add',
    method: 'post',
    data
  })
}
export function cepSourceUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/source/update',
    method: 'post',
    data
  })
}
export function cepSourceDelete(params) { //
  return request({
    url: 'piping/gateway/cep/source/delete',
    method: 'post',
    params
  })
}
export function cepSourceDetail(params) { //
  return request({
    url: 'piping/gateway/cep/source/detail',
    method: 'post',
    params
  })
}
export function cepSourceTemplate(params) { //
  return request({
    url: 'piping/gateway/cep/source/template',
    method: 'post',
    params
  })
}
// http
export function cepSourceHttpCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/http/add',
    method: 'post',
    data
  })
}
export function cepSourceHttpUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/source/http/update',
    method: 'post',
    data
  })
}
export function cepSourceHttpDetail(params) { //
  return request({
    url: 'piping/gateway/cep/source/http/detailByCepSourceId',
    method: 'post',
    params
  })
}
// kafka
export function cepSourceKafkaCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/kafka/add',
    method: 'post',
    data
  })
}
export function cepSourceKafkaUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/source/kafka/update',
    method: 'post',
    data
  })
}
export function cepSourceKafkaDetail(params) { //
  return request({
    url: 'piping/gateway/cep/source/kafka/detailByCepSourceId',
    method: 'post',
    params
  })
}
// mqtt
export function cepSourceMqttCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/mqtt/add',
    method: 'post',
    data
  })
}
export function cepSourceMqttUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/source/mqtt/update',
    method: 'post',
    data
  })
}
export function cepSourceMqttDetail(params) { //
  return request({
    url: 'piping/gateway/cep/source/mqtt/detailByCepSourceId',
    method: 'post',
    params
  })
}
// tcp
export function cepSourceTcpCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/tcp/add',
    method: 'post',
    data
  })
}
export function cepSourceTcpUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/source/tcp/update',
    method: 'post',
    data
  })
}
export function cepSourceTcpDetail(params) { //
  return request({
    url: 'piping/gateway/cep/source/tcp/detailByCepSourceId',
    method: 'post',
    params
  })
}
// map
export function cepSourceMapCreate(data) { //
  return request({
    url: 'piping/gateway/cep/source/map/add',
    method: 'post',
    data
  })
}
export function cepSourceMapDetail(params) { // 已经提交的Map列表
  return request({
    url: 'piping/gateway/cep/source/map/detailByCepSourceId',
    method: 'post',
    params
  })
}

export function cepSourceMapDelete(params) { //
  return request({
    url: 'piping/gateway/cep/source/map/delete',
    method: 'post',
    params
  })
}

/* ********************************************************************* */


export function cepSourceStats(data) { //
  return request({
    url: '1/cep/source/stats_show',
    method: 'post',
    data
  })
}
export function cepSourceMapperStats(data) { //
  return request({
    url: '1/cep/sourceMapper/stats_show',
    method: 'post',
    data
  })
}