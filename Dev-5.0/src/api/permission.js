import request from '@/utils/request'

export function userList(data) { //
  return request({
    url: 'rae/user/queryUser',
    method: 'post',
    data
  })
}
