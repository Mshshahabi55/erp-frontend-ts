import { DataTable, Column } from '@/shared/components';

interface ReportTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  emptyMessage: string;
}

// The one piece every per-report table actually did differently was its
// column definitions - pagination-slicing and the DataTable wiring were
// identical across Sales/Purchases/Orders, so that part lives here once.
export function ReportTable<T extends { id: string | number }>({
  columns,
  rows,
  isLoading,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  emptyMessage,
}: ReportTableProps<T>) {
  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <DataTable
      columns={columns}
      data={pagedRows}
      loading={isLoading}
      totalCount={rows.length}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyMessage={emptyMessage}
    />
  );
}
