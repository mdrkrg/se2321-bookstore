/*
 * Books
 */

import type { Book, BookSalesStat, BookTag, PagedItems } from '../models/user'
import type { CommentRequest } from './comment'
import type { $MutateOptions, ApiResponseBase } from './utils'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { endpoints } from '../models/endpoints'
import { formatDate } from '../utils/datetime'
import { $mutate, $query, $queryOptions } from './utils'

export const DEFAULT_PAGE_SIZE = 4

export interface FetchBooksProps {
  title?: string
  tagIds?: number[]
  pageNumber: number
  pageSize: number
}

export async function fetchBooks({
  title,
  tagIds,
  pageNumber,
  pageSize,
}: FetchBooksProps) {
  const rsp = await axios.get<PagedItems<Book>>(endpoints.book.index, {
    params: {
      title: title ?? '',
      tagIds: tagIds?.join(',') ?? '',
      pageNumber,
      pageSize,
    },
  })
  return rsp.data
}

export interface BookStatRequest {
  pageSize?: number
  startDate?: Date
  endDate?: Date
}

const DEFAULT_RANK_SIZE = 10

export async function fetchBookRanks({
  pageSize = DEFAULT_RANK_SIZE,
  startDate,
  endDate,
}: BookStatRequest) {
  const rsp = await axios.get<PagedItems<BookSalesStat>>(endpoints.book.rank, {
    params: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      pageSize,
    },
  })
  return rsp.data
}

export function useBooks() {
  function fetchBookOptions({ title, tagIds, pageNumber, pageSize }:
  { title?: string, tagIds?: number[], pageNumber: number, pageSize: number }) {
    return $queryOptions<PagedItems<Book>>({
      url: endpoints.book.index,
      key: ['books', title, tagIds, pageNumber, pageSize],
      query: {
        title: title ?? '',
        tagIds: tagIds?.join(',') ?? '',
        pageNumber,
        pageSize,
      },
    })
  }

  function search(
    tag: string,
    keyword: string,
    pageIndex: number, // | QueryState<number>,
    pageSize: number,
  ) {
    return $query<PagedItems<Book>>({
      url: endpoints.book.index,
      key: ['books', pageIndex],
      query: {
        tag,
        keyword,
        pageIndex,
        pageSize,
      },
    })
  }

  function fetchRankOptions(params: BookStatRequest) {
    return queryOptions({
      queryFn: () => fetchBookRanks(params),
      queryKey: ['book', 'rank', params],
    })
  }

  function tags() {
    return $query<BookTag[]>({
      url: endpoints.book.tags,
      key: ['bookTags'],
    })
  }

  return {
    fetchBookOptions,
    fetchRankOptions,
    search,
    top,
    tags,
  }
}

export function useBook(id: number) {
  function fetchBookOptions() {
    return $queryOptions<Book>({
      url: endpoints.book.detail(id),
      key: ['book', id], // add id to enable caching
    })
  }

  function comment<T extends CommentRequest = CommentRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.book.comments(id),
      method: 'POST',
      ...options,
    })
  }

  return {
    fetchBookOptions,
    comment,
  }
}
