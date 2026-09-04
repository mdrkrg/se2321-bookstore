import type { HeaderContext } from '@tanstack/react-table'
import { cn } from '@/lib/utils/cn'
import { ArrowUpDown, ArrowUpWideNarrowIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

export function getDisableSortingHeader<TData, TValue>() {
  return (headerContext: HeaderContext<TData, TValue>) => (
    <Button
      variant="ghost"
      className="bg-transparent hover:bg-transparent"
      onClick={() => headerContext.table.resetSorting()}
      title="清除选择"
    >
      <ArrowUpWideNarrowIcon />
    </Button>
  )
}

interface SortingHeaderProps<TData, TValue> extends React.ComponentProps<'button'> {
  headerContext: HeaderContext<TData, TValue>
}

function SortingHeader<TData, TValue>({
  headerContext,
  label,
  className,
}: SortingHeaderProps<TData, TValue> & { label: string }) {
  const column = headerContext.column
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={cn('bg-transparent hover:bg-transparent', className)}
      aria-label={label}
    >
      {label}
      <ArrowUpDown />
    </Button>
  )
}

export function getSortingHeader<TData, TValue>(
  label: string,
  props?: React.ComponentProps<'button'>,
) {
  return (ctx: HeaderContext<TData, TValue>) => <SortingHeader headerContext={ctx} label={label} {...props} />
}
