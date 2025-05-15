import type { Book, OrderItem } from '@/lib/models/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NumberInput } from '@/components/ui/number-input'
import { addCartItem } from '@/lib/api/order'
import { toCNYString } from '@/lib/utils/price'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { OrderPopup } from '../order/order-popup'

interface BookDetailProps {
  book: Book
}

export function BookDetail({ book }: BookDetailProps) {
  const [count, setCount] = useState<number>(1)
  const navigate = useNavigate()

  async function postAddToCart(book: Book, count: number) {
    // eslint-disable-next-line no-console
    console.log('adding to cart:')
    // eslint-disable-next-line no-console
    console.log(book)
    // eslint-disable-next-line no-console
    console.log(`count: ${count}`)
    return addCartItem(book.id, count)
  }

  async function handleCartClick() {
    await postAddToCart(book, count)

    return toast(`已将 ${book.title} 加入购物车`, {
      action: (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate({ to: '/cart' })}
          className="ml-auto"
        >
          前往查看
        </Button>
      ),
    })
  }

  // orderList is used as prop passed into OrderPopup
  const [orderList, setOrderList] = useState<OrderItem[]>([{
    id: -1, // placeholder
    book,
    number: count,
    unitPrice: book.price,
    paidPrice: book.price * count,
  }])
  const [posted, setPosted] = useState(false)

  function handleBuyNowClick() {
    // if not posted yet, or posted but number has changed
    if (!posted || (posted && orderList[0].number !== count)) {
      // add a cart item immediately, else get an existing cart item
      postAddToCart(book, count).then((item) => {
        // use .then to sync
        setOrderList([{
          unitPrice: book.price,
          paidPrice: book.price * item.number,
          book,
          number: count,
          id: item.id,
        }])
        setPosted(true)
      })
    }
  }

  return (
    <>
      <div className="md:w-1/3">
        <img
          className="w-full h-auto object-cover p-4 mt-6"
          src={book.cover}
          alt={book.title}
        />
      </div>

      <article className="md:w-2/3 p-8">
        <h1 className="text-3xl font-bold text-gray-800 max-sm:text-center max-sm:mb-6">
          {book.title}
        </h1>

        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">基本信息</h2>
          <div className="text-gray-600 p-2 leading-8">
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
          </div>
        </section>

        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">作品简介</h2>
          <p className="text-gray-600 p-2 leading-8">
            {book.description}
          </p>
        </section>

        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">价格</h2>
          <p className="text-pink-700 text-xl font-bold leading-10">{toCNYString(book.price)}</p>
        </section>

        <section className="mt-6 flex flex-row max-sm:flex-col">
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
          <OrderPopup orderList={orderList}>
            <Button
              variant="destructive"
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded mx-2 max-sm:my-2"
              onClick={handleBuyNowClick}
            >
              立即购买
            </Button>
          </OrderPopup>
        </section>
      </article>
    </>
  )
}
