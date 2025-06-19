import type { Order, PagedItems } from '@/lib/models/user'
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useOrder } from '@/lib/api/order'
import { cn } from '@/lib/utils/cn'
import { toCNYString } from '@/lib/utils/price'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { addDays } from 'date-fns'
import { ArrowUpDown, ArrowUpWideNarrowIcon, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'
import { OrderExpandDetail } from './order-expand-detail'

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          收货地址
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.address
    },
  },
  {
    accessorKey: 'receiver',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          收货人
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.receiver
    },
  },
  {
    accessorKey: 'tel',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          联系电话
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.tel
    },
  },
  {
    id: 'price',
    header: '已支付总价',
    cell: ({ row }) => {
      return toCNYString(row.original.totalPaidPrice)
    },
  },
  // custom filter
  // FIXME: value is always "item"
  // ref: https://tanstack.com/table/v8/docs/guide/column-filtering
  // filterFn: (row, value: string) => {
  //   const book: Book = row.original.item
  //   return book.title.includes(value)
  // },
  {
    id: 'actions',
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(false)}
        >
          <ArrowUpWideNarrowIcon />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orderId = row.original.id

      function handleClipboardClick() {
        navigator.clipboard.writeText(`${orderId}`)
        toast('订单 ID 已复制到剪贴板', {
          className: '!w-max',
        })
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">更多操作</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>更多操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                handleClipboardClick()
                e.stopPropagation() // stop triggering row onClick
              }}
            >
              复制订单 ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
            }}
            >
              售后
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface MyOrdersProps extends React.ComponentProps<'table'> {
  initialOrderList: PagedItems<Order>
}

export function MyOrders({ initialOrderList }: MyOrdersProps) {
  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })

  const [filterTitle, setFilterTitle] = useState('')
  const [debouncedFilterTitle] = useDebounceValue(filterTitle, 500)

  const ordersQueryConfig = useOrder().fetchOrderOptions({
    title: debouncedFilterTitle,
    createdAtStart: date?.from,
    createdAtEnd: date?.to,
  })

  const {
    data: orderList,
  } = useQuery<PagedItems<Order>>({
    ...ordersQueryConfig,
    initialData: initialOrderList,
    placeholderData: previousData => previousData,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility]
    = React.useState<VisibilityState>({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const table = useReactTable({
    data: orderList.items,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: _ => true,
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      columnFilters,
      columnVisibility,
      expanded,
      sorting,
    },
    onExpandedChange: setExpanded,
  })
  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">订单</h1>
      <div className="flex items-center pb-4">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="筛选书名"
          value={filterTitle}
          onChange={event => setFilterTitle(event.target.value)}
        />
      </div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="搜索收货地址"
          value={(table.getColumn('address')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('address')?.setFilterValue(event.target.value)
          }}
          className="max-w-sm"
        />
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
                      <TableRow
                        onClick={row.getToggleExpandedHandler()}
                        className="cursor-pointer"
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={row.getAllCells().length}
                          className={cn(
                            row.getIsExpanded() ? '' : 'py-0',
                            'transition-all animate-duration-600',
                            'data-[state=closed]:animate-out data[state=closed]:slide-out-t',
                            'data-[state=open]:animate-in data[state=open]:slide-in-b',
                          )}
                        >
                          <OrderExpandDetail
                            itemList={row.original.items}
                            className={cn(
                              row.getIsExpanded() ? 'max-h-auto' : 'max-h-0',
                              'transition-all animate-duration-600 overflow-hidden',
                              'data-[state=closed]:animate-out data[state=closed]:slide-out-t',
                              'data-[state=open]:animate-in data[state=open]:slide-in-b',
                            )}
                            state={row.getIsExpanded() ? 'open' : 'closed'}
                          />
                        </TableCell>
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
                      指定筛选条件下没有订单。
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
