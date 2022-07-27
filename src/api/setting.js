import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {当前页,每页数量} param0
 * @returns
 */
export const getRoleList = ({ page, pagesize }) => {
  return request({
    url: '/sys/role',
    params: { page, pagesize }
  })
}
/**
 * 删除角色API
 * @param {Number} id---需要删除的角色id
 * @returns
 */
export const delRoleAPI = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}
// 修改角色
export const editRole = data => {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}
// 根据id查询公司信息
export const getCompanyInfo = id => {
  return request({
    url: `/company/${id}`
  })
}

