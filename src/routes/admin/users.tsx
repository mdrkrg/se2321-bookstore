import { UserList } from '@/components/admin/user-list'
import DropdownLayout from '@/components/layouts/dropdown'
import { fetchUserListOptions } from '@/lib/api/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
  async loader({ context: { queryClient } }) {
    const userList = await queryClient.fetchQuery(fetchUserListOptions())
    return userList
  },
})

function RouteComponent() {
  const userList = Route.useLoaderData()
  return (
    <DropdownLayout>
      <UserList initialUserList={userList} />
    </DropdownLayout>
  )
}
