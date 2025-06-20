import type { Book, Order, User } from './user'

type CommonReadOnlyFields = 'id' | 'createdAt' | 'updatedAt'

type ChangeModelRequest<T extends Record<any, any>, Omitted extends Array<keyof T | never> = never> = {
  // iterate over the keys of T, but only those not in 'id' or Args.
  [P in keyof Omit<T, CommonReadOnlyFields | Omitted[number]>]?:
  // check if the property's value is a plain object
  T[P] extends Record<string, any>
  // if it's an object, make it Partial
    ? Partial<T[P]>
  // otherwise, keep original type
    : T[P]
}

export type ChangeUserRequest = ChangeModelRequest<User, ['username']>

export type ChangeBookRequest = ChangeModelRequest<Book, ['title', 'author', 'tags']>

export type AddBookRequest = ChangeModelRequest<Book, ['tags', 'sales']>

export interface OrderAdmin extends Order {
  creator: User
}

export type ChangeOrderRequest = ChangeModelRequest<Order, ['items', 'totalPaidPrice', 'originalPrice']>
