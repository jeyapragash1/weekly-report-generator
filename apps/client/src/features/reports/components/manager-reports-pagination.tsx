import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ManagerReportsPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function ManagerReportsPagination({
  onPageChange,
  page,
  pageSize,
  totalItems,
  totalPages,
}: ManagerReportsPaginationProps) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Showing {from} - {to} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="px-2 text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
