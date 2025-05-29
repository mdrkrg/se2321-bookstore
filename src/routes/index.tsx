import type { Book, PagedItems } from '@/lib/models/user'
import CardsWaterfall from '@/components/user/main/cards-waterfall'
import BookFilter from '@/components/user/main/filter'
import { useBooks } from '@/lib/api/book'
import { NO_NEED_AUTH_ROUTES } from '@/lib/models/endpoints'
import { fetchFakeTags } from '@/lib/utils/dummy'
import { useQuery } from '@tanstack/react-query'

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/')({
  component: App,
  async loader({ context: { queryClient }, location }) {
    if (NO_NEED_AUTH_ROUTES.includes(location.pathname)) {
      return {
        items: [] as Book[],
        total: 0,
      }
    }
    return await queryClient.fetchQuery(useBooks().fetchBookOptions({}))
  },
})

function App() {
  const [filterInput, setFilterInput] = useState('')
  const tags = fetchFakeTags()

  const initialBookList = Route.useLoaderData()

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  function handleSelectedTagChange(selected: number[]) {
    setSelectedTagIds(selected)
  }

  const [debouncedFilterInput] = useDebounceValue(filterInput, 500)
  const booksQueryConfiguration = useBooks().fetchBookOptions({ title: debouncedFilterInput })

  const {
    data: booksResult,
    isLoading,
    isFetching,
  } = useQuery<PagedItems<Book>>({
    ...booksQueryConfiguration,
    initialData: initialBookList,
    placeholderData: previousData => previousData,
  })

  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen gap-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col min-h-full gap-8 row-start-2 items-center sm:items-start">
        <BookFilter
          filterInput={filterInput}
          onFilterInputChange={setFilterInput}
          onSelectedTagsChange={handleSelectedTagChange}
          tags={tags}
          className="w-full"
        />
        <CardsWaterfall
          bookList={booksResult.items}
          isFilterEnabled={debouncedFilterInput.length !== 0}
          isLoading={isLoading || isFetching}
        />
      </main>
    </div>
  )
}

export default App
