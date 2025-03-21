/*
 * Cart and order
 */

import type { OrderInfo } from '../models/user'
import type { $MutateOptions, ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export type OrderRequest = OrderInfo

export function usePostOrder<T extends OrderRequest = OrderRequest>(
  options?: $MutateOptions<T>,
) {
  return $mutate<ApiResponseBase, OrderRequest>({
    url: endpoints.order,
    method: 'POST',
    ...options,
  })
}

interface AddCartQuery {
  bookId: number
}

interface UpdateCartQuery {
  number: number
}

export function useCart() {
  function addBook(
    bookId: number,
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase, undefined, AddCartQuery>({
      url: endpoints.cart.index,
      method: 'PUT',
      query: { bookId },
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
    addBook,
    updateBookCount,
    deleteBook,
  }
}
