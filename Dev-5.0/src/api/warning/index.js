import request from '@/utils/request'


/* ****************************制程预警规则************************** */
export function processAdd(data) {
  return request({
    url: 'spc/task/online/alert/process/add',
    method: 'post',
    data
  })
}
export function processUpdate(data) {
  return request({
    url: 'spc/task/online/alert/process/update',
    method: 'post',
    data
  })
}
export function processDelete(params) {
  return request({
    url: 'spc/task/online/alert/process/delete',
    method: 'post',
    params
  })
}
export function processList(params) {
  return request({
    url: 'spc/task/online/alert/process/list',
    method: 'post',
    params
  })
}
/* ****************************判异预警规则************************** */
export function abnormalAdd(data) {
  return request({
    url: 'spc/task/online/alert/abnormal/add',
    method: 'post',
    data
  })
}
export function abnormalUpdate(data) {
  return request({
    url: 'spc/task/online/alert/abnormal/update',
    method: 'post',
    data
  })
}
export function abnormalDelete(params) {
  return request({
    url: 'spc/task/online/alert/abnormal/delete',
    method: 'post',
    params
  })
}
export function abnormalList(params) {
  return request({
    url: 'spc/task/online/alert/abnormal/list',
    method: 'post',
    params
  })
}
/* spc_task_online  SPC在线分析任务 */
export function onlineUpdate(data) {
  return request({
    url: 'spc/task/online/update',
    method: 'post',
    data
  })
}
export function onlineDetail(params) {
  return request({
    url: 'spc/task/online/detail',
    method: 'post',
    params
  })
}
/* ************spc_task_online_alerting************** */
export function onlineAlertAdd(data) {
  return request({
    url: 'spc/task/online/alerting/add',
    method: 'post',
    data
  })
}
export function onlineAlertUpdate(data) {
  return request({
    url: 'spc/task/online/alerting/update',
    method: 'post',
    data
  })
}
export function onlineAlertDetail(params) {
  return request({
    url: 'spc/task/online/alerting/detail',
    method: 'post',
    params
  })
}
export function onlineAlertDelete(params) {
  return request({
    url: 'spc/task/online/alerting/delete',
    method: 'post',
    params
  })
}
export function onlineAlertList(params) {
  return request({
    url: 'spc/task/online/alerting/list',
    method: 'post',
    params
  })
}
export function onlineAlertCpkList(params) {
  return request({
    url: 'spc/task/online/alerting/cpkList',
    method: 'post',
    params
  })
}
export function upload(data) {
  return request({
    url: 'spc/task/online/alerting/upload',
    method: 'post',
    data
  })
}
export function onlineAlertDeleteFiles(params) {
  return request({
    url: 'spc/task/online/alerting/deleteFile',
    method: 'post',
    params
  })
}
/* *******************spc_task_online_alert_threshold******************* */
export function thresholdAdd(data) {
  return request({
    url: 'spc/task/online/alert/threshold/add',
    method: 'post',
    data
  })
}
export function thresholdUpdate(data) {
  return request({
    url: 'spc/task/online/alert/threshold/update',
    method: 'post',
    data
  })
}
export function thresholdDelete(params) {
  return request({
    url: 'spc/task/online/alert/threshold/delete',
    method: 'post',
    params
  })
}
export function thresholdList(params) {
  return request({
    url: 'spc/task/online/alert/threshold/list',
    method: 'post',
    params
  })
}
