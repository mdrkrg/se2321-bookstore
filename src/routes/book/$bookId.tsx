import type { Book } from '@/lib/models/user'
import type { ReactNode } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NumberInput } from '@/components/ui/number-input'
import { OrderPopup } from '@/components/user/order/order-popup'
import { toCNYString } from '@/lib/utils/price'
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useCountdown } from 'usehooks-ts'

const testbook: Book = {
  id: 0,
  title: 'Test',
  description: `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis nibh et mi fringilla ullamcorper id non erat. Sed vestibulum cursus accumsan. Quisque fringilla risus diam, a egestas enim accumsan ut. Maecenas imperdiet sed lorem vel pulvinar. Integer quis fermentum ligula. Nunc aliquam tempor lectus a vestibulum. Donec commodo, tortor in sagittis vehicula, lectus dui rhoncus libero, nec tincidunt mauris magna et velit. Quisque non ipsum ut sapien placerat consequat. Curabitur imperdiet dolor in sapien posuere imperdiet. Etiam vel blandit quam.
  Morbi eros lorem, aliquet tempor metus vel, cursus sollicitudin ante. Nam in augue et lectus lobortis fringilla. Proin aliquet elementum mollis. Vivamus placerat, nulla vitae venenatis dapibus, ex nunc vestibulum mauris, non aliquet justo enim id nisl. Ut molestie tortor quis dolor dignissim malesuada. Donec volutpat pharetra posuere. Phasellus elementum elit non massa convallis, rutrum fermentum nibh fermentum. Vivamus accumsan commodo libero ultricies imperdiet. Praesent consectetur, odio in posuere pellentesque, enim neque finibus sapien, sit amet malesuada dolor magna a dui. Nulla auctor neque vitae interdum aliquam. Praesent euismod diam lorem, et eleifend ex semper eu. Fusce lectus nibh, tincidunt eu eleifend et, malesuada eget odio. Donec iaculis neque ut neque efficitur, ut malesuada augue volutpat. Praesent mattis lectus orci, ut aliquet neque mattis non. Aenean porta enim tortor, nec tempor ex blandit sed. Morbi mi ligula, molestie ut ante quis, luctus maximus neque. `,
  cover: 'https://img3m4.ddimg.cn/96/20/25215594-2_u_11.jpg',
  author: 'me',
  sales: 100,
  price: 0,
  tags: [
    { id: 0, name: 'test' },
  ],
}

function fetchBookFake(id: number): Book | null {
  if (id === 0)
    return testbook
  return null
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
