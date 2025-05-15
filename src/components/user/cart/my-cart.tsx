import type { Book, CartItem, OrderItem } from '@/lib/models/user'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { changeCartItem, deleteCartItem } from '@/lib/api/order'
import { toCNYString } from '@/lib/utils/price'
import { Link, useRouter } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { OrderPopup } from '../order/order-popup'

const columns: ColumnDef<CartItemProps>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="选择全部"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="选择本行"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'cover',
    accessorFn: row => row.book.cover,
    header: () => {
      return (
        <Button variant="ghost">
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
          数量
        </Button>
      )
    },
    cell: ({ row }) => {
      const number: number = row.getValue('number')
      const setNumber = row.original.setNumber
      return (
        <div className="max-w-[48px] ml-[20%]">
          <NumberInput
            inputStyle="w-[48px]"
            placeholder="数量"
            value={number}
            onValueChange={(value) => {
              if (value)
                setNumber(value)
            }}
            defaultValue={1}
            min={1}
          />
        </div>
      )
    },
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          价格
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))
      const formattedPrice = toCNYString(price)

      return <div className="font-medium">{formattedPrice}</div>
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
            <DropdownMenuItem
              className="bg-red-500 text-white"
              onClick={row.original.handleDelete}
            >
              删除
            </DropdownMenuItem>
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

interface CartItemProps extends CartItem {
  setNumber: (newNumber: number) => void
  handleDelete: () => void
}

function useCartItemProps(cartItems: CartItem[]): CartItemProps[] {
  interface ItemNumbers { [id: number]: number }
  const [itemNumbers, setItemNumbers]
    = useState<ItemNumbers>(cartItems.reduce(
      (accumulator: ItemNumbers, { id, number }) => {
        return {
          ...accumulator,
          [id]: number,
        }
      },
      {},
    ))

  const router = useRouter()
  const cartItemProps = useMemo(() => cartItems.map((item) => {
    const { number: _, ...itemRemain } = item
    const setNumber = (newNumber: number) => {
      if (newNumber !== itemNumbers[item.id]) {
        setItemNumbers(prev => ({ ...prev, [item.id]: newNumber }))
        changeCartItem(item.id, newNumber).then(() => router.invalidate())
      }
    }
    const handleDelete = () => {
      deleteCartItem(item.id).then(() => router.invalidate())
    }
    return {
      number: itemNumbers[item.id],
      setNumber,
      handleDelete,
      ...itemRemain,
    }
  }), [cartItems, itemNumbers])

  return cartItemProps
}

function getOrderList(cartItems: CartItemProps[]): OrderItem[] {
  return cartItems.map((item) => {
    const { setNumber: _, handleDelete: __, ...remain } = item
    return {
      unitPrice: item.book.price,
      // TODO: use another form item to indicate price paid
      paidPrice: item.book.price * item.number,
      ...remain,
    }
  })
}

interface MyCartProps {
  cartItemsData: CartItem[]
}

export default function MyCart({ cartItemsData }: MyCartProps) {
  const cartItems = useCartItemProps(cartItemsData)
  const [sorting, setSorting] = useState<SortingState>([])
  const [
    columnFilters,
    setColumnFilters,
  ] = useState<ColumnFiltersState>([])
  const [
    columnVisibility,
    setColumnVisibility,
  ] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: cartItems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  function useSelectedCartItems(): CartItemProps[] {
    return table.getSelectedRowModel().rows.map(row => (
      row.original
    ))
  }

  function isSelectedCartItemsEmpty() {
    return table.getSelectedRowModel().rows.length === 0
  }

  function checkIfSelectedEmpty() {
    if (isSelectedCartItemsEmpty()) {
      toast('未选择商品', {
        description: '请在购物车中选择下单的商品',
      })
    }
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">购物车</h1>
      <div className="flex items-center pb-4">
        <Input
          placeholder="搜索书标题"
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('title')?.setFilterValue(event.target.value)
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
                      空空如也……
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          共
          {' '}
          {table.getFilteredRowModel().rows.length}
          {' '}
          件商品，选中
          {' '}
          {table.getFilteredSelectedRowModel().rows.length}
          {' '}
          件商品。
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
        <div className="space-x-2">
          <OrderPopup
            orderList={getOrderList(useSelectedCartItems())}
          >
            <Button
              variant="destructive"
              className="ml-[1em] bg-pink-500 hover:bg-pink-700"
              onClick={checkIfSelectedEmpty}
            >
              下单
            </Button>
          </OrderPopup>
        </div>
      </div>
    </div>
  )
}
