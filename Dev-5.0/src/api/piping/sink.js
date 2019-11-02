import request from '@/utils/request'

export function cepSinkCreate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/add',
    method: 'post',
    data
  })
}
export function cepSinkUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/update',
    method: 'post',
    data
  })
}
export function cepSinkDelete(params) { //
  return request({
    url: 'piping/gateway/cep/sink/delete',
    method: 'post',
    params
  })
}
export function cepSinkDetail(params) { //
  return request({
    url: 'piping/gateway/cep/sink/detail',
    method: 'post',
    params
  })
}
// http
export function cepSinkHttpCreate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/http/add',
    method: 'post',
    data
  })
}
export function cepSinkHttpUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/http/update',
    method: 'post',
    data
  })
}
export function cepSinkHttpDetail(params) { //
  return request({
    url: 'piping/gateway/cep/sink/http/detailByCepSinkId',
    method: 'post',
    params
  })
}
// kafka
export function cepSinkKafkaCreate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/kafka/add',
    method: 'post',
    data
  })
}
export function cepSinkKafkaUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/kafka/update',
    method: 'post',
    data
  })
}
export function cepSinkKafkaDetail(params) { //
  return request({
    url: 'piping/gateway/cep/sink/kafka/detailByCepSinkId',
    method: 'post',
    params
  })
}
// tcp
export function cepSinkTcpCreate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/tcp/add',
    method: 'post',
    data
  })
}
export function cepSinkTcpUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/tcp/update',
    method: 'post',
    data
  })
}
export function cepSinkTcpDetail(params) { //
  return request({
    url: 'piping/gateway/cep/sink/tcp/detailByCepSinkId',
    method: 'post',
    params
  })
}
// mqtt
export function cepSinkMqttCreate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/mqtt/add',
    method: 'post',
    data
  })
}
export function cepSinkMqttUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/sink/mqtt/update',
    method: 'post',
    data
  })
}
export function cepSinkMqttDetail(params) { //
  return request({
    url: 'piping/gateway/cep/sink/mqtt/detailByCepSinkId',
    method: 'post',
    params
  })
}




/* ****************************************************/

export function cepSinkStats(data) { //
  return request({
    url: '1/cep/sink/stats_show',
    method: 'post',
    data
  })
}
export function cepSinkMapperStats(data) { //
  return request({
    url: '1/cep/sinkMapper/stats_show',
    method: 'post',
    data
  })
}
export function getTopic(data) { //
  return request({
    url: '1/cep/sink/topic',
    method: 'post',
    data
  })
}