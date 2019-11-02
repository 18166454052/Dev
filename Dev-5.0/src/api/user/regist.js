import request from '@/utils/request'

export function getProvince() { // project_id
  return request.post('rae/regist/provinces')
}

export function getDistrict(city_id) { // project_id
  return request.post('rae/regist/district','position_city_id=' + city_id)
}
export function getCity(province_id) { // project_id
  return request.post('rae/regist/citys','position_province_id=' + province_id)
}

export function regist(data) {
  return request({
    url: 'rae/user/regist',
    method: 'post',
    data
  })
}
