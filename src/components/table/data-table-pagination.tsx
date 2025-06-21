import type { Table } from '@tanstack/react-table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

/**
 * Generates an array of page numbers for pagination.
 * @param currentPage - The current active page (1-based).
 * @param totalPages - The total number of pages.
 * @returns An array of numbers and strings ('...') representing the pagination sequence.
 */
function generatePagination(currentPage: number, totalPages: number): (number | string)[] {
  // If there are 5 or fewer pages, show all of them.
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If the current page is near the beginning.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages]
  }

  // If the current page is near the end.
  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  // If the current page is somewhere in the middle.
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  // Don't render when only one page or less
  if (pageCount <= 1) {
    return null
  }

  const paginationItems = generatePagination(pageIndex + 1, pageCount)

  function handlePreviousClick() {
    table.getIsSomeRowsExpanded() && table.resetExpanded()
    table.previousPage()
  }

  function handleNextClick() {
    table.getIsSomeRowsExpanded() && table.resetExpanded()
    table.nextPage()
  }

  function handleIndexClick(index: number) {
    table.getIsSomeRowsExpanded() && table.resetExpanded()
    table.setPageIndex(index)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousClick}
            aria-disabled={!table.getCanPreviousPage()}
            // Add classes to visually disable and manage cursor
            className={
              !table.getCanPreviousPage()
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
        {/* Page Number Buttons */}
        {paginationItems.map((item, index) => (
          <PaginationItem key={index}>
            {typeof item === 'number' ? (
              <PaginationLink
                // 1-based
                onClick={() => handleIndexClick(item - 1)}
                isActive={pageIndex === item - 1}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            aria-disabled={!table.getCanNextPage()}
            className={
              !table.getCanNextPage()
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
