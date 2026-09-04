/*
 * Cart and order
 */

import type { UseQueryOptions } from '@tanstack/react-query'
import type {
  CartItem,
  Order,
  OrderAccepted,
  OrderInfo,
  OrderResult,
  PagedItems,
} from '../models/user'
import type { $MutateOptions, ApiResponseBase, PageRequest } from './utils'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { endpoints } from '../models/endpoints'
import { formatDate } from '../utils/datetime'
import { $fetch, $mutate, $queryOptions, getSortParam } from './utils'

export type OrderRequest = OrderInfo

export interface FetchOrderRequest extends PageRequest {
  title?: string
  createdAtStart?: Date
  createdAtEnd?: Date
}

export async function getMyOrderList({
  title,
  createdAtStart,
  createdAtEnd,
  page = 0,
  size = 10,
  sort,
}: FetchOrderRequest) {
  const sortParam = getSortParam(sort)
  const rsp = await axios.get<PagedItems<Order>>(endpoints.order.index, {
    params: {
      title,
      createdAtStart: formatDate(createdAtStart),
      createdAtEnd: formatDate(createdAtEnd),
      page,
      size,
      sort: sortParam,
    },
  })
  return rsp.data
}

export function useOrder() {
  function fetchOrderOptions(params: FetchOrderRequest = {
    page: 0,
    size: 10,
  }) {
    return queryOptions({
      queryFn: () => getMyOrderList(params),
      queryKey: [
        'order',
        'list',
        params,
      ],
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

/**
 * Async message queue version of place order.
 */
export async function placeOrderAsync(order: OrderRequest, protocol: 'ws' | 'sse') {
  const endpoint = protocol === 'ws' ? endpoints.order.ws : endpoints.order.sse
  const rsp = await axios.post<OrderAccepted>(
    endpoint,
    order,
  )
  return rsp.data
}

function onMessageBuilder(client: WebSocket | EventSource, resolve: (value: OrderResult | PromiseLike<OrderResult>) => void, reject: (reason?: any) => void) {
  return (event: MessageEvent) => {
    try {
      const result: OrderResult = JSON.parse(event.data)
      client.close()
      resolve(result)
    }
    catch (error) {
      console.error('Failed to parse order result JSON:', error)
      client.close()
      reject(new Error('解析服务器订单结果失败'))
    }
  }
}

export function waitForOrderResultEvent(messageId: string): Promise<OrderResult> {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(endpoints.orderResult.sse(messageId))

    eventSource.onmessage = onMessageBuilder(eventSource, resolve, reject)

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
      eventSource.close()
      reject(new Error('SSE 连接失败'))
    }
  })
}

export function waitForOrderResultWs(messageId: string): Promise<OrderResult> {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(endpoints.orderResult.ws(messageId))

    client.onmessage = onMessageBuilder(client, resolve, reject)

    client.onerror = (error) => {
      console.error('WebSocket failed:', error)
      client.close()
      reject(new Error('WS 连接失败'))
    }
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
