import type { BookSalesStat, PagedItems } from '@/lib/models/user'
import type { ColumnDef } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBooks } from '@/lib/api/book'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { addDays } from 'date-fns'
import React, { useState } from 'react'

const columns: ColumnDef<BookSalesStat>[] = [
  {
    id: 'rank',
    header: '排行',
    cell: ({ row }) => {
      return <span className="font-bold">{row.index + 1}</span>
    },
  },
  {
    accessorKey: 'book',
    header: '标题（点击跳转）',
    cell: ({ row }) => {
      return (
        <Link
          to="/book/$bookId"
          params={{ bookId: `${row.original.book.id}` }}
          className="hover:text-pink-700"
        >
          {row.original.book.title}
        </Link>
      )
    },
  },
  {
    accessorKey: 'number',
    header: '销量',
    cell: ({ row }) => {
      return row.original.number
    },
  },
]

interface BookRankProps extends React.ComponentProps<'table'> {
  initialSalesList: PagedItems<BookSalesStat>
}

export function BookRank({ initialSalesList }: BookRankProps) {
  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })

  const [showDateRange, setShowDateRange] = useState(false)
  const booksQueryConfig = useBooks().fetchRankOptions({
    startDate: showDateRange ? date?.from : undefined,
    endDate: showDateRange ? date?.to : undefined,
  })

  const {
    data: orderList,
  } = useQuery({
    ...booksQueryConfig,
    initialData: initialSalesList,
    placeholderData: previousData => previousData,
  })

  const table = useReactTable({
    data: orderList.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">Top 10 榜单</h1>
      <div className="flex items-center pb-4">
        {showDateRange
          && <DatePickerWithRange date={date} setDate={setDate} />}
        <Button
          onClick={() => setShowDateRange(!showDateRange)}
          className="ml-auto w-40"
        >
          {showDateRange ? '查看全部' : '查看日期范围内' }
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center !b-r-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableRow>
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      这段时间内没有销售额数据。
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
