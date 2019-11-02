import request from '@/utils/request'

export function realSetting(params) { // 实时感知
  return request({
    url: 'cnc/external/as/model/realSetting',
    method: 'post',
    params
  })
}
export function modelSetted(params) { // 实时感知
  return request({
    url: 'cnc/external/as/model/modelSetted',
    method: 'post',
    params
  })
}




export function controlSetting(params) { // 实时控制
  return request({
    url: 'cnc/external/as/model/controlSetting',
    method: 'post',
    params
  })
}
export function historySetting(params) { // 历史查看模板
  return request({
    url: 'cnc/external/as/model/historySetting',
    method: 'post',
    params
  })
}
export function overlaySetting(params) { // 历史叠加模板
  return request({
    url: 'cnc/external/as/model/overlaySetting',
    method: 'post',
    params
  })
}

export function jiagongNums(params) { //
  return request({
    url: 'cnc/external/as/model/jiagongNums',
    method: 'post',
    params
  })
}
