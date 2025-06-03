import type { DateRange } from 'react-day-picker'

import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'

import { BookStat } from '@/components/user/stats/book-stat'
import { fetchUserStatOptions } from '@/lib/api/user'
import { createFileRoute } from '@tanstack/react-router'
import { addDays } from 'date-fns'
import { useState } from 'react'

export const Route = createFileRoute('/me/stats')({
  async loader({ context: { queryClient } }) {
    return await queryClient.fetchQuery(fetchUserStatOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const initialStat = Route.useLoaderData()
  // const [showChart, setShowChart] = useState(false)

  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })
  return (
    <div className="w-2/3 m-auto p-4">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">购书统计</h1>
      {/*
      <Button
        variant="secondary"
        onClick={() => setShowChart(!showChart)}
        className='float-right w-40'
      >
        {showChart ? '查看书目统计' : '查看消费月度统计'}
      </Button>
        */
      }
      <DatePickerWithRange date={date} setDate={setDate} />
      <BookStat
        initialBookStat={initialStat}
        date={date}
      />
    </div>
  )
}
