import type { AddBookRequest, AdminUserStat, ChangeBookRequest, ChangeOrderRequest, ChangeUserRequest, OrderAdmin } from '../models/admin'
import type { Book, PagedItems, User } from '../models/user'
import type { FetchOrderRequest } from './order'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { endpoints } from '../models/endpoints'
import { formatDate } from '../utils/datetime'
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

export async function addBook(data: AddBookRequest) {
  const rsp = await axios.post<Book>(
    endpoints.admin.book.index,
    data,
  )
  return rsp.data
}

export function fetchAdminOrderListOptions(params: FetchOrderRequest = {}) {
  const query = {
    title: params.title ?? '',
    createdAtStart: params.createdAtStart
      ? dayjs(params.createdAtStart).format('YYYY-MM-DD')
      : '',
    createdAtEnd: params.createdAtEnd
      ? dayjs(params.createdAtEnd).format('YYYY-MM-DD')
      : '',
  }
  return $queryOptions<PagedItems<OrderAdmin>>({
    url: endpoints.admin.order.index,
    key: [
      'admin',
      'order',
      'list',
      query,
    ],
    query,
  })
}

export async function changeOrder(id: number, data: ChangeOrderRequest) {
  const rsp = await axios.put<OrderAdmin>(
    endpoints.admin.order.change(id),
    data,
  )
  return rsp.data
}

// export async function deleteOrder(id: number) {
//   await axios.delete(
//     endpoints.admin.order.change(id),
//   )
// }

export interface AdminUserStatRequest {
  pageSize?: number
  startDate?: Date
  endDate?: Date
}

const DEFAULT_SPENDER_SIZE = 10

export async function getUserSpendingStats({
  pageSize = DEFAULT_SPENDER_SIZE,
  startDate,
  endDate,
}: AdminUserStatRequest) {
  const rsp = await axios.get<PagedItems<AdminUserStat>>(endpoints.admin.user.stats, {
    params: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      pageSize,
    },
  })
  return rsp.data
}

export function fetchAdminUserStatOptions(params: AdminUserStatRequest = {}) {
  return queryOptions({
    queryFn: () => getUserSpendingStats(params),
    queryKey: [
      'admin',
      'user',
      'stats',
      params,
    ],
  })
}
