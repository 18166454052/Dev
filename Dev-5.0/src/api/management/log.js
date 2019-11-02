import request from '@/utils/request'

export function userList(data) { //
  return request({
    url: 'rae/user/queryUser',
    method: 'post',
    data
  })
}
export function logType(data) { //
  return request({
    url: 'rae/user/queryType',
    method: 'post',
    data
  })
}
export function logList(data) { //
  return request({
    url: 'rae/user/log',
    method: 'post',
    data
  })
}