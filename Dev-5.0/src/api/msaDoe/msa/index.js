import request from '@/utils/request'

export function msaCreate(data) { //
  return request({
    url: 'msa/task/editor/add',
    method: 'post',
    data
  })
}
export function msaUpdate(data) { //
  return request({
    url: 'msa/task/editor/update',
    method: 'post',
    data
  })
}
export function msaList(params) { //
  return request({
    url: 'msa/task/viewer/list',
    method: 'post',
    params
  })
}
export function msaDelete(params) { //
  return request({
    url: 'msa/task/editor/delete',
    method: 'post',
    params
  })
}
export function msaDetail(params) { //
  return request({
    url: 'msa/task/viewer/detail',
    method: 'post',
    params
  })
}
export function msaRuleList(params) { //
  return request({
    url: 'msa/task/abnormal/rules/viewer/list',
    method: 'post',
    params
  })
}
export function msaRuleCreate(data) { //
  return request({
    url: 'msa/task/abnormal/rules/editor/add',
    method: 'post',
    data
  })
}
export function msaRuleUpdate(data) { //
  return request({
    url: 'msa/task/abnormal/rules/editor/update',
    method: 'post',
    data
  })
}
export function msaTaskView(data) { //
  return request({
    url: 'msa/task/viewer/view',
    method: 'post',
    data
    // data:{analysisParms:obj.analysisParms},
    // params:{spcTaskId:obj.spcTaskId}
  })
}

// /////////////////////////////////////////////////////////
// 更新msa************************************
// msa
// 判异规则
export function msaRulesCreate(data) { //
  return request({
    url: '1/msa/config/rules/create',
    method: 'post',
    data
  })
}
export function msaRulesUpdate(data) { //
  return request({
    url: '1/msa/config/rules/update',
    method: 'post',
    data
  })
}
export function msaRulesDelete(data) { //
  return request({
    url: '1/msa/config/rules/delete',
    method: 'post',
    data
  })
}
// fields
export function msaFieldsCreate(data) { //
  return request({
    url: '1/msa/config/fields/create',
    method: 'post',
    data
  })
}
export function msaFieldsUpdate(data) { //
  return request({
    url: '1/msa/config/fields/update',
    method: 'post',
    data
  })
}
export function msaFieldsDelete(data) { //
  return request({
    url: '1/msa/config/fields/delete',
    method: 'post',
    data
  })
}
// 必选信息
export function msaRequiredFieldsCreate(data) { //
  return request({
    url: '1/msa/config/required_fields/create',
    method: 'post',
    data
  })
}
export function msaRequiredFieldsUpdate(data) { //
  return request({
    url: '1/msa/config/required_fields/update',
    method: 'post',
    data
  })
}
export function msaRequiredFieldsDelete(data) { //
  return request({
    url: '1/msa/config/required_fields/delete',
    method: 'post',
    data
  })
}
//  MSA 可视化*********************************
export function msaView(data) { //
  return request({
    url: '1/msa/config/msaView',
    method: 'post',
    data
  })
}
