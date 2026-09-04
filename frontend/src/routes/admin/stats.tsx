import { SpenderStat } from '@/components/admin/spender-stat'
import DropdownLayout from '@/components/layouts/dropdown'
import { fetchAdminUserStatOptions } from '@/lib/api/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stats')({
  component: RouteComponent,
  async loader({ context: { queryClient } }) {
    return await queryClient.fetchQuery(fetchAdminUserStatOptions())
  },
})

function RouteComponent() {
  const initialSpenderList = Route.useLoaderData()

  return (
    <DropdownLayout>
      <SpenderStat initialSpenderList={initialSpenderList} />
    </DropdownLayout>
  )
}
