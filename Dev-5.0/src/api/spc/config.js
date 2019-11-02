import request from '@/utils/request'

export function spcCreate(data) { //
  return request({
    url: 'spc/task/editor/add',
    method: 'post',
    data
  })
}
export function spcUpdate(data) { //
  return request({
    url: 'spc/task/editor/update',
    method: 'post',
    data
  })
}
export function spcDelete(params) { //
  return request({
    url: 'spc/task/editor/delete',
    method: 'post',
    params
  })
}
export function spcDetail(params) { //
  return request({
    url: 'spc/task/viewer/detail',
    method: 'post',
    params
  })
}
export function spcRulesList(params) { //
  return request({
    url: 'spc/task/abnormal/rules/viewer/list',
    method: 'post',
    params
  })
}
export function spcRuleUpdate(data) { //
  return request({
    url: 'spc/task/abnormal/rules/editor/update',
    method: 'post',
    data
  })
}
export function spcTaskView(data) { //
  return request({
    url: 'spc/task/viewer/sampleView',
    method: 'post',
    data
    // data:{analysisParms:obj.analysisParms},
    // params:{spcTaskId:obj.spcTaskId}
  })
}
export function spcTaskProcess(data) { // 制程能力分析
  return request({
    url: 'spc/task/viewer/trendView',
    method: 'post',
    data
    // data:{analysisParms:obj.analysisParms},
    // params:{spcTaskId:obj.spcTaskId}
  })
}
export function controlInfo(params) { //
  return request({
    url: 'config/dataanalysis/parameter/control/viewer/list',
    method: 'post',
    params
  })
}

export function spcRulesCreate(data) { //
  return request({
    url: 'spc/task/abnormal/rules/create',
    method: 'post',
    data
  })
}
export function spcRulesUpdate(data) { //
  return request({
    url: 'spc/task/abnormal/rules/update',
    method: 'post',
    data
  })
}
export function spcRulesDetail(params) { //
  return request({
    url: 'spc/task/abnormal/rules/detail',
    method: 'post',
    params
  })
}
export function spcRulesDelete(params) { //
  return request({
    url: 'spc/task/abnormal/rules/delete',
    method: 'post',
    params
  })
}
/* *************************预警开启/关闭***************************** */
export function warningStart(params) { //
  return request({
    url: 'spc/task/editor/warningStart',
    method: 'post',
    params
  })
}
export function warningStop(params) { //
  return request({
    url: 'spc/task/editor/warningStop',
    method: 'post',
    params
  })
}


/** 废弃代码**/
export function spcConofigCreate(data) { //
  return request({
    url: '1/spc/config/create',
    method: 'post',
    data: data
  })
}
export function spcConofigUpdate(data) { //
  return request({
    url: '1/spc/config/update',
    method: 'post',
    data: data
  })
}
export function spcConofigDelete(data) { //
  return request({
    url: '1/spc/config/delete',
    method: 'post',
    data: data
  })
}
export function spcConofigDetail(data) { //
  return request({
    url: '1/spc/config/detail',
    method: 'post',
    data: data
  })
}
export function spcConofigList(data) { //
  return request({
    url: '1/spc/config/list',
    method: 'post',
    data: data
  })
}
/* update  */
// 判异
export function rulesCreate(data) { //
  return request({
    url: '1/spc/config/rules/create',
    method: 'post',
    data: data
  })
}
export function rulesUpdate(data) { //
  return request({
    url: '1/spc/config/rules/update',
    method: 'post',
    data: data
  })
}
export function rulesDelete(data) { //
  return request({
    url: '1/spc/config/rules/delete',
    method: 'post',
    data: data
  })
}
// fields
export function fieldsCreate(data) { //
  return request({
    url: '1/spc/config/fields/create',
    method: 'post',
    data: data
  })
}
export function fieldsUpdate(data) { //
  return request({
    url: '1/spc/config/fields/update',
    method: 'post',
    data: data
  })
}
export function fieldsDelete(data) { //
  return request({
    url: '1/spc/config/fields/delete',
    method: 'post',
    data: data
  })
}
// graph
export function graphUpdate(data) { //
  return request({
    url: '1/spc/config/graph/update',
    method: 'post',
    data: data
  })
}
// sql_info
export function sqlInfoUpdate(data) { //
  return request({
    url: '1/spc/config/sql/update',
    method: 'post',
    data: data
  })
}
export function sqlInfoDelete(data) { //
  return request({
    url: '1/spc/config/sql/delete',
    method: 'post',
    data: data
  })
}
// 可视化
export function spcViewData(data) { //
  return request({
    url: '1/spc/view/measurement/stats',
    method: 'post',
    data: data
  })
}
//////////////////tes
export function test(data) { //
  return request({
    url: '/test/test1',
    method: 'post',
    data: data
  })
}