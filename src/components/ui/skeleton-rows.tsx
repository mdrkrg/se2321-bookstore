import { ColumnDef } from "@tanstack/react-table"
import { range } from "lodash"
import { ComponentProps } from "react"
import { TableCell, TableRow } from "./table"
import { Skeleton } from "./skeleton"
import { cn } from "@/lib/utils/cn"

interface SkeletonRowsProps<T = unknown> extends ComponentProps<'tr'> {
  columns: ColumnDef<T>[]
  length: number
}

export function SkeletonRows<T>({
  columns,
  length,
  className,
}: SkeletonRowsProps<T>) {
  return range(length).map((_, i) => (
    <TableRow key={`skeleton-${i}`}>
      {columns.map(column => (
        <TableCell
          key={(column.id || (column as any).accessorKey) as string}
          className="text-center"
        >
          <Skeleton className={cn("mx-auto rounded-md", className)} />
        </TableCell>
      ))}
    </TableRow>
  ))
}
