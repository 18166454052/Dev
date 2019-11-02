import request from '@/utils/request'

export function cepJobCreate(data) { //
  return request({
    url: 'piping/gateway/cep/job/add',
    method: 'post',
    data
  })
}
export function cepJobUpdate(data) { //
  return request({
    url: 'piping/gateway/cep/job/update',
    method: 'post',
    data
  })
}
export function cepJobDelete(params) { //
  return request({
    url: 'piping/gateway/cep/job/delete',
    method: 'post',
    params
  })
}
export function cepJobDetail(params) { //
  return request({
    url: 'piping/gateway/cep/job/detail',
    method: 'post',
    params
  })
}
export function cepJobTemplate(params) { //
  return request({
    url: 'piping/gateway/cep/job/template',
    method: 'post',
    params
  })
}
export function cepJobPublicTemplate(params) { // 系统创建的job模板
  return request({
    url: 'piping/gateway/cep/job/public/list',
    method: 'post',
    params
  })
}
/* ****************************************************************** */
export function cepJobStats(data) { //
  return request({
    url: '1/cep/job/stats_show',
    method: 'post',
    data
  })
}