import type { Order } from '@/lib/models/user'
import DropdownLayout from '@/components/layouts/dropdown'
import { MyOrders } from '@/components/user/order/my-orders'
import { fetchFakeOrderList } from '@/lib/utils/dummy'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order')({
  component: OrderComponent,
  loader() {
    const orderList = fetchFakeOrderList()
    return orderList
  },
})

function OrderComponent() {
  const orderList: Order[] = Route.useLoaderData()
  return (
    <DropdownLayout>
      <MyOrders orderList={orderList} />
    </DropdownLayout>
  )
}
