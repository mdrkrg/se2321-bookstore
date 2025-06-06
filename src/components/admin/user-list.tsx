import type { ChangeUserRequest } from '@/lib/models/admin'
import type { PagedItems, User } from '@/lib/models/user'
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
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
import { changeUser, fetchUserListOptions } from '@/lib/api/admin'
import { getRoleDisplay } from '@/lib/models/user'
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
import { ArrowUpDown, ArrowUpWideNarrowIcon, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '../ui/input'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          用户名
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.username
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          邮箱
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.original.email
    },
  },
  {
    accessorKey: 'role',
    header: '用户类型',
    cell: ({ row }) => {
      return getRoleDisplay(row.original.role)
    },
  },
  {
    accessorKey: 'accountNonLocked',
    header: '是否禁用',
    cell: ({ row }) => {
      return row.original.accountNonLocked ? '否' : '是'
    },
  },
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
      const role = row.original.role
      const banned = !row.original.accountNonLocked
      const queryClient = useQueryClient()
      const queryKey = fetchUserListOptions().queryKey

      const {
        mutate: mutateUser,
      } = useMutation<User, any, ChangeUserRequest>({
        mutationFn: data => changeUser(row.original.id, data),
        onSuccess(_) {
          toast(`成功修改了用户${row.original.id}`)
          queryClient.invalidateQueries({
            queryKey,
          })
        },
        onError(_) {
          toast('修改失败')
        },
      })

      function handleBanUser() {
        const data = {
          accountNonLocked: false,
        } satisfies ChangeUserRequest
        mutateUser(data)
      }

      function handleUnbanUser() {
        const data = {
          accountNonLocked: true,
        } satisfies ChangeUserRequest
        mutateUser(data)
      }

      function handleSetAdmin() {
        const data = {
          role: 'ADMIN',
        } satisfies ChangeUserRequest
        mutateUser(data)
      }

      function handleUnsetAdmin() {
        const data = {
          role: 'USER',
        } satisfies ChangeUserRequest
        mutateUser(data)
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
            {role === 'USER'
              ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation() // stop triggering row onClick
                      handleSetAdmin()
                    }}
                  >
                    设置为管理员
                  </DropdownMenuItem>
                )
              : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnsetAdmin()
                    }}
                  >
                    取消管理员权限
                  </DropdownMenuItem>
                )}
            <DropdownMenuSeparator />
            {banned
              ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnbanUser()
                    }}
                    className="bg-red-300"
                  >
                    取消禁用用户
                  </DropdownMenuItem>
                )
              : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBanUser()
                    }}
                    className="bg-red-300"
                  >
                    禁用用户
                  </DropdownMenuItem>
                )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export interface UserListProps extends React.ComponentProps<'div'> {
  initialUserList: PagedItems<User>
}

export function UserList({ initialUserList }: UserListProps) {
  const userQueryConfig = fetchUserListOptions()
  const {
    data: userList,
  } = useQuery<PagedItems<User>>({
    ...userQueryConfig,
    initialData: initialUserList,
    placeholderData: previousData => previousData,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility]
    = useState<VisibilityState>({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const table = useReactTable({
    data: userList.items,
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
      <h1 className="font-bold text-2xl pl-[0.5em] pb-4">管理-用户列表</h1>
      <div className="flex items-center pb-4">
        <Input
          placeholder="搜索用户名"
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('username')?.setFilterValue(event.target.value)
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
