import type { QueryKey, UseMutationOptions } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'

interface FetchOptions {
  method?: string
  headers?: { [key: string]: string }
  body?: BodyInit | null
  mode?: RequestMode
  credentials?: RequestCredentials
  cache?: RequestCache
  redirect?: RequestRedirect
  referrerPolicy?: ReferrerPolicy
  integrity?: string
  keepalive?: boolean
  signal?: AbortSignal | null
  [key: string]: any
}

export function $fetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  return fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return res.json() as Promise<T>
    })
    .catch((error) => {
      console.error('Fetch error:', error)
      throw error
    })
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface UseQueryProps<TData, TQuery> {
  url: string
  key?: QueryKey
  query?: TQuery
  // onSuccess?: (data: TData) => void
  // onError?: (error: any) => void
}

export function useFetch<TData = any, TQuery = any>({
  url,
  key,
  query,
  // onSuccess,
  // onError,
}: UseQueryProps<TData, TQuery>) {
  const urlWithParams = query
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  return useQuery<TData, any>({
    queryFn: async () => {
      return await $fetch<TData>(urlWithParams)
    },
    queryKey: key ?? [url],
  })
}

interface UseMutateProps<TData, TVariables, TQuery> {
  url: string
  method: 'POST' | 'PUT' | 'DELETE'
  query?: TQuery
  onSuccess?: (data: TData) => void
  onError?: (error: any) => void
  options?: UseMutationOptions<TData, any, TVariables>
}

export function $mutate<TData = any, TVariables = any, TQuery = any>(
  { url, method, query, onSuccess, onError, options }: UseMutateProps<TData, TVariables, TQuery>,
) {
  const urlWithParams = query
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  return useMutation<TData, any, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await fetch(urlWithParams, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json() as TData
    },
    onSuccess: (data: TData) => {
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (error: any) => {
      if (onError) {
        onError(error)
      }
    },
    ...options,
  })
}

export interface ApiResponseBase {
  message: string
  ok: boolean
  data: Record<string, never>
}
