import request from '@/utils/request'

export function fieldsCreate(data) { //
  return request({
    url: '1/spc_batch/config/fields/create',
    method: 'post',
    data
  })
}
export function fieldsDelete(data) { //
  return request({
    url: '1/spc_batch/config/fields/delete',
    method: 'post',
    data
  })
}
export function fieldsUpdate(data) { //
  return request({
    url: '1/spc_batch/config/fields/update',
    method: 'post',
    data
  })
}
export function fieldsList(data) { //
  return request({
    url: '1/spc_batch/config/fields/list',
    method: 'post',
    data
  })
}
export function fieldsAll(data) { //
  return request({
    url: '1/spc_batch/config/fields_down/list ',
    method: 'post',
    data
  })
}
