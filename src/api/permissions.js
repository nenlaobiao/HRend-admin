import request from '@/utils/request'
export const getPermissions = () => {
  return request({
    url: '/sys/permission'
  })
}

// 根据角色id获取权限
export const getPermissionsById = id => {
  return request({
    url: `/sys/role/${id}`
  })
}
export const assignPermission = (id, permIds) => {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data: { id, permIds }
  })
}
// 添加角色
export const addRole = ({ name, description }) => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data: { name, description }
  })
}
