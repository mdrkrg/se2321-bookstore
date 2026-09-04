import type { Book, PagedItems } from '@/lib/models/user'
import type { InfiniteData, QueryKey as TQueryKey } from '@tanstack/react-query'
import CardsWaterfall from '@/components/user/main/cards-waterfall'
import BookFilter from '@/components/user/main/filter'

import { DEFAULT_PAGE_SIZE, fetchBooks } from '@/lib/api/book'
import { NO_NEED_AUTH_ROUTES } from '@/lib/models/endpoints'

import { fetchFakeTags } from '@/lib/utils/dummy'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/')({
  component: App,
  async loader({ context: { queryClient }, location }) {
    if (NO_NEED_AUTH_ROUTES.includes(location.pathname)) {
      return { isPublicRoute: true }
    }

    // prefetch
    const filterInput = ''
    const selectedTagIds: number[] = []
    const initialPageNumber = 0

    const queryKey: TQueryKey = ['books', filterInput, selectedTagIds]

    await queryClient.prefetchInfiniteQuery<
      PagedItems<Book>,
      Error,
      PagedItems<Book>,
      TQueryKey,
      number
    >({
      queryKey,
      queryFn: async ({ pageParam = initialPageNumber }) => {
        return await fetchBooks({
          title: filterInput,
          tagIds: selectedTagIds,
          pageNumber: pageParam,
          pageSize: DEFAULT_PAGE_SIZE,
        })
      },
      initialPageParam: initialPageNumber,
      getNextPageParam: (lastPage) => {
        const nextPageNum = lastPage.pageNumber + 1
        const totalPages = lastPage.totalPages
        return nextPageNum < totalPages ? nextPageNum : undefined
      },
      pages: 1,
    })

    return { isPublicRoute: false }
  },
})

function App() {
  const [filterInput, setFilterInput] = useState('')
  const tags = fetchFakeTags()
  const { isPublicRoute } = Route.useLoaderData()

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  function handleSelectedTagChange(newSelectedTagIds: number[]) {
    setSelectedTagIds(newSelectedTagIds)
  }

  const [debouncedFilterInput] = useDebounceValue(filterInput, 500)

  const queryKey: TQueryKey = ['books', debouncedFilterInput, selectedTagIds]

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    PagedItems<Book>,
    Error,
    InfiniteData<PagedItems<Book>, number>,
    TQueryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      return await fetchBooks({
        title: filterInput,
        tagIds: selectedTagIds,
        pageNumber: pageParam,
        pageSize: DEFAULT_PAGE_SIZE,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPageNum = lastPage.pageNumber + 1
      return nextPageNum < lastPage.totalPages ? nextPageNum : undefined
    },
    enabled: !isPublicRoute,
  })

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage])

  function scrollToTop() {
    // HACK: must first 1 then 0 to handle some bug
    window.scrollTo({ top: 1, behavior: 'smooth' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // scroll back when fetching query
  useEffect(() => {
    if ((status === 'pending' || isFetching) && !isFetchingNextPage) {
      scrollToTop()
    }
  }, [isFetching, status, isFetchingNextPage])

  const bookList = data ? data.pages.flatMap(page => page.items) : []
  const isInitialFetching = isFetching && !isFetchingNextPage
  const isBookLoading = status === 'pending' || (isInitialFetching && bookList.length === 0 && status !== 'error')
  const isFilterEnabled = debouncedFilterInput.length > 0 || selectedTagIds.length > 0

  // toast error if something goes wrong
  useEffect(() => {
    if (status === 'error') {
      toast('出错：', {
        className: 'text-red-500!',
        description: error?.message || '无法加载书籍列表',
        descriptionClassName: 'text-red-500!',
      })
    }
  }, [error, status])

  const loadingStyle = `w-80vw text-center text-slate-500 dark:text-slate-400`

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
          bookList={bookList}
          isLoading={isBookLoading}
        />

        <div ref={loadMoreRef} className="w-full text-center py-8">
          {isFetchingNextPage
            ? (
                <p className={loadingStyle}>正在加载...</p>
              )
            : hasNextPage
              ? (
                  <></>
                )
              : (
                  bookList.length > 0 && status !== 'pending' && (
                    <p className={loadingStyle}>已获取所有书籍！</p>
                  )
                )}
          {/* no books */}
          {status === 'success' && bookList.length === 0 && !isFetching && (
            <p className={loadingStyle}>
              {isFilterEnabled ? '未找到符合筛选项的书籍' : '当前书籍已售空'}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
