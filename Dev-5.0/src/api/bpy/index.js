import request from '@/utils/request'

export function bpyHistory(params) { // 
  return request({
    url: 'cnc/tool/data/digitalTwin',
    method: 'post',
    params
  })
}
export function bpyReal(params) { // 
  return request({
    url: 'cnc/tool/data/digitalTwinReal',
    method: 'post',
    params
  })
}
export function bpyTools(params) { // 
  return request({
    url: 'cnc/tool/data/tools',
    method: 'post',
    params
  })
}
export function bpyNums(params) { // 
  return request({
    url: 'cnc/tool/data/jiagongNums',
    method: 'post',
    params
  })
}
