export interface PagedItems<Item> {
  /** Format: int32 */
  total: number
  items: Item[]
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface OrderInfo {
  address: string
  receiver: string
  tel: string
  items: {
    paidPrice: number
    itemId: number // cart item id
  }[]
}

export interface PartialUserDTO {
  username: string
  nickname: string
  avatar: string
  introduction: string
}

export const Roles = {
  USER: '用户',
  ADMIN: '管理员',
} as const

export type Role = keyof typeof Roles

export function getRoleDisplay(role: Role) {
  return Roles[role]
}

export interface UserDTO {
  id: number
  username: string
  email: string
  balance: number
  role: Role
  userInfo: {
    avatar: string
    introduction: string
    nickname: string
  }
}

export interface User extends UserDTO {
  enabled: boolean
  accountNonExpired: boolean
  accountNonLocked: boolean
}

export interface Address {
  /** Format: int64 */
  id: number
  address: string
  tel: string
  receiver: string
}

export interface Book {
  /** Format: int64 */
  id: number
  title: string
  author: string
  description: string
  /** Format: int32 */
  price: number
  cover: string
  /** Format: int32 */
  sales: number
  stock: number
  tags: BookTag[]
}

export function isBookOutOfStock(book: Book) {
  return book.stock <= 0
}

export interface Order {
  /** Format: int64 */
  id: number
  receiver: string
  address: string
  tel: string
  /** Format: date-time */
  // createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  /** Format: int64 */
  id: number
  book: Book
  /** Format: int32 */
  number: number
  unitPrice: number
  paidPrice: number
}

export interface BookTag {
  /** Format: int64 */
  id: number
  name: string
}

export interface CartItem {
  /** Format: int64 */
  id: number
  book: Book
  /** Format: int32 */
  number: number
  price: number
}

export interface CommentDTO {
  /** Format: int64 */
  id: number
  /** Format: int64 */
  userId: number
  username: string
  avatar: string
  content: string
  reply: string
  /** Format: int32 */
  like: number
  liked: boolean
  /** Format: date-time */
  createdAt: string
}

export interface OutOfStockDetail {
  cartItemId: number
  available: number
  requested: number
  title: string
}

export interface OutOfStockErrorResponse {
  message: string
  outOfStockItems: OutOfStockDetail[]
}
