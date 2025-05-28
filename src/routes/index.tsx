import CardsWaterfall from '@/components/user/main/cards-waterfall'
import BookFilter from '@/components/user/main/filter'
import { useBooks } from '@/lib/api/book'
import { NO_NEED_AUTH_ROUTES } from '@/lib/models/endpoints'
import { fetchFakeTags } from '@/lib/utils/dummy'

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
  async loader({ context: { queryClient }, location }) {
    if (NO_NEED_AUTH_ROUTES.includes(location.pathname))
      return []
    return await queryClient.fetchQuery(useBooks().fetchBookOptions())
  },
})

function App() {
  const [filterInput, setFilterInput] = useState('')
  const tags = fetchFakeTags()

  const bookList = Route.useLoaderData()

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  function handleSelectedTagChange(selected: number[]) {
    setSelectedTagIds(selected)
  }

  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen gap-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <BookFilter
          filterInput={filterInput}
          onFilterInputChange={setFilterInput}
          onSelectedTagsChange={handleSelectedTagChange}
          tags={tags}
          className="w-full"
        />
        <CardsWaterfall bookList={bookList.items} />
      </main>
    </div>
  )
}

export default App
