import request from '@/utils/request'

export function cepCreate(data) { //
  return request({
    url: 'piping/gateway/cep/program/add',
    method: 'post',
    data
  })
}
export function cepUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/program/update',
    method: 'post',
    data
  })
}
export function cepList(params) {
  return request({
    url: 'piping/gateway/cep/program/list',
    method: 'post',
    params
  })
}
export function cepDetail(params) {
  return request({
    url: 'piping/gateway/cep/program/detail',
    method: 'post',
    params
  })
}
export function cepDelete(params) {
  return request({
    url: 'piping/gateway/cep/program/delete',
    method: 'post',
    params
  })
}
export function cepStart(params) {  // 启动
  return request({
    url: '1/cep/program/start',
    method: 'post',
    params
  })
}
export function cepStop(params) {  // 停止
  return request({
    url: '1/cep/program/disable',
    method: 'post',
    params
  })
}
export function cepUninstall(params) { // 卸载
  return request({
    url: '1/cep/program/uninstall',
    method: 'post',
    params
  })
}
export function cepDeploy(params) { // 部署
  return request({
    url: '1/cep/program/deploy',
    method: 'post',
    params
  })
}
/* ******************************************************************* */


export function cepArduinoCreate(data) { // 添加设备
  return request({
    url: '1/cep/arduino/create',
    method: 'post',
    data
  })
}
