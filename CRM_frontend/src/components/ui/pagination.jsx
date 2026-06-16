import {
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function TablePagination({
    total = 0,
    limit = 10,
    offset = 0,
    onPaginationChange,
}) {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit) || 1;

    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < totalPages;

    const setPageIndex = (index) => {
        if (onPaginationChange) {
            onPaginationChange({ offset: index * limit, limit });
        }
    };

    const setPageSize = (newLimit) => {
        if (onPaginationChange) {
            // Reset to first page when changing page size
            onPaginationChange({ offset: 0, limit: newLimit });
        }
    };

    return (
        <div className="flex items-center justify-between px-2 w-full mt-4">
            <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
                Showing {total === 0 ? 0 : offset + 1} to {Math.min(offset + limit, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium hidden sm:block">Rows per page</p>
                    <Select
                        value={`${limit}`}
                        onValueChange={(value) => {
                            setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPageIndex(0)}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(currentPage - 2)}
                        disabled={!canPreviousPage}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPageIndex(currentPage)}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPageIndex(totalPages - 1)}
                        disabled={!canNextPage}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}