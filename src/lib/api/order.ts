/*
 * Cart and order
 */

import type { OrderInfo } from '../models/user'
import type { ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export type OrderRequest = OrderInfo

export function usePostOrder(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, OrderRequest>({
    url: endpoints.order,
    method: 'POST',
    onSuccess,
    onError,
  })
}

interface AddCartQuery {
  bookId: number
}

export function useAddCart(
  bookId: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, never, AddCartQuery>({
    url: endpoints.cart.index,
    method: 'PUT',
    query: { bookId },
    onSuccess,
    onError,
  })
}

interface UpdateCartQuery {
  number: number
}

export function useUpdateCartItem(
  id: number,
  number: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, never, UpdateCartQuery>({
    url: endpoints.cart.change(id),
    method: 'PUT',
    query: { number },
    onSuccess,
    onError,
  })
}

export function useDeleteCartItem(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase>({
    url: endpoints.cart.change(id),
    method: 'DELETE',
    onSuccess,
    onError,
  })
}
