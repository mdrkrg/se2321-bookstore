import type { Book } from '@/lib/models/user'
import { Link } from '@tanstack/react-router'
import GoodCard from './good-card'

// const fetchingBook = <div className="aspect-video rounded-xl bg-muted" />

export default function CardsWaterfall({ bookList }: { bookList: Array<Book> }) {
  return (
    <div className="w-full rounded bg-white">
      {
        bookList.length
          ? (
              <div className="flex flex-1 flex-col gap-4 p-4 w-full">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4 w-80vw">
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
                    * Add lazy loading and dummy data here, refer to
                    * https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll
                    * for more details.
                    */}
                </div>
              </div>
            )
          : <h2 className="text-center font-bold text-2xl">当前书籍已售空</h2>
      }
    </div>
  )
}
