import type { PagedItems, User } from '../models/user'
import axios from 'axios'
import { endpoints } from '../models/endpoints'
import { $queryOptions } from './utils'

export async function banUser(id: number) {
  const rsp = await axios.delete<User>(endpoints.admin.user.change(id))
  return rsp.data
}

export async function changeUser(id: number, data: Partial<User>) {
  const rsp = await axios.put<User>(
    endpoints.admin.user.change(id),
    data,
  )
  return rsp.data
}

export function fetchUserListOptions() {
  return $queryOptions<PagedItems<User>>({
    url: endpoints.admin.user.index,
    key: ['admin', 'user'],
  })
}
