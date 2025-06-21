import type { FieldErrorResponse } from '@/lib/api/utils'
import type { ChangeBookRequest } from '@/lib/models/admin'
import type { Book, PagedItems } from '@/lib/models/user'
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
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
import { changeBook, fetchAdminBookListOptions } from '@/lib/api/admin'
import { cn } from '@/lib/utils/cn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { CreateBookPopup } from './create-book'
import { ModifyBookForm } from './modify-book'
import { getDisableSortingHeader, getSortingHeader } from '../table/headers'
import { useDebounceValue } from 'usehooks-ts'
import { DataTablePagination } from '../table/data-table-pagination'
import { SkeletonRows } from '../ui/skeleton-rows'

const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'title',
    header: getSortingHeader('书名'),
    cell: ({ row }) => {
      return row.original.title
    },
  },
  {
    accessorKey: 'author',
    header: getSortingHeader('作者'),
    cell: ({ row }) => {
      return row.original.author
    },
  },
  {
    accessorKey: 'price',
    header: getSortingHeader('价格'),
    cell: ({ row }) => {
      return row.original.price
    },
  },
  {
    accessorKey: 'sales',
    header: getSortingHeader('销量'),
    cell: ({ row }) => {
      return row.original.sales
    },
  },
  {
    accessorKey: 'stock',
    header: getSortingHeader('库存'),
    cell: ({ row }) => {
      return row.original.stock
    },
  },
  {
    accessorKey: 'accountNonLocked',
    header: '是否上架',
    cell: ({ row }) => {
      return row.original.available ? '是' : '否'
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    header: getDisableSortingHeader(),
    cell: ({ row }) => {
      const available = row.original.available
      const queryClient = useQueryClient()
      const queryKey = ['admin', 'book', 'list']

      const {
        mutate: mutateBook,
      } = useMutation<Book, Error | FieldErrorResponse<ChangeBookRequest>, ChangeBookRequest>({
        mutationFn: data => changeBook(row.original.id, data),
        onSuccess(_) {
          toast(`成功修改了商品${row.original.id}`)
          queryClient.invalidateQueries({
            queryKey,
          })
        },
        onError(_) {
          toast('修改失败')
        },
      })

      function handleDeleteBook() {
        const data = {
          available: false,
        } satisfies ChangeBookRequest
        mutateBook(data)
      }

      function handleRestockBook() {
        const data = {
          available: true,
        } satisfies ChangeBookRequest
        mutateBook(data)
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
            <DropdownMenuSeparator />
            {available
              ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation() // stop triggering row onClick
                      handleDeleteBook()
                    }}
                  >
                    下架
                  </DropdownMenuItem>
                )
              : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRestockBook()
                    }}
                  >
                    上架
                  </DropdownMenuItem>
                )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export interface BookListProps extends React.ComponentProps<'div'> {
  initialBookList: PagedItems<Book>
}

export function BookList({ initialBookList }: BookListProps) {
  const [filterTitle, setFilterTitle] = useState('')
  const [debouncedFilterTitle] = useDebounceValue(filterTitle, 500)

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const queryConfig = fetchAdminBookListOptions({
    title: debouncedFilterTitle,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort: sorting,
  })

  const {
    data: bookList,
    isLoading,
    isFetching,
    isPending,
  } = useQuery({
    ...queryConfig,
    initialData: initialBookList,
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
    data: bookList?.items ?? [],
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
    pageCount: bookList?.totalPages ?? -1,
    rowCount: bookList?.total,
    state: {
      columnFilters,
      columnVisibility,
      expanded,
      sorting,
      pagination,
    },
    onExpandedChange: setExpanded,
  })

  function handleExpandOneRow(row: Row<Book>) {
    setExpanded(row.getIsExpanded() ? {} : { [row.id]: true })
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">管理-书籍列表</h1>
      <div className="flex items-center pb-4">
        <Input
          placeholder="搜索标题"
          value={filterTitle}
          onChange={event => setFilterTitle(event.target.value)}
          className="max-w-sm"
        />
        <CreateBookPopup>
          <Button className="ml-auto">创建新书</Button>
        </CreateBookPopup>
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
                          <ModifyBookForm
                            book={row.original}
                            className={cn(
                              row.getIsExpanded() ? 'max-h-auto' : 'max-h-0',
                              'transition-all animate-duration-600 overflow-hidden',
                              'data-[state=closed]:animate-out data[state=closed]:slide-out-t',
                              'data-[state=open]:animate-in data[state=open]:slide-in-b',
                            )}
                            data-state={row.getIsExpanded() ? 'open' : 'closed'}
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
                      指定筛选条件下没有图书。
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
