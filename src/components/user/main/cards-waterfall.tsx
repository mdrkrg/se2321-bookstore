import type { Book } from '@/lib/models/user'
import { cn } from '@/lib/utils/cn'
import { Link } from '@tanstack/react-router'
import { range } from 'lodash'
import React from 'react'
import GoodCard from './good-card'

interface CardsWaterfallProps extends React.ComponentProps<'div'> {
  bookList: Array<Book>
  isLoading: boolean
}

export default function CardsWaterfall({
  bookList,
  isLoading,
  className,
}: CardsWaterfallProps) {
  return (
    <div className={cn('w-full rounded bg-white', className)}>
      {isLoading
        ? (
            <div className="p-4 grid auto-rows-min gap-4 md:grid-cols-4 w-80vw">
              {range(8).map(i => (<GoodCard key={i} isLoading={true} />))}
            </div>
          )
        : Boolean(bookList.length)
          && (
            <div className="p-4 grid auto-rows-min gap-4 md:grid-cols-4 w-80vw">
              {
                bookList.map((book, index) => {
                  return (
                    <Link
                      to="/book/$bookId"
                      params={{ bookId: book.id.toString() }}
                      key={index}
                    >
                      <GoodCard book={book} />
                    </Link>
                  )
                })
              }
              {/* TODO:
              * lazy loading and dummy data, refer to
              * https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll
              * for more details.
              */}
            </div>
          )}
    </div>
  )
}
