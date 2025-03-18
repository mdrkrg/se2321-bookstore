/*
 * Books
 */

import type { Book, BookTag, PagedItems } from '../models/user'
import type { CommentRequest } from './comment'
import type { ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate, useFetch } from './utils'

export function useAddBookComment(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, CommentRequest>({
    url: endpoints.book.comments(id),
    method: 'POST',
    onSuccess,
    onError,
  })
}

export function useSearchBooks(
  tag: string,
  keyword: string,
  pageIndex: number, // | QueryState<number>,
  pageSize: number,
) {
  return useFetch<PagedItems<Book>>({
    url: endpoints.books.index,
    key: ['books', pageIndex],
    query: {
      tag,
      keyword,
      pageIndex,
      pageSize,
    },
  })
}

export function useTopBooks() {
  return useFetch<Book[]>({
    url: endpoints.books.rank,
    key: ['bookRank'],
  })
}

export function useBook(
  id: number,
) {
  return useFetch<Book>({
    url: endpoints.book.index(id),
    key: ['book', id], // add id to enable caching
  })
}

export function useBookTags() {
  return useFetch<BookTag[]>({
    url: endpoints.book.tags,
    key: ['bookTags'],
  })
}
