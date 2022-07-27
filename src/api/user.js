import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
export const assignRoles = ({ id, roleIds }) => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data: { id, roleIds }
  })
}
// 保存员工信息
export const saveEmployee = (id, data) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'PUT',
    data
  })
}
/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
