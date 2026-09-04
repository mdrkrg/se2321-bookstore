import type { Book } from '@/lib/models/user'

import {
  Card,
  // CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/cn'
import { toCNYString } from '@/lib/utils/price'

interface GoodCardProps extends React.ComponentProps<'div'> {
  book?: Book
  isLoading?: boolean
}

export default function GoodCard({
  book,
  isLoading: loading = false,
  className,
}: GoodCardProps) {
  if (loading) {
    return (
      <Card className={cn('flex flex-col overflow-hidden hover:shadow-lg', className)}>
        <CardHeader className="flex-grow p-4">
          <CardDescription className="flex justify-center mb-4">
            {/* image */}
            <Skeleton className="w-full" style={{ aspectRatio: '1 / 1' }} />
          </CardDescription>
          {/* title */}
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </CardHeader>
        <CardFooter className="p-4">
          {/* price */}
          <Skeleton className="h-5 w-1/4" />
        </CardFooter>
      </Card>
    )
  }

  if (!book) {
    return null
  }

  return (
    <Card className={cn('flex flex-col overflow-hidden hover:shadow-lg', className)}>
      <CardHeader className="flex-grow p-4">
        <CardDescription className="flex justify-center mb-4">
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="center object-cover w-full"
            style={{ aspectRatio: '1 / 1' }}
          />
        </CardDescription>
        <CardTitle className="text-center pt-[1em] h-auto min-h-[3em] line-clamp-2">
          {book.title}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-4">
        <p>{toCNYString(book.price)}</p>
      </CardFooter>
    </Card>
  )
}
