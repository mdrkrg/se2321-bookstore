import type { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { queryOptions as _queryOptions, useMutation, useQuery } from '@tanstack/react-query'

export async function $fetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const res = await fetch(url, options)
    if (res.ok) {
      if (res.status === 204) // no content
        return undefined as T
      return await (res.json() as Promise<T>)
    }
    throw res
  }
  catch (res) {
    console.error('Fetch error:', res as Response)
    throw res
  }
}

interface UseFetchProps<TData, TQuery> {
  url: string
  key?: QueryKey
  query?: TQuery
  fetchOptions?: RequestInit
  queryOptions?: Omit<UseQueryOptions<TData, any, TData, QueryKey>, 'queryKey' | 'queryFn'>
}

export function $query<TData = any, TQuery = any>({
  url,
  key,
  query,
  fetchOptions = {},
  queryOptions = {},
}: UseFetchProps<TData, TQuery>) {
  const urlWithParams = query
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  return useQuery<TData, any>({
    queryKey: key ?? [url],
    queryFn: async () => {
      return await $fetch<TData>(urlWithParams, fetchOptions)
    },
    ...queryOptions,
  })
}

export function $queryOptions<TData = any, TQuery = any>({
  url,
  key,
  query,
  fetchOptions = {},
  queryOptions = {},
}: UseFetchProps<TData, TQuery>) {
  const urlWithParams = query
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  return _queryOptions<TData, any>({
    queryKey: key ?? [url],
    queryFn: async () => {
      return await $fetch<TData>(urlWithParams, fetchOptions)
    },
    ...queryOptions,
  })
}

export type _$MutateOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, any, TVariables>,
  'mutationFn'
>

export type $MutateOptions<TVariables> = _$MutateOptions<ApiResponseBase, TVariables>

interface UseMutateProps<TData, TVariables, TQuery> {
  url: string
  method: 'POST' | 'PUT' | 'DELETE'
  query?: TQuery
  fetchOptions?: Omit<Omit<RequestInit, 'method'>, 'body'>
  mutateOptions?: _$MutateOptions<TData, TVariables>
}

export function $mutate<TData = any, TVariables = any, TQuery = undefined>({
  url,
  method,
  query,
  fetchOptions = {},
  mutateOptions = {},
}: UseMutateProps<TData, TVariables, TQuery>) {
  const urlWithParams = query
    ? `${url}?${new URLSearchParams(query).toString()}`
    : url

  const { headers: fetchHeaders, ...fetchOptionsRest } = fetchOptions
  return useMutation<TData, any, TVariables>({
    mutationFn: async (data?: TVariables) => {
      const _fetchOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...fetchHeaders,
        },
        method,
        body: data && JSON.stringify(data),
        ...fetchOptionsRest,
      }
      const responseData = await $fetch(urlWithParams, _fetchOptions)
      return responseData as TData
    },
    ...mutateOptions,
  })
}

export interface ApiResponseBase {
  message: string
  ok: boolean
  data: Record<string, never>
}
