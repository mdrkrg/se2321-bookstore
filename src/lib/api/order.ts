/*
 * Cart and order
 */

import type { CartItem, Order, OrderInfo, PagedItems } from '../models/user'
import type { $MutateOptions, ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate, $queryOptions } from './utils'

export type OrderRequest = OrderInfo

export function useOrder() {
  function fetchOrderOptions() {
    return $queryOptions<PagedItems<Order>>({
      url: endpoints.order.index,
      // key: ['order', pageIndex],
      key: ['order'],
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

interface AddCartQuery {
  bookId: number
  number: number
}

interface UpdateCartQuery {
  number: number
}

export function useCart() {
  function fetchCartOptions() {
    return $queryOptions<PagedItems<CartItem>>({
      url: endpoints.cart.index,
      // key: ['cart', pageIndex],
      key: ['cart'],
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
    number: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase, undefined, UpdateCartQuery>({
      url: endpoints.cart.change(bookId),
      method: 'PUT',
      query: { number },
      ...options,
    })
  }

  function deleteBook(
    bookId: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase>({
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
