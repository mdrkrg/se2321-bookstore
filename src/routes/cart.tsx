import DropdownLayout from '@/components/layouts/dropdown'
import MyCart from '@/components/user/cart/my-cart'
import { useCart } from '@/lib/api/order'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  async loader({ context: { queryClient } }) {
    // load cart items
    const cartItems = await queryClient.fetchQuery(useCart().fetchCartOptions())
    return cartItems.items
  },
  component: Cart,
})

function Cart() {
  const cartItemsData = Route.useLoaderData()
  return (
    <DropdownLayout>
      <MyCart cartItemsData={cartItemsData} />
    </DropdownLayout>
  )
}
