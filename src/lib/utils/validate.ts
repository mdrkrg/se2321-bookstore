import { z } from 'zod'

export const PHONE_REGEX = /^1[3-9]\d{9}$/

export const MIN_NAME = 2
export const MAX_NAME = 50

export const MIN_ADDRESS = 5
export const MAX_ADDRESS = 100

export const MAX_DESCRIPTION = 300

export const MIN_PASSWORD = 8
export const MAX_PASSWORD = 100

export const PASSWORD_VALIDATOR = z.string().min(MIN_PASSWORD, {
  message: `密码长度不得少于 ${MIN_PASSWORD}`,
}).max(MAX_PASSWORD, {
  message: `密码长度不得超过 ${MAX_PASSWORD}`,
})

export const CHANGE_PASSWORD_VALIDATOR = z.object({
  password: PASSWORD_VALIDATOR,
  confirmPassword: PASSWORD_VALIDATOR,
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: '确认密码不一致',
      path: ['confirmPassword'],
    })
  }
})

export const ADDRESS_VALIDATOR = z.string({
  required_error: '请输入收货地址',
}).min(MIN_ADDRESS, {
  message: '请输入详细的收货地址',
}).max(MAX_ADDRESS, {
  message: '收货地址过长',
})

export const PHONE_VALIDATOR = z.string({
  required_error: '请输入联系电话',
}).regex(PHONE_REGEX, {
  message: '请输入正确的联系电话',
})

export function getNameValidator(calling?: string) {
  const name = calling ?? '姓名'
  return z.string({
    required_error: `请输入${name}`,
  }).min(MIN_NAME, {
    message: `请输入正确的${name}`,
  }).max(MAX_NAME, {
    message: `请输入正确的${name}`,
  })
}
