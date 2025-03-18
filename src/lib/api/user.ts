/*
 * Personal information
 */

import type { ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export interface ChangeAvatarRequest {
  file: Blob
}

export function useChangeAvatar(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, ChangeAvatarRequest>({
    url: endpoints.user.me.avatar,
    method: 'POST',
    onSuccess,
    onError,
  })
}

export interface ChangePasswordRequest {
  password: string
}

export function useChangePassword(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, ChangePasswordRequest>({
    url: endpoints.user.me.passwd,
    method: 'PUT',
    onSuccess,
    onError,
  })
}

export interface ChangeIntroductionRequest {
  introduction: string
}

export function useChangeIntroduction(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, ChangeIntroductionRequest>({
    url: endpoints.user.me.intro,
    method: 'PUT',
    onSuccess,
    onError,
  })
}

export interface AddAddressRequest {
  address: string
  receiver: string
  tel: string
}

export function useAddAddress(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, AddAddressRequest>({
    url: endpoints.user.me.addrs.index,
    method: 'POST',
    onSuccess,
    onError,
  })
}

export function useDeleteAddress(
  id: number,
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, AddAddressRequest>({
    url: endpoints.user.me.addrs.delete(id),
    method: 'DELETE',
    onSuccess,
    onError,
  })
}

/*
 * Login and logout
 */

export interface LoginRequest {
  username: string
  password: string
}

export function useLogin(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase, LoginRequest>({
    url: endpoints.view.login,
    method: 'POST',
    onSuccess,
    onError,
  })
}

export function useLogout(
  onSuccess?: (data: ApiResponseBase) => void,
  onError?: (error: any) => void,
) {
  return $mutate<ApiResponseBase>({
    url: endpoints.view.logout,
    method: 'PUT',
    onSuccess,
    onError,
  })
}
