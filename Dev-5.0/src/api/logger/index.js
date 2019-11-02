import request from '@/utils/request'
export function logList(params) {
  return request({
    url: 'tb/log/info/list',
    method: 'post',
    params
  })
}
