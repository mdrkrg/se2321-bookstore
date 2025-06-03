import type { UserStat } from '@/lib/api/user'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { fetchUserStatOptions } from '@/lib/api/user'

import { cn } from '@/lib/utils/cn'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/me/stats')({
  async loader({ context: { queryClient } }) {
    return await queryClient.fetchQuery(fetchUserStatOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const initialStat = Route.useLoaderData()

  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })

  const statsQueryConfig = fetchUserStatOptions({
    createdAtStart: date?.from,
    createdAtEnd: date?.to,
  })

  const {
    data: statResult,
  } = useQuery<UserStat>({
    ...statsQueryConfig,
    initialData: initialStat,
    placeholderData: previousData => previousData,
  })

  return (
    <div>
      {
        statResult.totalNumber > 0
          ? (
              <>
                <div>
                  已购买总价:
                  {statResult.totalPrice}
                </div>
                <div>
                  已购书总数量:
                  {statResult.totalNumber}
                </div>
                <div>
                  书籍信息
                  {statResult.bookStats.map(({ book, number }) => {
                    return (
                      <div key={book.id}>
                        <span>
                          标题:
                          {' '}
                          {book.title}
                        </span>
                        <span>
                          数量:
                          {' '}
                          {number}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            )
          : (
              <div>该时间段内没有购书记录</div>
            )
      }
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon />
            {date?.from
              ? (
                  date.to
                    ? (
                        <>
                          {format(date.from, 'LLL dd, y')}
                          {' '}
                          -
                          {' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      )
                    : (
                        format(date.from, 'LLL dd, y')
                      )
                )
              : (
                  <span>Pick a date</span>
                )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

    </div>
  )
}
