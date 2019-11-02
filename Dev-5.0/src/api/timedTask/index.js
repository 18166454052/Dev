import request from '@/utils/request'

export function timedList(data) { //
  return request({
    url: '1/timing/config/list',
    method: 'post',
    data: data
  })
}
export function timedCreate(data) { //
  return request({
    url: '1/timing/config/create',
    method: 'post',
    data: data
  })
}
export function timedUpdate(data) { //
  return request({
    url: '1/timing/config/update',
    method: 'post',
    data: data
  })
}
export function timedDetail(data) { //
  return request({
    url: '1/timing/config/detail',
    method: 'post',
    data: data
  })
}
export function timedDelete(data) { //
  return request({
    url: '1/timing/config/delete',
    method: 'post',
    data: data
  })
}
export function timedStart(data) { //
  return request({
    url: '1/timing/config/start',
    method: 'post',
    data: data
  })
}
export function timedStop(data) { //
  return request({
    url: '1/timing/config/stop',
    method: 'post',
    data: data
  })
}
