import type { CartItem } from '@/lib/models/user'
import DropdownLayout from '@/components/layouts/dropdown'
import MyCart from '@/components/user/cart/my-cart'
import { testBookList } from '@/lib/utils/dummy'
import { createFileRoute } from '@tanstack/react-router'
import { random, sampleSize } from 'lodash'

export const Route = createFileRoute('/cart')({
  async loader() {
    // load cart items
    const selectedBooks = sampleSize(testBookList, random(0, testBookList.length))
    const cartItems: CartItem[] = selectedBooks.map(book => ({
      id: book.id,
      book,
      number: random(1, 10),
    }))

    return cartItems
  },
  component: Cart,
})

function Cart() {
  return (
    <DropdownLayout>
      <MyCart />
    </DropdownLayout>
  )
}
