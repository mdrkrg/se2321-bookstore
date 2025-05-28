/*
 * Personal information,
 * login and logout
 */

import type { AxiosError } from 'axios'
import type { UserDTO } from '../models/user'
import type { $MutateOptions, ApiResponseBase } from './utils'
import axios from 'axios'
import { endpoints } from '../models/endpoints'
import { $mutate, $queryOptions } from './utils'

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

export interface SignUpRequest {
  username: string
  email: string
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
      url: endpoints.auth.login,
      method: 'POST',
      ...options,
    })
  }

  function signup<T extends SignUpRequest = SignUpRequest>(
    options?: $MutateOptions<T>,
  ) {
    return $mutate<ApiResponseBase, T>({
      url: endpoints.auth.login,
      method: 'POST',
      ...options,
    })
  }

  function logout(
    options?: $MutateOptions<undefined>,
  ) {
    return $mutate<ApiResponseBase>({
      url: endpoints.auth.logout,
      method: 'PUT',
      ...options,
    })
  }

  function fetchUserOptions() {
    return $queryOptions<UserDTO>({
      url: endpoints.auth.curuser,
      key: ['user'],
    })
  }

  return {
    changeAvatar,
    changePassword,
    changeIntroduction,
    addAddress,
    deleteAddress,
    login,
    signup,
    logout,
    fetchUserOptions,
  }
}

export interface LoginErrorResponse {
  username?: string
  password?: string
}

export interface FieldError {
  field: string
  message: string
}

export async function loginFetcher(data: LoginRequest): Promise<UserDTO> {
  try {
    const response = await axios.post<UserDTO>(
      endpoints.auth.login,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<LoginErrorResponse>
      if (axiosError.response && (
        axiosError.response.status === 401 || axiosError.response.status === 403
      )) {
        // login failed or account locked
        const errors: FieldError[] = Object.entries(axiosError.response.data).map(([key, val]) => ({
          field: key,
          message: val,
        }))
        throw errors
      }
      else {
        // other axios errors
        throw new Error(axiosError.message || 'unexpected login error')
      }
    }
    // non axios errors
    throw new Error('unexpected error')
  }
}
