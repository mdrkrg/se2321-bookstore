import type { OrderItem } from '@/lib/models/user'
import { cn } from '@/lib/utils/cn'
import { toCNYString } from '@/lib/utils/price'
import { Link } from '@tanstack/react-router'
import React from 'react'

interface OrderPanelProps extends React.ComponentProps<'div'> {
  itemList: OrderItem[]
  state: 'open' | 'closed'
}

export function OrderExpandDetail({ itemList, state, className }: OrderPanelProps) {
  const rowStyle = 'w-full grid grid-cols-[1fr_2fr_1fr_1fr_2em] py-2 mx-2 text-center'
  return (
    <div
      data-state={state}
      className={cn(
        className,
        'overflow-hidden relative',
      )}
    >
      <div className={rowStyle}>
        <span>封面</span>
        <span>标题（点击跳转）</span>
        <span>数量</span>
        <span>价格</span>
      </div>
      {
        itemList.map(({ id, book, number }) => (
          <div key={id} className={rowStyle}>
            <img src={book.cover} alt={book.title} width={50} className="m-auto" />
            <span className="m-auto hover:text-pink-700">
              <Link to="/book/$bookId" params={{ bookId: `${book.id}` }}>
                {book.title}
              </Link>
            </span>
            <span className="m-auto">{number}</span>
            <span className="m-auto">{toCNYString(number * book.price)}</span>
          </div>
        ))
      }
    </div>
  )
}
