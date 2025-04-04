import type { Book } from '@/lib/models/user'
import type { ReactNode } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NumberInput } from '@/components/ui/number-input'
import { OrderPopup } from '@/components/user/order/order-popup'
import { testBookList } from '@/lib/utils/dummy'
import { toCNYString } from '@/lib/utils/price'
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
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
  component: BookDetail,
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

function BookDetail() {
  const [count, setCount] = useState<number>(1)
  const book = Route.useLoaderData()
  const navigate = useNavigate()

  function postAddToCart(book: Book, count: number) {
    // eslint-disable-next-line no-console
    console.log('adding to cart:')
    // eslint-disable-next-line no-console
    console.log(book)
    // eslint-disable-next-line no-console
    console.log(`count: ${count}`)
  }

  function handleCartClick() {
    postAddToCart(book, count)

    return toast(`已将 ${book.title} 加入购物车`, {
      action: (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate({ to: 'cart' })}
          className="ml-auto"
        >
          前往查看
        </Button>
      ),
    })
  }

  return (
    <BookLayout>
      <div className="md:w-1/3">
        <img
          className="w-full h-auto object-cover p-4 mt-6"
          src={book.cover}
          alt={book.title}
        />
      </div>

      <div className="md:w-2/3 p-8">
        <h1 className="text-3xl font-bold text-gray-800 max-sm:text-center max-sm:mb-6">
          {book.title}
        </h1>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">基本信息</h2>
          <p className="text-gray-600 p-2 leading-8">
            作者&emsp;
            {book.author}
            <br />
            销量&emsp;
            {book.sales}
            <br />
            标签&ensp;
            {
              book.tags.map(tag => (
                <Badge
                  variant="outline"
                  className="bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mx-2"
                  key={tag.id}
                >
                  {tag.name}
                </Badge>
              ))
            }
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">作品简介</h2>
          <p className="text-gray-600 p-2 leading-8">
            {book.description}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">价格</h2>
          <p className="text-pink-700 text-xl font-bold leading-10">{toCNYString(book.price)}</p>
        </div>

        <div className="mt-6 flex flex-row max-sm:flex-col">
          <NumberInput
            className="rounded-r-none mx-2 sm:ml-none max-sm:my-2"
            inputStyle="focus:outline-none"
            placeholder="数量"
            defaultValue={1}
            min={1}
            value={count}
            onValueChange={
              newCount => typeof newCount === 'number' ? setCount(newCount) : null
            }
          />
          <Button
            variant="secondary"
            className="font-bold py-2 px-4 rounded mx-2 max-sm:my-2"
            onClick={handleCartClick}
          >
            加入购物车
          </Button>
          {/* create a orderList at once */}
          <OrderPopup orderList={[{
            id: book.id,
            book,
            number: count,
          }]}
          >
            <Button
              variant="destructive"
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mx-2 max-sm:my-2"
            >
              立即购买
            </Button>
          </OrderPopup>
        </div>
      </div>
    </BookLayout>
  )
}

export default BookDetail
