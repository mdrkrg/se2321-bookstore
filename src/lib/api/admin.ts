import type { ChangeBookRequest, ChangeUserRequest } from '../models/admin'
import type { Book, PagedItems, User } from '../models/user'
import axios from 'axios'
import { endpoints } from '../models/endpoints'
import { $queryOptions } from './utils'

export async function banUser(id: number) {
  const rsp = await axios.delete<User>(endpoints.admin.user.change(id))
  return rsp.data
}

export async function changeUser(id: number, data: ChangeUserRequest) {
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

export function fetchAdminBookListOptions() {
  return $queryOptions<PagedItems<Book>>({
    url: endpoints.admin.book.index,
    key: ['admin', 'book'],
  })
}

export async function changeBook(id: number, data: ChangeBookRequest) {
  const rsp = await axios.put<Book>(
    endpoints.admin.book.change(id),
    data,
  )
  return rsp.data
}
