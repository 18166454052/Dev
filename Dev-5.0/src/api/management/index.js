import request from '@/utils/request'

export function createManagement(data) {
  return request({
    url: '1/project/create',
    method: 'post',
    data
  })
}

export function getProjectList() {
  return request({
    url: '1/project/show',
    method: 'post'
  })
}

export function deleteProject(data) {
  return request({
    url: '1/project/destroy',
    method: 'post',
    data
  })
}

export function editProject(data) {
  return request({
    url: '1/project/update',
    method: 'post',
    data
  })
}
export function getProDetail(data) {
  return request({
    url: '1/project/detail',
    method: 'post',
    data
  })
}
