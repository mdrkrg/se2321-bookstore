import type { Book } from '@/lib/models/user'
import type { ReactNode } from 'react'
import { BookDetail } from '@/components/user/book/detail'
import { testBookList } from '@/lib/utils/dummy'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'

function fetchBookFake(id: number): Book | null {
  return testBookList.find(book => book.id === id) ?? null
}

export const Route = createFileRoute('/book/$bookId')({
  loader: async ({ params }) => {
    const bookId = Number(params.bookId)
    if (Number.isNaN(bookId))
      throw notFound()
    const book = fetchBookFake(bookId)
    if (book)
      return book

    throw notFound()
  },
  component: BookDetailComponent,
  notFoundComponent: NotFound,
})

function BookLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-4 max-sm:p-0 max-sm:mx-0">
      <div className="md:flex bg-white shadow-md rounded-lg overflow-hidden max-sm:w-screen max-sm:shadow-none">
        {children}
      </div>
    </div>
  )
}

function BookDetailComponent() {
  const book = Route.useLoaderData()
  return (
    <BookLayout>
      <BookDetail book={book} />
    </BookLayout>
  )
}

function NotFound() {
  const router = useRouter()
  const [count, { startCountdown, stopCountdown }]
    = useCountdown({
      countStart: 3,
    })

  useEffect(() => {
    if (count === 0)
      router.history.back()
  }, [count])

  useEffect(() => {
    startCountdown()
    // Cleanup on unmount
    return () => stopCountdown()
  })

  return (
    <BookLayout>
      <h1 className="text-2xl font-heavy text-center mx-auto my-2 p-4">
        出错了
      </h1>
      <p className="leading-8 mx-auto text-center my-2">
        找不到所请求的资源
        <br />
        {count}
        {' '}
        秒后返回上一页
      </p>
    </BookLayout>
  )
}
