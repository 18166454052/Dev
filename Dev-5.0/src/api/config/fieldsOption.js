import request from '@/utils/request'

export function fieldsOptionCreate(data) { //
  return request({
    url: '1/spc_batch/config/fields_options/create',
    method: 'post',
    data
  })
}
export function fieldsOptionDelete(data) { //
  return request({
    url: '1/spc_batch/config/fields_options/delete',
    method: 'post',
    data
  })
}
export function fieldsOptionUpdate(data) { //
  return request({
    url: '1/spc_batch/config/fields_options/update',
    method: 'post',
    data
  })
}
export function fieldsOptionList(data) { //
  return request({
    url: '1/spc_batch/config/fields_options/list',
    method: 'post',
    data
  })
}
export function fieldsOptionsAll(data) { //
  return request({
    url: '1/spc_batch/config/fields_options_down/list',
    method: 'post',
    data
  })
}
