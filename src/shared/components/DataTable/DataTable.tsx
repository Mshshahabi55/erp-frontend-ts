import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Skeleton,
  Alert,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

// `value || ''` would render falsy-but-valid values (0, false) as a blank
// cell - a real bug that showed up for a bare, unrendered `stock` column
// where 0 is a common, meaningful value (out of stock).
const formatCellValue = (value: unknown): string => (value == null ? '' : String(value));

export interface Column<T> {
  key: keyof T | string;
  label: string;
  // Each column's cell value has a different shape (string, number, enum,
  // array...) and this callback is the per-column boundary where that gets
  // resolved - typing it any narrower would force every caller to cast anyway.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  /** Enables a clickable sort header for this column; requires `onSortChange` on the table. */
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: Error | null;
  totalCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry?: () => void;
  emptyMessage?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
}

interface DataTableHeadProps<T> {
  columns: Column<T>[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
}

function DataTableHead<T>({ columns, sortBy, sortDirection, onSortChange }: DataTableHeadProps<T>) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => {
          const field = String(col.key);
          const isSortable = col.sortable && !!onSortChange;
          const isActive = isSortable && sortBy === field;

          return (
            <TableCell
              key={field}
              align={col.align || 'left'}
              style={{ width: col.width, fontWeight: 600 }}
              sortDirection={isActive ? sortDirection : false}
            >
              {isSortable ? (
                <TableSortLabel
                  active={isActive}
                  direction={isActive ? sortDirection : 'asc'}
                  onClick={() => onSortChange!(field)}
                >
                  {col.label}
                </TableSortLabel>
              ) : (
                col.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  error = null,
  totalCount = 0,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRetry,
  emptyMessage = 'No data found',
  sortBy,
  sortDirection,
  onSortChange,
}: DataTableProps<T>) {
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              <Refresh /> Retry
            </Button>
          )
        }
      >
        {error.message}
      </Alert>
    );
  }

  const safeData = data || [];
  const safeTotal = totalCount || 0;

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <DataTableHead columns={columns} sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
            <TableBody>
              {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (safeData.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <DataTableHead columns={columns} sortBy={sortBy} sortDirection={sortDirection} onSortChange={onSortChange} />
          <TableBody>
            {safeData.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} align={col.align || 'left'}>
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : formatCellValue(row[col.key as keyof T])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={safeTotal}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        labelRowsPerPage="Rows per page:"
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
