import request from '@/utils/requestFlink'

export function overview() { //
  return request({
    url: 'overview',
    method: 'get'
  })
}
export function jobs() { //
  return request({
    url: 'jobs',
    method: 'get'
  })
}
export function jobById(obj) { //
  return request({
    url: 'jobs/' + obj.jid,
    method: 'get'
  })
}
export function jobExceptions(obj) { //
  return request({
    url: 'jobs/' + obj.id + '/exceptions',
    method: 'get'
  })
}
export function jobConfig(obj) { //
  return request({
    url: 'jobs/' + obj.id + '/config',
    method: 'get'
  })
}
