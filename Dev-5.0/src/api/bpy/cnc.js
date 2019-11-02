import request from '@/utils/request'

export function cncReal(params) { //
  return request({
    url: 'cnc/external/data/realFactor',
    method: 'post',
    params
  })
}
export function cncHistory(params) { //
  return request({
    url: 'cnc/external/data/historyFactor',
    method: 'post',
    params
  })
}
export function cncToolIds(params) { //
  return request({
    // url: 'cnc/external/data/realToolIds',
    url: 'cnc/external/as/model/tools',
    method: 'post',
    params
  })
}

export function cncNumbers(params) { //
  return request({
    // url: 'cnc/external/data/jiagongNums',
    url: 'cnc/external/as/model/jiagongNums',
    method: 'post',
    params
  })
}
/* *********************************************************** */

export function cncModelsListReal(params) {
  return request({
    url: 'cnc/external/as/model/realTool',
    method: 'post',
    params
  })
}
export function cncModelSdReal(params) {
  return request({
    url: 'cnc/external/as/model/realToolModel',
    method: 'post',
    params
  })
}
export function cncModelHistoryReal(params) {
  return request({
    url: 'cnc/external/as/model/historyTool',
    method: 'post',
    params
  })
}



export function cncModelsList(params) {
  return request({
    url: 'cnc/external/as/model/continuity',
    method: 'post',
    params
  })
}
export function cncModelSd(params) {
  return request({
    url: 'cnc/external/as/model/conPer',
    method: 'post',
    params
  })
}

export function cncModelSdList(params) {
  return request({
    url: 'cnc/external/as/model/overlay',
    method: 'post',
    params
  })
}

export function cncControlsSd(params) {
  return request({
    url: 'cnc/external/as/model/contControl',
    method: 'post',
    params
  })
}
export function cncControlsSdReal(params) {
  return request({
    url: 'cnc/external/as/model/realToolControl',
    method: 'post',
    params
  })
}
