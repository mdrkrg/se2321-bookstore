import DropdownLayout from '@/components/layouts/dropdown'
import { MyOrders } from '@/components/user/order/my-orders'
import { useOrder } from '@/lib/api/order'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/order')({
  component: OrderComponent,
  async loader({ context: { queryClient } }) {
    const orderList = await queryClient.fetchQuery(useOrder().fetchOrderOptions())
    return orderList
  },
})

function OrderComponent() {
  const orderList = Route.useLoaderData()
  return (
    <DropdownLayout>
      <MyOrders initialOrderList={orderList} />
    </DropdownLayout>
  )
}
