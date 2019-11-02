import request from '@/utils/request'

export function groupinfoList(data) { //
  return request({
    url: '1/timing/spc/group_info/list',
    method: 'post',
    data: data
  })
}
export function groupinfoDetail(data) { //
  return request({
    url: '1/timing/spc/group_info/detail',
    method: 'post',
    data: data
  })
}
export function emailList(data) { //
  return request({
    url: '1/timing/email/list',
    method: 'post',
    data: data
  })
}
export function emailDetail(data) { //
  return request({
    url: '1/timing/email/detail',
    method: 'post',
    data: data
  })
}
