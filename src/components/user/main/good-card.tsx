import type { Book } from '@/lib/models/user'

import {
  Card,
  // CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toCNYString } from '@/lib/utils/price'

interface GoodCardProps extends React.ComponentProps<'div'> {
  book: Book
}

export default function GoodCard({ book, className }: GoodCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardDescription className="flex justify-center">
          <img
            src={book.cover}
            alt="test cover of good card"
            className="center"
            width={300}
            height={300}
          />
        </CardDescription>
        <CardTitle className="text-center pt-[1em]">{book.title}</CardTitle>
      </CardHeader>
      <CardFooter>
        <p>{toCNYString(book.price)}</p>
      </CardFooter>
    </Card>
  )
}
