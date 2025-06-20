import dayjs from 'dayjs'

export function formatDate(date: Date | undefined) {
  return date ? dayjs(date).format('YYYY-MM-DD') : null
}
