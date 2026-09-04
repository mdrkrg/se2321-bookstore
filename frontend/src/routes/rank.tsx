import DropdownLayout from '@/components/layouts/dropdown'
import { BookRank } from '@/components/user/stats/book-rank'
import { useBooks } from '@/lib/api/book'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rank')({
  component: RouteComponent,
  async loader({ context: { queryClient } }) {
    return await queryClient.fetchQuery(useBooks().fetchRankOptions({}))
  },
})

function RouteComponent() {
  const initialOrderList = Route.useLoaderData()

  return (
    <DropdownLayout>
      <BookRank initialSalesList={initialOrderList} />
    </DropdownLayout>
  )
}
