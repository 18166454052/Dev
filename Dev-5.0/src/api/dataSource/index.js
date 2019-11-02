import request from '@/utils/request'

export function dsCreate(data) { //
  return request({
    url: 'config/dataanalysis/admin/add',
    method: 'post',
    data
  })
}
export function dsUpdate(data) { //
  return request({
    url: 'config/dataanalysis/admin/update',
    method: 'post',
    data
  })
}
export function dsDelete(params) { //
  return request({
    url: 'config/dataanalysis/admin/delete',
    method: 'post',
    params
  })
}
export function dsList(params) { //
  return request({
    url: 'config/dataanalysis/admin/list',
    method: 'post',
    params
  })
}
export function dsDetail(params) { //
  return request({
    url: 'config/dataanalysis/admin/detail',
    method: 'post',
    params
  })
}
//   msa////////////////////////////////
export function dsMsaCreate(data) { //
  return request({
    url: 'config/dataanalysis/msa/admin/add',
    method: 'post',
    data
  })
}
export function dsMsaUpdate(data) { //
  return request({
    url: 'config/dataanalysis/msa/admin/update',
    method: 'post',
    data
  })
}
export function dsMsaDelete(params) { //
  return request({
    url: 'config/dataanalysis/msa/admin/delete',
    method: 'post',
    params
  })
}
export function dsMsaList(params) { //
  return request({
    url: 'config/dataanalysis/msa/admin/list',
    method: 'post',
    params
  })
}
export function dsMsaDetail(params) { //
  return request({
    url: 'config/dataanalysis/msa/admin/detail',
    method: 'post',
    params
  })
}
export function dsControlUpdate(data) { //
  return request({
    url: 'config/dataanalysis/parameter/control/admin/update',
    method: 'post',
    data
  })
}
export function dsControlSqlValue(params) { // 获取sql查询结果
  return request({
    url: 'config/dataanalysis/parameter/control/viewer/getControlParameterValues',
    method: 'post',
    params
  })
}

/* ***************************废弃代码**************************** */
export function dataSourceCreate(data) { //
  return request({
    url: '1/spc_batch/source/create',
    method: 'post',
    data
  })
}
export function dataSourceDelete(data) { //
  return request({
    url: '1/spc_batch/source/delete',
    method: 'post',
    data
  })
}
export function dataSourceUpdate(data) { //
  return request({
    url: '1/spc_batch/source/update',
    method: 'post',
    data
  })
}
export function dataSourceDetail(data) { //
  return request({
    url: '1/spc_batch/source/detail',
    method: 'post',
    data
  })
}
export function dataSourceList(data) { //
  return request({
    url: '1/spc_batch/source/list',
    method: 'post',
    data
  })
}
export function dataSourceFieldsDelete(data) { //
  return request({
    url: '1/spc_batch/source/fields/delete',
    method: 'post',
    data
  })
}
export function dataSourceQuery(data) { //
  return request({
    url: '1/spc_batch/source/query',
    method: 'post',
    data
  })
}
export function dataSourceFieldsUpdate(data) { //
  return request({
    url: '1/spc_batch/source/fields/update',
    method: 'post',
    data
  })
}
export function dataSourceFieldsCreate(data) { //
  return request({
    url: '1/spc_batch/source/fields/insert',
    method: 'post',
    data
  })
}
