import type { UserStat } from '@/lib/api/user'
import type { Book } from '@/lib/models/user'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchUserStatOptions } from '@/lib/api/user'
import { toCNYString } from '@/lib/utils/price'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,

} from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

const columns: ColumnDef<UserStat['bookStats'][number]>[] = [
  {
    id: 'cover',
    accessorFn: row => row.book.cover,
    header: () => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
        >
          封面
        </Button>
      )
    },
    cell: ({ row }) => {
      const title: string = row.getValue('title')
      const coverURL: string = row.getValue('cover')
      return (
        <div className="flex center">
          <img
            src={coverURL}
            alt={title}
            width={80}
            height={80}
            // blurDataURL="data:..."
            // placeholder="blur"
            className="mx-auto"
          />
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'title',
    accessorFn: row => row.book.title,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          名称
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const title: string = row.getValue('title')
      return (
        <div>{title}</div>
      )
    },
  },
  {
    accessorKey: 'number',
    header: () => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
        >
          购买数量总计
        </Button>
      )
    },
    cell: ({ row }) => {
      const number: number = row.getValue('number')
      return (
        <div>
          {number}
        </div>
      )
    },
  },
  {
    accessorKey: 'book.price',
    header: () => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
        >
          原价
        </Button>
      )
    },
    cell: ({ row }) => {
      const number: number = row.getValue('number')
      return toCNYString(row.original.book.price * number)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const book: Book = row.original.book

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
            <DropdownMenuItem>
              <Link to="/book/$bookId" params={{ bookId: book.id.toString() }}>
                查看商品详情
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface BookStatPorps extends React.ComponentProps<'div'> {
  initialBookStat: UserStat
  date: DateRange | undefined
}

export function BookStat({
  initialBookStat,
  date,
}: BookStatPorps) {
  const statsQueryConfig = fetchUserStatOptions({
    createdAtStart: date?.from,
    createdAtEnd: date?.to,
  })

  const {
    data: bookStat,
  } = useQuery<UserStat>({
    ...statsQueryConfig,
    initialData: initialBookStat,
    placeholderData: previousData => previousData,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: bookStat.bookStats,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="p-2">
        筛选时间段内已购买总价：
        {toCNYString(bookStat.totalPrice)}
        <br />
        筛选时间段内已购书总数量：
        {bookStat.totalNumber}
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
                ))
              )
            : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    该时间段内没有购书记录
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  )
}
