import request from '@/utils/request'

export function dbCreate(data) { //
  return request({
    url: 'config/datasource/admin/add',
    method: 'post',
    data
  })
}
export function dbList(params) { //
  return request({
    url: 'config/datasource/admin/list',
    method: 'post',
    params
  })
}
export function dbDelete(params) { //
  return request({
    url: 'config/datasource/admin/delete',
    method: 'post',
    params
  })
}
export function dbUpdate(data) { //
  return request({
    url: 'config/datasource/admin/update',
    method: 'post',
    data
  })
}


/* *****************前期版本接口*********************** */
export function sourceConfigCreate(data) { //
  return request({
    url: '1/data/datasource/create',
    method: 'post',
    data
  })
}
export function sourceConfigList(data) { //
  return request({
    url: '1/data/datasource/list',
    method: 'post',
    data
  })
}
export function sourceConfigUpdate(data) { //
  return request({
    url: '1/data/datasource/update',
    method: 'post',
    data
  })
}
export function sourceConfigDelete(data) { //
  return request({
    url: '1/data/datasource/delete',
    method: 'post',
    data
  })
}
export function sourceConfigDetail(data) { //
  return request({
    url: '1/data/datasource/detail',
    method: 'post',
    data
  })
}