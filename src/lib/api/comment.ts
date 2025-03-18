/*
 * Comments
 */

import type { ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export interface CommentRequest {
  content: string
}

export function usePostComment(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, CommentRequest>({
    url: endpoints.comment.index(id),
    method: 'POST',
    onSuccess,
    onError,
  })
}

export function useLikeComment(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase>({
    url: endpoints.comment.like(id),
    method: 'PUT',
    onSuccess,
    onError,
  })
}

export function useUnlikeComment(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase>({
    url: endpoints.comment.unlike(id),
    method: 'PUT',
    onSuccess,
    onError,
  })
}
