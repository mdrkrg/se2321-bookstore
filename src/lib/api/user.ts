/*
 * Personal information,
 * login and logout
 */

import type { $MutateOptions, ApiResponseBase } from './utils'
import { endpoints } from '../models/endpoints'
import { $mutate } from './utils'

export interface ChangeAvatarRequest {
  file: Blob
}

export interface ChangePasswordRequest {
  password: string
}

export interface ChangeIntroductionRequest {
  introduction: string
}

export interface AddAddressRequest {
  address: string
  receiver: string
  tel: string
}

export interface LoginRequest {
  username: string
  password: string
}

export function useUser() {
  function changeAvatar<T extends ChangeAvatarRequest = ChangeAvatarRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.user.me.avatar,
      method: 'POST',
      ...options,
    })
  }

  function changePassword<T extends ChangePasswordRequest = ChangePasswordRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.user.me.passwd,
      method: 'PUT',
      ...options,
    })
  }

  function changeIntroduction<T extends ChangeIntroductionRequest = ChangeIntroductionRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.user.me.intro,
      method: 'PUT',
      ...options,
    })
  }

  function addAddress<T extends AddAddressRequest = AddAddressRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.user.me.addrs.index,
      method: 'POST',
      ...options,
    })
  }

  function deleteAddress<T extends AddAddressRequest = AddAddressRequest>(
    id: number,
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.user.me.addrs.delete(id),
      method: 'DELETE',
      ...options,
    })
  }

  function login<T extends LoginRequest = LoginRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.view.login,
      method: 'POST',
      ...options,
    })
  }

  function logout(
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase>({
      url: endpoints.view.logout,
      method: 'PUT',
      ...options,
    })
  }

  return {
    changeAvatar,
    changePassword,
    changeIntroduction,
    addAddress,
    deleteAddress,
    login,
    logout,
  }
}
