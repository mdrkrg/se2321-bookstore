/*
 * Personal information,
 * login and logout
 */

import type { AxiosError } from 'axios'
import type { Book, UserDTO } from '../models/user'
import type { $MutateOptions, ApiResponseBase } from './utils'
import axios from 'axios'
import dayjs from 'dayjs'
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

export interface SignupRequest {
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

  function signup<T extends SignupRequest = SignupRequest>(
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

export async function authFetcher<TRequest>(data: TRequest, endpoint: string): Promise<UserDTO> {
  try {
    const response = await axios.post<UserDTO>(
      endpoint,
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
      const knownCodes = [401, 403, 409]
      if (axiosError.response && knownCodes.includes(axiosError.response.status)) {
        // login failed or account locked
        const errors: FieldError[] = Object.entries(
          axiosError.response.data,
        ).map(([key, val]) => ({
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

export async function loginFetcher(data: LoginRequest): Promise<UserDTO> {
  return await authFetcher(data, endpoints.auth.login)
}

export async function signupFetcher(data: SignupRequest): Promise<UserDTO> {
  return await authFetcher(data, endpoints.auth.signup)
}

export interface UserStat {
  totalPrice: number
  totalNumber: number
  bookStats: {
    book: Book
    number: number
  }[]
}

export interface UserStatRequest {
  createdAtStart?: Date
  createdAtEnd?: Date
}

// TODO: generalize this fetcher
export async function statFetcher({
  createdAtStart,
  createdAtEnd,
}: UserStatRequest) {
  try {
    const response = await axios.get<UserStat>(endpoints.user.me.stat, {
      params: {
        createdAtStart: createdAtStart?.toISOString(),
        createdAtEnd: createdAtEnd?.toISOString(),
      },
    })
    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<LoginErrorResponse>
      if (axiosError.response && axiosError.response.status === 400) {
        const errors: FieldError[] = Object.entries(
          axiosError.response.data,
        ).map(([key, val]) => ({
          field: key,
          message: val,
        }))
        throw errors
      }
      else {
        // other axios errors
        throw new Error(axiosError.message || 'unexpected fetch error')
      }
    }
    // non axios errors
    throw new Error('unexpected error')
  }
}

export function fetchUserStatOptions(
  createdAtStart?: Date,
  createdAtEnd?: Date,
) {
  const start = createdAtStart ? dayjs(createdAtStart).format('YYYY-MM-DD') : ''
  const end = createdAtEnd ? dayjs(createdAtEnd).format('YYYY-MM-DD') : ''
  return $queryOptions<UserStat>({
    url: endpoints.user.me.stat,
    key: [
      'user-stat',
      start,
      end,
    ],
    query: {
      createdAtStart: start,
      createdAtEnd: end,
    },
  })
}
