/*
 * Comments
 */

import type { $MutateOptions, ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export interface CommentRequest {
  content: string
}

export function useComment(id: number) {
  function post<T extends CommentRequest = CommentRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.comment.index(id),
      method: 'POST',
      ...options,
    })
  }
  function like(
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase, undefined>({
      url: endpoints.comment.like(id),
      method: 'PUT',
      ...options,
    })
  }
  function unlike(
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase, undefined>({
      url: endpoints.comment.unlike(id),
      method: 'PUT',
      ...options,
    })
  }

  return {
    post,
    like,
    unlike,
  }
}
