import request from '@/utils/request'

export function timedStateDetail(data) { //
  return request({
    url: '1/dashboard/key/stats/detail',
    method: 'post',
    data: data
  })
}
