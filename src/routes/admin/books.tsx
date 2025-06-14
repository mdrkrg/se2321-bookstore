import { BookList } from '@/components/admin/book-list'
import DropdownLayout from '@/components/layouts/dropdown'
import { fetchAdminBookListOptions } from '@/lib/api/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/books')({
  component: RouteComponent,
  async loader({ context: { queryClient } }) {
    const bookList = await queryClient.fetchQuery(fetchAdminBookListOptions())
    return bookList
  },
})

function RouteComponent() {
  const initialBookList = Route.useLoaderData()

  return (
    <DropdownLayout>
      <BookList initialBookList={initialBookList} />
    </DropdownLayout>
  )
}
