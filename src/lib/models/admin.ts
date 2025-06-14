import type { Book, User } from './user'

type ChangeModelRequest<T extends Record<any, any>, Omitted extends Array<keyof T | never> = never> = {
  // iterate over the keys of T, but only those not in 'id' or Args.
  [P in keyof Omit<T, 'id' | Omitted[number]>]?:
  // check if the property's value is a plain object
  T[P] extends Record<string, any>
  // if it's an object, make it Partial
    ? Partial<T[P]>
  // otherwise, keep original type
    : T[P]
}

export type ChangeUserRequest = ChangeModelRequest<User, ['username']>

export type ChangeBookRequest = ChangeModelRequest<Book, ['title', 'author', 'tags']>
