/*
 * Books
 */

import type { Book, BookTag, PagedItems } from '../models/user'
import type { CommentRequest } from './comment'
import type { $MutateOptions, ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate, $query } from './utils'

export function useBooks() {
  function search(
    tag: string,
    keyword: string,
    pageIndex: number, // | QueryState<number>,
    pageSize: number,
  ) {
    return $query<PagedItems<Book>>({
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

  function top() {
    return $query<Book[]>({
      url: endpoints.books.rank,
      key: ['bookRank'],
    })
  }

  function tags() {
    return $query<BookTag[]>({
      url: endpoints.book.tags,
      key: ['bookTags'],
    })
  }

  return {
    search,
    top,
    tags,
  }
}

export function useBook(id: number) {
  function get() {
    return $query<Book>({
      url: endpoints.book.index(id),
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
    get,
    comment,
  }
}
