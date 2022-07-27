import dayjs from 'dayjs'
// 时间过滤器
export const dateformat = function (time) {
  return dayjs(time).format('YYYY-MM-DD')
}
