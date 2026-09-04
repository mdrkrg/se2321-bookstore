import type { AdminUserStat } from '@/lib/models/admin'
import type { PagedItems } from '@/lib/models/user'
import type { ColumnDef } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchAdminUserStatOptions } from '@/lib/api/admin'
import { toCNYString } from '@/lib/utils/price'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { addDays } from 'date-fns'
import React, { useState } from 'react'

const columns: ColumnDef<AdminUserStat>[] = [
  {
    id: 'rank',
    header: '消费排名',
    cell: ({ row }) => {
      return <span className="font-bold">{row.index + 1}</span>
    },
  },
  {
    accessorKey: 'user',
    header: '用户名',
    cell: ({ row }) => {
      return row.original.user.username
    },
  },
  {
    accessorKey: 'totalPaidPrice',
    header: '消费金额',
    cell: ({ row }) => {
      return toCNYString(row.original.totalPaidPrice)
    },
  },
]

interface SpenderStatProps extends React.ComponentProps<'table'> {
  initialSpenderList: PagedItems<AdminUserStat>
}

export function SpenderStat({ initialSpenderList }: SpenderStatProps) {
  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })

  const spendersQueryConfig = fetchAdminUserStatOptions({
    startDate: date?.from,
    endDate: date?.to,
  })

  const {
    data: spenderList,
  } = useQuery({
    ...spendersQueryConfig,
    initialData: initialSpenderList,
    placeholderData: previousData => previousData,
  })

  const table = useReactTable({
    data: spenderList.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">用户消费榜单</h1>
      <div className="flex items-center pb-4">
        <DatePickerWithRange date={date} setDate={setDate} />
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
                      这段时间内没有订单数据。
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
