import { OrderList } from '@/components/admin/order-list'
import DropdownLayout from '@/components/layouts/dropdown'
import { fetchAdminOrderListOptions } from '@/lib/api/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders')({
  component: RouteComponent,
  async loader({ context: { queryClient } }) {
    const orderList = await queryClient.fetchQuery(fetchAdminOrderListOptions())
    return orderList
  },
})

function RouteComponent() {
  const initialOrderList = Route.useLoaderData()

  return (
    <DropdownLayout>
      <OrderList initialOrderList={initialOrderList} />
    </DropdownLayout>
  )
}
