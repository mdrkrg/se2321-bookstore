/*
 * Cart and order
 */

import type { UseQueryOptions } from '@tanstack/react-query'
import type { SortingState } from '@tanstack/react-table'
import type { CartItem, Order, OrderInfo, PagedItems } from '../models/user'
import type { $MutateOptions, ApiResponseBase } from './utils'
import dayjs from 'dayjs'
import { endpoints } from '../models/endpoints'
import { $fetch, $mutate, $queryOptions } from './utils'

export type OrderRequest = OrderInfo

export interface FetchOrderRequest {
  title?: string
  createdAtStart?: Date
  createdAtEnd?: Date
  page?: number
  size?: number
  sort?: SortingState
}

export function useOrder() {
  function fetchOrderOptions(params: FetchOrderRequest = {}, options?: UseQueryOptions) {
    const query = {
      title: params.title ?? '',
      createdAtStart: params.createdAtStart
        ? dayjs(params.createdAtStart).format('YYYY-MM-DD')
        : '',
      createdAtEnd: params.createdAtEnd
        ? dayjs(params.createdAtEnd).format('YYYY-MM-DD')
        : '',
    }
    return $queryOptions<PagedItems<Order>>({
      url: endpoints.order.index,
      // key: ['order', pageIndex],
      key: [
        'order',
        query.title || 'no-title',
        query.createdAtStart || 'no-start',
        query.createdAtEnd || 'no-end',
      ],
      query,
      ...options,
    })
  }

  function postOrder<T extends OrderRequest = OrderRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, OrderRequest>({
      url: endpoints.order.index,
      method: 'POST',
      ...options,
    })
  }

  return {
    fetchOrderOptions,
    postOrder,
  }
}

export function placeOrder(order: OrderRequest) {
  return $fetch<Order>(endpoints.order.index, {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

interface AddCartQuery {
  bookId: number
  number: number
}

export function useCart() {
  function fetchCartOptions(options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) {
    return $queryOptions<PagedItems<CartItem>>({
      url: endpoints.cart.index,
      // key: ['cart', pageIndex],
      key: ['cart'],
      queryOptions: options,
    })
  }

  function addBook(
    bookId: number,
    number: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase, undefined, AddCartQuery>({
      url: endpoints.cart.index,
      method: 'PUT',
      query: { bookId, number },
      ...options,
    })
  }

  function updateBookCount(
    bookId: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<CartItem, { number: number }>({
      url: endpoints.cart.change(bookId),
      method: 'PUT',
      ...options,
    })
  }

  function deleteBook(
    bookId: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<undefined>({
      url: endpoints.cart.change(bookId),
      method: 'DELETE',
      ...options,
    })
  }

  return {
    fetchCartOptions,
    addBook,
    updateBookCount,
    deleteBook,
  }
}

export function addCartItem(bookId: number, number: number) {
  return fetch(endpoints.cart.index, {
    method: 'POST',
    body: JSON.stringify({ bookId, number }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.json()) as Promise<CartItem>
}

export function changeCartItem(id: number, number: number) {
  return fetch(endpoints.cart.change(id), {
    method: 'PUT',
    body: JSON.stringify({ number }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(rsp => rsp.json()) as Promise<CartItem>
}

export function deleteCartItem(id: number) {
  return fetch(endpoints.cart.change(id), {
    method: 'DELETE',
  })
}
