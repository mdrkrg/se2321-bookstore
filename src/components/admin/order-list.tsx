// import type { FieldErrorResponse } from '@/lib/api/utils'
import type {
  // ChangeBookRequest,
  // ChangeOrderRequest,
  OrderAdmin,
} from '@/lib/models/admin'
import type { PagedItems } from '@/lib/models/user'
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  // deleteOrder,
  fetchAdminOrderListOptions,
} from '@/lib/api/admin'
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
import { MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { DataTablePagination } from '../table/data-table-pagination'
import { getDisableSortingHeader, getSortingHeader } from '../table/headers'
import { DatePickerWithRange } from '../ui/date-picker-with-range'
import { Input } from '../ui/input'
import { SkeletonRows } from '../ui/skeleton-rows'
import { OrderExpandDetail } from '../user/order/order-expand-detail'
import { ModifyOrderForm } from './modify-order'

const columns: ColumnDef<OrderAdmin>[] = [
  {
    accessorKey: 'creator.username',
    header: getSortingHeader('创建者'),
    cell: ({ row }) => {
      return row.original.creator.username
    },
  },
  {
    accessorKey: 'address',
    header: getSortingHeader('收货地址'),
    cell: ({ row }) => {
      return row.original.address
    },
  },
  {
    accessorKey: 'receiver',
    header: getSortingHeader('收件人'),
    cell: ({ row }) => {
      return row.original.receiver
    },
  },
  {
    accessorKey: 'tel',
    header: getSortingHeader('联系电话'),
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
  {
    id: 'actions',
    enableHiding: false,
    enableSorting: false,
    header: getDisableSortingHeader(),
    cell: ({ row }) => {
      // const queryClient = useQueryClient()
      // const queryKey = fetchAdminOrderListOptions().queryKey

      const [dialogOpen, setDialogOpen] = useState(false)

      // const {
      //   mutate: removeOrder,
      // } = useMutation<void, Error | FieldErrorResponse<ChangeOrderRequest>>({
      //   mutationFn: () => deleteOrder(row.original.id),
      //   onSuccess(_) {
      //     toast(`成功删除了订单${row.original.id}`)
      //     queryClient.invalidateQueries({
      //       queryKey,
      //     })
      //   },
      //   onError(_) {
      //     toast('删除失败')
      //   },
      // })

      // function handleDeleteOrder() {
      //   removeOrder()
      // }

      return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">更多操作</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>更多操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={e => e.stopPropagation()}>
                  修改订单邮寄信息
                </DropdownMenuItem>
              </DialogTrigger>
              {/*
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation() // stop triggering row onClick
                // handleDeleteOrder()
              }}
            >
              删除订单
            </DropdownMenuItem>
              */}
            </DropdownMenuContent>
            <DialogContent onClick={e => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>修改订单邮寄信息</DialogTitle>
                <DialogDescription>
                  请输入新的收件人、地址或联系方式。
                </DialogDescription>
              </DialogHeader>
              <ModifyOrderForm
                order={row.original}
                onSubmissionSuccess={() => setDialogOpen(false)}
              />
            </DialogContent>
          </DropdownMenu>
        </Dialog>
      )
    },
  },
]

export interface OrderListProps extends React.ComponentProps<'div'> {
  initialOrderList: PagedItems<OrderAdmin>
}

export function OrderList({ initialOrderList }: OrderListProps) {
  const today = new Date(Date.now())
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(today, -30),
    to: today,
  })

  const [filterTitle, setFilterTitle] = useState('')
  const [debouncedFilterTitle] = useDebounceValue(filterTitle, 500)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const queryConfig = fetchAdminOrderListOptions({
    title: debouncedFilterTitle,
    createdAtStart: date?.from,
    createdAtEnd: date?.to,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort: sorting,
  })

  const {
    data: orderList,
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    ...queryConfig,
    initialData: initialOrderList,
    placeholderData: previousData => previousData,
  })

  function showSkeleton() {
    return isLoading || isFetching || isPending
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility]
    = useState<VisibilityState>({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const table = useReactTable({
    data: orderList?.items ?? [],
    columns,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: _ => true,
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: orderList?.totalPages ?? -1,
    rowCount: orderList?.total,
    state: {
      columnFilters,
      columnVisibility,
      expanded,
      sorting,
      pagination,
    },
    onExpandedChange: setExpanded,
  })

  /**
   * Single row selection
   */
  function handleExpandOneRow(row: Row<OrderAdmin>) {
    setExpanded(row.getIsExpanded() ? {} : { [row.id]: true })
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">管理-订单列表</h1>
      <div className="flex items-center pb-4">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="筛选标题"
          value={filterTitle}
          onChange={event => setFilterTitle(event.target.value)}
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
            {showSkeleton()
              ? (
                  <SkeletonRows
                    length={pagination.pageSize}
                    columns={columns}
                    className="h-6 w-full"
                  />
                )
              : table.getRowModel().rows?.length
                ? (
                    table.getRowModel().rows.map(row => (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() && 'selected'}
                          onClick={() => handleExpandOneRow(row)}
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
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}
