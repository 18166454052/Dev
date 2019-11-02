import request from '@/utils/request'

export function spcList(data) { //
  return request({
    url: '1/spc/config/list',
    method: 'post',
    data: data
  })
}
export function spcState(data) { //
  return request({
    url: '1/spcdemo/x_r/stats_data',
    method: 'post',
    data
  })
}
export function groupData(data) { //
  return request({
    url: '1/spcdemo/x_r/group_data',
    method: 'post',
    data
  })
}
export function pointData(data) { //
  return request({
    url: '1/spcdemo/x_r/point_data',
    method: 'post',
    data
  })
}
export function countData(data) { //
  return request({
    url: '1/spcdemo/x_r/count_data',
    method: 'post',
    data
  })
}
export function distributionData(data) { //
  return request({
    url: '1/spcdemo/x_r/distribution',
    method: 'post',
    data
  })
}
export function abnormalData(data) { //
  return request({
    url: '1/spcdemo/x_r/abnormal',
    method: 'post',
    data
  })
}

